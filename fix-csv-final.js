const fs = require('fs');
const path = require('path');

// Read the original CSV file
const csvPath = path.join(__dirname, 'backend', 'all.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');

console.log('🔧 Final CSV Data Fix...');

// Split into lines and process
const lines = csvContent.split('\n');
const headers = lines[0].split(',');

console.log('📊 Processing', lines.length - 1, 'data rows...');

// Boolean field indices
const booleanFields = ['featured', 'trending', 'bestSeller', 'lovedByExperts', 'onSale'];
const booleanIndices = {};

booleanFields.forEach(field => {
  const index = headers.indexOf(field);
  if (index !== -1) {
    booleanIndices[field] = index;
  }
});

// Process each line
const fixedLines = [lines[0]]; // Keep header

for (let i = 1; i < lines.length; i++) {
  if (lines[i].trim() === '') continue;
  
  // Handle CSV parsing with quoted fields
  const columns = [];
  let currentField = '';
  let inQuotes = false;
  let j = 0;
  
  while (j < lines[i].length) {
    const char = lines[i][j];
    
    if (char === '"' && (j === 0 || lines[i][j-1] === ',')) {
      inQuotes = true;
    } else if (char === '"' && inQuotes && (j === lines[i].length - 1 || lines[i][j+1] === ',')) {
      inQuotes = false;
    } else if (char === ',' && !inQuotes) {
      columns.push(currentField);
      currentField = '';
      j++;
      continue;
    } else {
      currentField += char;
    }
    j++;
  }
  columns.push(currentField); // Add the last field
  
  // Fix boolean values
  Object.entries(booleanIndices).forEach(([field, index]) => {
    if (columns[index]) {
      const value = columns[index].trim().toUpperCase();
      if (value === 'TRUE') {
        columns[index] = 'true';
      } else if (value === 'FALSE') {
        columns[index] = 'false';
      }
    }
  });
  
  // Fix variants field
  const variantsIndex = headers.indexOf('variants');
  if (variantsIndex !== -1 && columns[variantsIndex]) {
    const variantsValue = columns[variantsIndex].trim();
    if (variantsValue === '{}' || variantsValue === '') {
      columns[variantsIndex] = '[]';
    }
  }
  
  // Rebuild the line with proper CSV formatting
  const rebuiltLine = columns.map(col => {
    // If column contains comma, quote, or newline, wrap in quotes
    if (col.includes(',') || col.includes('"') || col.includes('\n')) {
      return '"' + col.replace(/"/g, '""') + '"';
    }
    return col;
  }).join(',');
  
  fixedLines.push(rebuiltLine);
}

// Write the completely fixed CSV
const finalCsvContent = fixedLines.join('\n');
const finalPath = path.join(__dirname, 'backend', 'all-final.csv');

fs.writeFileSync(finalPath, finalCsvContent);
console.log('✅ Created final fixed CSV at:', finalPath);

// Analyze the final data
console.log('\n📈 Final Data Analysis:');
let bestSellerCount = 0;
let lovedByExpertsCount = 0;
let shopByGoalCount = 0;
let featuredCount = 0;
let trendingCount = 0;

for (let i = 1; i < fixedLines.length; i++) {
  if (fixedLines[i].trim() === '') continue;
  
  const columns = fixedLines[i].split(',');
  
  // Count categories
  const bestSellerIndex = headers.indexOf('bestSeller');
  if (bestSellerIndex !== -1 && columns[bestSellerIndex] === 'true') {
    bestSellerCount++;
  }
  
  const lovedByExpertsIndex = headers.indexOf('lovedByExperts');
  if (lovedByExpertsIndex !== -1 && columns[lovedByExpertsIndex] === 'true') {
    lovedByExpertsCount++;
  }
  
  const featuredIndex = headers.indexOf('featured');
  if (featuredIndex !== -1 && columns[featuredIndex] === 'true') {
    featuredCount++;
  }
  
  const trendingIndex = headers.indexOf('trending');
  if (trendingIndex !== -1 && columns[trendingIndex] === 'true') {
    trendingCount++;
  }
  
  const shopByGoalIndex = headers.indexOf('shopByGoal');
  if (shopByGoalIndex !== -1 && columns[shopByGoalIndex] && columns[shopByGoalIndex].trim() !== '') {
    shopByGoalCount++;
  }
}

console.log(`🏆 Best Sellers: ${bestSellerCount} products`);
console.log(`👨🔬 Loved by Experts: ${lovedByExpertsCount} products`);
console.log(`⭐ Featured: ${featuredCount} products`);
console.log(`📈 Trending: ${trendingCount} products`);
console.log(`🎯 Shop by Goal: ${shopByGoalCount} products`);

console.log('\n🎉 All issues fixed! Now replace your original CSV with the final version.');
console.log('📝 Command: cp backend/all-final.csv backend/all.csv');