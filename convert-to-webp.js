const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const bannerDir = './frontend/src/assets/Banners';

// Convert PNG files to WebP
const convertToWebP = async (inputPath, outputPath) => {
  try {
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath);
    console.log(`Converted: ${inputPath} -> ${outputPath}`);
  } catch (error) {
    console.error(`Error converting ${inputPath}:`, error);
  }
};

// Process all PNG files
const processDirectory = async (dir) => {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      await processDirectory(fullPath);
    } else if (file.name.endsWith('.png')) {
      const webpPath = fullPath.replace('.png', '.webp');
      await convertToWebP(fullPath, webpPath);
    }
  }
};

processDirectory(bannerDir);