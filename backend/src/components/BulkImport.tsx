import React from 'react'

const BulkImport: React.FC = () => {
  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '20px 0' }}>
      <h3>📦 Bulk Product Import</h3>
      <p>Import multiple products at once using Excel/CSV files.</p>
      
      <div style={{ marginTop: '15px' }}>
        <a 
          href="/api/download-template" 
          style={{ 
            display: 'inline-block',
            padding: '8px 16px',
            backgroundColor: '#F9A246',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            marginRight: '10px'
          }}
        >
          📥 Download Template
        </a>
        
        <span style={{ color: '#666', fontSize: '14px' }}>
          Use POST /api/bulk-import to upload your Excel file
        </span>
      </div>
      
      <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
        <strong>Template includes:</strong> Product name, price, category, brand, variants, nutrition info, and more.
      </div>
    </div>
  )
}

export default BulkImport