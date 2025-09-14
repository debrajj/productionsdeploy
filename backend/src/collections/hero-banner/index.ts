import type { CollectionConfig } from 'payload'

export const HeroBanner: CollectionConfig = {
  slug: 'hero-banner',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
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
      required: false,
      admin: {
        description: 'Mobile banner image (optional)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Turn banner ON/OFF. Only one can be active.',
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        if (doc.isActive && operation === 'update') {
          try {
            await req.payload.update({
              collection: 'hero-banner',
              where: {
                id: {
                  not_equals: doc.id,
                },
              },
              data: {
                isActive: false,
              },
            })
          } catch (error) {
            console.log('Hero banner update conflict, ignoring')
          }
        }
      },
    ],
  },
}