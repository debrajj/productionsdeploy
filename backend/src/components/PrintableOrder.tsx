'use client'
import React from 'react'

const PrintableOrder = ({ doc }) => {
  if (!doc) return <div>Loading...</div>

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '40px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: 'white'
    }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        borderBottom: '3px solid #007cba', 
        paddingBottom: '20px', 
        marginBottom: '30px' 
      }}>
        <h1 style={{ margin: '0 0 10px 0', color: '#007cba', fontSize: '28px' }}>ORDER INVOICE</h1>
        <h2 style={{ margin: 0, color: '#666', fontSize: '20px' }}>#{doc.orderNumber}</h2>
      </div>

      {/* Order Info Bar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        backgroundColor: '#f8f9fa', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <div>
          <strong>Date:</strong> {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'N/A'}
        </div>
        <div>
          <strong>Status:</strong> <span style={{ 
            textTransform: 'uppercase', 
            fontWeight: 'bold',
            color: doc.status === 'delivered' ? '#28a745' : doc.status === 'pending' ? '#ffc107' : '#007cba'
          }}>{doc.status || 'PENDING'}</span>
        </div>
        <div>
          <strong>Payment:</strong> {doc.paymentMethod || 'N/A'}
        </div>
      </div>

      {/* Customer & Address */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
        <div>
          <h3 style={{ color: '#007cba', borderBottom: '2px solid #007cba', paddingBottom: '5px' }}>CUSTOMER</h3>
          <div style={{ fontSize: '16px', lineHeight: '1.6' }}>
            <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{doc.customerName || 'N/A'}</div>
            <div>{doc.customerEmail || 'N/A'}</div>
          </div>
        </div>
        
        <div>
          <h3 style={{ color: '#007cba', borderBottom: '2px solid #007cba', paddingBottom: '5px' }}>SHIPPING ADDRESS</h3>
          <div style={{ fontSize: '16px', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
            {doc.shippingAddress || 'N/A'}
          </div>
        </div>
      </div>

      {/* Items */}
      {doc.items && doc.items.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#007cba', borderBottom: '2px solid #007cba', paddingBottom: '5px' }}>ORDER ITEMS</h3>
          {doc.items.map((item, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '15px 0', 
              borderBottom: '1px solid #eee'
            }}>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Product ID: {item.product}</div>
                <div style={{ color: '#666' }}>Qty: {item.quantity}</div>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>₹{item.price}</div>
            </div>
          ))}
        </div>
      )}

      {/* Total */}
      <div style={{ 
        textAlign: 'right', 
        fontSize: '24px', 
        fontWeight: 'bold', 
        color: '#007cba',
        borderTop: '3px solid #007cba',
        paddingTop: '20px',
        marginTop: '30px'
      }}>
        TOTAL: ₹{doc.totalAmount || 0}
      </div>

      {/* Notes */}
      {doc.notes && (
        <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>NOTES:</h4>
          <div>{doc.notes}</div>
        </div>
      )}

      {/* Print Button */}
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <button 
          onClick={() => window.print()}
          style={{
            padding: '12px 30px',
            backgroundColor: '#007cba',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          🖨️ PRINT ORDER
        </button>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          button { display: none !important; }
          body { margin: 0; }
        }
      `}</style>
    </div>
  )
}

export default PrintableOrder