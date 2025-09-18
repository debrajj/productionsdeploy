// Fix variant parsing in API service
const fs = require('fs');
const path = require('path');

const apiFilePath = '/Users/debrajroy/Desktop/productionsdeploy/frontend/src/services/api.ts';
let content = fs.readFileSync(apiFilePath, 'utf8');

// Replace variant parsing logic
const oldVariantLogic = `        variants: (() => {
          try {
            if (typeof product.variants === 'string') {
              return JSON.parse(product.variants) || []
            }
            return product.variants || []
          } catch (e) {
            return []
          }
        })(),`;

const newVariantLogic = `        variants: (() => {
          try {
            if (typeof product.variants === 'string') {
              // Handle malformed JSON from CSV (keys without quotes)
              let variantStr = product.variants
              if (variantStr && variantStr !== '[]') {
                // Fix malformed JSON by adding quotes to keys
                variantStr = variantStr.replace(/([{,])\\s*([a-zA-Z_][a-zA-Z0-9_]*)\\s*:/g, '$1"$2":')
                return JSON.parse(variantStr) || []
              }
              return []
            }
            return product.variants || []
          } catch (e) {
            console.log('Variant parsing error:', e.message, 'for:', product.variants)
            return []
          }
        })(),`;

// Replace all occurrences
content = content.replace(new RegExp(oldVariantLogic.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newVariantLogic);

fs.writeFileSync(apiFilePath, content);
console.log('✅ Fixed variant parsing in API service');