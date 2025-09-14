import type { CollectionConfig } from 'payload'

export const Coupons: CollectionConfig = {
  slug: 'coupons',
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'discountType', 'discountValue', 'isActive', 'expiresAt'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique coupon code (e.g., WELCOME10)',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Display title for the coupon',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Description of the coupon offer',
      },
    },
    {
      name: 'discountType',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Percentage',
          value: 'percentage',
        },
        {
          label: 'Fixed Amount',
          value: 'fixed',
        },
        {
          label: 'Free Shipping',
          value: 'free_shipping',
        },
      ],
      defaultValue: 'percentage',
    },
    {
      name: 'discountValue',
      type: 'number',
      required: true,
      admin: {
        description: 'Discount value (percentage or fixed amount in INR)',
      },
    },
    {
      name: 'minimumOrderValue',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Minimum order value required to use this coupon (in INR)',
      },
    },
    {
      name: 'maximumDiscountAmount',
      type: 'number',
      admin: {
        description: 'Maximum discount amount for percentage coupons (in INR)',
      },
    },
    {
      name: 'usageLimit',
      type: 'number',
      admin: {
        description: 'Maximum number of times this coupon can be used (leave empty for unlimited)',
      },
    },
    {
      name: 'usageCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Number of times this coupon has been used',
      },
    },
    {
      name: 'userLimit',
      type: 'number',
      admin: {
        description: 'Maximum uses per user (leave empty for unlimited)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this coupon is currently active',
      },
    },
    {
      name: 'startsAt',
      type: 'date',
      admin: {
        description: 'When this coupon becomes active',
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      admin: {
        description: 'When this coupon expires',
      },
    },
    {
      name: 'applicableCategories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        description: 'Categories this coupon applies to (leave empty for all categories)',
      },
    },
    {
      name: 'applicableProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      admin: {
        description: 'Specific products this coupon applies to (leave empty for all products)',
      },
    },
    {
      name: 'excludedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      admin: {
        description: 'Products excluded from this coupon',
      },
    },
    {
      name: 'firstTimeUserOnly',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Only available for first-time users',
      },
    },
    {
      name: 'showOnCart',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show this coupon in the available coupons list on cart page',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.code) {
          data.code = data.code.toUpperCase()
        }
        return data
      },
    ],
  },
}