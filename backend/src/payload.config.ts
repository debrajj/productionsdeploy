// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'

import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/products/index'
import { Category } from './collections/category/index'
import { Announcements } from './collections/announcements/index'
import { HeroBanner } from './collections/hero-banner/index'
import { Coupons } from './collections/coupons/index'
import { Subscribers } from './collections/subscribers/index'
import { Orders } from './collections/orders/index'
import { Goals } from './collections/goals/index'
import { Brands } from './collections/brands/index'
import { BulkUpload } from './collections/bulk-upload/index'
import { HeroBanner as HeroBannerGlobal } from './globals/HeroBanner'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- O2 Nutrition Store Management',
    },
  },
  cookiePrefix: 'payload-admin',
  csrf: [
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
    process.env.BACKEND_URL,
  ].filter(Boolean),
  cookies: {
    secure: false,
    sameSite: 'lax',
  },
  collections: [
    Users,
    Media,
    Products,
    Category,
    Brands,
    BulkUpload,
    Announcements,
    Coupons,
    Subscribers,
    Orders,
    Goals,
  ],
  globals: [
    HeroBannerGlobal,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
  cors: [
    ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : []),
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
    process.env.BACKEND_URL,
    'https://*.vercel.app',
    'https://*.netlify.app',
    'https://*.railway.app',
    'https://*.render.com'
  ].filter(Boolean),
  sharp,
  plugins: [
    // storage-adapter-placeholder
  ],
  
})