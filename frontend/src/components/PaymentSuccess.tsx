import React, { useState } from 'react'

const PaymentSuccess: React.FC = () => {
  const [giftCode, setGiftCode] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePaymentSuccess = async (amount: number) => {
    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/gift-cards/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      })
      const data = await response.json()
      if (data.success) {
        setGiftCode(data.code)
      }
    } catch (error) {
      console.error('Failed to generate gift card')
    }
    setLoading(false)
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Payment Success</h2>
      
      {!giftCode ? (
        <button
          onClick={() => handlePaymentSuccess(100)}
          disabled={loading}
          className="bg-[#F9A245] text-white px-6 py-2 rounded-md hover:bg-[#FEB47B] disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Simulate Payment ($100)'}
        </button>
      ) : (
        <div className="bg-green-50 p-4 rounded-md border border-green-200">
          <h3 className="font-semibold text-green-800 mb-2">Gift Card Generated!</h3>
          <p className="text-sm mb-2">Your 12-digit gift card code:</p>
          <div className="font-mono text-lg font-bold text-green-700 bg-white p-2 rounded border">
            {giftCode}
          </div>
          <p className="text-xs text-green-600 mt-2">This code is valid for one-time use only.</p>
        </div>
      )}
    </div>
  )
}

export default PaymentSuccess