export default function CreateEscrow() {
  return (
    <div className="py-12">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Create New Escrow</h2>

        <form className="card p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Seller Address</label>
            <input
              type="text"
              placeholder="GXXX..."
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Amount (XLM)</label>
            <input
              type="number"
              placeholder="1000"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              placeholder="Describe the transaction..."
              className="input h-24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Expires In (hours)</label>
            <input
              type="number"
              placeholder="24"
              className="input"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
          >
            Create Escrow
          </button>
        </form>
      </div>
    </div>
  )
}
