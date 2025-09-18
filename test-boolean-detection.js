// Test Boolean Auto-Detection for Bulk Import

// Helper function to detect boolean values (same as in bulk import)
const parseBoolean = (value) => {
  if (!value) return false
  const cleanValue = value.trim().toLowerCase()
  return cleanValue === 'true' || cleanValue === 'TRUE' || cleanValue === '1' || cleanValue === 'yes' || cleanValue === 'YES'
}

// Sample CSV data with different boolean formats
const sampleProducts = [
  {
    name: "Whey Protein Isolate",
    price: "2999",
    category: "Protein",
    brand: "Optimum Nutrition",
    featured: "TRUE",
    trending: "false", 
    bestSeller: "Yes",
    lovedByExperts: "1",
    onSale: "NO"
  },
  {
    name: "BCAA Energy Drink",
    price: "1499", 
    category: "Amino Acids",
    brand: "Scivation",
    featured: "False",
    trending: "TRUE",
    bestSeller: "0", 
    lovedByExperts: "yes",
    onSale: "true"
  }
]

console.log('🧪 TESTING BOOLEAN AUTO-DETECTION\n')

sampleProducts.forEach((product, index) => {
  console.log(`📦 PRODUCT ${index + 1}: ${product.name}`)
  console.log('─'.repeat(50))
  
  // Process boolean fields
  const processedProduct = {
    name: product.name,
    price: parseFloat(product.price),
    category: product.category,
    brand: product.brand,
    featured: parseBoolean(product.featured),
    trending: parseBoolean(product.trending),
    bestSeller: parseBoolean(product.bestSeller),
    lovedByExperts: parseBoolean(product.lovedByExperts),
    onSale: parseBoolean(product.onSale)
  }
  
  console.log('📥 INPUT VALUES:')
  console.log(`  featured: "${product.featured}"`)
  console.log(`  trending: "${product.trending}"`)
  console.log(`  bestSeller: "${product.bestSeller}"`)
  console.log(`  lovedByExperts: "${product.lovedByExperts}"`)
  console.log(`  onSale: "${product.onSale}"`)
  
  console.log('\n📤 PROCESSED VALUES:')
  console.log(`  featured: ${processedProduct.featured}`)
  console.log(`  trending: ${processedProduct.trending}`)
  console.log(`  bestSeller: ${processedProduct.bestSeller}`)
  console.log(`  lovedByExperts: ${processedProduct.lovedByExperts}`)
  console.log(`  onSale: ${processedProduct.onSale}`)
  
  console.log('\n✅ FINAL PRODUCT DATA:')
  console.log(JSON.stringify(processedProduct, null, 2))
  console.log('\n' + '='.repeat(60) + '\n')
})

console.log('🎯 SUPPORTED BOOLEAN VALUES:')
console.log('✅ TRUE: true, TRUE, True, 1, yes, YES')
console.log('❌ FALSE: false, FALSE, False, 0, no, NO, empty')