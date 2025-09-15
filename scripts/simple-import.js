const axios = require('axios');

class SimpleImporter {
  constructor() {
    this.apiUrl = 'http://localhost:3000/api';
    this.client = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
  }

  async createSimpleProduct() {
    const productData = {
      name: 'Test Product ' + Date.now(),
      slug: 'test-product-' + Date.now(),
      price: 999,
      category: 'SPORTS NUTRITION',
      subcategory: 'Proteins',
      brand: 'TEST BRAND',
      description: 'Test product description',
      imageType: 'url',
      imageUrl: 'https://via.placeholder.com/300',
      status: 'published',
      stock: 100,
      sku: 'TEST-' + Date.now(),
    };

    try {
      console.log('Creating test product...');
      const response = await this.client.post('/products', productData);
      console.log('✅ Product created successfully!');
      console.log('Product ID:', response.data.doc.id);
      console.log('View at: http://localhost:3000/admin/collections/products/' + response.data.doc.id);
    } catch (error) {
      console.error('❌ Error creating product:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
    }
  }
}

// Run the importer
const importer = new SimpleImporter();
importer.createSimpleProduct();
