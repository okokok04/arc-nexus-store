export default function Home() {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-4">Welcome to Stellar Escrow</h2>
        <p className="text-xl text-gray-600 mb-8">
          Secure peer-to-peer payments on Stellar blockchain
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-bold mb-2">🔒 Secure</h3>
            <p className="text-gray-600">
              Multi-party authorization and on-chain verification
            </p>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-bold mb-2">⚡ Fast</h3>
            <p className="text-gray-600">
              Sub-second settlement on Stellar network
            </p>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-bold mb-2">💰 Low Cost</h3>
            <p className="text-gray-600">
              Minimal fees compared to traditional escrow
            </p>
          </div>
        </div>

        <div className="mt-12 p-8 bg-stellar-50 rounded-lg border border-stellar-200">
          <h3 className="text-2xl font-bold mb-4">How it works</h3>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li>Connect your Freighter wallet</li>
            <li>Create a new escrow agreement</li>
            <li>Buyer deposits funds</li>
            <li>Seller confirms delivery</li>
            <li>Payment automatically released</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
