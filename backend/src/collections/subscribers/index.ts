import type { CollectionConfig } from 'payload'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: false,
    },
    {
      name: 'subscribedAt',
      type: 'date',
      defaultValue: () => new Date(),
      admin: {
        readOnly: true,
      },
    },
  ],
}