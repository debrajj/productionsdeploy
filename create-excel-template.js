const XLSX = require('xlsx')
const path = require('path')

// Sample product data
const templateData = [
  {
    name: 'Premium Whey Protein Isolate',
    price: 4199,
    originalPrice: 4999,
    category: 'SPORTS NUTRITION',
    subcategory: 'Proteins',
    brand: 'Optimum Nutrition',
    description: 'High-quality whey protein isolate for muscle building',
    imageUrl: 'https://example.com/protein.jpg',
    additionalImageUrls: 'https://example.com/protein2.jpg,https://example.com/protein3.jpg',
    rating: 4.5,
    reviews: 150,
    onSale: true,
    featured: true,
    trending: false,
    bestSeller: true,
    lovedByExperts: true,
    shopByGoal: 'MUSCLE_GAIN',
    simpleFlavors: 'Chocolate,Vanilla,Strawberry',
    variants: '[{"flavor":"Chocolate","weight":"1kg","price":4199},{"flavor":"Vanilla","weight":"1kg","price":4199}]',
    servingSize: '30g (1 scoop)',
    servingsPerContainer: 33,
    protein: '25g',
    carbohydrates: '2g',
    fat: '0.5g',
    calories: 110,
    ingredients: 'Whey Protein Isolate,Natural Flavors,Lecithin'
  },
  {
    name: 'Mass Gainer Pro',
    price: 3499,
    originalPrice: 3999,
    category: 'SPORTS NUTRITION',
    subcategory: 'Gainers',
    brand: 'MuscleTech',
    description: 'Advanced mass gainer for weight gain',
    imageUrl: 'https://example.com/gainer.jpg',
    additionalImageUrls: 'https://example.com/gainer2.jpg',
    rating: 4.2,
    reviews: 89,
    onSale: true,
    featured: false,
    trending: true,
    bestSeller: false,
    lovedByExperts: false,
    shopByGoal: 'MUSCLE_GAIN',
    simpleFlavors: 'Chocolate,Vanilla',
    variants: '[{"flavor":"Chocolate","weight":"3kg","price":3499}]',
    servingSize: '100g (2 scoops)',
    servingsPerContainer: 30,
    protein: '50g',
    carbohydrates: '85g',
    fat: '5g',
    calories: 630,
    ingredients: 'Maltodextrin,Whey Protein,Creatine'
  },
  {
    name: 'Fat Burner Extreme',
    price: 2299,
    originalPrice: 2799,
    category: 'SPORTS NUTRITION',
    subcategory: 'Fat Burners',
    brand: 'Cellucor',
    description: 'Thermogenic fat burner supplement',
    imageUrl: 'https://example.com/fatburner.jpg',
    additionalImageUrls: '',
    rating: 4.0,
    reviews: 67,
    onSale: false,
    featured: false,
    trending: false,
    bestSeller: false,
    lovedByExperts: true,
    shopByGoal: 'WEIGHT_LOSS',
    simpleFlavors: '',
    variants: '',
    servingSize: '2 capsules',
    servingsPerContainer: 60,
    protein: '0g',
    carbohydrates: '0g',
    fat: '0g',
    calories: 5,
    ingredients: 'Green Tea Extract,Caffeine,L-Carnitine'
  }
]

// Create workbook and worksheet
const worksheet = XLSX.utils.json_to_sheet(templateData)
const workbook = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(workbook, worksheet, 'Products')

// Save the file
const filePath = path.join(__dirname, 'product-import-template.xlsx')
XLSX.writeFile(workbook, filePath)

console.log('Excel template created:', filePath)
console.log('Sample data includes:')
templateData.forEach((product, index) => {
  console.log(`${index + 1}. ${product.name} - ₹${product.price}`)
})