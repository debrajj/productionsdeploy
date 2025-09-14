import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function deleteOrderDirect(orderIdOrNumber) {
  const client = new MongoClient(process.env.DATABASE_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const ordersCollection = db.collection('orders');
    
    let query;
    if (ObjectId.isValid(orderIdOrNumber)) {
      query = { _id: new ObjectId(orderIdOrNumber) };
    } else {
      query = { orderNumber: orderIdOrNumber };
    }
    
    // Find the order first
    const order = await ordersCollection.findOne(query);
    if (!order) {
      console.log('❌ Order not found');
      return;
    }
    
    console.log(`🎯 Found order: ${order.orderNumber} (${order.customerEmail})`);
    
    // Delete the order
    const result = await ordersCollection.deleteOne(query);
    
    if (result.deletedCount === 1) {
      console.log('✅ Order deleted successfully');
    } else {
      console.log('❌ Failed to delete order');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

// Usage: node delete-order-direct.js
// Change this to the order ID or order number you want to delete
const orderToDelete = 'ORD-2024-001'; // or use ObjectId like '689fd9da9523ce8b37bdf331'
deleteOrderDirect(orderToDelete);