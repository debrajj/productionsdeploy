const fs = require('fs');
const csv = require('csv-parser');

// Products that should be bestSeller=true from your CSV
const bestSellerProducts = [
  'AVVATAR Whey Protein',
  'ON (OPTIMUM NUTRITION) Pre-Workout', 
  'BSN Amino Acids',
  'GHOST Protein',
  'LABRADA Mass Gainer',
  'UNIVERSAL Whey Protein',
  'MUTANT BCAA',
  'PROSUPPS Hyde',
  'INSANE LABZ Psychotic',
  'RONNIE COLEMAN Signature',
  'APPLIED NUTRITION ABE'
];

// Products that should be lovedByExperts=true from your CSV
const lovedByExpertsProducts = [
  'AVVATAR Whey Protein',
  'BSN Amino Acids', 
  'DYMATIZE Protein',
  'UNIVERSAL Whey Protein',
  'GASPARI Aminolast',
  'INSANE LABZ Psychotic',
  'KEVIN LEVRONE Gold Whey',
  'RONNIE COLEMAN Signature',
  'APPLIED NUTRITION ABE'
];

async function updateProducts() {
  const API_BASE = 'http://localhost:3000/api';
  
  console.log('Updating product boolean values...');
  
  // Get all products
  const response = await fetch(`${API_BASE}/products?limit=100`);
  const data = await response.json();
  
  for (const product of data.docs) {
    const shouldBeBestSeller = bestSellerProducts.includes(product.name);
    const shouldBeLovedByExperts = lovedByExpertsProducts.includes(product.name);
    
    if (shouldBeBestSeller !== product.bestSeller || shouldBeLovedByExperts !== product.lovedByExperts) {
      console.log(`Updating ${product.name}: bestSeller=${shouldBeBestSeller}, lovedByExperts=${shouldBeLovedByExperts}`);
      
      try {
        const updateResponse = await fetch(`${API_BASE}/products/${product.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bestSeller: shouldBeBestSeller,
            lovedByExperts: shouldBeLovedByExperts
          }),
        });
        
        if (updateResponse.ok) {
          console.log(`✓ Updated ${product.name}`);
        } else {
          console.log(`✗ Failed to update ${product.name}: ${updateResponse.status}`);
        }
      } catch (error) {
        console.log(`✗ Error updating ${product.name}: ${error.message}`);
      }
    }
  }
  
  console.log('Update completed!');
}

updateProducts().catch(console.error);