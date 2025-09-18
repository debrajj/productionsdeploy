'use client'
import React, { useState } from 'react'

const BulkImportButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleBulkImport = async () => {
    setIsLoading(true)
    setResult(null)
    
    try {
      const response = await fetch('/api/bulk-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        message: '❌ Network error occurred',
        error: error.message
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <button
        onClick={handleBulkImport}
        disabled={isLoading}
        style={{
          backgroundColor: isLoading ? '#6b7280' : '#F9A246',
          color: 'white',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s ease'
        }}
      >
        {isLoading ? (
          <>
            <div style={{
              width: '16px',
              height: '16px',
              border: '2px solid #ffffff',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            🔄 Processing...
          </>
        ) : (
          '🚀 Bulk Import Products'
        )}
      </button>
      
      {result && (
        <div style={{
          marginTop: '20px',
          padding: '20px',
          borderRadius: '8px',
          backgroundColor: result.success ? '#f0fdf4' : '#fef2f2',
          border: `2px solid ${result.success ? '#22c55e' : '#ef4444'}`
        }}>
          <h3 style={{
            margin: '0 0 16px 0',
            color: result.success ? '#15803d' : '#dc2626',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            {result.message}
          </h3>
          
          {result.success && result.stats && (
            <div style={{ display: 'grid', gap: '8px' }}>
              <div style={{
                padding: '12px',
                backgroundColor: '#e0f2fe',
                borderRadius: '6px',
                border: '1px solid #0284c7'
              }}>
                <strong style={{ color: '#0284c7' }}>📊 Total Records Processed: </strong>
                <span style={{ color: '#0f172a', fontWeight: 'bold' }}>{result.stats.totalProcessed}</span>
              </div>
              
              <div style={{
                padding: '12px',
                backgroundColor: '#f0fdf4',
                borderRadius: '6px',
                border: '1px solid #22c55e'
              }}>
                <strong style={{ color: '#15803d' }}>📈 Total Products Inserted: </strong>
                <span style={{ color: '#0f172a', fontWeight: 'bold' }}>{result.stats.totalInserted}</span>
              </div>
              
              <div style={{
                padding: '12px',
                backgroundColor: '#fef3c7',
                borderRadius: '6px',
                border: '1px solid #f59e0b'
              }}>
                <strong style={{ color: '#d97706' }}>✅ Success Rate: </strong>
                <span style={{ color: '#0f172a', fontWeight: 'bold' }}>{result.stats.successRate}</span>
              </div>
              
              <div style={{
                padding: '12px',
                backgroundColor: '#f3e8ff',
                borderRadius: '6px',
                border: '1px solid #8b5cf6'
              }}>
                <strong style={{ color: '#7c3aed' }}>🎯 Status: </strong>
                <span style={{ color: '#0f172a', fontWeight: 'bold' }}>{result.stats.status}</span>
              </div>
            </div>
          )}
          
          {!result.success && (
            <p style={{ color: '#dc2626', margin: '8px 0 0 0' }}>
              Error: {result.error}
            </p>
          )}
        </div>
      )}
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default BulkImportButton