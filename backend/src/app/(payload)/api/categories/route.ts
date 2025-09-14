import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { CollectionSlug } from 'payload'

// GET /api/categories - Get all categories with subcategories
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    const categories = await payload.find({
      collection: 'categories' as CollectionSlug,
      limit: 100,
      depth: 1,
    })

    // Convert to plain objects
    const plainCategories = categories.docs.map((category) => ({
      id: category.id,
      name: (category as any).name,
      slug: (category as any).slug,
      subcategories: (category as any).subcategories || [],
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }))

    return NextResponse.json({
      success: true,
      data: plainCategories,
      pagination: {
        page: categories.page,
        totalPages: categories.totalPages,
        totalDocs: categories.totalDocs,
        hasNextPage: categories.hasNextPage,
        hasPrevPage: categories.hasPrevPage,
      },
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 })
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: name' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })
    
    // Create the category
    const category = await payload.create({
      collection: 'categories' as CollectionSlug,
      data: {
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        subcategories: body.subcategories || [],
      } as any,
    })

    // Convert to plain object
    const plainCategory = {
      id: category.id,
      name: (category as any).name,
      slug: (category as any).slug,
      subcategories: (category as any).subcategories || [],
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }

    return NextResponse.json({
      success: true,
      data: plainCategory,
    })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ success: false, error: 'Failed to create category' }, { status: 500 })
  }
}