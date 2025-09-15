const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const XLSX = require('xlsx');

// Configuration
const CONFIG = {
  API_URL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  API_KEY: process.env.PAYLOAD_SECRET || 'your-payload-secret',
  BATCH_SIZE: 10, // Process 10 products at a time
  DELAY_BETWEEN_BATCHES: 1000, // 1 second between batches
};

class BulkImporter {
  constructor() {
    this.client = axios.create({
      baseURL: CONFIG.API_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `users-api-keys ${CONFIG.API_KEY}`,
      },
      timeout: 30000,
    });
  }

  async startImport(filePath) {
    try {
      console.log('🚀 Starting bulk import...');
      
      // 1. Upload the file to the media collection
      const mediaId = await this.uploadFile(filePath);
      
      // 2. Create a bulk import record
      const importId = await this.createBulkImportRecord(mediaId, path.basename(filePath));
      
      console.log(`✅ Bulk import started with ID: ${importId}`);
      console.log(`🔍 Check the admin panel or logs for progress`);
      
      return { success: true, importId };
    } catch (error) {
      console.error('❌ Error during import:', error.message);
      return { success: false, error: error.message };
    }
  }

  async uploadFile(filePath) {
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));
      
      const response = await axios.post(
        `${CONFIG.API_URL}/api/media`,
        form,
        {
          headers: {
            ...form.getHeaders(),
            'Authorization': `users-api-keys ${CONFIG.API_KEY}`,
          },
          maxBodyLength: Infinity,
        }
      );
      
      return response.data.doc.id;
    } catch (error) {
      console.error('Error uploading file:', error.response?.data || error.message);
      throw new Error('Failed to upload file');
    }
  }

  async createBulkImportRecord(mediaId, fileName) {
    try {
      console.log(`📤 Creating bulk import record for file: ${fileName}`);
      const response = await this.client.post('/api/bulk-imports', {
        fileName,
        file: mediaId,
        status: 'pending',
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `users-api-keys ${CONFIG.API_KEY}`,
        }
      });
      
      if (!response.data?.doc?.id) {
        throw new Error('Invalid response from server');
      }
      
      console.log(`✅ Bulk import record created with ID: ${response.data.doc.id}`);
      return response.data.doc.id;
    } catch (error) {
      console.error('❌ Error creating bulk import record:', error.response?.data || error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      throw new Error(`Failed to create bulk import record: ${error.message}`);
    }
  }
}

// Run the import if this file is executed directly
if (require.main === module) {
  const filePath = process.argv[2];
  
  if (!filePath) {
    console.error('❌ Please provide a file path');
    console.log('Usage: node scripts/bulk-import.js <path-to-excel-file>');
    process.exit(1);
  }
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }
  
  const importer = new BulkImporter();
  importer.startImport(path.resolve(filePath))
    .then(({ success, importId, error }) => {
      if (success) {
        console.log(`\n✅ Bulk import started successfully!`);
        console.log(`   Import ID: ${importId}`);
        console.log(`   Check the admin panel for progress.`);
      } else {
        console.error(`\n❌ Failed to start bulk import: ${error}`);
      }
    });
}

module.exports = { BulkImporter };
