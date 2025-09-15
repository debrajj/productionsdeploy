# 📊 CSV Import Reference Guide

## 🏷️ **BRANDS** (Choose from these exact values)
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

## 📂 **CATEGORIES** (Choose from these exact values)
```
SPORTS NUTRITION
VITAMINS & SUPPLEMENTS  
AYURVEDA & HERBS
HEALTH FOOD & DRINKS
FITNESS
WELLNESS
```

## 📋 **SUBCATEGORIES** (Choose from these exact values)
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

## 🎯 **SHOP BY GOALS** (Choose from these exact values)
```
MUSCLE_GAIN
WEIGHT_LOSS
ENERGY_PERFORMANCE
HEALTH_WELLNESS
```

## 📝 **CSV COLUMN REFERENCE**

### **Required Columns**
- `name` - Product name
- `price` - Current price (number)
- `category` - Main category (from list above)
- `brand` - Brand name (from list above)

### **Optional Columns**
- `originalPrice` - Original price before discount
- `subcategory` - Subcategory (from list above)
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
- `shopByGoal` - Goal category (from list above)

### **Variant Columns**
- `simpleFlavors` - Comma-separated flavors: "Chocolate,Vanilla,Strawberry"
- `variants` - JSON format for complex variants:
```json
[{"flavor":"Chocolate","weight":"1kg","price":4199},{"flavor":"Vanilla","weight":"500g","price":2499}]
```

### **Nutrition Columns**
- `servingSize` - e.g., "30g (1 scoop)"
- `servingsPerContainer` - Number of servings
- `protein` - e.g., "25g"
- `carbohydrates` - e.g., "2g"
- `fat` - e.g., "0.5g"
- `calories` - Number of calories
- `ingredients` - Comma-separated: "Whey Protein Isolate,Natural Flavors,Lecithin"

## ✅ **Example CSV Row**
```csv
name,price,originalPrice,category,subcategory,brand,description,imageUrl,rating,onSale,bestSeller,shopByGoal,simpleFlavors
Premium Whey Protein,4199,4999,SPORTS NUTRITION,Proteins,ON (OPTIMUM NUTRITION),High-quality protein,https://example.com/img.jpg,4.5,true,true,MUSCLE_GAIN,"Chocolate,Vanilla"
```

## 🚀 **Quick Tips**
- Use exact values from lists above
- Boolean fields: use `true` or `false`
- Multiple values: separate with commas
- JSON variants: use proper JSON format
- Missing brands/categories will be auto-created if not in lists