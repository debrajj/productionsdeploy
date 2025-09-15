import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { importProductsFromExcel } from '@/lib/bulk-import'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Use BulkUpload collection for automatic processing' },
    { status: 400 }
  )
}