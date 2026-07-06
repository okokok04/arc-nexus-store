import { useState, useCallback, useEffect } from 'react'
import { getPublicKey, signTransaction } from '@lib/freighter'
import { useWalletStore } from '@context/stores'

export function useWallet() {
  const store = useWalletStore()
  const [error, setError] = useState<string | null>(null)

  const connect = useCallback(async () => {
    try {
      setError(null)
      const publicKey = await getPublicKey()
      store.setAddress(publicKey)
      store.setConnected(true)
      // TODO: Fetch balance from blockchain
      store.setBalance(0)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to connect wallet'
      setError(errorMsg)
      console.error('Wallet connection failed:', err)
    }
  }, [store])

  const disconnect = useCallback(() => {
    store.reset()
    setError(null)
  }, [store])

  const sign = useCallback(
    async (transaction: string) => {
      try {
        const signed = await signTransaction(transaction)
        return signed
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to sign transaction'
        setError(errorMsg)
        throw err
      }
    },
    [],
  )

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (window.freighter) {
          const isConnected = await window.freighter.isConnected()
          if (isConnected) {
            const publicKey = await getPublicKey()
            store.setAddress(publicKey)
            store.setConnected(true)
          }
        }
      } catch (err) {
        console.log('Wallet not connected')
      }
    }
    checkConnection()
  }, [store])

  return {
    account: store.address,
    isConnected: store.isConnected,
    balance: store.balance,
    network: store.network,
    connect,
    disconnect,
    sign,
    error,
  }
}
