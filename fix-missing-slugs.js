#!/usr/bin/env node

/**
 * Fix missing slugs in products
 * Run with: node fix-missing-slugs.js
 */

const API_BASE = 'http://localhost:3000/api';

// Function to generate slug from product name
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim('-'); // Remove leading/trailing hyphens
}

async function fixMissingSlugs() {
  console.log('🔧 Fixing missing slugs in products...\n');

  try {
    // Get all products
    const response = await fetch(`${API_BASE}/products?limit=100`);
    const data = await response.json();

    if (!data.docs || data.docs.length === 0) {
      console.log('❌ No products found');
      return;
    }

    console.log(`Found ${data.docs.length} products`);

    let fixedCount = 0;
    let errorCount = 0;

    for (const product of data.docs) {
      // Check if slug is missing or empty
      if (!product.slug || product.slug.trim() === '') {
        console.log(`\n🔧 Fixing product: ${product.name}`);
        console.log(`   ID: ${product.id}`);
        console.log(`   Current slug: "${product.slug || 'empty'}"`);

        // Generate new slug
        const newSlug = generateSlug(product.name);
        console.log(`   New slug: "${newSlug}"`);

        try {
          // Update the product with new slug
          const updateResponse = await fetch(`${API_BASE}/products/${product.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              slug: newSlug
            })
          });

          if (updateResponse.ok) {
            console.log(`   ✅ Updated successfully`);
            fixedCount++;
          } else {
            console.log(`   ❌ Failed to update: ${updateResponse.status}`);
            errorCount++;
          }
        } catch (error) {
          console.log(`   ❌ Error updating: ${error.message}`);
          errorCount++;
        }
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Fixed: ${fixedCount} products`);
    console.log(`   Errors: ${errorCount} products`);
    console.log(`   Total processed: ${data.docs.length} products`);

    if (fixedCount > 0) {
      console.log('\n✅ Slug fixing completed! Products should now load correctly.');
    } else {
      console.log('\n✅ All products already have valid slugs.');
    }

  } catch (error) {
    console.error('❌ Failed to fix slugs:', error.message);
  }
}

// Use dynamic import for fetch in Node.js
async function main() {
  try {
    // Try to use built-in fetch (Node 18+)
    if (typeof fetch === 'undefined') {
      const { default: fetch } = await import('node-fetch');
      global.fetch = fetch;
    }
    await fixMissingSlugs();
  } catch (error) {
    console.error('Failed to run slug fix:', error.message);
    console.log('\nTry running: npm install node-fetch');
  }
}

main();