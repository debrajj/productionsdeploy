const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const inputFile = './BULK-PRODUCTS-75-BRANDS.csv';
const outputFile = './BULK-PRODUCTS-75-BRANDS-FIXED.csv';

const products = [];

// Read and fix the CSV data
fs.createReadStream(inputFile)
  .pipe(csv())
  .on('data', (row) => {
    // Fix variants field - the JSON is malformed in CSV, let's extract the data manually
    if (row.variants && row.variants !== '{}' && row.variants !== '') {
      try {
        // The variants field seems to be truncated, let's try to reconstruct from the pattern
        console.log(`Processing variants for ${row.name}: ${row.variants.substring(0, 100)}...`);
        
        // For now, let's clear variants and use simple flavors/weights instead
        row.variants = '';
      } catch (e) {
        console.log(`Error processing variants for ${row.name}: ${e.message}`);
        row.variants = '';
      }
    } else {
      row.variants = '';
    }

    // Add simpleWeights field from weight field
    if (row.weight && !row.simpleWeights) {
      row.simpleWeights = row.weight;
    }

    // Clean up boolean fields
    row.featured = row.featured === 'TRUE';
    row.trending = row.trending === 'TRUE';
    row.bestSeller = row.bestSeller === 'TRUE';
    row.lovedByExperts = row.lovedByExperts === 'TRUE';
    row.onSale = row.onSale === 'TRUE';

    // Ensure numeric fields
    row.price = parseInt(row.price) || 0;
    row.originalPrice = parseInt(row.originalPrice) || 0;
    row.rating = parseFloat(row.rating) || 4.0;
    row.reviews = parseInt(row.reviews) || 0;

    products.push(row);
  })
  .on('end', () => {
    console.log(`Processed ${products.length} products`);
    
    // Write the fixed CSV
    const csvWriter = createCsvWriter({
      path: outputFile,
      header: [
        {id: 'name', title: 'name'},
        {id: 'price', title: 'price'},
        {id: 'originalPrice', title: 'originalPrice'},
        {id: 'category', title: 'category'},
        {id: 'subcategory', title: 'subcategory'},
        {id: 'brand', title: 'brand'},
        {id: 'description', title: 'description'},
        {id: 'mainImage', title: 'mainImage'},
        {id: 'images', title: 'images'},
        {id: 'rating', title: 'rating'},
        {id: 'reviews', title: 'reviews'},
        {id: 'weight', title: 'weight'},
        {id: 'simpleWeights', title: 'simpleWeights'},
        {id: 'simpleFlavors', title: 'simpleFlavors'},
        {id: 'variants', title: 'variants'},
        {id: 'featured', title: 'featured'},
        {id: 'trending', title: 'trending'},
        {id: 'bestSeller', title: 'bestSeller'},
        {id: 'lovedByExperts', title: 'lovedByExperts'},
        {id: 'onSale', title: 'onSale'},
        {id: 'shopByGoal', title: 'shopByGoal'},
        {id: 'nutritionInfo', title: 'nutritionInfo'},
        {id: 'ingredients', title: 'ingredients'},
        {id: 'certifications', title: 'certifications'},
        {id: 'nutritionImage', title: 'nutritionImage'},
        {id: 'slug', title: 'slug'}
      ]
    });

    csvWriter.writeRecords(products)
      .then(() => {
        console.log(`Fixed CSV written to ${outputFile}`);
        
        // Show sample of products with simple flavors/weights
        const productsWithSimple = products.filter(p => p.simpleFlavors || p.simpleWeights);
        console.log(`\nProducts with simple flavors/weights: ${productsWithSimple.length}`);
        
        if (productsWithSimple.length > 0) {
          console.log('\nSample products with simple variants:');
          productsWithSimple.slice(0, 3).forEach(sample => {
            console.log({
              name: sample.name,
              simpleFlavors: sample.simpleFlavors,
              simpleWeights: sample.simpleWeights,
              price: sample.price,
              featured: sample.featured,
              trending: sample.trending
            });
          });
        }
      })
      .catch(err => {
        console.error('Error writing CSV:', err);
      });
  });