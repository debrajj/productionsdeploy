import fs from 'fs';

const brands = [
  { name: "Avvatar", slug: "avvatar" },
  { name: "HYPR", slug: "hypr" },
  { name: "Naturaltein", slug: "naturaltein" },
  { name: "AS-IT-IS", slug: "as-it-is" },
  { name: "Bigmuscles Nutrition", slug: "bigmuscles-nutrition" },
  { name: "Nutrabay", slug: "nutrabay" },
  { name: "Isopure", slug: "isopure" }
];

async function addBrands() {
  const baseUrl = `${process.env.BACKEND_URL}/api`;
  
  console.log(`Adding ${brands.length} brands...`);
  
  for (const brand of brands) {
    try {
      const response = await fetch(`${baseUrl}/brands`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(brand)
      });
      
      if (response.ok) {
        console.log(`✅ Added brand: ${brand.name}`);
      } else {
        const error = await response.text();
        console.error(`❌ Failed brand: ${brand.name} - ${response.status}: ${error}`);
      }
    } catch (error) {
      console.error(`❌ Error brand: ${brand.name} - ${error.message}`);
    }
  }
  
  console.log('🎉 Brands added! Now running product import...');
  
  // Now import products
  const jsonPath = '../frontend/src/data/homeproduct.json';
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  
  for (const product of data.products) {
    const payloadProduct = {
      name: product.name,
      slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      image: product.image,
      price: product.price,
      originalPrice: product.originalPrice || null,
      onSale: product.onSale || false,
      category: product.category,
      subcategory: product.subcategory,
      brand: product.brand,
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
        console.log(`✅ Added product: ${product.name}`);
      } else {
        const error = await response.text();
        console.error(`❌ Failed product: ${product.name} - ${response.status}`);
      }
    } catch (error) {
      console.error(`❌ Error product: ${product.name} - ${error.message}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('🎉 All done! Products added to backend.');
}

addBrands();