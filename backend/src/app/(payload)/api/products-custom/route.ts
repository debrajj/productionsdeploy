import { getPayloadClient } from '@/lib/payload'
import { NextRequest, NextResponse } from 'next/server'
import { CollectionSlug } from 'payload'

// GET /api/products - Get all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const featured = searchParams.get('featured')
    const trending = searchParams.get('trending')
    const onSale = searchParams.get('onSale')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')

    // Build query
    const query: any = {}

    if (search) {
      query.name = { contains: search }
    }

    if (category) {
      query.category = { equals: category }
    }

    if (brand) {
      // For now, just filter by brand field - we'll handle customBrand on frontend
      query.brand = { equals: brand }
    }

    if (featured === 'true') {
      query.featured = { equals: true }
    }

    if (trending === 'true') {
      query.trending = { equals: true }
    }

    if (onSale === 'true') {
      query.onSale = { equals: true }
    }

    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.greater_than_equal = parseFloat(minPrice)
      if (maxPrice) query.price.less_than_equal = parseFloat(maxPrice)
    }
    const payload = await getPayloadClient()
    const products = await payload.find({
      collection: 'products' as CollectionSlug,
      where: query,
      page,
      limit,
      depth: 1,
    })

    // Convert to plain objects to avoid serialization issues
    const plainProducts = products.docs.map((product) => ({
      id: product.id,
      slug: (product as any).slug,
      name: (product as any).name,
      image: (product as any).image,
      images: (product as any).images || [],
      rating: (product as any).rating,
      reviews: (product as any).reviews,
      price: (product as any).price,
      originalPrice: (product as any).originalPrice,
      onSale: (product as any).onSale,
      category: (product as any).category,
      categorySlug: (product as any).categorySlug,
      subcategory: (product as any).subcategory,
      subcategorySlug: (product as any).subcategorySlug,
      brand: (product as any).brand,
      customBrand: (product as any).customBrand,
      featured: (product as any).featured,
      trending: (product as any).trending,
      description: (product as any).description,
      certifications: (product as any).certifications || [],
      nutritionInfo: (product as any).nutritionInfo,
      ingredients: (product as any).ingredients || [],
      subscriptionOptions: (product as any).subscriptionOptions,
      bundledOffers: (product as any).bundledOffers || [],
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }))

    return NextResponse.json({
      success: true,
      data: plainProducts,
      pagination: {
        page: products.page,
        totalPages: products.totalPages,
        totalDocs: products.totalDocs,
        hasNextPage: products.hasNextPage,
        hasPrevPage: products.hasPrevPage,
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 })
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''
    let body

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const payloadData = formData.get('_payload') as string
      if (payloadData) {
        body = JSON.parse(payloadData)
      } else {
        return NextResponse.json(
          { success: false, error: 'No payload data found in form' },
          { status: 400 },
        )
      }
    } else {
      const rawBody = await request.text()
      try {
        body = JSON.parse(rawBody)
      } catch (jsonError) {
        console.error('Invalid JSON received:', rawBody.substring(0, 100))
        return NextResponse.json(
          { success: false, error: 'Invalid JSON in request body' },
          { status: 400 },
        )
      }
    }
    console.log(body)
    // Validate required fields
    const requiredFields = ['name', 'price', 'category', 'categorySlug', 'brand']
    const missingFields = requiredFields.filter((field) => !body[field])

    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields)
      console.log('Available fields:', Object.keys(body))
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 },
      )
    }

    // Create the product
    const payload = await getPayloadClient()
    const product = await payload.create({
      collection: 'products' as CollectionSlug,
      data: {
        name: body.name,
        image: body.image,
        images: body.images || [],
        rating: body.rating,
        reviews: body.reviews,
        price: body.price,
        originalPrice: body.originalPrice,
        onSale: body.onSale || false,
        category: body.category,
        categorySlug: body.categorySlug,
        subcategory: body.subcategory,
        subcategorySlug: body.subcategorySlug,
        brand: body.brand,
        featured: body.featured || false,
        trending: body.trending || false,
        description: body.description,
        certifications: body.certifications || [],
        nutritionInfo: body.nutritionInfo,
        ingredients: body.ingredients || [],
        subscriptionOptions: body.subscriptionOptions,
        bundledOffers: body.bundledOffers || [],
      } as any,
    })

    // Convert to plain object
    const plainProduct = {
      id: product.id,
      name: (product as any).name,
      image: (product as any).image,
      images: (product as any).images || [],
      rating: (product as any).rating,
      reviews: (product as any).reviews,
      price: (product as any).price,
      originalPrice: (product as any).originalPrice,
      onSale: (product as any).onSale,
      category: (product as any).category,
      categorySlug: (product as any).categorySlug,
      subcategory: (product as any).subcategory,
      subcategorySlug: (product as any).subcategorySlug,
      brand: (product as any).brand,
      customBrand: (product as any).customBrand,
      featured: (product as any).featured,
      trending: (product as any).trending,
      description: (product as any).description,
      certifications: (product as any).certifications || [],
      nutritionInfo: (product as any).nutritionInfo,
      ingredients: (product as any).ingredients || [],
      subscriptionOptions: (product as any).subscriptionOptions,
      bundledOffers: (product as any).bundledOffers || [],
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }

    return NextResponse.json({
      success: true,
      data: plainProduct,
    })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 })
  }
}
