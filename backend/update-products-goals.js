import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://gainmode46:XnjDxAwNf6Gx3Reo@cluster0.2zketsh.mongodb.net/gain?retryWrites=true&w=majority&appName=Cluster0';

// Goal mapping based on product categories and types
const goalMapping = {
  'SPORTS NUTRITION': 'MUSCLE_GAIN',
  'VITAMINS & SUPPLEMENTS': 'HEALTH_WELLNESS',
  'AYURVEDA & HERBS': 'WEIGHT_LOSS',
  'HEALTH FOOD & DRINKS': 'HEALTH_WELLNESS',
  'FITNESS': 'ENERGY_PERFORMANCE',
  'WELLNESS': 'HEALTH_WELLNESS',
};

// Subcategory-specific mappings
const subcategoryMapping = {
  'Proteins': 'MUSCLE_GAIN',
  'Gainers': 'MUSCLE_GAIN',
  'Pre/Post Workout': 'ENERGY_PERFORMANCE',
  'Fat Burners': 'WEIGHT_LOSS',
  'Amino Acids': 'MUSCLE_GAIN',
  'Herbs for Weight Loss': 'WEIGHT_LOSS',
  'Weight Loss Foods': 'WEIGHT_LOSS',
  'Multivitamins': 'HEALTH_WELLNESS',
  'Omega Fatty Acids': 'HEALTH_WELLNESS',
  'Vital Herbs': 'HEALTH_WELLNESS',
  'Health Juices': 'HEALTH_WELLNESS',
  'Gym Accessories': 'ENERGY_PERFORMANCE',
  'Fitness Trackers': 'ENERGY_PERFORMANCE',
  'Skin Care': 'HEALTH_WELLNESS',
  'Hair Care': 'HEALTH_WELLNESS',
};

async function updateProductsWithGoals() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('gain');
    const collection = db.collection('products');
    
    // Get all products
    const products = await collection.find({}).toArray();
    console.log(`Found ${products.length} products to update`);
    
    let updatedCount = 0;
    
    for (const product of products) {
      let goalValue = null;
      
      // First try to map by subcategory
      if (product.subcategory && subcategoryMapping[product.subcategory]) {
        goalValue = subcategoryMapping[product.subcategory];
      }
      // Then try to map by category
      else if (product.category && goalMapping[product.category]) {
        goalValue = goalMapping[product.category];
      }
      // Default fallback
      else {
        goalValue = 'HEALTH_WELLNESS';
      }
      
      // Update the product
      await collection.updateOne(
        { _id: product._id },
        { $set: { shopByGoal: goalValue } }
      );
      
      updatedCount++;
      
      if (updatedCount % 50 === 0) {
        console.log(`Updated ${updatedCount} products...`);
      }
    }
    
    console.log(`Successfully updated ${updatedCount} products with goal values`);
    
    // Show distribution
    const distribution = await collection.aggregate([
      { $group: { _id: '$shopByGoal', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();
    
    console.log('\nGoal distribution:');
    distribution.forEach(item => {
      console.log(`${item._id}: ${item.count} products`);
    });
    
  } catch (error) {
    console.error('Error updating products:', error);
  } finally {
    await client.close();
  }
}

updateProductsWithGoals();