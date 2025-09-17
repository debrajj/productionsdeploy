import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const fs = require('fs')
    const payload = await getPayload({ config })
    
    const uploads = await payload.find({
      collection: 'bulk-upload',
      limit: 1,
      sort: '-createdAt'
    })
    
    const upload = uploads.docs[0]
    const file = upload.file as any
    const filePath = path.join(process.cwd(), 'media', file.filename)
    
    const content = fs.readFileSync(filePath, 'utf8')
    const lines = content.split('\n')
    
    return NextResponse.json({
      fileName: file.filename,
      uploadName: upload.fileName,
      createdAt: upload.createdAt,
      totalLines: lines.length,
      firstLine: lines[0],
      secondLine: lines[1]
    })
    
  } catch (error) {
    return NextResponse.json({ error: error.message })
  }
}