import EscrowDashboard from '@components/EscrowDashboard'
import TransactionHistory from '@components/TransactionHistory'

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        <EscrowDashboard />
        <div className="mt-12">
          <TransactionHistory />
        </div>
      </div>
    </div>
  )
}
