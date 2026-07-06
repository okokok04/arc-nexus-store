import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getEscrow } from '@lib/contract'
import { Escrow } from '@types/index'
import EscrowCard from '@components/EscrowCard'

export default function EscrowDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [escrow, setEscrow] = useState<Escrow | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEscrow = async () => {
    if (!id) return

    setLoading(true)
    try {
      const data = await getEscrow(parseInt(id))
      setEscrow(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load escrow')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEscrow()
  }, [id])

  if (loading) {
    return <div className="text-center py-12">⏳ Loading escrow...</div>
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>
  }

  if (!escrow) {
    return <div className="text-center py-12 text-gray-600">Escrow not found</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => window.history.back()} className="btn btn-secondary mb-6">
          ← Back
        </button>
        <h1 className="text-4xl font-bold mb-8">Escrow #{escrow.id}</h1>
        <EscrowCard escrow={escrow} onRefresh={fetchEscrow} />
      </div>
    </div>
  )
}
