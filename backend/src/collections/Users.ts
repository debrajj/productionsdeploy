import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    verify: false,
    tokenExpiration: 7200, // 2 hours default
    maxLoginAttempts: 5,
    lockTime: 600000, // 10 minutes
    cookies: {
      secure: false,
      sameSite: 'lax',
    },
  },
  access: {
    admin: ({ req: { user } }) => {
      if (user?.email === 'rk129479@gmail.com') {
        return false
      }
      return user?.email === 'gainmode46@gmail.com'
    },
  },

  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
      defaultValue: 'user',
      required: true,
    },
  ],
}
