import { formatSlug } from '@/lib/Globals/Slug'
import type { CollectionConfig } from 'payload'

// All brands from brands page - exact same as frontend
const allBrands = [
  'ALPINO', 'AS-IT-IS', 'AVVATAR', 'AESTHETIC NUTRITION', 'BOLT', 'BPI', 'BEAST LIFE', 'DYMATIZE',
  'FAST AND UP', 'GASPARI', 'GAT', 'GNC', 'GHOST', 'HEALTH FARM', 'INTERNATIONAL PROTEIN', 'ISOPURE',
  'KAGED', 'KEVIN LEVRONE', 'LABRADA', 'MONSTER LAB', 'MUSCLE BLAZE', 'MUSCLETECH', 'MUTANT', 'MYFITNESS',
  'MYFITNESS PEANUT BUTTER', 'NEUHERBS', 'NAKPRO', 'ONE SCIENCE', 'ON (OPTIMUM NUTRITION)', 'POLE NUTRITION',
  'PROSUPPS', 'PINTOLA', 'RONNIE COLEMAN', 'RAW NUTRITION', 'RYSE', 'THE WHOLE TRUTH NUTRITION', 'WELLBEING',
  'XTEND', 'YOGABAR', 'RANBDS', 'APPLIED NUTRITION', 'BSN', 'DENIS JAMES', 'DEXTER JACKSON', 'EXALT',
  'INSANE LABZ', 'MHP', 'MI (MUSCLE IMPACT NUTRITION) 02 BRAND', 'NOW', 'NUTREX', 'NUTRAMARC', 'REDCON',
  'RULE ONE', 'UNIVERSAL', 'ATOM', 'TRUE BASICS', 'CLOMA PHARMA', 'CENTRUM', 'CONDEMNED', 'MUSCLEMEDS', 
  'ULTIMATE NUTRITION', 'FA ICE HYDRO', 'ANDROPIQUE', 'CUREGARDEN', 'TATA 1MG', 'ACE BLEND', 'NATUREYZ', 
  'HEALTHYHEY NUTRITION', 'MIDUTY', 'WHATS UP WELLNESS', 'MYODROL', 'CARBAMIDE FORTE', 'BEAUTYWISE', 
  'FUEL ONE', 'NAKPRO PROTEIN'
]

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
  },

  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Set main image based on type
        if (data.imageType === 'upload' && data.mainImage) {
          data.image = data.mainImage
        } else if (data.imageType === 'url' && data.imageUrl) {
          data.image = data.imageUrl
        }
        return data
      },
    ],
    afterRead: [
      async ({ doc, req }) => {
        // Convert main image based on type
        if (doc.imageType === 'upload') {
          if (doc.mainImage && typeof doc.mainImage === 'object' && doc.mainImage.filename) {
            doc.image = `/media/${doc.mainImage.filename}`
          } else if (doc.image && typeof doc.image === 'object' && doc.image.filename) {
            doc.image = `/media/${doc.image.filename}`
          }
        } else if (doc.imageType === 'url' && doc.imageUrl) {
          doc.image = doc.imageUrl
        }
        
        // Ensure image is always a string
        if (typeof doc.image === 'object') {
          doc.image = doc.image?.filename ? `/media/${doc.image.filename}` : null
        }
        
        // Convert additional images
        if (doc.additionalImages && Array.isArray(doc.additionalImages)) {
          doc.images = doc.additionalImages.map((item: any) => {
            if (item.imageType === 'upload' && item.image && typeof item.image === 'object' && item.image.filename) {
              return {
                url: `/media/${item.image.filename}`,
                imageType: 'upload'
              }
            } else if (item.imageType === 'url' && item.imageUrl) {
              return {
                url: item.imageUrl,
                imageType: 'url'
              }
            }
            return {
              url: typeof item.image === 'string' ? item.image : (item.image?.filename ? `/media/${item.image.filename}` : item.imageUrl),
              imageType: item.imageType || 'upload'
            }
          })
        }
        
        // Convert nutrition image
        if (doc.nutritionImage) {
          if (typeof doc.nutritionImage === 'object' && doc.nutritionImage.filename) {
            doc.nutritionImage = `/media/${doc.nutritionImage.filename}`
          } else if (typeof doc.nutritionImage === 'string') {
            // If it's just an ID, we need to populate it
            // This will be handled by the populate in the API call
          }
        }
        
        // Clean up any remaining object references
        delete doc.mainImage
        delete doc.imageUrl
        delete doc.additionalImages
        
        console.log('Product after processing:', { id: doc.id, nutritionImage: doc.nutritionImage })
        
        return doc
      },
    ],
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
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [formatSlug('name')],
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
      type: 'group',
      admin: {
        description: 'Nutrition facts per serving',
      },
      fields: [
        {
          name: 'servingSize',
          type: 'text',
          admin: {
            description: 'Serving size (e.g., 30g (1 scoop))',
          },
        },
        {
          name: 'servingsPerContainer',
          type: 'number',
          min: 0,
          admin: {
            description: 'Number of servings per container (e.g., 33)',
          },
        },
        {
          name: 'protein',
          type: 'text',
          admin: {
            description: 'Protein content (e.g., 25g)',
          },
        },
        {
          name: 'carbohydrates',
          type: 'text',
          admin: {
            description: 'Carbs content (e.g., 2g)',
          },
        },
        {
          name: 'fat',
          type: 'text',
          admin: {
            description: 'Fat content (e.g., 0.5g)',
          },
        },
        {
          name: 'calories',
          type: 'number',
          min: 0,
          admin: {
            description: 'Calories per serving (e.g., 110)',
          },
        },
        {
          name: 'sodium',
          type: 'text',
          admin: {
            description: 'Sodium content (e.g., 50mg)',
          },
        },
        {
          name: 'calcium',
          type: 'text',
          admin: {
            description: 'Calcium content (e.g., 120mg)',
          },
        },
      ],
    },
    {
      name: 'nutritionImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Nutrition facts image',
      },
    },
    {
      name: 'ingredients',
      type: 'array',
      admin: {
        description: 'Product ingredients list',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          admin: {
            description: 'Ingredient name (e.g., Whey Protein Isolate)',
          },
        },
      ],
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

    {
      name: 'upsells',
      type: 'array',
      admin: {
        description: 'Upsell offers - products that complement this product',
      },
      fields: [
        {
          name: 'upsellProduct',
          type: 'relationship',
          relationTo: 'products',
          required: true,
          admin: {
            description: 'Select the product to offer as upsell',
          },
        },
        {
          name: 'discountPercentage',
          type: 'number',
          min: 0,
          max: 100,
          required: true,
          admin: {
            description: 'Discount percentage when both products are purchased together',
          },
        },
        {
          name: 'description',
          type: 'text',
          admin: {
            description: 'Short description of why these products work well together',
          },
        },
        {
          name: 'active',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Enable/disable this upsell offer',
          },
        },
      ],
    },
  ],
}
