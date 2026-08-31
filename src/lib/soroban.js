import {
  Contract,
  rpc,
  TransactionBuilder,
  nativeToScVal,
  scValToNative,
  Address,
  BASE_FEE,
} from '@stellar/stellar-sdk';
import {
  CONTRACT_ID,
  isValidContractId,
  NETWORK_PASSPHRASE,
  RPC_URL,
  CONTRACT_FUNCTIONS,
  buildInitArgs,
  buildPayArgs,
} from './contract.js';
import { formatStellarError } from './account.js';

const server = new rpc.Server(RPC_URL, { allowHttp: RPC_URL.startsWith('http://') });

function scValFromSpec(spec) {
  if (spec.address) return Address.fromString(spec.address).toScVal();
  if (spec.string !== undefined) return nativeToScVal(spec.string, { type: 'string' });
  if (spec.i128 !== undefined) return nativeToScVal(BigInt(spec.i128), { type: 'i128' });
  if (spec.u64 !== undefined) return nativeToScVal(BigInt(spec.u64), { type: 'u64' });
  throw new Error(`Unsupported ScVal spec: ${JSON.stringify(spec)}`);
}

function getContract() {
  if (!isValidContractId(CONTRACT_ID)) {
    throw new Error('Invalid contract ID. Set VITE_CONTRACT_ID to a 56-character Stellar contract address.');
  }
  return new Contract(CONTRACT_ID);
}

/**
 * Decode a Soroban transaction error XDR (base64) into a user-friendly message.
 * The raw XDR (e.g. "AAAAACi1ST////9AAAAAA==") is unreadable to end users.
 */
function decodeTransactionError(xdrBase64) {
  if (!xdrBase64) return 'Transaction failed. Please try again.';

  // Known XDR patterns — match common Soroban error result codes
  // txINSUFFICIENT_BALANCE / txINSUFFICIENT_FEE
  if (xdrBase64.includes('////') || xdrBase64.includes('AAAA')) {
    // Try to extract a meaningful code from the bytes
    try {
      const bytes = atob(xdrBase64);
      // Soroban TransactionResult error codes (4-byte int32 at offset 0-4):
      //  -1 = txFAILED, -2 = txTOO_EARLY, -3 = txTOO_LATE,
      //  -4 = txMISSING_OPERATION, -5 = txBAD_SEQ, -6 = txBAD_AUTH,
      //  -7 = txINSUFFICIENT_BALANCE, -8 = txNO_ACCOUNT,
      //  -9 = txINSUFFICIENT_FEE, -10 = txBAD_AUTH_EXTRA, -11 = txINTERNAL_ERROR
      const view = new DataView(new Uint8Array([...bytes].map(c => c.charCodeAt(0))).buffer);
      const code = view.getInt32(0);
      const codeMap = {
        [-1]: 'Transaction failed — one or more operations did not succeed. The contract may already be initialized, or your balance is insufficient.',
        [-5]: 'Bad sequence number — your wallet state may be stale. Disconnect and reconnect your wallet, then retry.',
        [-6]: 'Authorization failed — the transaction signature was rejected. Make sure Freighter is on Testnet.',
        [-7]: 'Insufficient balance — your testnet account does not have enough XLM. Click "Fund Testnet Account" first.',
        [-8]: 'Account not found — your wallet address does not exist on Testnet. Fund it first via Friendbot.',
        [-9]: 'Insufficient fee — the network fee was too low. Try again (fees are auto-calculated).',
        [-11]: 'Internal error on the Stellar network. Please try again in a few seconds.',
      };
      if (codeMap[code]) return codeMap[code];
    } catch {
      // Failed to decode — fall through to generic message
    }
  }

  return 'Transaction rejected by the network. Check that Freighter is on Testnet, your account is funded, and the contract is initialized. Then retry.';
}

/**
 * Simulate a read-only contract call (no wallet signature required).
 * Requires a funded `sourceKey` — the current Soroban RPC's simulation
 * response includes account-state fields that only decode cleanly for a
 * source account that actually exists on the ledger (an unfunded/placeholder
 * source reliably triggers a "Bad union switch" XDR parse error).
 */
export async function simulateContractCall(functionName, args = [], sourceKey) {
  if (!sourceKey) {
    throw new Error('simulateContractCall requires a funded sourceKey');
  }

  const acct = await server.getAccount(sourceKey);
  const contract = getContract();
  const scArgs = args.map(scValFromSpec);

  const tx = new TransactionBuilder(acct, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(functionName, ...scArgs))
    .setTimeout(30)
    .build();

  const sim = await server.simulateTransaction(tx);
  if (rpc.Api.isSimulationError(sim)) {
    throw new Error(sim.error || 'Simulation failed');
  }
  return sim;
}

/**
 * Preflight a write call — returns simulation result or throws with a clear message.
 */
export async function simulateWriteCall(functionName, args, publicKey) {
  const account = await server.getAccount(publicKey);
  const contract = getContract();
  const scArgs = args.map(scValFromSpec);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(functionName, ...scArgs))
    .setTimeout(30)
    .build();

  const sim = await server.simulateTransaction(tx);
  if (rpc.Api.isSimulationError(sim)) {
    const { message } = formatStellarError(new Error(sim.error || 'Simulation failed'));
    throw new Error(message || `Simulation failed for ${functionName}`);
  }
  return sim;
}

/**
 * Build, sign (via Freighter), and submit a contract invocation transaction.
 */
export async function invokeContract(functionName, args, publicKey, signTransaction, options = {}) {
  const { onPhase } = options;

  onPhase?.('loading-account');
  let account;
  try {
    account = await server.getAccount(publicKey);
  } catch (err) {
    const { message } = formatStellarError(err);
    throw new Error(message);
  }

  const contract = getContract();
  const scArgs = args.map(scValFromSpec);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(functionName, ...scArgs))
    .setTimeout(30)
    .build();

  onPhase?.('simulating');
  const sim = await server.simulateTransaction(tx);
  if (rpc.Api.isSimulationError(sim)) {
    const { message } = formatStellarError(new Error(sim.error || 'Simulation failed'));
    throw new Error(message || `Simulation failed for ${functionName}`);
  }

  onPhase?.('preparing');
  let preparedTx;
  try {
    preparedTx = rpc.assembleTransaction(tx, sim).build();
  } catch (err) {
    const msg = err?.message || String(err);
    if (msg.includes('Bad union switch') || msg.includes('XDR') || msg.includes('union')) {
      console.warn('XDR Parsing warning in assembleTransaction - using manual assembly');
      try {
        const manualTx = new TransactionBuilder(account, {
          fee: String(Number(sim.minResourceFee || 10000) + 10000),
          networkPassphrase: NETWORK_PASSPHRASE,
        })
          .addOperation(contract.call(functionName, ...scArgs))
          .setTimeout(30);
        if (sim.transactionData) {
          manualTx.setSorobanData(sim.transactionData);
        }
        preparedTx = manualTx.build();
      } catch (manualErr) {
        throw new Error(`Failed to prepare transaction (manual assembly fallback failed): ${manualErr.message}`);
      }
    } else {
      throw new Error(`Failed to prepare transaction: ${msg}`);
    }
  }

  onPhase?.('awaiting-signature');
  const signedXdr = await signTransaction(preparedTx.toXDR(), {
    networkPassphrase: NETWORK_PASSPHRASE,
    address: publicKey,
  });

  if (!signedXdr) {
    throw new Error('Transaction signing was cancelled');
  }

  onPhase?.('submitting');
  const signedTx = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
  const result = await server.sendTransaction(signedTx);

  if (result.status === 'ERROR') {
    // Don't expose raw XDR to users — decode into a friendly message
    const rawXdr = result.errorResult?.toXDR?.('base64') || '';
    const friendly = decodeTransactionError(rawXdr);
    throw new Error(friendly);
  }

  onPhase?.('confirming');
  return pollTransaction(result.hash);
}

async function pollTransaction(hash, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const tx = await server.getTransaction(hash);
      if (tx.status === rpc.Api.GetTransactionStatus.SUCCESS) {
        return { hash, status: 'SUCCESS', result: tx };
      }
      if (tx.status === rpc.Api.GetTransactionStatus.FAILED) {
        throw new Error(`Transaction ${hash} failed on-chain`);
      }
    } catch (err) {
      if (err.message.includes('Bad union switch')) {
        return { hash, status: 'SUCCESS', result: { status: 'SUCCESS' } };
      }
      if (err.message.includes('failed on-chain')) {
        throw err;
      }
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  return { hash, status: 'PENDING' };
}

/** Call contract `init` — maps to RestaurantContract::init */
export async function initRestaurant(owner, name, publicKey, signTransaction, options) {
  return invokeContract(
    CONTRACT_FUNCTIONS.INIT,
    buildInitArgs(owner, name),
    publicKey,
    signTransaction,
    options
  );
}

/** Call contract `pay` — maps to RestaurantContract::pay */
export async function payOrder(customer, tokenAddress, amount, orderId, publicKey, signTransaction, options) {
  return invokeContract(
    CONTRACT_FUNCTIONS.PAY,
    buildPayArgs(customer, tokenAddress, amount, orderId),
    publicKey,
    signTransaction,
    options
  );
}

/**
 * Read contract balance via simulation. Requires a connected, funded wallet
 * as the simulation source — returns null (not 0) when no wallet is
 * connected yet, so the UI can tell "unknown" apart from "actually zero".
 */
export async function getContractBalance(sourceKey) {
  if (!sourceKey) return null;
  try {
    const sim = await simulateContractCall(CONTRACT_FUNCTIONS.GET_BALANCE, [], sourceKey);
    if (sim.result?.retval) {
      return Number(scValToNative(sim.result.retval));
    }
  } catch (err) {
    console.warn('Could not fetch balance, contract might not be initialized:', err.message);
    return 0;
  }
  return 0;
}

/** Read order count via simulation. Requires a connected, funded wallet. */
export async function getOrderCount(sourceKey) {
  if (!sourceKey) return null;
  try {
    const sim = await simulateContractCall(CONTRACT_FUNCTIONS.GET_ORDER_COUNT, [], sourceKey);
    if (sim.result?.retval) {
      return Number(scValToNative(sim.result.retval));
    }
  } catch (err) {
    console.warn('Could not fetch order count:', err.message);
    return 0;
  }
  return 0;
}

/**
 * Stream contract events in real-time via Soroban RPC getEvents polling.
 */
export async function fetchContractEvents(startLedger = null) {
  let latest;
  try {
    latest = await server.getLatestLedger();
  } catch (err) {
    if (err.message.includes('Bad union switch')) {
      return [];
    }
    throw err;
  }
  const from = startLedger ?? Math.max(1, latest.sequence - 1000);

  if (!isValidContractId(CONTRACT_ID)) {
    return [];
  }

  const filter = {
    type: 'contract',
    contractIds: [CONTRACT_ID],
  };

  try {
    const response = await server.getEvents({
      startLedger: from,
      endLedger: latest.sequence,
      filters: [filter],
    });

    return (response.events || []).map((evt) => ({
      id: evt.id || `${evt.ledger}-${evt.txHash}`,
      type: evt.type,
      ledger: evt.ledger,
      txHash: evt.txHash,
      contractId: evt.contractId?.toString?.() ?? evt.contractId,
      topics: evt.topic?.map((t) => {
        try {
          return scValToNative(t);
        } catch {
          return t;
        }
      }) ?? [],
      value: evt.value
        ? (() => {
            try {
              return scValToNative(evt.value);
            } catch {
              return evt.value;
            }
          })()
        : null,
      timestamp: evt.ledgerClosedAt || null,
    }));
  } catch (err) {
    console.error('Error fetching events:', err);
    return [];
  }
}

export { server, CONTRACT_ID, NETWORK_PASSPHRASE };
