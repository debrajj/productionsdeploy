import { getPayloadClient } from '@/lib/payload'
import { NextRequest, NextResponse } from 'next/server'
import { CollectionSlug } from 'payload'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sortBy = searchParams.get('sortBy') || 'name'
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    const payload = await getPayloadClient()
    
    // Build query
    const whereQuery: any = {}

    // Text search
    if (query.trim()) {
      whereQuery.or = [
        { name: { contains: query } },
        { description: { contains: query } },
        { brand: { contains: query } },
        { customBrand: { contains: query } },
        { category: { contains: query } },
        { customCategory: { contains: query } }
      ]
    }

    // Additional filters
    if (category) {
      whereQuery.category = { equals: category }
    }

    if (brand) {
      whereQuery.brand = { equals: brand }
    }

    if (minPrice || maxPrice) {
      whereQuery.price = {}
      if (minPrice) whereQuery.price.greater_than_equal = parseFloat(minPrice)
      if (maxPrice) whereQuery.price.less_than_equal = parseFloat(maxPrice)
    }

    // Sort configuration
    let sort = 'name'
    if (sortBy === 'price') {
      sort = sortOrder === 'desc' ? '-price' : 'price'
    } else if (sortBy === 'rating') {
      sort = sortOrder === 'desc' ? '-rating' : 'rating'
    } else if (sortBy === 'name') {
      sort = sortOrder === 'desc' ? '-name' : 'name'
    } else if (sortBy === 'createdAt') {
      sort = sortOrder === 'desc' ? '-createdAt' : 'createdAt'
    }

    const products = await payload.find({
      collection: 'products' as CollectionSlug,
      where: whereQuery,
      page,
      limit,
      sort,
      depth: 1,
    })

    // Transform products for frontend
    const transformedProducts = products.docs.map((product: any) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      images: product.images || [],
      rating: product.rating,
      reviews: product.reviews,
      price: product.price,
      originalPrice: product.originalPrice,
      onSale: product.onSale,
      category: product.customCategory || product.category,
      subcategory: product.customSubcategory || product.subcategory,
      brand: product.customBrand || product.brand,
      featured: product.featured,
      trending: product.trending,
      bestSeller: product.bestSeller,
      lovedByExperts: product.lovedByExperts,
      description: product.description,
      shopByGoal: product.shopByGoal,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }))

    return NextResponse.json({
      success: true,
      data: transformedProducts,
      pagination: {
        page: products.page,
        totalPages: products.totalPages,
        totalDocs: products.totalDocs,
        hasNextPage: products.hasNextPage,
        hasPrevPage: products.hasPrevPage,
        limit: products.limit,
      },
      query: {
        searchTerm: query,
        category,
        brand,
        minPrice,
        maxPrice,
        sortBy,
        sortOrder,
      },
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to search products' },
      { status: 500 }
    )
  }
}