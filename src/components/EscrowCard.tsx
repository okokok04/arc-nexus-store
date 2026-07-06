import { useState } from 'react'
import { Escrow, EscrowState } from '@types/index'
import { confirmDelivery, requestRefund, fileDispute } from '@lib/contract'
import { useWallet } from '@hooks/useWallet'

interface EscrowCardProps {
  escrow: Escrow
  onRefresh: () => void
}

const stateLabels: Record<EscrowState, string> = {
  [EscrowState.Created]: 'Waiting for deposit',
  [EscrowState.Funded]: 'Waiting for confirmation',
  [EscrowState.Completed]: 'Completed',
  [EscrowState.Refunded]: 'Refunded',
  [EscrowState.Disputed]: 'Disputed',
}

const stateColors: Record<EscrowState, string> = {
  [EscrowState.Created]: 'bg-yellow-50 border-yellow-200',
  [EscrowState.Funded]: 'bg-blue-50 border-blue-200',
  [EscrowState.Completed]: 'bg-green-50 border-green-200',
  [EscrowState.Refunded]: 'bg-gray-50 border-gray-200',
  [EscrowState.Disputed]: 'bg-red-50 border-red-200',
}

export default function EscrowCard({ escrow, onRefresh }: EscrowCardProps) {
  const { account } = useWallet()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isBuyer = account === escrow.buyer
  const isSeller = account === escrow.seller

  const handleConfirmDelivery = async () => {
    if (!isBuyer) return
    setLoading(true)
    try {
      await confirmDelivery(escrow.id)
      onRefresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to confirm delivery')
    } finally {
      setLoading(false)
    }
  }

  const handleRefund = async () => {
    if (!isBuyer) return
    setLoading(true)
    try {
      await requestRefund(escrow.id)
      onRefresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request refund')
    } finally {
      setLoading(false)
    }
  }

  const handleDispute = async () => {
    if (!isBuyer && !isSeller) return
    const reason = prompt('Enter dispute reason:')
    if (!reason) return

    setLoading(true)
    try {
      await fileDispute(escrow.id, reason)
      onRefresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to file dispute')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`card p-6 border ${stateColors[escrow.state]}`}>
      {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg">Escrow #{escrow.id}</h3>
          <p className="text-sm text-gray-600">{escrow.description}</p>
        </div>
        <span className="px-3 py-1 bg-white rounded-full text-xs font-medium">
          {stateLabels[escrow.state]}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div>
          <p className="text-gray-600">Amount</p>
          <p className="font-mono font-bold">{escrow.amount} XLM</p>
        </div>
        <div>
          <p className="text-gray-600">Buyer</p>
          <p className="font-mono text-xs">{escrow.buyer.substring(0, 10)}...</p>
        </div>
        <div>
          <p className="text-gray-600">Seller</p>
          <p className="font-mono text-xs">{escrow.seller.substring(0, 10)}...</p>
        </div>
        <div>
          <p className="text-gray-600">Expires</p>
          <p className="font-mono text-xs">{new Date(escrow.expiresAt * 1000).toLocaleDateString()}</p>
        </div>
      </div>

      {escrow.state === EscrowState.Created && isBuyer && (
        <div className="space-y-2">
          <button className="btn btn-primary w-full" disabled={loading}>
            {loading ? '⏳ Processing...' : '💰 Deposit Funds'}
          </button>
        </div>
      )}

      {escrow.state === EscrowState.Funded && (
        <div className="space-y-2">
          {isBuyer && (
            <>
              <button onClick={handleConfirmDelivery} className="btn btn-primary w-full" disabled={loading}>
                {loading ? '⏳ Processing...' : '✅ Confirm & Release Payment'}
              </button>
              <button onClick={handleRefund} className="btn btn-secondary w-full" disabled={loading}>
                {loading ? '⏳ Processing...' : '🔄 Request Refund'}
              </button>
            </>
          )}
          {(isBuyer || isSeller) && (
            <button onClick={handleDispute} className="btn btn-secondary w-full" disabled={loading}>
              {loading ? '⏳ Processing...' : '⚠️ File Dispute'}
            </button>
          )}
        </div>
      )}

      {escrow.state === EscrowState.Completed && (
        <div className="text-center text-green-600 font-medium">✅ Payment released successfully</div>
      )}

      {escrow.state === EscrowState.Refunded && (
        <div className="text-center text-blue-600 font-medium">🔄 Funds refunded to buyer</div>
      )}

      {escrow.state === EscrowState.Disputed && (
        <div className="text-center text-red-600 font-medium">⚠️ Awaiting dispute resolution</div>
      )}
    </div>
  )
}
