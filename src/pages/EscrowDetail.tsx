import { useParams } from 'react-router-dom'

export default function EscrowDetail() {
  const { id } = useParams()

  return (
    <div className="py-12">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Escrow #{id}</h2>

        <div className="card p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-lg font-bold">Loading...</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Amount</p>
              <p className="text-lg font-bold">-- XLM</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-bold mb-4">Actions</h3>
            <div className="space-y-2">
              <button className="btn btn-primary w-full">Deposit Funds</button>
              <button className="btn btn-secondary w-full">Confirm Delivery</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
