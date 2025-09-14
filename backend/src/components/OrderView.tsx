'use client'
import React from 'react'

const OrderView = ({ doc }) => {
  const handlePrint = () => {
    window.print()
  }

  if (!doc) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, color: '#333' }}>Order #{doc.orderNumber || 'N/A'}</h1>
        <button 
          onClick={handlePrint}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007cba',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🖨️ Print Order
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
        <div>
          <h3 style={{ color: '#666', marginBottom: '10px' }}>Customer Details</h3>
          <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '6px' }}>
            <p><strong>{doc.customerName || 'N/A'}</strong></p>
            <p>{doc.customerEmail || 'N/A'}</p>
          </div>
        </div>

        <div>
          <h3 style={{ color: '#666', marginBottom: '10px' }}>Order Info</h3>
          <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '6px' }}>
            <p><strong>Status:</strong> <span style={{ 
              padding: '4px 8px', 
              borderRadius: '12px', 
              backgroundColor: doc.status === 'delivered' ? '#d4edda' : doc.status === 'pending' ? '#fff3cd' : '#d1ecf1',
              color: doc.status === 'delivered' ? '#155724' : doc.status === 'pending' ? '#856404' : '#0c5460'
            }}>{doc.status || 'pending'}</span></p>
            <p><strong>Date:</strong> {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Payment:</strong> {doc.paymentMethod || 'N/A'}</p>
          </div>
        </div>
      </div>

      {doc.shippingAddress && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#333', marginBottom: '8px', fontSize: '16px' }}>Shipping Address</h3>
          <div style={{ 
            border: '1px solid #ddd', 
            padding: '10px', 
            fontSize: '13px',
            backgroundColor: '#fafafa',
            lineHeight: '1.4',
            whiteSpace: 'pre-line'
          }}>
            {doc.shippingAddress}
          </div>
        </div>
      )}

      {doc.items && doc.items.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#333', marginBottom: '10px', fontSize: '16px' }}>Items Ordered</h3>
          {doc.items.map((item, index) => (
            <div key={index} style={{ 
              border: '1px solid #ddd', 
              marginBottom: '8px', 
              padding: '8px 12px',
              fontSize: '13px',
              backgroundColor: '#fafafa'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <strong>{item.name || `Product #${item.id}`}</strong>
                  {item.variant && <span style={{ color: '#666', marginLeft: '8px' }}>({item.variant})</span>}
                </div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <span>Qty: {item.quantity}</span>
                  <span>₹{item.price?.toLocaleString()}</span>
                  <strong>₹{(item.price * item.quantity)?.toLocaleString()}</strong>
                </div>
              </div>
            </div>
          ))}
          
          <div style={{ border: '2px solid #333', padding: '10px', marginTop: '15px', backgroundColor: '#f9f9f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
              <span>Subtotal:</span>
              <span>₹{doc.subtotal?.toLocaleString()}</span>
            </div>
            {doc.shippingCost > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span>Shipping:</span>
                <span>₹{doc.shippingCost?.toLocaleString()}</span>
              </div>
            )}
            <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #333' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 'bold' }}>
              <span>TOTAL:</span>
              <span>₹{doc.total?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}



      {doc.notes && (
        <div style={{ marginTop: '30px' }}>
          <h3 style={{ color: '#666', marginBottom: '10px' }}>Notes</h3>
          <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '6px' }}>
            <p>{doc.notes}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderView