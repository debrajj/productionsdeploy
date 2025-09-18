const fs = require('fs');
const path = require('path');

// Read the backup CSV file (original)
const csvPath = path.join(__dirname, 'backend', 'all-backup.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');

console.log('🔧 Simple Boolean Fix...');

// Simple string replacement approach
let fixedContent = csvContent;

// Replace boolean values in the specific columns
// This is safer than parsing CSV with complex quoted fields
fixedContent = fixedContent.replace(/,TRUE,/g, ',true,');
fixedContent = fixedContent.replace(/,FALSE,/g, ',false,');

// Handle end-of-line cases
fixedContent = fixedContent.replace(/,TRUE\n/g, ',true\n');
fixedContent = fixedContent.replace(/,FALSE\n/g, ',false\n');
fixedContent = fixedContent.replace(/,TRUE$/g, ',true');
fixedContent = fixedContent.replace(/,FALSE$/g, ',false');

// Replace empty variants objects with empty arrays
fixedContent = fixedContent.replace(/,{},/g, ',[],');
fixedContent = fixedContent.replace(/,{}\n/g, ',[]\n');
fixedContent = fixedContent.replace(/,{}$/g, ',[]');

// Write the fixed CSV
const finalPath = path.join(__dirname, 'backend', 'all-simple-fix.csv');
fs.writeFileSync(finalPath, fixedContent);

console.log('✅ Created simply fixed CSV at:', finalPath);

// Verify the fix by counting
const lines = fixedContent.split('\n');
let trueCount = 0;
let falseCount = 0;

for (const line of lines) {
  trueCount += (line.match(/,true,/g) || []).length;
  falseCount += (line.match(/,false,/g) || []).length;
  trueCount += (line.match(/,true\n/g) || []).length;
  falseCount += (line.match(/,false\n/g) || []).length;
}

console.log(`✅ Found ${trueCount} 'true' values and ${falseCount} 'false' values`);
console.log('📝 Now copy this file: cp backend/all-simple-fix.csv backend/all.csv');