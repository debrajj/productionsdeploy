const { MongoClient } = require('mongodb');

// MongoDB connection URL - update this to match your database
const MONGODB_URI = process.env.DATABASE_URI;

async function addUpsellsToProducts() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const productsCollection = db.collection('products');
    
    // Get all products
    const products = await productsCollection.find({}).toArray();
    console.log(`Found ${products.length} products`);
    
    if (products.length < 2) {
      console.log('Need at least 2 products to create upsells');
      return;
    }
    
    // Add upsells to the first few products
    for (let i = 0; i < Math.min(3, products.length); i++) {
      const currentProduct = products[i];
      const upsells = [];
      
      // Add 2-3 other products as upsells
      for (let j = 0; j < products.length && upsells.length < 3; j++) {
        if (i !== j) { // Don't add self as upsell
          upsells.push({
            upsellProduct: products[j]._id,
            discountPercentage: Math.floor(Math.random() * 20) + 5, // 5-25% discount
            description: `Perfect complement to ${currentProduct.name}`,
            active: true
          });
        }
      }
      
      // Update the product with upsells
      await productsCollection.updateOne(
        { _id: currentProduct._id },
        { $set: { upsells: upsells } }
      );
      
      console.log(`✅ Added ${upsells.length} upsells to: ${currentProduct.name}`);
    }
    
    console.log('✅ Successfully added upsells to products!');
    
  } catch (error) {
    console.error('❌ Error adding upsells:', error);
  } finally {
    await client.close();
  }
}

addUpsellsToProducts();