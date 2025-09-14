const { getPayload } = require('payload')
const config = require('./dist/payload.config.js').default

async function fixOrderData() {
  try {
    const payload = await getPayload({ config })
    
    // Get the problematic order
    const orders = await payload.find({
      collection: 'orders',
      where: {
        orderNumber: {
          equals: 'AKFHAWVQZ'
        }
      }
    })

    if (orders.docs.length > 0) {
      const order = orders.docs[0]
      console.log('Found order:', order.id)
      
      // Update the order with proper data
      const updatedOrder = await payload.update({
        collection: 'orders',
        id: order.id,
        data: {
          items: order.items.map(item => ({
            ...item,
            name: item.name || 'O2 Nutrition Product',
            image: item.image || '/placeholder-product.jpg'
          })),
          tracking: {
            trackingNumber: 'TRK68c3d99672829ed4dfdf445a',
            carrier: 'delhivery',
            estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            shippedDate: new Date().toISOString()
          },
          status: 'shipped'
        }
      })
      
      console.log('Order updated successfully:', updatedOrder.id)
    } else {
      console.log('Order not found')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

fixOrderData()