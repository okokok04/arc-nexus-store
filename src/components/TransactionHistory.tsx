import { useEffect, useState } from 'react'
import { useWallet } from '@hooks/useWallet'

interface Transaction {
  id: string
  type: string
  amount: number
  timestamp: number
  status: string
}

export default function TransactionHistory() {
  const { account } = useWallet()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!account) return
    // TODO: Load transactions from contract
    setLoading(false)
  }, [account])

  return (
    <div className="card p-6">
      <h2 className="text-2xl font-bold mb-6">Transaction History</h2>

      {loading ? (
        <p className="text-center py-8 text-gray-500">Loading...</p>
      ) : transactions.length === 0 ? (
        <p className="text-center py-8 text-gray-500">No transactions yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-4 font-bold">Date</th>
                <th className="text-left p-4 font-bold">Type</th>
                <th className="text-right p-4 font-bold">Amount</th>
                <th className="text-left p-4 font-bold">Status</th>
                <th className="text-left p-4 font-bold">Tx Hash</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{new Date(tx.timestamp).toLocaleDateString()}</td>
                  <td className="p-4 capitalize">{tx.type}</td>
                  <td className="text-right p-4 font-mono">{tx.amount} XLM</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        tx.status === 'confirmed'
                          ? 'bg-green-100 text-green-700'
                          : tx.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs text-gray-600">{tx.id.substring(0, 16)}...</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
