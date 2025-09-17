const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const API_BASE = 'http://localhost:3000/api';
const MEDIA_DIR = './backend/media';

// Ensure media directory exists
if (!fs.existsSync(MEDIA_DIR)) {
  fs.mkdirSync(MEDIA_DIR, { recursive: true });
}

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    const filePath = path.join(MEDIA_DIR, filename);
    
    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filePath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(`/media/${filename}`);
        });
      } else {
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

function generateFilename(url, productName) {
  const ext = path.extname(url).split('?')[0] || '.jpg';
  const safeName = productName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return `${safeName}-${Date.now()}${ext}`;
}

async function convertExternalImages() {
  try {
    console.log('Fetching products with external images...');
    
    const response = await fetch(`${API_BASE}/products?limit=100`);
    const data = await response.json();
    
    if (!data.docs) {
      console.log('No products found');
      return;
    }
    
    let convertedCount = 0;
    
    for (const product of data.docs) {
      let needsUpdate = false;
      const updates = {};
      
      // Check main image
      if (product.image && product.image.startsWith('http')) {
        try {
          console.log(`Converting main image for: ${product.name}`);
          const filename = generateFilename(product.image, product.name);
          const localPath = await downloadImage(product.image, filename);
          updates.image = localPath;
          updates.imageType = 'url';
          updates.imageUrl = localPath;
          needsUpdate = true;
          console.log(`✅ Downloaded: ${filename}`);
        } catch (error) {
          console.log(`❌ Failed to download main image for ${product.name}: ${error.message}`);
        }
      }
      
      // Check additional images
      if (product.images && Array.isArray(product.images)) {
        const convertedImages = [];
        for (const img of product.images) {
          if (img.url && img.url.startsWith('http')) {
            try {
              const filename = generateFilename(img.url, `${product.name}-additional`);
              const localPath = await downloadImage(img.url, filename);
              convertedImages.push({ url: localPath, imageType: 'url' });
              console.log(`✅ Downloaded additional: ${filename}`);
            } catch (error) {
              console.log(`❌ Failed to download additional image: ${error.message}`);
              convertedImages.push(img); // Keep original if download fails
            }
          } else {
            convertedImages.push(img);
          }
        }
        if (convertedImages.length > 0) {
          updates.images = convertedImages;
          needsUpdate = true;
        }
      }
      
      // Check nutrition image
      if (product.nutritionImage && product.nutritionImage.startsWith('http')) {
        try {
          console.log(`Converting nutrition image for: ${product.name}`);
          const filename = generateFilename(product.nutritionImage, `${product.name}-nutrition`);
          const localPath = await downloadImage(product.nutritionImage, filename);
          updates.nutritionImage = localPath;
          updates.nutritionImageType = 'url';
          updates.nutritionImageUrl = localPath;
          needsUpdate = true;
          console.log(`✅ Downloaded nutrition: ${filename}`);
        } catch (error) {
          console.log(`❌ Failed to download nutrition image for ${product.name}: ${error.message}`);
        }
      }
      
      // Update product if needed
      if (needsUpdate) {
        try {
          const updateResponse = await fetch(`${API_BASE}/products/${product.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
          });
          
          if (updateResponse.ok) {
            console.log(`✅ Updated product: ${product.name}`);
            convertedCount++;
          } else {
            console.log(`❌ Failed to update product: ${product.name}`);
          }
        } catch (error) {
          console.log(`❌ Error updating product ${product.name}: ${error.message}`);
        }
      }
      
      // Add delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log(`\n📊 Conversion Summary:`);
    console.log(`✅ Converted: ${convertedCount} products`);
    console.log(`📁 Images saved to: ${MEDIA_DIR}`);
    
  } catch (error) {
    console.error('❌ Conversion failed:', error.message);
  }
}

convertExternalImages();