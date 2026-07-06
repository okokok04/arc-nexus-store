import { useState, useEffect } from 'react'
import { useWallet } from '@hooks/useWallet'

export default function WalletConnect() {
  const { account, connect, disconnect, isConnected, error, balance } = useWallet()
  const [truncatedAddress, setTruncatedAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (account) {
      setTruncatedAddress(`${account.substring(0, 6)}...${account.substring(account.length - 4)}`)
    }
  }, [account])

  const handleConnect = async () => {
    setIsLoading(true)
    try {
      await connect()
    } catch (err) {
      console.error('Connection failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isConnected && account) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end text-sm">
          <p className="font-mono font-bold text-gray-900">{truncatedAddress}</p>
          {balance > 0 && <p className="text-xs text-gray-600">{balance.toFixed(4)} XLM</p>}
        </div>
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
          {account.substring(0, 1)}
        </div>
        <button onClick={disconnect} className="btn btn-secondary text-sm px-3 py-2">
          🔌 Disconnect
        </button>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={handleConnect}
        disabled={isLoading}
        className={`btn btn-primary font-medium ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? '⏳ Connecting...' : '🔑 Connect Wallet'}
      </button>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  )
}
