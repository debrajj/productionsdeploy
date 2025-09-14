import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function checkOrders() {
  const client = new MongoClient(process.env.DATABASE_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const ordersCollection = db.collection('orders');
    
    // Get total count
    const count = await ordersCollection.countDocuments();
    console.log(`📊 Total orders: ${count}`);
    
    // Get first few orders
    const orders = await ordersCollection.find({}).limit(3).toArray();
    console.log('📋 Sample orders:');
    orders.forEach((order, index) => {
      console.log(`${index + 1}. ID: ${order._id}, Order: ${order.orderNumber}, Email: ${order.customerEmail}`);
    });
    
    // Check for any indexes that might prevent deletion
    const indexes = await ordersCollection.indexes();
    console.log('🔍 Indexes:', indexes.map(idx => idx.name));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

checkOrders();