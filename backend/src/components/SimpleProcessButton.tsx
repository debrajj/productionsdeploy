'use client'
import React, { useState } from 'react'

export const SimpleProcessButton = () => {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState({ added: 0, skipped: 0, errors: 0 })
  const [processed, setProcessed] = useState(false)
  const [progress, setProgress] = useState('')
  const [errorDetails, setErrorDetails] = useState('')

  const handleClick = async () => {
    // Immediate UI response
    setLoading(true)
    setProcessed(false)
    setResults({ added: 0, skipped: 0, errors: 0 })
    setErrorDetails('')
    setProgress('Starting...')
    
    try {
      setProgress('Processing products...')
      
      const response = await fetch('/api/test-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      
      const result = await response.json()
      console.log('API Result:', result)
      
      // Parse detailed results
      setResults({
        added: result.imported || 0,
        skipped: result.skipped || 0,
        errors: result.errors || 0
      })
      
      if (result.errorDetails) {
        setErrorDetails(result.errorDetails)
      }
      
      setProgress('Complete!')
      
      // Brief delay to show completion
      setTimeout(() => {
        setProcessed(true)
        setProgress('')
        setLoading(false)
      }, 500)
      
    } catch (err) {
      console.error('API Error:', err)
      setResults({ added: 0, skipped: 0, errors: 1 })
      setErrorDetails('Network error or server issue')
      setProcessed(true)
      setProgress('Error occurred')
      setLoading(false)
    }
  }

  return (
    <div>

      <button
        onClick={handleClick}
        style={{
          padding: '12px 24px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          width: '100%'
        }}
      >
        {loading ? (progress ? `⏳ ${progress}` : '⏳ Processing...') : processed ? 
          `✅ Added: ${results.added} | ⏭️ Skipped: ${results.skipped} | ❌ Errors: ${results.errors}` : 
          '📦 Create Products'}
      </button>
      
      {processed && errorDetails && (
        <div style={{
          marginTop: '10px',
          padding: '10px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px',
          fontSize: '14px',
          border: '1px solid #f5c6cb'
        }}>
          <strong>Error Details:</strong> {errorDetails}
        </div>
      )}
      
      {processed && results.added > 0 && (
        <div style={{
          marginTop: '10px',
          padding: '10px',
          backgroundColor: '#d4edda',
          color: '#155724',
          borderRadius: '4px',
          fontSize: '14px',
          border: '1px solid #c3e6cb'
        }}>
          <strong>Success!</strong> {results.added} products added successfully.
          {results.skipped > 0 && ` ${results.skipped} duplicates were skipped.`}
        </div>
      )}
    </div>
  )
}

export default SimpleProcessButton