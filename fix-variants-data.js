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
    // Fix variants field - convert empty {} to empty string or proper JSON
    if (row.variants === '{}' || row.variants === '' || !row.variants) {
      row.variants = '';
    } else {
      try {
        // Try to parse existing variants to validate JSON
        const variants = JSON.parse(row.variants);
        if (Array.isArray(variants) && variants.length > 0) {
          row.variants = JSON.stringify(variants);
        } else {
          row.variants = '';
        }
      } catch (e) {
        console.log(`Invalid variants JSON for ${row.name}: ${row.variants}`);
        row.variants = '';
      }
    }

    // Add simpleWeights field from weight field
    if (row.weight && !row.simpleWeights) {
      row.simpleWeights = row.weight;
    }

    // Ensure all required fields are present
    row.price = row.price || 0;
    row.originalPrice = row.originalPrice || '';
    row.rating = row.rating || 4.0;
    row.reviews = row.reviews || 0;
    row.featured = row.featured === 'TRUE' ? true : false;
    row.trending = row.trending === 'TRUE' ? true : false;
    row.bestSeller = row.bestSeller === 'TRUE' ? true : false;
    row.lovedByExperts = row.lovedByExperts === 'TRUE' ? true : false;
    row.onSale = row.onSale === 'TRUE' ? true : false;

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
        
        // Show sample of products with variants
        const productsWithVariants = products.filter(p => p.variants && p.variants !== '');
        console.log(`\nProducts with variants: ${productsWithVariants.length}`);
        
        if (productsWithVariants.length > 0) {
          console.log('\nSample product with variants:');
          console.log(JSON.stringify(productsWithVariants[0], null, 2));
        }

        // Show sample of products with simple flavors/weights
        const productsWithSimple = products.filter(p => p.simpleFlavors || p.simpleWeights);
        console.log(`\nProducts with simple flavors/weights: ${productsWithSimple.length}`);
        
        if (productsWithSimple.length > 0) {
          console.log('\nSample product with simple variants:');
          const sample = productsWithSimple[0];
          console.log({
            name: sample.name,
            simpleFlavors: sample.simpleFlavors,
            simpleWeights: sample.simpleWeights,
            price: sample.price
          });
        }
      })
      .catch(err => {
        console.error('Error writing CSV:', err);
      });
  });