// Test the DELETE API endpoint directly
const testOrderId = '68c6d7fe2b5b4f770c8c912e'; // Replace with actual order ID

fetch(`http://localhost:3000/api/orders/${testOrderId}`, {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    // Add authorization header if needed
  },
})
.then(response => response.json())
.then(data => {
  console.log('✅ Delete response:', data);
})
.catch(error => {
  console.error('❌ Delete error:', error);
});

console.log(`🧪 Testing DELETE request to: http://localhost:3000/api/orders/${testOrderId}`);