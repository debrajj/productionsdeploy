import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    verify: false,
    tokenExpiration: 7200,
    maxLoginAttempts: 5,
    lockTime: 600000,
    cookies: {
      secure: false,
      sameSite: 'lax',
    },
    strategies: [
      {
        name: 'google',
        strategy: {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
        },
      },
    ],
  },
  hooks: {
    afterLogin: [
      ({ req, user }) => {
        // Auto-save user profile data for order auto-fill
        if (user) {
          const userData = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            defaultAddress: user.defaultAddress
          };
          // This will be used by frontend for auto-fill
          req.user = { ...req.user, ...userData };
        }
      }
    ]
  },




  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: false,
    },
    {
      name: 'lastName',
      type: 'text',
      required: false,
    },
    {
      name: 'name',
      type: 'text',
      required: false,
    },
    {
      name: 'phone',
      type: 'text',
      required: false,
    },
    {
      name: 'defaultAddress',
      type: 'group',
      fields: [
        {
          name: 'address',
          type: 'text',
        },
        {
          name: 'city',
          type: 'text',
        },
        {
          name: 'state',
          type: 'text',
        },
        {
          name: 'zipCode',
          type: 'text',
        },
      ],
    },
    {
      name: 'googleId',
      type: 'text',
      required: false,
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
