const mongoose = require('mongoose');

async function fixDB() {
  try {
    await mongoose.connect('mongodb+srv://gainmode46:XnjDxAwNf6Gx3Reo@cluster0.2zketsh.mongodb.net/gain?retryWrites=true&w=majority&appName=Cluster0');
    
    const db = mongoose.connection.db;
    
    // Drop slug index
    try {
      await db.collection('products').dropIndex('slug_1');
      console.log('✅ Dropped slug index');
    } catch (e) {
      console.log('Index may not exist');
    }
    
    // Clear existing products
    await db.collection('products').deleteMany({});
    console.log('✅ Cleared products');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

fixDB();