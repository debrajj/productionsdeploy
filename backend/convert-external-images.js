const mongoose = require('mongoose');
const crypto = require('crypto');

// Load environment variables
require('dotenv').config();

// Your website domain from env
const YOUR_DOMAIN = process.env.VITE_SERVER_BASE || 'http://localhost:3000';

async function convertExternalImages() {
  try {
    await mongoose.connect('mongodb+srv://gainmode46:XnjDxAwNf6Gx3Reo@cluster0.2zketsh.mongodb.net/gain?retryWrites=true&w=majority&appName=Cluster0');
    
    const db = mongoose.connection.db;
    const products = await db.collection('products').find({}).toArray();
    
    console.log(`Processing ${products.length} products...`);
    
    for (const product of products) {
      let updated = false;
      
      // Convert main image
      if (product.image && isExternalUrl(product.image)) {
        const newImageUrl = convertToInternalUrl(product.image, product.slug, 'main');
        await db.collection('products').updateOne(
          { _id: product._id },
          { $set: { image: newImageUrl } }
        );
        console.log(`Updated main image for ${product.name}`);
        updated = true;
      }
      
      // Convert additional images
      if (product.images && typeof product.images === 'string') {
        const imageUrls = product.images.split(',').map(url => url.trim());
        const convertedUrls = imageUrls.map((url, index) => {
          if (isExternalUrl(url)) {
            return convertToInternalUrl(url, product.slug, `gallery-${index + 1}`);
          }
          return url;
        });
        
        if (convertedUrls.some((url, index) => url !== imageUrls[index])) {
          await db.collection('products').updateOne(
            { _id: product._id },
            { $set: { images: convertedUrls.join(',') } }
          );
          console.log(`Updated additional images for ${product.name}`);
          updated = true;
        }
      }
      
      // Convert nutrition image
      if (product.nutritionImage && isExternalUrl(product.nutritionImage)) {
        const newNutritionUrl = convertToInternalUrl(product.nutritionImage, product.slug, 'nutrition');
        await db.collection('products').updateOne(
          { _id: product._id },
          { $set: { nutritionImage: newNutritionUrl } }
        );
        console.log(`Updated nutrition image for ${product.name}`);
        updated = true;
      }
    }
    
    console.log('✅ All external images converted to internal URLs');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

function isExternalUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return url.startsWith('http://') || url.startsWith('https://');
}

function convertToInternalUrl(externalUrl, productSlug, imageType) {
  // Create a hash of the external URL for uniqueness
  const hash = crypto.createHash('md5').update(externalUrl).digest('hex').substring(0, 8);
  
  // Create internal URL structure
  return `${YOUR_DOMAIN}/api/images/${productSlug}/${imageType}-${hash}.jpg`;
}

convertExternalImages();