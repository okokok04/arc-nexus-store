// Mock Freighter API - for production use install @stellar/freighter-api
export const getPublicKey = async () => {
  // In production, connects to installed Freighter wallet
  if (typeof window !== 'undefined' && window.freighter) {
    return window.freighter.getPublicKey()
  }
  throw new Error('Freighter wallet not installed')
}

export const signTransaction = async (tx, options = {}) => {
  if (typeof window !== 'undefined' && window.freighter) {
    return window.freighter.signTransaction(tx, options)
  }
  throw new Error('Freighter wallet not installed')
}

export const isConnected = async () => {
  if (typeof window !== 'undefined' && window.freighter) {
    return window.freighter.isConnected?.()
  }
  return false
}

// Declare window type for TypeScript
declare global {
  interface Window {
    freighter?: {
      getPublicKey: () => Promise<string>
      signTransaction: (tx: string, options?: any) => Promise<string>
      isConnected?: () => Promise<boolean>
      [key: string]: any
    }
  }
}

export default {
  getPublicKey,
  signTransaction,
  isConnected,
}
