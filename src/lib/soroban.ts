const RPC_URL = import.meta.env.VITE_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org'

interface RpcRequest {
  jsonrpc: string
  id: number
  method: string
  params: any[]
}

async function rpcCall(method: string, params: any[]): Promise<any> {
  const request: RpcRequest = {
    jsonrpc: '2.0',
    id: Math.floor(Math.random() * 10000),
    method,
    params,
  }

  try {
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(`RPC Error: ${data.error.message}`)
    }

    return data.result
  } catch (error) {
    console.error('RPC call failed:', error)
    throw error
  }
}

export async function submitTransaction(xdr: string): Promise<string> {
  try {
    const result = await rpcCall('sendTransaction', [{ transaction: xdr }])
    return result.hash
  } catch (error) {
    throw new Error(`Failed to submit transaction: ${error}`)
  }
}

export async function getTransactionStatus(txHash: string): Promise<any> {
  try {
    const result = await rpcCall('getTransaction', [txHash])
    return result
  } catch (error) {
    throw new Error(`Failed to get transaction status: ${error}`)
  }
}

export async function getEvents(
  contractId: string,
  startLedger: number = 0,
): Promise<any[]> {
  try {
    const filters = [
      {
        type: 'contract',
        contractIds: [contractId],
      },
    ]

    const result = await rpcCall('getEvents', [
      {
        filters,
        startLedger,
        limit: 100,
      },
    ])

    return result.events || []
  } catch (error) {
    console.error('Failed to get events:', error)
    return []
  }
}

export async function getContractData(key: string): Promise<any> {
  try {
    // TODO: Implement getContractData with proper ledger entry query
    const result = await rpcCall('getLedgerEntry', [
      {
        key,
      },
    ])
    return result
  } catch (error) {
    console.error('Failed to get contract data:', error)
    return null
  }
}

export async function getLatestLedger(): Promise<number> {
  try {
    const result = await rpcCall('getLatestLedger', [])
    return result.sequence
  } catch (error) {
    throw new Error(`Failed to get latest ledger: ${error}`)
  }
}

export async function getAccount(publicKey: string): Promise<any> {
  try {
    const result = await rpcCall('getAccount', [publicKey])
    return result
  } catch (error) {
    throw new Error(`Failed to get account: ${error}`)
  }
}
