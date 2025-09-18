const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = path.join(__dirname, 'backend', 'all.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');

console.log('🔍 Analyzing CSV data issues...');

// Split into lines
const lines = csvContent.split('\n');
const headers = lines[0].split(',');

console.log('📊 Headers found:', headers);

// Find the indices of boolean fields
const booleanFields = ['featured', 'trending', 'bestSeller', 'lovedByExperts', 'onSale'];
const booleanIndices = {};

booleanFields.forEach(field => {
  const index = headers.indexOf(field);
  if (index !== -1) {
    booleanIndices[field] = index;
    console.log(`✅ Found ${field} at index ${index}`);
  } else {
    console.log(`❌ Missing ${field} field`);
  }
});

// Process each data line
const fixedLines = [lines[0]]; // Keep header as is

for (let i = 1; i < lines.length; i++) {
  if (lines[i].trim() === '') continue; // Skip empty lines
  
  const columns = lines[i].split(',');
  
  // Fix boolean values
  Object.entries(booleanIndices).forEach(([field, index]) => {
    if (columns[index]) {
      // Convert "TRUE"/"FALSE" strings to lowercase boolean strings
      if (columns[index].toUpperCase() === 'TRUE') {
        columns[index] = 'true';
      } else if (columns[index].toUpperCase() === 'FALSE') {
        columns[index] = 'false';
      }
    }
  });
  
  // Fix variants field - ensure it's proper JSON or empty
  const variantsIndex = headers.indexOf('variants');
  if (variantsIndex !== -1 && columns[variantsIndex]) {
    const variantsValue = columns[variantsIndex].trim();
    if (variantsValue === '{}' || variantsValue === '') {
      columns[variantsIndex] = '[]'; // Empty array instead of empty object
    } else if (variantsValue.startsWith('[') && variantsValue.endsWith(']')) {
      // It's already a JSON array, keep it
      try {
        JSON.parse(variantsValue); // Validate JSON
      } catch (e) {
        console.log(`⚠️  Invalid JSON in variants for row ${i}: ${variantsValue}`);
        columns[variantsIndex] = '[]';
      }
    }
  }
  
  fixedLines.push(columns.join(','));
}

// Write the fixed CSV
const fixedCsvContent = fixedLines.join('\n');
const backupPath = path.join(__dirname, 'backend', 'all-backup.csv');
const fixedPath = path.join(__dirname, 'backend', 'all-fixed.csv');

// Create backup
fs.writeFileSync(backupPath, csvContent);
console.log('💾 Created backup at:', backupPath);

// Write fixed version
fs.writeFileSync(fixedPath, fixedCsvContent);
console.log('✅ Created fixed CSV at:', fixedPath);

// Analyze the data
console.log('\n📈 Data Analysis:');
let bestSellerCount = 0;
let lovedByExpertsCount = 0;
let shopByGoalCount = 0;

for (let i = 1; i < fixedLines.length; i++) {
  if (fixedLines[i].trim() === '') continue;
  
  const columns = fixedLines[i].split(',');
  
  // Count best sellers
  const bestSellerIndex = headers.indexOf('bestSeller');
  if (bestSellerIndex !== -1 && columns[bestSellerIndex] === 'true') {
    bestSellerCount++;
  }
  
  // Count loved by experts
  const lovedByExpertsIndex = headers.indexOf('lovedByExperts');
  if (lovedByExpertsIndex !== -1 && columns[lovedByExpertsIndex] === 'true') {
    lovedByExpertsCount++;
  }
  
  // Count shop by goal
  const shopByGoalIndex = headers.indexOf('shopByGoal');
  if (shopByGoalIndex !== -1 && columns[shopByGoalIndex] && columns[shopByGoalIndex].trim() !== '') {
    shopByGoalCount++;
  }
}

console.log(`🏆 Best Sellers: ${bestSellerCount} products`);
console.log(`👨‍🔬 Loved by Experts: ${lovedByExpertsCount} products`);
console.log(`🎯 Shop by Goal: ${shopByGoalCount} products`);

console.log('\n🔧 Issues Fixed:');
console.log('1. ✅ Boolean values converted from "TRUE"/"FALSE" to "true"/"false"');
console.log('2. ✅ Empty variants objects {} converted to empty arrays []');
console.log('3. ✅ Data validation completed');

console.log('\n📝 Next Steps:');
console.log('1. Review the fixed CSV file: backend/all-fixed.csv');
console.log('2. Replace the original file if the data looks correct');
console.log('3. Re-import the data using your bulk import process');
console.log('4. Test the frontend categories');

// Show sample of fixed data
console.log('\n📋 Sample of Fixed Data:');
console.log('Header:', headers.slice(0, 10).join(', '));
if (fixedLines.length > 1) {
  const sampleRow = fixedLines[1].split(',');
  console.log('Sample:', sampleRow.slice(0, 10).join(', '));
}