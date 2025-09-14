import type { CollectionConfig } from 'payload'

export const Announcements: CollectionConfig = {
  slug: 'announcements',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'isActive', 'createdAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Title for the announcement (for admin reference)',
      },
    },
    {
      name: 'text',
      type: 'text',
      required: true,
      admin: {
        description: 'The announcement text to display',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Toggle to show/hide this announcement',
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'orange',
      options: [
        { label: 'Orange', value: 'orange' },
        { label: 'Blue', value: 'blue' },
        { label: 'Green', value: 'green' },
        { label: 'Red', value: 'red' },
        { label: 'Purple', value: 'purple' },
        { label: 'Black', value: 'black' },
        { label: 'Custom', value: 'custom' },
      ],
      admin: {
        description: 'Background color for the announcement bar',
      },
    },
    {
      name: 'customBackgroundColor',
      type: 'text',
      admin: {
        description: 'Custom background color (hex code like #FF5733)',
        condition: (data) => data.backgroundColor === 'custom',
      },
    },
    {
      name: 'textColor',
      type: 'select',
      defaultValue: 'white',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Black', value: 'black' },
        { label: 'Gray', value: 'gray' },
        { label: 'Custom', value: 'custom' },
      ],
      admin: {
        description: 'Text color for the announcement',
      },
    },
    {
      name: 'customTextColor',
      type: 'text',
      admin: {
        description: 'Custom text color (hex code like #FFFFFF)',
        condition: (data) => data.textColor === 'custom',
      },
    },
    {
      name: 'link',
      type: 'text',
      admin: {
        description: 'Optional link URL (leave empty for no link)',
      },
    },
    {
      name: 'priority',
      type: 'number',
      defaultValue: 1,
      admin: {
        description: 'Priority order (higher numbers show first)',
      },
    },
  ],
}