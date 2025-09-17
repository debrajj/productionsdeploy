import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { importProductsFromExcel } from '@/lib/bulk-import'
import path from 'path'
import fs from 'fs'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    // Get all bulk upload files
    const uploads = await payload.find({
      collection: 'bulk-upload',
      limit: 100
    })
    
    if (uploads.docs.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'No CSV files found to process' 
      }, { status: 400 })
    }
    
    let totalImported = 0
    const errors: string[] = []
    
    for (const upload of uploads.docs) {
      try {
        // Get the file path
        const file = upload.file as any
        if (!file || !file.filename) {
          errors.push(`Invalid file for upload: ${upload.fileName}`)
          continue
        }
        
        const filePath = path.join(process.cwd(), 'media', file.filename)
        console.log('Checking file path:', filePath)
        console.log('File exists?', fs.existsSync(filePath))
        
        if (!fs.existsSync(filePath)) {
          errors.push(`File not found: ${file.filename} (looked at: ${filePath})`)
          continue
        }
        
        // Import products from this file
        const result = await importProductsFromExcel(payload, filePath, true)
        totalImported += result.success
        errors.push(...result.errors)
        
        // Update upload status
        await payload.update({
          collection: 'bulk-upload',
          id: upload.id,
          data: {
            status: 'processed',
            results: `Imported ${result.success} products. Errors: ${result.errors.length}`
          }
        })
        
      } catch (error) {
        errors.push(`Error processing ${upload.fileName}: ${error.message}`)
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Successfully imported ${totalImported} products from ${uploads.docs.length} files`,
      imported: totalImported,
      errors: errors.length > 0 ? errors : undefined
    })
    
  } catch (error) {
    console.error('Process CSV error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to process CSV files' 
    }, { status: 500 })
  }
}