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
      name: 'brand',
      type: 'text',
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
      name: 'description',
      type: 'text',
    },
    {
      name: 'image',
      type: 'text',
    },
    {
      name: 'originalPrice',
      type: 'number',
    },
    {
      name: 'mainImage',
      type: 'text',
    },
    {
      name: 'images',
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
      name: 'weight',
      type: 'text',
    },
    {
      name: 'simpleFlavors',
      type: 'text',
    },
    {
      name: 'variants',
      type: 'text',
    },
    {
      name: 'featured',
      type: 'checkbox',
    },
    {
      name: 'trending',
      type: 'checkbox',
    },
    {
      name: 'bestSeller',
      type: 'checkbox',
    },
    {
      name: 'lovedByExperts',
      type: 'checkbox',
    },
    {
      name: 'onSale',
      type: 'checkbox',
    },
    {
      name: 'shopByGoal',
      type: 'text',
    },
    {
      name: 'nutritionInfo',
      type: 'text',
    },
    {
      name: 'ingredients',
      type: 'text',
    },
    {
      name: 'certifications',
      type: 'text',
    },
    {
      name: 'nutritionImage',
      type: 'text',
    },
    {
      name: 'slug',
      type: 'text',
    },
  ],
}