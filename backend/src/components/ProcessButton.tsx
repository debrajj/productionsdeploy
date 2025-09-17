'use client'
import React from 'react'

export const ProcessButton: React.FC<{ value?: any, path?: string }> = ({ value, path }) => {
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState('')
  
  // Get the current document ID from the URL or path
  const getDocumentId = () => {
    if (typeof window !== 'undefined') {
      const url = window.location.pathname
      const match = url.match(/\/bulk-upload\/([^/]+)/)
      return match ? match[1] : null
    }
    return null
  }

  const handleProcess = async () => {
    const docId = getDocumentId()
    if (!docId) {
      setMessage('❌ ERROR: No file selected')
      return
    }

    setLoading(true)
    setMessage('🚀 Creating products from this file...')
    
    try {
      const response = await fetch('/api/process-single-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uploadId: docId })
      })
      
      if (response.ok) {
        const result = await response.json()
        setMessage(`✅ SUCCESS: Created ${result.imported} products!`)
        // Refresh page to show updated status
        setTimeout(() => window.location.reload(), 2000)
      } else {
        const error = await response.json()
        setMessage(`❌ FAILED: ${error.error || 'Could not create products'}`)
      }
    } catch (error) {
      setMessage(`❌ ERROR: ${error.message || 'Processing failed'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ margin: '20px 0', padding: '20px', border: '2px solid #333', borderRadius: '8px', backgroundColor: '#1a1a1a' }}>
      <div style={{ marginBottom: '15px', fontSize: '14px', color: '#ccc' }}>
        📁 <strong>Process this CSV file to create products</strong>
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
        {loading ? '⏳ PROCESSING...' : '🚀 PROCESS THIS FILE'}
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