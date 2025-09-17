import React, { useState } from 'react'

const BulkImport: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [message, setMessage] = useState('')

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    setFile(selectedFile || null)
    setMessage('')
  }

  const handleUpload = async () => {
    if (!file) return

    setProcessing(true)
    setMessage('Processing...')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/bulk-import', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      
      if (response.ok) {
        setMessage(`✅ Success! Imported ${result.imported || 0} products`)
        setTimeout(() => window.location.reload(), 2000)
      } else {
        setMessage(`❌ Error: ${result.error || 'Upload failed'}`)
      }
    } catch (error) {
      setMessage(`❌ Error: Upload failed`)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '20px 0' }}>
      <h3>📦 Add Products from CSV</h3>
      
      <div style={{ marginTop: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileSelect}
          style={{ padding: '5px' }}
        />
        
        <button
          onClick={handleUpload}
          disabled={!file || processing}
          style={{
            padding: '8px 16px',
            backgroundColor: (!file || processing) ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: (!file || processing) ? 'not-allowed' : 'pointer'
          }}
        >
          {processing ? '⏳ Processing...' : '📤 Add Products'}
        </button>
      </div>
      
      {message && (
        <div style={{ 
          marginTop: '10px', 
          padding: '10px', 
          borderRadius: '4px',
          backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
          color: message.includes('✅') ? '#155724' : '#721c24'
        }}>
          {message}
        </div>
      )}
    </div>
  )
}

export default BulkImport