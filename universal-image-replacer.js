const fs = require('fs');

const YOUR_DOMAIN = 'https://yourwebsite.com';

function replaceAllImageLinks(data) {
    // Replace ANY external image URL with your domain
    return data.replace(
        /https?:\/\/[^\/\s,"\n]+\.[^\/\s,"\n]*\/[^\s,"\n]*\.(jpg|jpeg|png|webp|gif|svg)/gi,
        (match, ext, offset, string) => {
            // Get the product slug from the same line
            const lineStart = string.lastIndexOf('\n', offset) + 1;
            const lineEnd = string.indexOf('\n', offset);
            const line = string.substring(lineStart, lineEnd === -1 ? string.length : lineEnd);
            
            // Extract slug (usually last column)
            const parts = line.split(',');
            const slug = parts[parts.length - 1].trim().replace(/"/g, '');
            
            // Determine image type based on context
            const beforeMatch = string.substring(lineStart, offset);
            const columnIndex = beforeMatch.split(',').length;
            
            let imageType = 'main';
            if (match.includes('nutrition') || columnIndex > 20) imageType = 'nutrition';
            else if (match.includes('gallery') || match.includes('image_2')) imageType = 'gallery';
            
            return `${YOUR_DOMAIN}/products/${slug}/${imageType}.jpg`;
        }
    );
}

// Process any file type
function processFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        content = replaceAllImageLinks(content);
        
        const outputPath = filePath.replace(/(\.[^.]+)$/, '-updated$1');
        fs.writeFileSync(outputPath, content);
        
        console.log(`✅ Updated: ${filePath} → ${outputPath}`);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
    }
}

// Usage
const file = process.argv[2];
if (file) {
    processFile(file);
} else {
    console.log('Drop any file: node universal-image-replacer.js yourfile.csv');
}