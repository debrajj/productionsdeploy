const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const axios = require('axios');

class CSVImporter {
  constructor() {
    this.apiUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000';
    this.apiKey = process.env.PAYLOAD_SECRET || 'your-payload-secret';
    
    this.client = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `users-api-keys ${this.apiKey}`,
      },
      timeout: 30000,
    });
    
    this.stats = {
      total: 0,
      success: 0,
      failed: 0,
      skipped: 0,
      errors: [],
    };
  }

  async importFromCSV(filePath) {
    try {
      console.log(`📂 Reading file: ${filePath}`);
      
      // Read and parse CSV
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        cast: (value, context) => {
          if (context.column === 'price' || 
              context.column === 'originalPrice' ||
              context.column === 'rating' ||
              context.column === 'reviews' ||
              context.column === 'servingsPerContainer' ||
              context.column === 'calories') {
            return value ? parseFloat(value) : null;
          }
          if (context.column === 'onSale' || 
              context.column === 'featured' || 
              context.column === 'trending' ||
              context.column === 'bestSeller' ||
              context.column === 'lovedByExperts') {
            return value === 'true';
          }
          if (context.column === 'variants' && value) {
            try {
              return JSON.parse(value);
            } catch (e) {
              console.warn(`Invalid JSON in variants: ${value}`);
              return [];
            }
          }
          if (context.column === 'additionalImageUrls' && value) {
            return value.split(',').map(url => ({
              imageType: 'url',
              imageUrl: url.trim()
            }));
          }
          return value;
        }
      });
      
      this.stats.total = records.length;
      console.log(`📊 Found ${this.stats.total} products to import`);
      
      // Process products in batches
      const BATCH_SIZE = 5;
      for (let i = 0; i < records.length; i += BATCH_SIZE) {
        const batch = records.slice(i, i + BATCH_SIZE);
        console.log(`\n🔄 Processing batch ${i / BATCH_SIZE + 1}/${Math.ceil(records.length / BATCH_SIZE)}`);
        
        await Promise.all(batch.map(record => this.importProduct(record)));
        
        // Small delay between batches
        if (i + BATCH_SIZE < records.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      // Print summary
      console.log('\n✅ Import completed!');
      console.log(`   Total: ${this.stats.total}`);
      console.log(`   Success: ${this.stats.success}`);
      console.log(`   Failed: ${this.stats.failed}`);
      console.log(`   Skipped: ${this.stats.skipped}`);
      
      if (this.stats.errors.length > 0) {
        console.log('\n❌ Errors:');
        this.stats.errors.forEach((err, idx) => {
          console.log(`   ${idx + 1}. ${err.productName}: ${err.error}`);
        });
      }
      
    } catch (error) {
      console.error('❌ Error during import:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
    }
  }
  
  async importProduct(product) {
    const productName = product.name || 'Unnamed Product';
    const slug = this.slugify(product.name);
    
    try {
      // Prepare product data
      const productData = {
        ...product,
        slug,
        imageType: 'url',
        additionalImages: product.additionalImageUrls || [],
        variants: product.variants || [],
        ingredients: product.ingredients ? product.ingredients.split(',').map(i => i.trim()) : [],
      };
      
      // Check if product already exists
      const existingProduct = await this.findProductBySlug(slug);
      
      if (existingProduct) {
        // Update existing product
        console.log(`🔄 Updating existing product: ${product.name}`);
        await this.client.patch(`/api/products/${existingProduct.id}`, { ...productData });
        console.log(`✅ Updated: ${product.name}`);
      } else {
        // Create new product
        console.log(`➕ Creating new product: ${product.name}`);
        await this.client.post('/api/products', { ...productData });
        console.log(`✅ Created: ${product.name}`);
      }
      
      this.stats.success++;
      
    } catch (error) {
      console.error(`❌ Failed to import ${productName}:`, error.message);
      this.stats.failed++;
      this.stats.errors.push({
        productName,
        error: error.message,
        details: error.response?.data || {}
      });
    }
  }
  
  async findProductBySlug(slug) {
    try {
      const response = await this.client.get(`/api/products?where[slug][equals]=${slug}`);
      return response.data.docs[0] || null;
    } catch (error) {
      return null;
    }
  }
  
  slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }
}

// Run the importer if this file is executed directly
if (require.main === module) {
  const filePath = process.argv[2];
  
  if (!filePath) {
    console.error('❌ Please provide a CSV file path');
    console.log('Usage: node scripts/import-from-csv.js <path-to-csv>');
    process.exit(1);
  }
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }
  
  const importer = new CSVImporter();
  importer.importFromCSV(path.resolve(filePath));
}

module.exports = { CSVImporter };
