import React, { useState } from 'react'

const GiftCardValidator: React.FC = () => {
  const [code, setCode] = useState('')
  const [result, setResult] = useState<{ success: boolean; amount?: number; error?: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const validateCode = async () => {
    if (code.length !== 12) return
    
    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/gift-cards/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.toUpperCase() }),
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ success: false, error: 'Network error' })
    }
    setLoading(false)
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Validate Gift Card</h2>
      
      <div className="space-y-4">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 12))}
          placeholder="Enter 12-digit code"
          className="w-full px-3 py-2 border rounded-md font-mono"
          maxLength={12}
        />
        
        <button
          onClick={validateCode}
          disabled={loading || code.length !== 12}
          className="bg-[#F9A245] text-white px-6 py-2 rounded-md hover:bg-[#FEB47B] disabled:opacity-50"
        >
          {loading ? 'Validating...' : 'Validate Code'}
        </button>

        {result && (
          <div className={`p-4 rounded-md ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`}>
            {result.success ? (
              <div>
                <p className="font-semibold text-green-800">Valid Gift Card!</p>
                <p className="text-green-700">Amount: ${result.amount}</p>
                <p className="text-xs text-green-600 mt-1">Code has been marked as used.</p>
              </div>
            ) : (
              <p className="text-red-700">{result.error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default GiftCardValidator