import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
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
    },

    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'originalPrice',
      type: 'number',
    },
    {
      name: 'category',
      type: 'text',
    },
    {
      name: 'subcategory',
      type: 'text',
    },
    {
      name: 'brand',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'imageType',
      type: 'text',
      defaultValue: 'url',
    },
    {
      name: 'imageUrl',
      type: 'text',
    },
    {
      name: 'image',
      type: 'text',
    },
    {
      name: 'rating',
      type: 'number',
    },
    {
      name: 'reviews',
      type: 'number',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'trending',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'bestSeller',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'lovedByExperts',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'onSale',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'shopByGoal',
      type: 'text',
    },
    {
      name: 'nutritionInfo',
      type: 'textarea',
    },
    {
      name: 'ingredients',
      type: 'textarea',
    },
  ],
}