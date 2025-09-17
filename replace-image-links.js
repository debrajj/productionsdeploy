const fs = require('fs');

// Configuration
const YOUR_WEBSITE_URL = 'https://yourwebsite.com'; // Replace with your actual website URL
const CSV_FILE_PATH = './BULK-PRODUCTS-75-BRANDS.csv';
const OUTPUT_FILE_PATH = './BULK-PRODUCTS-75-BRANDS-updated.csv';

function replaceImageLinks(csvContent) {
    const lines = csvContent.split('\n');
    const header = lines[0];
    
    // Find image column indices
    const columns = header.split(',');
    const mainImageIndex = columns.indexOf('mainImage');
    const imagesIndex = columns.indexOf('images');
    const slugIndex = columns.indexOf('slug');
    
    const updatedLines = [header];
    
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        const row = parseCSVRow(lines[i]);
        
        if (row.length > Math.max(mainImageIndex, imagesIndex, slugIndex)) {
            const slug = row[slugIndex];
            
            // Replace mainImage
            if (mainImageIndex !== -1 && row[mainImageIndex]) {
                row[mainImageIndex] = `${YOUR_WEBSITE_URL}/products/${slug}/main.jpg`;
            }
            
            // Replace images array
            if (imagesIndex !== -1 && row[imagesIndex]) {
                try {
                    const imageArray = JSON.parse(row[imagesIndex]);
                    const updatedImages = imageArray.map((img, index) => 
                        `${YOUR_WEBSITE_URL}/products/${slug}/image-${index + 1}.jpg`
                    );
                    row[imagesIndex] = `"${JSON.stringify(updatedImages).replace(/"/g, '""')}"`;
                } catch (e) {
                    // If not JSON array, replace as single image
                    row[imagesIndex] = `"${YOUR_WEBSITE_URL}/products/${slug}/gallery.jpg"`;
                }
            }
        }
        
        updatedLines.push(row.join(','));
    }
    
    return updatedLines.join('\n');
}

function parseCSVRow(row) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < row.length; i++) {
        const char = row[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current);
    return result;
}

// Main execution
try {
    const csvContent = fs.readFileSync(CSV_FILE_PATH, 'utf8');
    const updatedContent = replaceImageLinks(csvContent);
    fs.writeFileSync(OUTPUT_FILE_PATH, updatedContent);
    console.log(`✅ Image links updated successfully!`);
    console.log(`📁 Output saved to: ${OUTPUT_FILE_PATH}`);
} catch (error) {
    console.error('❌ Error:', error.message);
}