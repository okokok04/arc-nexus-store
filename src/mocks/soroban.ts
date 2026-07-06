// Mock Soroban RPC - for production use Stellar RPC endpoints
const mockRPC = (method: string, params: any[] = []) => {
  console.log(`[Mock RPC] ${method}`, params)

  // Mock responses for common methods
  const mocks: Record<string, any> = {
    getLatestLedger: { result: { sequence: 123456 } },
    getAccount: {
      result: {
        id: 'GA...',
        account_id: 'GA...',
        balances: [{ balance: '1000', asset_type: 'native' }],
        sequence: '1',
      },
    },
    submitTransaction: { result: { hash: 'tx_' + Math.random().toString(36) } },
    getTransactionStatus: { result: { status: 'PENDING' } },
    getEvents: { result: [] },
    getLedgerEntries: { result: [] },
  }

  return Promise.resolve(mocks[method] || { result: null })
}

export const rpcCall = async (method: string, params: any[] = []) => {
  const response = await mockRPC(method, params)
  return response.result
}

export const submitTransaction = async (xdr: string) => {
  const result = await rpcCall('submitTransaction', [xdr])
  return result.hash || `tx_${Date.now()}`
}

export const getContractData = async (key: string) => {
  return mockRPC('getLedgerEntries', [key])
}

export const getEvents = async (contractId: string, startLedger: number = 0) => {
  return mockRPC('getEvents', [{ contractId, startLedger }]).then((r) => r || [])
}

export const getLatestLedger = async () => {
  const result = await rpcCall('getLatestLedger')
  return result.sequence || 0
}

export const getAccount = async (publicKey: string) => {
  return rpcCall('getAccount', [publicKey])
}

export default {
  rpcCall,
  submitTransaction,
  getContractData,
  getEvents,
  getLatestLedger,
  getAccount,
}
