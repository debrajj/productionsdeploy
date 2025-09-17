'use client'
import React from 'react'

export const ProcessButton: React.FC = () => {
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState('')
  const [uploadCount, setUploadCount] = React.useState(0)

  React.useEffect(() => {
    // Get upload count on load
    fetch('/api/bulk-upload')
      .then(res => res.json())
      .then(data => setUploadCount(data.totalDocs || 0))
      .catch(() => setUploadCount(0))
  }, [])

  const handleProcess = async () => {
    setLoading(true)
    setMessage('🚀 Creating products...')
    
    try {
      const response = await fetch('/api/process-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const result = await response.json()
        setMessage(`✅ SUCCESS: ${result.message}`)
        setLoading(false)
        // Don't auto-refresh, let user see the result
      } else {
        setMessage('❌ FAILED: Could not create products')
        setLoading(false)
      }
    } catch (error) {
      setMessage(`❌ ERROR: ${error.message}`)
      setLoading(false)
    }
  }

  return (
    <div style={{ margin: '20px 0', padding: '20px', border: '2px solid #333', borderRadius: '8px', backgroundColor: '#1a1a1a' }}>
      <div style={{ marginBottom: '15px', fontSize: '14px', color: '#ccc' }}>
        📁 <strong>Total CSV Files Uploaded:</strong> {uploadCount}
      </div>
      
      <button
        onClick={handleProcess}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#555' : '#000',
          color: 'white',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          width: '100%',
          transition: 'all 0.3s ease'
        }}
      >
        {loading ? '⏳ PROCESSING CSV...' : '🚀 PROCESS CSV & CREATE PRODUCTS'}
      </button>
      
      {message && (
        <div style={{ 
          marginTop: '15px', 
          padding: '12px', 
          backgroundColor: message.includes('✅') ? '#1a3d2e' : message.includes('❌') ? '#3d1a1a' : '#3d3d1a',
          border: `2px solid ${message.includes('✅') ? '#00ff00' : message.includes('❌') ? '#ff0000' : '#ffff00'}`,
          color: '#fff',
          borderRadius: '6px',
          fontWeight: 'bold',
          fontSize: '14px',
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}
      
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#aaa', textAlign: 'center' }}>
        📝 This will create products from your uploaded CSV files
      </div>
    </div>
  )
}