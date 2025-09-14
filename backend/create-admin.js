const { getPayload } = require('payload')
const config = require('./dist/payload.config.js').default

async function createAdmin() {
  const payload = await getPayload({ config })

  try {
    await payload.create({
      collection: 'users',
      data: {
        email: 'admin@o2nutrition.com',
        password: 'admin123',
        role: 'admin'
      }
    })
    console.log('Admin user created successfully!')
    console.log('Email: admin@o2nutrition.com')
    console.log('Password: admin123')
  } catch (error) {
    console.error('Error creating admin user:', error)
  }

  process.exit(0)
}

createAdmin()