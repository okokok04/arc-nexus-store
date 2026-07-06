import { useEffect, useState } from 'react'
import { Escrow } from '@types/index'

export default function EscrowDashboard() {
  const [escrows, setEscrows] = useState<Escrow[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    // TODO: Load escrows from contract
    setLoading(false)
  }, [])

  const stats = {
    active: escrows.filter((e) => e.state === 1).length,
    completed: escrows.filter((e) => e.state === 2).length,
    disputed: escrows.filter((e) => e.state === 4).length,
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 bg-blue-50 border-blue-200">
          <p className="text-gray-600 text-sm">Active Escrows</p>
          <p className="text-3xl font-bold">{stats.active}</p>
        </div>
        <div className="card p-4 bg-green-50 border-green-200">
          <p className="text-gray-600 text-sm">Completed</p>
          <p className="text-3xl font-bold">{stats.completed}</p>
        </div>
        <div className="card p-4 bg-red-50 border-red-200">
          <p className="text-gray-600 text-sm">Disputes</p>
          <p className="text-3xl font-bold">{stats.disputed}</p>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">My Escrows</h2>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input max-w-xs">
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="disputed">Disputed</option>
          </select>
        </div>

        {escrows.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No escrows yet. Create one to get started!</p>
        ) : (
          <div className="space-y-4">
            {escrows.map((escrow) => (
              <div key={escrow.id} className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold">Escrow #{escrow.id}</p>
                  <p className="text-sm text-gray-600">{escrow.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{escrow.amount} XLM</p>
                  <p className="text-xs text-gray-600">View details →</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
