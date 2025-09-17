import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { importProductsFromExcel } from '@/lib/bulk-import'
import path from 'path'
import fs from 'fs'

export async function POST(request: NextRequest) {
  try {
    const { uploadId } = await request.json()
    
    if (!uploadId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Upload ID is required' 
      }, { status: 400 })
    }
    
    const payload = await getPayload({ config })
    
    // Get the specific upload
    const upload = await payload.findByID({
      collection: 'bulk-upload',
      id: uploadId
    })
    
    if (!upload) {
      return NextResponse.json({ 
        success: false, 
        error: 'Upload not found' 
      }, { status: 404 })
    }
    
    // Get the file path
    const file = upload.file as any
    if (!file || !file.filename) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid file' 
      }, { status: 400 })
    }
    
    const filePath = path.join(process.cwd(), 'media', file.filename)
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ 
        success: false, 
        error: 'File not found on server' 
      }, { status: 404 })
    }
    
    // Import products from this file
    const result = await importProductsFromExcel(payload, filePath, true)
    
    // Update upload status
    await payload.update({
      collection: 'bulk-upload',
      id: uploadId,
      data: {
        status: 'processed',
        results: `✅ Imported ${result.success} products successfully!\n${result.errors.length > 0 ? `❌ Errors: ${result.errors.join(', ')}` : ''}`
      }
    })
    
    return NextResponse.json({
      success: true,
      message: `Successfully imported ${result.success} products`,
      imported: result.success,
      errors: result.errors.length > 0 ? result.errors : undefined
    })
    
  } catch (error) {
    console.error('Process single CSV error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to process CSV file' 
    }, { status: 500 })
  }
}