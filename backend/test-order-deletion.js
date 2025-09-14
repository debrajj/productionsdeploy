import payload from 'payload';
import dotenv from 'dotenv';
import config from './src/payload.config.ts';

dotenv.config();

async function testOrderDeletion() {
  try {
    // Initialize Payload
    await payload.init({
      config,
      secret: process.env.PAYLOAD_SECRET,
      local: true,
    });

    console.log('✅ Payload initialized successfully');

    // Get all orders first
    const orders = await payload.find({
      collection: 'orders',
      limit: 5,
    });

    console.log(`📋 Found ${orders.totalDocs} orders`);
    
    if (orders.docs.length > 0) {
      const firstOrder = orders.docs[0];
      console.log(`🎯 Attempting to delete order: ${firstOrder.orderNumber} (ID: ${firstOrder.id})`);
      
      // Try to delete the first order
      const result = await payload.delete({
        collection: 'orders',
        id: firstOrder.id,
      });
      
      console.log('✅ Order deleted successfully:', result);
    } else {
      console.log('❌ No orders found to delete');
    }

  } catch (error) {
    console.error('❌ Error during order deletion test:', error.message);
    console.error('Full error:', error);
  } finally {
    process.exit(0);
  }
}

testOrderDeletion();