import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    const products = await payload.find({
      collection: 'products',
      page,
      limit,
      depth: 2,
    })

    const serializedProducts = {
      ...products,
      docs: products.docs.map((product: any) => {
        const serialized = { ...product }
        
        if (serialized.imageType === 'upload' && serialized.imageUpload) {
          if (typeof serialized.imageUpload === 'object') {
            serialized.image = serialized.imageUpload.url || `/api/media/file/${serialized.imageUpload.filename}`
          }
          delete serialized.imageUpload
        } else if (serialized.imageType === 'url') {
          serialized.image = serialized.imageUrl
        }
        
        if (serialized.images && Array.isArray(serialized.images)) {
          serialized.images = serialized.images.map((img: any) => {
            if (img.imageType === 'upload' && img.imageUpload && typeof img.imageUpload === 'object') {
              return {
                url: img.imageUpload.url || `/api/media/file/${img.imageUpload.filename}`,
                imageType: img.imageType
              }
            }
            return {
              url: img.imageUrl || img.url,
              imageType: img.imageType || 'url'
            }
          })
        }
        
        delete serialized.imageUpload
        delete serialized._isLocked
        delete serialized._userEditing
        
        return serialized
      })
    }

    return NextResponse.json(serializedProducts)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}