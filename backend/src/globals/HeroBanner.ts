import type { GlobalConfig } from 'payload'

export const HeroBanner: GlobalConfig = {
  slug: 'hero-banner-global',
  admin: {
    description: 'Single dynamic hero banner for the homepage',
  },
  access: {
    read: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Turn banner ON/OFF',
      },
    },
    {
      name: 'bannerLink',
      type: 'text',
      defaultValue: '/products',
      admin: {
        description: 'Banner click link (href)',
      },
    },
    {
      name: 'desktopImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Desktop banner image',
      },
    },
    {
      name: 'mobileImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Mobile banner image',
      },
    },
  ],
}