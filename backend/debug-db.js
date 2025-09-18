const mongoose = require('mongoose');

async function debugDatabase() {
  try {
    await mongoose.connect('mongodb+srv://gainmode46:XnjDxAwNf6Gx3Reo@cluster0.2zketsh.mongodb.net/gain?retryWrites=true&w=majority&appName=Cluster0');
    
    const db = mongoose.connection.db;
    
    // Check total products
    const totalProducts = await db.collection('products').countDocuments();
    console.log(`Total products: ${totalProducts}`);
    
    // Check bestSeller products
    const bestSellers = await db.collection('products').find({ bestSeller: true }).toArray();
    console.log(`\nBest Sellers (${bestSellers.length}):`);
    bestSellers.slice(0, 3).forEach(p => console.log(`- ${p.name}: bestSeller=${p.bestSeller}`));
    
    // Check lovedByExperts products
    const experts = await db.collection('products').find({ lovedByExperts: true }).toArray();
    console.log(`\nLoved by Experts (${experts.length}):`);
    experts.slice(0, 3).forEach(p => console.log(`- ${p.name}: lovedByExperts=${p.lovedByExperts}`));
    
    // Check sample product structure
    const sample = await db.collection('products').findOne();
    console.log('\nSample product structure:');
    console.log({
      name: sample.name,
      bestSeller: sample.bestSeller,
      lovedByExperts: sample.lovedByExperts,
      featured: sample.featured,
      trending: sample.trending
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

debugDatabase();