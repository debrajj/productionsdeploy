const mongoose = require('mongoose');
const fs = require('fs');

// Color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function colorLog(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function bulkInsertAll() {
  try {
    colorLog('🔄 Connecting to database...', 'cyan');
    await mongoose.connect('mongodb+srv://gainmode46:XnjDxAwNf6Gx3Reo@cluster0.2zketsh.mongodb.net/gain?retryWrites=true&w=majority&appName=Cluster0');
    colorLog('✅ Database connected successfully', 'green');
    
    // Read the CSV file
    colorLog('📖 Reading CSV file...', 'cyan');
    const csvContent = fs.readFileSync('./all.csv', 'utf8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    // Skip header row
    const dataLines = lines.slice(1);
    const products = [];
    
    colorLog(`📊 Processing ${dataLines.length} product records...`, 'yellow');
    
    dataLines.forEach((line, index) => {
      if (!line.trim()) return;
      
      // Parse CSV line with proper handling of quoted values
      const values = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      
      if (values.length >= 6) {
        products.push({
          name: values[0]?.replace(/"/g, '').trim(),
          price: parseFloat(values[1]) || 0,
          originalPrice: parseFloat(values[2]) || null,
          category: values[3]?.replace(/"/g, '').trim(),
          subcategory: values[4]?.replace(/"/g, '').trim(),
          brand: values[5]?.replace(/"/g, '').trim(),
          description: values[6]?.replace(/"/g, '').trim() || 'Product description',
          image: values[7]?.replace(/"/g, '').trim(),
          images: values[8]?.replace(/"/g, '').trim() || '',
          rating: parseFloat(values[9]) || 4.0,
          reviews: parseInt(values[10]) || 0,
          weight: values[11]?.replace(/"/g, '').trim(),
          simpleFlavors: values[12]?.replace(/"/g, '').trim(),
          variants: values[13]?.replace(/"/g, '').trim() || '[]',
          featured: values[14]?.toLowerCase() === 'true',
          trending: values[15]?.toLowerCase() === 'true',
          bestSeller: values[16]?.toLowerCase() === 'true',
          lovedByExperts: values[17]?.toLowerCase() === 'true',
          onSale: values[18]?.toLowerCase() === 'true',
          shopByGoal: values[19]?.replace(/"/g, '').trim(),
          nutritionInfo: values[20]?.replace(/"/g, '').trim(),
          ingredients: values[21]?.replace(/"/g, '').trim(),
          certifications: values[22]?.replace(/"/g, '').trim(),
          nutritionImage: values[23]?.replace(/"/g, '').trim(),
          slug: values[24]?.replace(/"/g, '').trim(),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    });
    
    // Clear existing products first
    colorLog('🗑️ Clearing existing products...', 'yellow');
    const db = mongoose.connection.db;
    const deleteResult = await db.collection('products').deleteMany({});
    colorLog(`✅ Cleared ${deleteResult.deletedCount} existing products`, 'green');
    
    // Insert all products
    colorLog('🚀 Inserting new products...', 'cyan');
    const result = await db.collection('products').insertMany(products);
    
    // Success message with count
    colorLog('\n' + '='.repeat(50), 'magenta');
    colorLog(`🎉 BULK INSERT COMPLETED SUCCESSFULLY! 🎉`, 'green');
    colorLog(`📊 Total Products Inserted: ${colors.bright}${colors.green}${result.insertedCount}${colors.reset}`, 'reset');
    colorLog(`📊 Total Records Processed: ${colors.bright}${colors.blue}${products.length}${colors.reset}`, 'reset');
    colorLog(`✅ Success Rate: ${colors.bright}${colors.green}${((result.insertedCount/products.length)*100).toFixed(1)}%${colors.reset}`, 'reset');
    colorLog('='.repeat(50), 'magenta');
    
  } catch (error) {
    colorLog(`❌ Error: ${error.message}`, 'red');
  } finally {
    colorLog('🔌 Disconnecting from database...', 'cyan');
    await mongoose.disconnect();
    colorLog('✅ Database disconnected', 'green');
  }
}

bulkInsertAll();