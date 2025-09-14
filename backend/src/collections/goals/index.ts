import type { CollectionConfig } from 'payload'

export const Goals: CollectionConfig = {
  slug: 'goals',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Goal name (e.g., Build Muscle)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly slug (e.g., build-muscle)',
      },
    },
    {
      name: 'value',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Internal value used in products (e.g., MUSCLE_GAIN)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Goal description',
      },
    },
    {
      name: 'image',
      type: 'text',
      admin: {
        description: 'Goal image URL',
      },
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Order for displaying goals (lower numbers first)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show/hide this goal',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.name && !data.slug) {
          data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        return data;
      },
    ],
  },
}