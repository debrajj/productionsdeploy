import fs from 'fs';
import path from 'path';

const products = [
  {
    name: "Avvatar Absolute 100% Whey Protein - 1 Kg (2.2 Lb), Malai Kulfi",
    image: "https://cdn.nutrabay.com/wp-content/uploads/2023/09/NB-AVT-1001-23-01.jpg",
    rating: 4.8,
    reviews: 234,
    price: 4199,
    originalPrice: 4999,
    onSale: true,
    customCategory: "SPORTS NUTRITION",
    customSubcategory: "Proteins",
    customBrand: "Avvatar",
    featured: true,
    trending: true,
    bestSeller: true,
    lovedByExperts: true,
    description: "Premium 100% whey protein concentrate with delicious Malai Kulfi flavor. Perfect for muscle building and recovery after intense workouts.",
    slug: "avvatar-absolute-whey-protein-malai-kulfi"
  },
  {
    name: "HYPR Pre-Workout - 480 gm",
    image: "https://cdn.nutrabay.com/wp-content/uploads/2023/12/NB-ATH-1002-01-01.jpg",
    rating: 4.6,
    reviews: 189,
    price: 2899,
    originalPrice: 3299,
    onSale: true,
    customCategory: "SPORTS NUTRITION",
    customSubcategory: "Pre/Post Workout",
    customBrand: "HYPR",
    featured: true,
    trending: false,
    bestSeller: true,
    lovedByExperts: false,
    description: "Explosive pre-workout formula with caffeine, beta-alanine, and citrulline for maximum energy and pump during your training sessions.",
    slug: "hypr-pre-workout-480gm"
  },
  {
    name: "Naturaltein Whey Protein Isolate - 1 Kg (2.2 Lb), Chocolate",
    image: "https://cdn.nutrabay.com/wp-content/uploads/2023/11/NB-NTR-1000-01-01.jpg",
    rating: 4.7,
    reviews: 156,
    price: 5499,
    customCategory: "SPORTS NUTRITION",
    customSubcategory: "Proteins",
    customBrand: "Naturaltein",
    featured: false,
    trending: true,
    bestSeller: false,
    lovedByExperts: true,
    description: "Pure whey protein isolate with 27g of protein per serving. Low in carbs and fat, perfect for lean muscle growth.",
    slug: "naturaltein-whey-protein-isolate-chocolate"
  },
  {
    name: "AS-IT-IS ATOM PWR Raw Whey Protein with Enzyme - 1 Kg (2.2 Lb), Double Rich Chocolate",
    image: "https://cdn2.nutrabay.com/uploads/variant/images/variant-30100-featured_image-ASITIS_ATOM_PWR_Raw_Whey_Protein_with_Enzyme__1_Kg_22_Lb_Double_Rich_Chocolate.jpg",
    rating: 4.5,
    reviews: 298,
    price: 3899,
    customCategory: "SPORTS NUTRITION",
    customSubcategory: "Proteins",
    customBrand: "AS-IT-IS",
    featured: true,
    bestSeller: true,
    lovedByExperts: true,
    trending: false,
    description: "Raw whey protein with added digestive enzymes for better absorption. Minimally processed for maximum nutrition.",
    slug: "as-it-is-atom-pwr-raw-whey-protein"
  },
  {
    name: "Bigmuscles Nutrition Karnage Pre Workout",
    image: "https://cdn2.nutrabay.com/uploads/variant/images/featured_image-NB-BGM-1066-01-1200x1200.webp",
    rating: 4.4,
    reviews: 167,
    price: 3499,
    originalPrice: 3999,
    onSale: true,
    customCategory: "SPORTS NUTRITION",
    customSubcategory: "Pre/Post Workout",
    customBrand: "Bigmuscles Nutrition",
    featured: false,
    trending: true,
    bestSeller: false,
    lovedByExperts: false,
    description: "High-intensity pre-workout formula designed to deliver explosive energy, focus and pumps for your toughest workouts.",
    slug: "bigmuscles-nutrition-karnage-pre-workout"
  },
  {
    name: "Nutrabay High Protein Oats",
    image: "https://cdn2.nutrabay.com/uploads/variant/images/featured_image-NB-NUT-1098-01-1753305036-1500x1500.webp",
    rating: 4.3,
    reviews: 134,
    price: 1599,
    customCategory: "HEALTH FOOD & DRINKS",
    customSubcategory: "Weight Loss Foods",
    customBrand: "Nutrabay",
    featured: false,
    trending: true,
    bestSeller: false,
    lovedByExperts: true,
    description: "High-protein oats enriched with additional protein for a nutritious breakfast or snack. Helps in weight management and provides sustained energy.",
    slug: "nutrabay-high-protein-oats"
  },
  {
    name: "Isopure Low Carb 100% Whey Protein Isolate Powder - 1 Kg (2.2 Lb), Dutch Chocolate",
    image: "https://cdn2.nutrabay.com/uploads/variant/images/variant-6286-featured_image-Isopure_Low_Carb_100_Whey_Protein_Isolate_Powder__1_Kg_22_Lb_Dutch_Chocolate.jpg",
    rating: 4.8,
    reviews: 267,
    price: 5999,
    customCategory: "SPORTS NUTRITION",
    customSubcategory: "Proteins",
    customBrand: "Isopure",
    featured: true,
    trending: true,
    bestSeller: true,
    lovedByExperts: true,
    description: "Zero-carb whey protein isolate with 25g of pure protein per serving. Perfect for keto and low-carb diets.",
    slug: "isopure-low-carb-whey-protein-isolate"
  },
  {
    name: "Avvatar Whey Protein Concentrate - 1 Kg (2.2 Lb), Chocolate",
    image: "https://cdn.nutrabay.com/wp-content/uploads/2022/06/NB-AVT-1000-07-01.jpg",
    rating: 4.6,
    reviews: 189,
    price: 3299,
    originalPrice: 3899,
    onSale: true,
    customCategory: "SPORTS NUTRITION",
    customSubcategory: "Proteins",
    customBrand: "Avvatar",
    featured: true,
    trending: true,
    bestSeller: true,
    lovedByExperts: true,
    description: "Premium whey protein concentrate with 24g protein per serving. Perfect for muscle building and recovery.",
    slug: "avvatar-whey-protein-concentrate-chocolate"
  },
  {
    name: "Nutrabay Gold 100% Whey Protein - 1 Kg (2.2 Lb), Chocolate",
    image: "https://cdn2.nutrabay.com/uploads/variant/images/featured_image-NB-WYM-1001-01-1500x1500.webp",
    rating: 4.5,
    reviews: 178,
    price: 3799,
    customCategory: "SPORTS NUTRITION",
    customSubcategory: "Proteins",
    customBrand: "Nutrabay",
    featured: false,
    trending: true,
    bestSeller: false,
    lovedByExperts: true,
    description: "Premium quality whey protein with 24g protein per serving. Great taste and easy mixability.",
    slug: "nutrabay-gold-whey-protein-chocolate"
  }
];

async function uploadProducts() {
  const baseUrl = `${process.env.BACKEND_URL}/api`;
  
  for (const product of products) {
    try {
      const response = await fetch(`${baseUrl}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Added: ${product.name}`);
      } else {
        console.error(`❌ Failed to add: ${product.name} - ${response.status}`);
      }
    } catch (error) {
      console.error(`❌ Error adding ${product.name}:`, error.message);
    }
  }
  
  console.log('🎉 Upload complete!');
}

uploadProducts();