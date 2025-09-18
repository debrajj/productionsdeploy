import { formatSlug } from '@/lib/Globals/Slug'
import type { CollectionConfig } from 'payload'

// Import shared brands configuration
const { ALL_BRANDS } = require('../../../shared-brands.js')
const allBrands = ALL_BRANDS

// Categories from homeproduct.json
const categories = [
  { label: 'Sports Nutrition', value: 'SPORTS NUTRITION' },
  { label: 'Vitamins & Supplements', value: 'VITAMINS & SUPPLEMENTS' },
  { label: 'Ayurveda & Herbs', value: 'AYURVEDA & HERBS' },
  { label: 'Health Food & Drinks', value: 'HEALTH FOOD & DRINKS' },
  { label: 'Fitness', value: 'FITNESS' },
  { label: 'Wellness', value: 'WELLNESS' },
]

// Subcategories from homeproduct.json
const subcategories = [
  { label: 'Proteins', value: 'Proteins' },
  { label: 'Gainers', value: 'Gainers' },
  { label: 'Pre/Post Workout', value: 'Pre/Post Workout' },
  { label: 'Fat Burners', value: 'Fat Burners' },
  { label: 'Amino Acids', value: 'Amino Acids' },
  { label: 'Omega Fatty Acids', value: 'Omega Fatty Acids' },
  { label: 'Multivitamins', value: 'Multivitamins' },
  { label: 'Herbs for Weight Loss', value: 'Herbs for Weight Loss' },
  { label: 'Vital Herbs', value: 'Vital Herbs' },
  { label: 'Weight Loss Foods', value: 'Weight Loss Foods' },
  { label: 'Health Juices', value: 'Health Juices' },
  { label: 'Gym Accessories', value: 'Gym Accessories' },
  { label: 'Fitness Trackers', value: 'Fitness Trackers' },
  { label: 'Skin Care', value: 'Skin Care' },
  { label: 'Hair Care', value: 'Hair Care' },
]

// Shop by Goal categories - matching the goals collection
const shopByGoals = [
  { label: 'Build Muscle', value: 'MUSCLE_GAIN' },
  { label: 'Lose Weight', value: 'WEIGHT_LOSS' },
  { label: 'Improve Endurance', value: 'ENERGY_PERFORMANCE' },
  { label: 'Wellness', value: 'HEALTH_WELLNESS' },
]

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    description: 'Manage products. Use /api/download-template for bulk import template and POST /api/bulk-import to upload Excel files.',
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
        description: 'Product name (e.g., Premium Whey Protein Isolate)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'imageType',
      type: 'radio',
      required: true,
      defaultValue: 'upload',
      options: [
        {
          label: 'Upload Image',
          value: 'upload',
        },
        {
          label: 'Image URL',
          value: 'url',
        },
      ],
      admin: {
        description: 'Choose how to add main product image',
      },
    },
    {
      name: 'mainImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data) => data.imageType === 'upload',
        description: 'Upload main product image',
      },
      validate: (value, { data }) => {
        if (data.imageType === 'upload' && !value) {
          return 'Main image is required'
        }
        return true
      },
    },
    {
      name: 'imageUrl',
      type: 'text',
      admin: {
        condition: (data) => data.imageType === 'url',
        description: 'Main product image URL',
      },
      validate: (value, { data }) => {
        if (data.imageType === 'url' && !value) {
          return 'Image URL is required'
        }
        return true
      },
    },
    {
      name: 'additionalImages',
      type: 'array',
      maxRows: 10,
      admin: {
        description: 'Additional product images (max 10)',
      },
      fields: [
        {
          name: 'imageType',
          type: 'radio',
          defaultValue: 'upload',
          options: [
            {
              label: 'Upload Image',
              value: 'upload',
            },
            {
              label: 'Image URL',
              value: 'url',
            },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (data, siblingData) => siblingData.imageType === 'upload',
          },
          validate: (value, { siblingData }) => {
            if (siblingData.imageType === 'upload' && !value) {
              return 'Image is required'
            }
            return true
          },
        },
        {
          name: 'imageUrl',
          type: 'text',
          admin: {
            condition: (data, siblingData) => siblingData.imageType === 'url',
            placeholder: 'https://example.com/image.jpg',
          },
          validate: (value, { siblingData }) => {
            if (siblingData.imageType === 'url' && !value) {
              return 'Image URL is required'
            }
            return true
          },
        },
      ],
    },
    {
      name: 'images',
      type: 'array',
      admin: {
        hidden: true,
        description: 'Auto-populated from individual image fields',
      },
      fields: [
        {
          name: 'url',
          type: 'text',
        },
        {
          name: 'imageType',
          type: 'text',
        },
      ],
    },
    {
      name: 'image',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'rating',
      type: 'number',
      min: 0,
      max: 5,
      admin: {
        step: 0.1,
        description: 'Product rating (0-5 stars)',
      },
    },
    {
      name: 'reviews',
      type: 'number',
      min: 0,
      admin: {
        description: 'Number of customer reviews',
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Current selling price in rupees',
      },
    },
    {
      name: 'originalPrice',
      type: 'number',
      min: 0,
      admin: {
        description: 'Original price before discount (optional)',
      },
    },
    {
      name: 'onSale',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Check if product is on sale',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [...categories, { label: 'Other (type below)', value: 'other' }],
      admin: {
        description: 'Select category or choose Other to type new one',
      },
    },
    {
      name: 'customCategory',
      type: 'text',
      admin: {
        description: 'Type new category name if you selected Other above',
        condition: (data) => data.category === 'other',
      },
    },

    {
      name: 'subcategory',
      type: 'select',
      options: [...subcategories, { label: 'Other (type below)', value: 'other' }],
      admin: {
        description: 'Select subcategory or choose Other to type new one',
      },
    },
    {
      name: 'customSubcategory',
      type: 'text',
      admin: {
        description: 'Type new subcategory name if you selected Other above',
        condition: (data) => data.subcategory === 'other',
      },
    },

    {
      name: 'brand',
      type: 'select',
      required: true,
      options: [
        ...allBrands.map((brand) => ({ label: brand, value: brand })),
        { label: 'Other (type below)', value: 'other' },
      ],
      admin: {
        description: 'Select brand or choose Other to type new one',
      },
    },
    {
      name: 'customBrand',
      type: 'text',
      admin: {
        description: 'Type new brand name if you selected Other above',
        condition: (data) => data.brand === 'other',
      },
    },

    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Check if this is a featured product',
      },
    },
    {
      name: 'trending',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Check if this is a trending product',
      },
    },
    {
      name: 'bestSeller',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mark as best seller product',
      },
    },
    {
      name: 'lovedByExperts',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mark as loved by experts product',
      },
    },
    {
      name: 'shopByGoal',
      type: 'select',
      options: shopByGoals,
      admin: {
        description: 'Select the fitness goal this product helps achieve',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Detailed product description',
      },
    },
    {
      name: 'certifications',
      type: 'array',
      admin: {
        description: 'Product certifications',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          admin: {
            description: 'Certification name',
          },
        },
      ],
    },
    {
      name: 'nutritionInfo',
      type: 'textarea',
      admin: {
        description: 'Simple nutrition facts (e.g., Per serving: 25g Protein, 110 Calories)',
      },
    },
    {
      name: 'nutritionImage',
      type: 'text',
      admin: {
        description: 'Nutrition facts image URL',
      },
    },
    {
      name: 'ingredients',
      type: 'textarea',
      admin: {
        description: 'Comma-separated ingredients (e.g., Whey Protein Isolate, Natural Flavors)',
      },
    },

    {
      name: 'simpleFlavors',
      type: 'text',
      admin: {
        description: 'Comma-separated flavors for simple variants (e.g., Chocolate, Vanilla, Strawberry)',
      },
    },

    {
      name: 'variants',
      type: 'array',
      admin: {
        description: 'Product variants with individual pricing (flavors, sizes, etc.)',
      },
      fields: [
        {
          name: 'flavor',
          type: 'text',
          admin: {
            description: 'Flavor name (e.g., Chocolate, Vanilla, Strawberry)',
          },
        },
        {
          name: 'weight',
          type: 'text',
          admin: {
            description: 'Weight (e.g., 250g, 500g, 1kg)',
          },
        },
        {
          name: 'price',
          type: 'number',
          min: 0,
          admin: {
            description: 'Price for this variant (e.g., 4199)',
          },
        },
      ],
    },


  ],
}
