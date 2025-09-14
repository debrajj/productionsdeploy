import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function deleteAllOrders() {
  const client = new MongoClient(process.env.DATABASE_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const ordersCollection = db.collection('orders');
    
    // Get count before deletion
    const count = await ordersCollection.countDocuments();
    console.log(`📊 Found ${count} orders to delete`);
    
    if (count === 0) {
      console.log('❌ No orders found');
      return;
    }
    
    // Delete all orders
    const result = await ordersCollection.deleteMany({});
    
    console.log(`✅ Deleted ${result.deletedCount} orders`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

deleteAllOrders();