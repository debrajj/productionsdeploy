import fs from 'fs';

async function uploadProducts() {
  const baseUrl = `${process.env.BACKEND_URL}/api`;
  
  // First get all brands to map names to IDs
  console.log('Getting brands...');
  const brandsResponse = await fetch(`${baseUrl}/brands`);
  const brandsData = await brandsResponse.json();
  
  console.log('Brands response:', brandsData);
  
  const brandMap = {};
  if (brandsData.docs) {
    brandsData.docs.forEach(brand => {
      brandMap[brand.name] = brand.id;
    });
  } else if (Array.isArray(brandsData)) {
    brandsData.forEach(brand => {
      brandMap[brand.name] = brand.id;
    });
  }
  
  console.log('Brand mapping:', brandMap);
  
  // Read products from JSON
  const jsonPath = '../frontend/src/data/homeproduct.json';
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  
  console.log(`Uploading ${data.products.length} products...`);
  
  for (const product of data.products) {
    const brandId = brandMap[product.brand];
    
    if (!brandId) {
      console.log(`❌ Brand not found: ${product.brand}`);
      continue;
    }
    
    const payloadProduct = {
      name: product.name,
      slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      image: product.image,
      price: product.price,
      originalPrice: product.originalPrice || null,
      onSale: product.onSale || false,
      category: product.category,
      subcategory: product.subcategory,
      brand: brandId, // Use brand ID instead of name
      customCategory: product.category,
      customSubcategory: product.subcategory,
      customBrand: product.brand,
      featured: product.featured || false,
      trending: product.trending || false,
      bestSeller: product.bestSeller || false,
      lovedByExperts: product.lovedByExperts || false,
      description: product.description,
      rating: product.rating || 0,
      reviews: product.reviews || 0
    };
    
    try {
      const response = await fetch(`${baseUrl}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadProduct)
      });
      
      if (response.ok) {
        console.log(`✅ Added: ${product.name}`);
      } else {
        const error = await response.text();
        console.error(`❌ Failed: ${product.name} - ${response.status}`);
      }
    } catch (error) {
      console.error(`❌ Error: ${product.name} - ${error.message}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('🎉 Upload complete!');
}

uploadProducts();