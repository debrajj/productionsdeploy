import React from 'react'

const BulkImportView: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Bulk Product Import</h2>
      <p>Use the API endpoints to import products in bulk:</p>
      <ul>
        <li><strong>POST /api/bulk-import</strong> - Upload Excel file</li>
        <li><strong>GET /api/download-template</strong> - Download template</li>
      </ul>
      <a href="/api/download-template" style={{ color: '#0066cc' }}>
        Download Excel Template
      </a>
    </div>
  )
}

export default BulkImportView