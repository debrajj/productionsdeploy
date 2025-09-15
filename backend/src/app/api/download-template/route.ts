import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

export async function GET() {
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
    }
  ]

  const worksheet = XLSX.utils.json_to_sheet(templateData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Products')

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="product-import-template.xlsx"',
    },
  })
}