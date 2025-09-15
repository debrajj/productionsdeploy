const { MongoClient } = require('mongodb');

async function checkProducts() {
  // Replace with your MongoDB connection string from .env
  const uri = process.env.DATABASE_URI || 'mongodb://localhost:27017/payloadcms';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const products = db.collection('products');
    
    // Get count of products
    const count = await products.countDocuments();
    console.log(`Total products in database: ${count}`);
    
    // Get first 5 products
    const firstFive = await products.find({}).limit(5).toArray();
    console.log('First 5 products:', JSON.stringify(firstFive, null, 2));
    
  } catch (error) {
    console.error('Error checking products:', error);
  } finally {
    await client.close();
  }
}

checkProducts();
