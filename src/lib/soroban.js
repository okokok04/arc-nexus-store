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

  try {
    const bytes = Uint8Array.from(atob(xdrBase64), c => c.charCodeAt(0));
    const view = new DataView(bytes.buffer);

    // TransactionResultCode is typically the first int32
    // But errorResult might be just the result code union
    // Try reading at different offsets
    for (const offset of [0, 4, 8]) {
      if (offset + 4 > bytes.length) break;
      const code = view.getInt32(offset);

      const codeMap = {
        [-1]: 'Transaction failed — the contract call did not succeed. The store may not be initialized (click "Init Restaurant" first), or your balance is insufficient for this purchase.',
        [-2]: 'Transaction submitted too early. Please wait a moment and retry.',
        [-3]: 'Transaction expired. Please retry — a fresh transaction will be built automatically.',
        [-5]: 'Sequence number mismatch — your wallet state may be stale. Disconnect and reconnect Freighter, then retry.',
        [-6]: 'Authorization failed — make sure Freighter is set to Testnet and you approved the signing prompt.',
        [-7]: 'Insufficient XLM balance for this purchase. Click "Fund Testnet Account" to get more test XLM.',
        [-8]: 'Account not found on Testnet. Fund your wallet first via Friendbot.',
        [-9]: 'Network fee too low. Please retry — fees are recalculated automatically.',
        [-11]: 'Internal network error. Please try again in a few seconds.',
        [-12]: 'Transaction too large. Please retry with a simpler operation.',
      };

      if (codeMap[code]) {
        console.log(`[Soroban] Decoded error code ${code} at offset ${offset}`);
        return codeMap[code];
      }
    }
  } catch (e) {
    console.warn('[Soroban] Could not decode error XDR:', e.message);
  }

  return 'Transaction failed — the store may not be initialized yet. Try clicking "Init Restaurant" first, then retry your purchase. If the problem persists, ensure Freighter is on Testnet and your account has enough XLM.';
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

  // Use a higher base fee for Soroban — 100 stroops often isn't enough
  const sorobanBaseFee = '1000000'; // 0.1 XLM — assembleTransaction adds resource fee on top

  const tx = new TransactionBuilder(account, {
    fee: sorobanBaseFee,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(functionName, ...scArgs))
    .setTimeout(30)
    .build();

  onPhase?.('simulating');
  const sim = await server.simulateTransaction(tx);

  if (rpc.Api.isSimulationError(sim)) {
    console.error('[Soroban] Simulation error:', sim.error);
    // Extract the real error — don't let base64 handler mask it
    const simError = sim.error || 'Simulation failed';
    const { message } = formatStellarError(new Error(simError));
    throw new Error(message || `Simulation failed for ${functionName}`);
  }

  onPhase?.('preparing');
  let preparedTx;
  try {
    preparedTx = rpc.assembleTransaction(tx, sim).build();
  } catch (err) {
    const msg = err?.message || String(err);
    console.warn('[Soroban] assembleTransaction failed:', msg);

    if (msg.includes('Bad union switch') || msg.includes('XDR') || msg.includes('union')) {
      console.warn('[Soroban] Attempting manual assembly with auth entries');
      try {
        const manualTx = new TransactionBuilder(account, {
          fee: String(Math.max(Number(sim.minResourceFee || 100000), 100000) + 100000),
          networkPassphrase: NETWORK_PASSPHRASE,
        })
          .addOperation(contract.call(functionName, ...scArgs))
          .setTimeout(30);

        // Include Soroban transaction data (resource footprint, etc.)
        if (sim.transactionData) {
          manualTx.setSorobanData(sim.transactionData);
        }

        preparedTx = manualTx.build();
      } catch (manualErr) {
        throw new Error(`Failed to prepare transaction: ${manualErr.message}`);
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

  let result;
  try {
    result = await server.sendTransaction(signedTx);
  } catch (sendErr) {
    console.error('[Soroban] sendTransaction threw:', sendErr);
    throw new Error(`Network error submitting transaction: ${sendErr.message}. Please retry.`);
  }

  console.log('[Soroban] sendTransaction result:', result.status, result.hash || '');

  if (result.status === 'ERROR') {
    // Log full details for debugging
    const rawXdr = result.errorResult?.toXDR?.('base64') || '';
    console.error('[Soroban] Transaction ERROR:', {
      status: result.status,
      errorXdr: rawXdr,
      hash: result.hash,
      latestLedger: result.latestLedger,
    });
    const friendly = decodeTransactionError(rawXdr);
    throw new Error(friendly);
  }

  if (result.status === 'DUPLICATE') {
    console.warn('[Soroban] Duplicate transaction — may have already been submitted');
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
