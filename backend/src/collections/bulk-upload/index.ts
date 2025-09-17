import type { CollectionConfig } from 'payload'
import * as XLSX from 'xlsx'
import { Readable } from 'stream'
import fs from 'fs'
import path from 'path'

interface ProductImportRow {
  name: string
  price: number
  originalPrice?: number
  category: string
  subcategory?: string
  brand: string
  description?: string
  imageUrl?: string
  additionalImageUrls?: string
  rating?: number
  reviews?: number
  onSale?: boolean
  featured?: boolean
  trending?: boolean
  bestSeller?: boolean
  lovedByExperts?: boolean
  shopByGoal?: string
  simpleFlavors?: string
  variants?: string
  servingSize?: string
  servingsPerContainer?: number
  protein?: string
  carbohydrates?: string
  fat?: string
  calories?: number
  ingredients?: string
}



export const BulkUpload: CollectionConfig = {
  slug: 'bulk-upload',  // Keep original for URL consistency
  admin: {
    useAsTitle: 'fileName',
    group: 'Content',
    description: 'Upload CSV/Excel files to import multiple products at once',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'fileName',
      type: 'text',
      required: true,
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'status',
      type: 'text',
      defaultValue: 'uploaded',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'results',
      type: 'textarea',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'processButton',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/SimpleProcessButton#SimpleProcessButton'
        }
      }
    },

  ],
  // hooks: {
  //   // Hooks disabled - use manual processing
  // },
}