import type { CollectionConfig } from 'payload'

export const Category: CollectionConfig = {
  slug: 'categories',
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
        description: 'Category name (e.g., SPORTS NUTRITION)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly slug (e.g., sports-nutrition)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional category description',
      },
    },
    {
      name: 'image',
      type: 'text',
      admin: {
        description: 'Category image URL (optional)',
      },
    },
    {
      name: 'subcategories',
      type: 'array',
      admin: {
        description: 'Subcategories for this main category',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Subcategory name (e.g., Proteins)',
          },
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          admin: {
            description: 'URL-friendly slug (e.g., proteins)',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Optional subcategory description',
          },
        },
        {
          name: 'image',
          type: 'text',
          admin: {
            description: 'Subcategory image URL (optional)',
          },
        },
      ],
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Order for displaying categories (lower numbers first)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show/hide this category in menus',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.name && !data.slug) {
          data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        
        if (data.subcategories) {
          data.subcategories = data.subcategories.map(sub => {
            if (sub.name && !sub.slug) {
              sub.slug = sub.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            }
            return sub;
          });
        }
        
        return data;
      },
    ],
  },
}
