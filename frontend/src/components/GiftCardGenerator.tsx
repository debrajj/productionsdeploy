import React, { useState } from 'react'

interface GiftCardGeneratorProps {
  onGiftCardGenerated: (giftCard: { code: string; amount: number; balance: number }) => void
}

const GiftCardGenerator: React.FC<GiftCardGeneratorProps> = ({ onGiftCardGenerated }) => {
  const [amount, setAmount] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const generateGiftCard = async () => {
    if (amount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/gift-cards/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          orderId: `ORDER_${Date.now()}`,
        }),
      })

      const data = await response.json()

      if (data.success) {
        onGiftCardGenerated(data.giftCard)
        setAmount(0)
      } else {
        setError(data.error || 'Failed to generate gift card')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Generate Gift Card</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gift Card Amount ($)
          </label>
          <input
            type="number"
            value={amount || ''}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F9A245]"
            placeholder="Enter amount"
            min="1"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <button
          onClick={generateGiftCard}
          disabled={loading || amount <= 0}
          className="w-full bg-[#F9A245] hover:bg-[#FEB47B] text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating...' : 'Generate Gift Card'}
        </button>
      </div>
    </div>
  )
}

export default GiftCardGenerator