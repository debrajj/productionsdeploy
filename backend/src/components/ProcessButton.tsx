'use client'
import React, { useState, useEffect } from 'react'

const ProcessButton: React.FC = () => {
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState('')
  const [id, setId] = useState<string | null>(null)

  useEffect(() => {
    // Get ID from current URL
    const pathParts = window.location.pathname.split('/')
    const currentId = pathParts[pathParts.length - 1]
    setId(currentId)
  }, [])

  const handleProcess = async () => {
    if (!id) {
      setResult('Error: No ID found')
      return
    }
    
    setProcessing(true)
    setResult('Starting CSV processing...')
    
    try {
      const response = await fetch('/api/bulk-process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        setResult(`✅ Success! Created ${data.successCount || 0} products. Errors: ${data.errorCount || 0}`)
        
        // Show detailed results if available
        if (data.details) {
          setResult(prev => prev + '\n\nDetails:\n' + data.details)
        }
        
        // Refresh page after 3 seconds to show new products
        setTimeout(() => {
          window.location.reload()
        }, 3000)
      } else {
        setResult('❌ Processing failed: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      setResult('❌ Error: ' + (error?.message || 'Unknown error'))
    } finally {
      setProcessing(false)
    }
  }

  if (!id) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ margin: '10px 0' }}>
      <button
        onClick={handleProcess}
        disabled={processing}
        style={{
          padding: '10px 20px',
          backgroundColor: processing ? '#ccc' : '#007cba',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: processing ? 'not-allowed' : 'pointer',
        }}
      >
        {processing ? 'Processing...' : 'Start Creating Products from CSV'}
      </button>
      {result && (
        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
          {result}
        </div>
      )}
    </div>
  )
}

export default ProcessButton