// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'

import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/products/simple'
import { Category } from './collections/category'
import { Announcements } from './collections/announcements'
import { HeroBanner } from './collections/hero-banner'
import { Coupons } from './collections/coupons'
import { Subscribers } from './collections/subscribers'
import { Orders } from './collections/orders'
import { Goals } from './collections/goals'
import { Brands } from './collections/brands'
import { BulkUpload } from './collections/bulk-upload'
import { HeroBanner as HeroBannerGlobal } from './globals/HeroBanner'
import { bulkUploadProcessEndpoint } from './endpoints/bulk-upload-process'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '- O2 Nutrition Store Management',
      favicon: '/favicon.ico',
      ogImage: '/og-image.jpg',
    },
    css: path.resolve(dirname, './app/(payload)/custom.scss'),
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
  endpoints: [
    bulkUploadProcessEndpoint,
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