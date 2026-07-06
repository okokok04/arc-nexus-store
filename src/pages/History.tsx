export default function History() {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Transaction History</h2>

        <div className="card p-8">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Date</th>
                <th className="text-left py-3">Type</th>
                <th className="text-left py-3">Amount</th>
                <th className="text-left py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3">Loading...</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
