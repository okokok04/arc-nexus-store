import CreateEscrowForm from '@components/CreateEscrowForm'

export default function CreateEscrowPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create Escrow</h1>
          <p className="text-gray-600">
            Initiate a secure escrow transaction. Fund will be held until delivery is confirmed.
          </p>
        </div>
        <CreateEscrowForm />
      </div>
    </div>
  )
}
