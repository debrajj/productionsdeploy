# Bulk Product Import System for Payload CMS

## Overview
This system allows bulk importing of products into your Payload CMS store using Excel/CSV files.

## Features
- ✅ Bulk import products from Excel/CSV
- ✅ Auto-create missing brands and categories
- ✅ Support for product variants (flavors, sizes, prices)
- ✅ Multiple image support (main + additional images)
- ✅ Nutrition information import
- ✅ Custom fields (Best Seller, Loved by Experts, etc.)
- ✅ Excel template download

## How to Use

### 1. Access Bulk Import
Navigate to: `http://localhost:3000/admin/bulk-import`

### 2. Download Template
Click "Download Excel Template" to get the proper format

### 3. Fill Template
Fill the Excel file with your product data following the template format

### 4. Upload & Import
Upload your Excel file and click "Import Products"

## Excel Template Columns

### Required Fields
- `name` - Product name
- `price` - Current selling price
- `category` - Main category
- `brand` - Product brand

### Optional Fields
- `originalPrice` - Original price before discount
- `subcategory` - Product subcategory
- `description` - Product description
- `imageUrl` - Main product image URL
- `additionalImageUrls` - Comma-separated additional image URLs
- `rating` - Product rating (0-5)
- `reviews` - Number of reviews
- `onSale` - true/false
- `featured` - true/false
- `trending` - true/false
- `bestSeller` - true/false
- `lovedByExperts` - true/false
- `shopByGoal` - MUSCLE_GAIN, WEIGHT_LOSS, ENERGY_PERFORMANCE, HEALTH_WELLNESS

### Variant Support
- `simpleFlavors` - Comma-separated flavors (e.g., "Chocolate,Vanilla,Strawberry")
- `variants` - JSON array for complex variants with individual pricing

Example variants JSON:
```json
[
  {"flavor":"Chocolate","weight":"1kg","price":4199},
  {"flavor":"Vanilla","weight":"500g","price":2499}
]
```

### Nutrition Information
- `servingSize` - e.g., "30g (1 scoop)"
- `servingsPerContainer` - Number of servings
- `protein` - e.g., "25g"
- `carbohydrates` - e.g., "2g"
- `fat` - e.g., "0.5g"
- `calories` - Number of calories
- `ingredients` - Comma-separated ingredients list

## Reference Lists

### Available Brands (60+ brands)
```
ALPINO, AS-IT-IS, AVVATAR, AESTHETIC NUTRITION, BOLT, BPI, BEAST LIFE, DYMATIZE,
FAST AND UP, GASPARI, GAT, GNC, GHOST, HEALTH FARM, INTERNATIONAL PROTEIN, ISOPURE,
KAGED, KEVIN LEVRONE, LABRADA, MONSTER LAB, MUSCLE BLAZE, MUSCLETECH, MUTANT, MYFITNESS,
MYFITNESS PEANUT BUTTER, NEUHERBS, NAKPRO, ONE SCIENCE, ON (OPTIMUM NUTRITION), POLE NUTRITION,
PROSUPPS, PINTOLA, RONNIE COLEMAN, RAW NUTRITION, RYSE, THE WHOLE TRUTH NUTRITION, WELLBEING,
XTEND, YOGABAR, RANBDS, APPLIED NUTRITION, BSN, DENIS JAMES, DEXTER JACKSON, EXALT,
INSANE LABZ, MHP, MI (MUSCLE IMPACT NUTRITION), NOW, NUTREX, NUTRAMARC, REDCON,
RULE ONE, UNIVERSAL, ATOM, TRUE BASICS, CLOMA PHARMA, CENTRUM, CONDEMNED, MUSCLEMEDS,
ULTIMATE NUTRITION, FA ICE HYDRO, ANDROPIQUE, CUREGARDEN, TATA 1MG, ACE BLEND, NATUREYZ,
HEALTHYHEY NUTRITION, MIDUTY, WHATS UP WELLNESS, MYODROL, CARBAMIDE FORTE, BEAUTYWISE,
FUEL ONE, NAKPRO PROTEIN
```

### Available Categories
```
SPORTS NUTRITION
VITAMINS & SUPPLEMENTS
AYURVEDA & HERBS
HEALTH FOOD & DRINKS
FITNESS
WELLNESS
```

### Available Subcategories
```
Proteins
Gainers
Pre/Post Workout
Fat Burners
Amino Acids
Omega Fatty Acids
Multivitamins
Herbs for Weight Loss
Vital Herbs
Weight Loss Foods
Health Juices
Gym Accessories
Fitness Trackers
Skin Care
Hair Care
```

### Shop By Goals
```
MUSCLE_GAIN
WEIGHT_LOSS
ENERGY_PERFORMANCE
HEALTH_WELLNESS
```

## Auto-Creation Features

### Brands
If a brand doesn't exist in the list above, it will be automatically created with the name provided.

### Categories & Subcategories
If a category doesn't exist in the list above, it will be created. If a subcategory is provided and doesn't exist under the category, it will be added.

## Adding New Brands/Categories

### To Add New Brands:
1. Edit `backend/shared-brands.js`
2. Add brand name to `ALL_BRANDS` array
3. Restart server

### To Add New Categories:
1. Edit `backend/src/collections/products/index.ts`
2. Add to `categories` array
3. Restart server

### To Add New Subcategories:
1. Edit `backend/src/collections/products/index.ts`
2. Add to `subcategories` array
3. Restart server

## Error Handling
- Invalid data rows are skipped with error messages
- Missing required fields are reported
- Duplicate products (by name) are handled gracefully
- Import results show success count and detailed error list

## Example Data Row
```
name: Premium Whey Protein Isolate
price: 4199
originalPrice: 4999
category: SPORTS NUTRITION
subcategory: Proteins
brand: Optimum Nutrition
description: High-quality whey protein isolate for muscle building
imageUrl: https://example.com/protein.jpg
additionalImageUrls: https://example.com/protein2.jpg,https://example.com/protein3.jpg
rating: 4.5
reviews: 150
onSale: true
featured: true
bestSeller: true
lovedByExperts: true
shopByGoal: MUSCLE_GAIN
simpleFlavors: Chocolate,Vanilla,Strawberry
servingSize: 30g (1 scoop)
servingsPerContainer: 33
protein: 25g
carbohydrates: 2g
fat: 0.5g
calories: 110
ingredients: Whey Protein Isolate,Natural Flavors,Lecithin
```

## Installation

1. Install dependencies:
```bash
npm install xlsx
```

2. The system is ready to use - navigate to `/admin/bulk-import`

## API Endpoints
- `POST /api/bulk-import` - Upload and process Excel file
- `GET /api/download-template` - Download Excel template

## Notes
- Products automatically appear on frontend after import
- All imported data is validated before creation
- System maintains existing product structure
- No existing APIs are modified