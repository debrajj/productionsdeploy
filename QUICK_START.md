# 🚀 Quick Start - Bulk Product Import

## ✅ What's Ready
- Bulk import API endpoints
- Excel template generation
- Auto-creation of brands/categories
- Product variants support
- Nutrition info import

## 🎯 How to Use

### 1. Start Server
```bash
cd backend
npm run dev
```

### 2. Download Template
Visit: `http://localhost:3000/api/download-template`
Or use the existing: `product-import-template.xlsx`

### 3. Import Products
```bash
# Using curl
curl -X POST http://localhost:3000/api/bulk-import \
  -F "file=@product-import-template.xlsx"

# Or use the demo script
node bulk-import-demo.js
```

### 4. Check Results
- Products appear in admin: `http://localhost:3000/admin/collections/products`
- API returns success count and any errors

## 📊 Template Format
- **Required**: name, price, category, brand
- **Optional**: originalPrice, subcategory, description, imageUrl, etc.
- **Variants**: simpleFlavors or JSON variants with pricing
- **Nutrition**: servingSize, protein, carbs, fat, calories

## 🔗 API Endpoints
- `GET /api/download-template` - Download Excel template
- `POST /api/bulk-import` - Upload Excel file for import

## ✨ Features
- ✅ Auto-creates missing brands and categories
- ✅ Validates all data before import
- ✅ Supports product variants (flavors, sizes, prices)
- ✅ Handles multiple images (main + additional)
- ✅ Imports nutrition information
- ✅ Custom fields (Best Seller, Loved by Experts, etc.)
- ✅ Error handling with detailed reports

Ready to import! 🎉