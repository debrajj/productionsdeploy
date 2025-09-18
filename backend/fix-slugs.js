const mongoose = require('mongoose');

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim('-'); // Remove leading/trailing hyphens
}

async function fixSlugs() {
  try {
    await mongoose.connect('mongodb+srv://gainmode46:XnjDxAwNf6Gx3Reo@cluster0.2zketsh.mongodb.net/gain?retryWrites=true&w=majority&appName=Cluster0');
    
    const db = mongoose.connection.db;
    const products = await db.collection('products').find({}).toArray();
    
    console.log(`Found ${products.length} products`);
    
    for (const product of products) {
      const slug = generateSlug(product.name);
      await db.collection('products').updateOne(
        { _id: product._id },
        { $set: { slug: slug } }
      );
      console.log(`Updated ${product.name} -> ${slug}`);
    }
    
    console.log('✅ All slugs updated');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

fixSlugs();