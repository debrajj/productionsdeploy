const fs = require('fs');

const YOUR_DOMAIN = 'https://yourwebsite.com';
const file = process.argv[2];

if (!file) {
    console.log('Usage: node quick-replace.js <file>');
    process.exit(1);
}

let content = fs.readFileSync(file, 'utf8');

// Replace ALL external image URLs
content = content.replace(
    /https?:\/\/[^\s,"\n]+\.(jpg|jpeg|png|webp|gif)/gi,
    (match, ext, offset, string) => {
        // Find slug from current line
        const line = string.substring(
            string.lastIndexOf('\n', offset) + 1,
            string.indexOf('\n', offset) || string.length
        );
        const slug = line.split(',').pop().trim().replace(/"/g, '');
        return `${YOUR_DOMAIN}/products/${slug}/main.jpg`;
    }
);

fs.writeFileSync(file.replace(/(\.[^.]+)$/, '-fixed$1'), content);
console.log('✅ Done! External images replaced with your domain.');