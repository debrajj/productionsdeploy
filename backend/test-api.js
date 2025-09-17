const mongoose = require('mongoose');

async function testAPI() {
  try {
    await mongoose.connect('mongodb+srv://gainmode46:XnjDxAwNf6Gx3Reo@cluster0.2zketsh.mongodb.net/gain?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Connected to database');
    
    // Test if products collection exists and has data
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📁 Collections:', collections.map(c => c.name));
    
    const productsCollection = db.collection('products');
    const count = await productsCollection.countDocuments();
    console.log('📦 Products count:', count);
    
    if (count > 0) {
      const sample = await productsCollection.findOne();
      console.log('📄 Sample product keys:', Object.keys(sample));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

testAPI();