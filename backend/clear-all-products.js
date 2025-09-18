const mongoose = require('mongoose');

async function clearAllProducts() {
  try {
    await mongoose.connect('mongodb+srv://gainmode46:XnjDxAwNf6Gx3Reo@cluster0.2zketsh.mongodb.net/gain?retryWrites=true&w=majority&appName=Cluster0');
    
    const db = mongoose.connection.db;
    
    // Delete all products
    const result = await db.collection('products').deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} products`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

clearAllProducts();