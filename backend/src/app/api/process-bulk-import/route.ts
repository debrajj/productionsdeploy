import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { importProductsFromExcel } from '@/lib/bulk-import'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { importId } = await request.json()

    const bulkImport = await payload.findByID({
      collection: 'bulk-import',
      id: importId,
    })

    await payload.update({
      collection: 'bulk-import',
      id: importId,
      data: { status: 'processing' },
    })

    const media = await payload.findByID({
      collection: 'media',
      id: bulkImport.file,
    })

    const filePath = path.join(process.cwd(), 'media', media.filename)
    const results = await importProductsFromExcel(payload, filePath, true)

    await payload.update({
      collection: 'bulk-import',
      id: importId,
      data: {
        status: 'completed',
        successCount: results.success,
        errorCount: results.errors.length,
        errorMessages: results.errors.join('\n'),
      },
    })

    return NextResponse.json({ success: true, results })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}