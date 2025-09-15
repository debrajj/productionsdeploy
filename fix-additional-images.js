const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

async function fixAdditionalImages() {
  try {
    console.log('🔧 Fixing additional images for Premium Whey XXX...')
    
    // Get the product first
    const getResponse = await fetch('http://localhost:3000/api/products?where[name][contains]=Premium%20Whey%20XXX')
    const products = await getResponse.json()
    
    if (products.docs && products.docs.length > 0) {
      const product = products.docs[0]
      console.log('Found product:', product.name)
      
      // Update with additional images
      const updateData = {
        ...product,
        additionalImages: [
          {
            imageType: 'url',
            imageUrl: 'https://beastlife.in/cdn/shop/files/front_a4bd03ea-5e5b-41ae-9089-cd48922f6ce1.png'
          }
        ]
      }
      
      const updateResponse = await fetch(`http://localhost:3000/api/products/${product.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })
      
      if (updateResponse.ok) {
        console.log('✅ Additional images added successfully!')
        
        // Verify the update
        const verifyResponse = await fetch(`http://localhost:3000/api/products/${product.id}`)
        const updatedProduct = await verifyResponse.json()
        console.log('Additional images:', updatedProduct.additionalImages?.length || 0)
        console.log('Images array:', updatedProduct.images?.length || 0)
      } else {
        console.log('❌ Failed to update:', updateResponse.status)
        const error = await updateResponse.text()
        console.log('Error:', error)
      }
    } else {
      console.log('❌ Product not found')
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

fixAdditionalImages()