const fs = require('fs');
const path = require('path');

// Read the backup CSV file (original)
const csvPath = path.join(__dirname, 'backend', 'all-backup.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');

console.log('🔧 Comprehensive Boolean Fix...');

// Process line by line to handle all cases
const lines = csvContent.split('\n');
const headers = lines[0].split(',');

// Find boolean field positions
const booleanFields = ['featured', 'trending', 'bestSeller', 'lovedByExperts', 'onSale'];
const booleanPositions = booleanFields.map(field => headers.indexOf(field));

console.log('Boolean field positions:', booleanPositions);

const fixedLines = [lines[0]]; // Keep header

for (let i = 1; i < lines.length; i++) {
  if (lines[i].trim() === '') {
    fixedLines.push(lines[i]);
    continue;
  }
  
  let line = lines[i];
  
  // Replace all TRUE/FALSE with true/false (case insensitive)
  line = line.replace(/\bTRUE\b/gi, 'true');
  line = line.replace(/\bFALSE\b/gi, 'false');
  
  // Replace empty variants objects with empty arrays
  line = line.replace(/,{},/g, ',[],');
  line = line.replace(/,{}$/g, ',[]');
  
  fixedLines.push(line);
}

const fixedContent = fixedLines.join('\n');

// Write the fixed CSV
const finalPath = path.join(__dirname, 'backend', 'all-comprehensive-fix.csv');
fs.writeFileSync(finalPath, fixedContent);

console.log('✅ Created comprehensively fixed CSV at:', finalPath);

// Verify the fix
const trueMatches = fixedContent.match(/\btrue\b/g) || [];
const falseMatches = fixedContent.match(/\bfalse\b/g) || [];
const remainingTRUE = fixedContent.match(/\bTRUE\b/g) || [];
const remainingFALSE = fixedContent.match(/\bFALSE\b/g) || [];

console.log(`✅ Found ${trueMatches.length} 'true' values`);
console.log(`✅ Found ${falseMatches.length} 'false' values`);
console.log(`⚠️  Remaining 'TRUE': ${remainingTRUE.length}`);
console.log(`⚠️  Remaining 'FALSE': ${remainingFALSE.length}`);

console.log('📝 Now copy this file: cp backend/all-comprehensive-fix.csv backend/all.csv');