const fs = require('fs');

// CONFIGURATION - Update these values
const YOUR_DOMAIN = 'https://yourwebsite.com';
const INPUT_FILE = './BULK-PRODUCTS-75-BRANDS.csv';
const OUTPUT_FILE = './products-updated.csv';

// Read and process CSV
const csvData = fs.readFileSync(INPUT_FILE, 'utf8');
const lines = csvData.split('\n');

// Process each line
const updatedLines = lines.map((line, index) => {
    if (index === 0 || !line.trim()) return line; // Skip header and empty lines
    
    // Extract slug (last column)
    const lastCommaIndex = line.lastIndexOf(',');
    const slug = line.substring(lastCommaIndex + 1).trim();
    
    // Replace image URLs with your domain
    return line
        .replace(/https:\/\/cdn2\.nutrabay\.com[^,"]*/g, `${YOUR_DOMAIN}/products/${slug}/main.jpg`)
        .replace(/https:\/\/img1\.hkrtcdn\.com[^,"]*/g, `${YOUR_DOMAIN}/products/${slug}/nutrition.jpg`);
});

// Save updated CSV
fs.writeFileSync(OUTPUT_FILE, updatedLines.join('\n'));
console.log(`✅ Updated ${lines.length - 1} products`);
console.log(`📁 Saved to: ${OUTPUT_FILE}`);