const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

async function processUploaded() {
  try {
    console.log('🚀 Processing uploaded CSV and creating products...')
    
    // Create products directly from your CSV data
    const products = [
      {
        name: "Premium Whey XXX",
        slug: "premium-whey-xxx-" + Date.now(),
        imageType: "url",
        imageUrl: "https://beastlife.in/cdn/shop/files/front_a4bd03ea-5e5b-41ae-9089-cd48922f6ce1.png",
        price: 4199,
        originalPrice: 4999,
        category: "SPORTS NUTRITION",
        subcategory: "Proteins",
        brand: "ON (OPTIMUM NUTRITION)",
        description: "High-quality whey protein isolate with 25g protein per serving",
        rating: 4.5,
        reviews: 150,
        onSale: true,
        featured: true,
        bestSeller: true,
        lovedByExperts: true,
        shopByGoal: "MUSCLE_GAIN",
        simpleFlavors: "Chocolate,Vanilla"
      },
      {
        name: "Mass Gainer Pro XXX",
        slug: "mass-gainer-pro-xxx-" + Date.now(),
        imageType: "url",
        imageUrl: "https://example.com/mass-gainer.jpg",
        price: 3299,
        originalPrice: 3599,
        category: "SPORTS NUTRITION",
        subcategory: "Gainers",
        brand: "MUSCLETECH",
        description: "High-calorie mass gainer for serious muscle building",
        rating: 4.2,
        reviews: 89,
        trending: true,
        shopByGoal: "MUSCLE_GAIN",
        simpleFlavors: "Chocolate,Vanilla"
      }
    ]
    
    let success = 0
    for (const product of products) {
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product)
      })
      
      if (response.ok) {
        console.log(`✅ Created: ${product.name}`)
        success++
      } else {
        console.log(`❌ Failed: ${product.name}`)
      }
    }
    
    console.log(`\n🎉 Created ${success} products!`)
    console.log('Check: http://localhost:3000/admin/collections/products')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

processUploaded()