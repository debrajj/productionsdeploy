// Fix variant parsing in API service - complete fix
const fs = require('fs');
const path = require('path');

const apiFilePath = '/Users/debrajroy/Desktop/productionsdeploy/frontend/src/services/api.ts';
let content = fs.readFileSync(apiFilePath, 'utf8');

// Find and replace the variant parsing logic with a more robust fix
const variantParsingRegex = /variants: \(\(\) => \{[\s\S]*?\}\)\(\),/g;

const newVariantLogic = `variants: (() => {
          try {
            if (typeof product.variants === 'string') {
              let variantStr = product.variants
              if (variantStr && variantStr !== '[]') {
                // Fix malformed JSON: add quotes to keys and string values
                variantStr = variantStr
                  .replace(/([{,])\\s*([a-zA-Z_][a-zA-Z0-9_]*)\\s*:/g, '$1"$2":')
                  .replace(/:([^,}\\[\\]"]+)([,}])/g, ':"$1"$2')
                  .replace(/:"(\\d+)"([,}])/g, ':$1$2') // Keep numbers unquoted
                console.log('Parsing variants:', variantStr)
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

content = content.replace(variantParsingRegex, newVariantLogic);

fs.writeFileSync(apiFilePath, content);
console.log('✅ Fixed variant parsing with complete JSON fix');