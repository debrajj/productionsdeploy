const fs = require('fs');

// Test CSV processing directly
const csvContent = `EXALT Pre-Workout,2499,2999,SPORTS NUTRITION,Pre/Post Workout,EXALT,Explosive pre-workout formula,https://cdn2.nutrabay.com/uploads/variant/images/featured_image-NB-NUT-1061-23-1756467618-1500x1500.webp,"https://cdn2.nutrabay.com/uploads/variant/images/image_2-NB-NUT-1061-23-1756467320-1500x1500.webp",4.3,200,300g,"Fruit Punch,Blue Razz","[{""flavor"":""Fruit Punch"",""weight"":""300g"",""price"":2499}]",TRUE,TRUE,TRUE,FALSE,TRUE,ENERGY_PERFORMANCE,"Per serving (10g): 200mg Caffeine, 3g Beta-Alanine","Caffeine Anhydrous, Beta-Alanine",NSF Certified,,exalt-pre-workout`;

async function testDirectCreation() {
  try {
    const response = await fetch('http://localhost:3000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Product',
        price: 1999,
        category: 'SPORTS NUTRITION',
        brand: 'TEST BRAND',
        imageType: 'url',
        imageUrl: 'https://example.com/test.jpg',
        slug: 'test-product-' + Date.now(),
      }),
    });

    const result = await response.json();
    console.log('Direct product creation result:', result);
    
    if (result.id) {
      console.log('✅ Product created successfully with ID:', result.id);
    } else {
      console.log('❌ Product creation failed:', result);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testDirectCreation();