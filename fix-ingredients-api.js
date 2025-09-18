// Quick fix for ingredients parsing in API
const fs = require('fs');
const path = require('path');

const apiFilePath = '/Users/debrajroy/Desktop/productionsdeploy/frontend/src/services/api.ts';
let content = fs.readFileSync(apiFilePath, 'utf8');

// Replace all occurrences of ingredients parsing
content = content.replace(
  /ingredients: product\.ingredients \|\| \[\],/g,
  `ingredients: (() => {
          try {
            if (typeof product.ingredients === 'string') {
              return product.ingredients.split(',').map((ingredient: string) => ({
                name: ingredient.trim()
              }))
            }
            return product.ingredients || []
          } catch (e) {
            return []
          }
        })(),`
);

// Also fix nutritionInfo
content = content.replace(
  /nutritionInfo: product\.nutritionInfo \|\| \{\},/g,
  `nutritionInfo: typeof product.nutritionInfo === 'string' ? product.nutritionInfo : (product.nutritionInfo || {}),`
);

// Also fix nutritionInfo for data object
content = content.replace(
  /nutritionInfo: data\.nutritionInfo \|\| \{\},/g,
  `nutritionInfo: typeof data.nutritionInfo === 'string' ? data.nutritionInfo : (data.nutritionInfo || {}),`
);

fs.writeFileSync(apiFilePath, content);
console.log('✅ Fixed ingredients and nutritionInfo parsing in API service');