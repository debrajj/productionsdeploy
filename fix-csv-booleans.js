const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = path.join(__dirname, 'BULK-PRODUCTS-75-BRANDS.csv');
let csvContent = fs.readFileSync(csvPath, 'utf8');

console.log('Fixing boolean values in CSV...');

// Replace string boolean values with actual boolean values
csvContent = csvContent
  .replace(/,TRUE,/g, ',true,')
  .replace(/,FALSE,/g, ',false,')
  .replace(/,TRUE$/gm, ',true')
  .replace(/,FALSE$/gm, ',false')
  // Handle cases where TRUE/FALSE might be at the beginning of a line
  .replace(/^TRUE,/gm, 'true,')
  .replace(/^FALSE,/gm, 'false,');

// Write the fixed CSV back
const fixedCsvPath = path.join(__dirname, 'BULK-PRODUCTS-75-BRANDS-FIXED.csv');
fs.writeFileSync(fixedCsvPath, csvContent);

console.log('Fixed CSV saved as:', fixedCsvPath);
console.log('Boolean values have been converted from "TRUE"/"FALSE" to true/false');