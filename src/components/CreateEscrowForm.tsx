import { useState } from 'react'
import { useWallet } from '@hooks/useWallet'
import { createEscrow } from '@lib/contract'

export default function CreateEscrowForm() {
  const { account, isConnected } = useWallet()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    sellerAddress: '',
    amount: '',
    tokenType: 'XLM',
    description: '',
    expiresIn: '24',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = (): boolean => {
    if (!formData.sellerAddress.startsWith('G') || formData.sellerAddress.length !== 56) {
      setError('Invalid seller address')
      return false
    }
    if (Number(formData.amount) <= 0) {
      setError('Amount must be greater than 0')
      return false
    }
    if (!formData.description.trim()) {
      setError('Description is required')
      return false
    }
    if (Number(formData.expiresIn) <= 0) {
      setError('Expiration must be greater than 0')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!isConnected || !account) {
      setError('Please connect your wallet first')
      return
    }

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      await createEscrow(
        account,
        formData.sellerAddress,
        Number(formData.amount),
        Number(formData.expiresIn) * 3600,
        formData.description,
        formData.tokenType,
      )
      setSuccess(true)
      setFormData({
        sellerAddress: '',
        amount: '',
        tokenType: 'XLM',
        description: '',
        expiresIn: '24',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create escrow')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-8 max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Create Escrow Agreement</h2>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">{error}</div>}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
          Escrow created successfully! 🎉
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Seller Address</label>
        <input
          type="text"
          name="sellerAddress"
          value={formData.sellerAddress}
          onChange={handleChange}
          placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
          className="input"
          required
        />
        <p className="text-xs text-gray-500 mt-1">Must be a valid Stellar address</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Amount</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="1000"
          step="0.0001"
          min="0"
          className="input"
          required
        />
        <p className="text-xs text-gray-500 mt-1">{formData.tokenType} amount</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Token Type</label>
        <select name="tokenType" value={formData.tokenType} onChange={handleChange} className="input">
          <option value="XLM">XLM</option>
          <option value="USDC">USDC</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the transaction details, what the buyer is paying for, etc..."
          className="input h-24 resize-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Expires In (hours)</label>
        <input
          type="number"
          name="expiresIn"
          value={formData.expiresIn}
          onChange={handleChange}
          placeholder="24"
          min="1"
          max="720"
          className="input"
          required
        />
        <p className="text-xs text-gray-500 mt-1">After expiration, buyer can request refund</p>
      </div>

      <button
        type="submit"
        disabled={loading || !isConnected}
        className={`btn btn-primary w-full ${loading || !isConnected ? 'btn-loading' : ''}`}
      >
        {loading ? '⏳ Creating...' : '✅ Create Escrow'}
      </button>

      {!isConnected && <p className="text-sm text-yellow-600 text-center">Please connect wallet to proceed</p>}
    </form>
  )
}
