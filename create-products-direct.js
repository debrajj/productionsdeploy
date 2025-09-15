const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

const products = [
  {
    name: "Premium Whey XXX",
    slug: "premium-whey-xxx",
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
    name: "Mass Gainer Pro XX", 
    slug: "mass-gainer-pro-xx",
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
    onSale: false,
    trending: true,
    shopByGoal: "MUSCLE_GAIN",
    simpleFlavors: "Chocolate,Vanilla"
  },
  {
    name: "Pre-Workout Extreme",
    slug: "pre-workout-extreme", 
    imageType: "url",
    imageUrl: "https://example.com/pre-workout.jpg",
    price: 2499,
    originalPrice: 2999,
    category: "SPORTS NUTRITION",
    subcategory: "Pre/Post Workout",
    brand: "C4",
    description: "Explosive pre-workout formula with caffeine and beta-alanine",
    rating: 4.3,
    reviews: 200,
    onSale: true,
    featured: true,
    trending: true,
    bestSeller: true,
    shopByGoal: "ENERGY_PERFORMANCE",
    simpleFlavors: "Fruit Punch,Blue Razz,Watermelon"
  }
]

async function createProducts() {
  try {
    console.log('🚀 Creating products directly...')
    
    for (const product of products) {
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product)
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log(`✅ Created: ${product.name}`)
      } else {
        console.log(`❌ Failed: ${product.name} - ${response.status}`)
      }
    }
    
    console.log('🎉 All products created! Check admin panel.')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

createProducts()