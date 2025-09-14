const { getPayload } = require('payload')
const config = require('./dist/payload.config.js').default

async function createAdminUser() {
  const payload = await getPayload({ config })
  
  try {
    const admin = await payload.create({
      collection: 'users',
      data: {
        email: 'gainmode46@gmail.com',
        password: 'gainmode46@gmail.com',
        firstName: 'Admin',
        lastName: 'User',
        phone: '1234567890',
        role: 'admin'
      }
    })
    
    console.log('Admin user created:', admin.email)
  } catch (error) {
    console.error('Error creating admin user:', error)
  }
  
  process.exit(0)
}

createAdminUser()