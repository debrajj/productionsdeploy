const mongoose = require('mongoose');

async function bulkInsert() {
  try {
    await mongoose.connect('mongodb+srv://gainmode46:XnjDxAwNf6Gx3Reo@cluster0.2zketsh.mongodb.net/gain?retryWrites=true&w=majority&appName=Cluster0');
    
    const csvData = `EXALT Pre-Workout,2499,2999,SPORTS NUTRITION,Pre/Post Workout,EXALT,Explosive pre-workout formula,https://cdn2.nutrabay.com/uploads/variant/images/featured_image-NB-NUT-1061-23-1756467618-1500x1500.webp
MI (MUSCLE IMPACT NUTRITION) Amino,1899,2299,SPORTS NUTRITION,Amino Acids,MI (MUSCLE IMPACT NUTRITION),Essential amino acids for recovery,https://cdn2.nutrabay.com/uploads/variant/images/featured_image-NB-NUT-1061-23-1756467618-1500x1500.webp
NUTRAMARC Mass Gainer,3299,3799,SPORTS NUTRITION,Gainers,NUTRAMARC,High-calorie mass gainer,https://cdn2.nutrabay.com/uploads/variant/images/featured_image-NB-NUT-1061-23-1756467618-1500x1500.webp
REDCON Pre-Workout,2699,3199,SPORTS NUTRITION,Pre/Post Workout,REDCON,Military-grade pre-workout,https://cdn2.nutrabay.com/uploads/variant/images/featured_image-NB-NUT-1061-23-1756467618-1500x1500.webp
RULE ONE Protein,2899,3399,SPORTS NUTRITION,Proteins,RULE ONE,Premium whey isolate,https://cdn2.nutrabay.com/uploads/variant/images/featured_image-NB-NUT-1061-23-1756467618-1500x1500.webp
ATOM BCAA,1799,2199,SPORTS NUTRITION,Amino Acids,ATOM,Premium BCAA formula,https://cdn2.nutrabay.com/uploads/variant/images/featured_image-NB-NUT-1061-23-1756467618-1500x1500.webp
TRUE BASICS Fish Oil,799,999,VITAMINS & SUPPLEMENTS,Omega Fatty Acids,TRUE BASICS,Premium omega-3 fish oil,https://cdn2.nutrabay.com/uploads/variant/images/featured_image-NB-NUT-1061-23-1756467618-1500x1500.webp
CLOMA PHARMA Multivitamin,599,799,VITAMINS & SUPPLEMENTS,Multivitamins,CLOMA PHARMA,Complete daily multivitamin,https://cdn2.nutrabay.com/uploads/variant/images/featured_image-NB-NUT-1061-23-1756467618-1500x1500.webp
CONDEMNED Vitamin D,599,799,VITAMINS & SUPPLEMENTS,Multivitamins,CONDEMNED,Vitamin D3 supplement,https://cdn2.nutrabay.com/uploads/variant/images/featured_image-NB-NUT-1061-23-1756467618-1500x1500.webp
MUSCLEMEDS Vitamin C,499,699,VITAMINS & SUPPLEMENTS,Multivitamins,MUSCLEMEDS,Vitamin C immune support,https://cdn2.nutrabay.com/uploads/variant/images/featured_image-NB-NUT-1061-23-1756467618-1500x1500.webp
FA ICE HYDRO B-Complex,699,899,VITAMINS & SUPPLEMENTS,Multivitamins,FA ICE HYDRO,B-complex vitamin supplement,https://cdn2.nutrabay.com/uploads/variant/images/featured_image-NB-NUT-1061-23-1756467618-1500x1500.webp
ANDROPIQUE Iron,399,599,VITAMINS & SUPPLEMENTS,Multivitamins,ANDROPIQUE,Iron deficiency supplement,https://cdn2.nutrabay.com/uploads/variant/images/featured_image-NB-NUT-1061-23-1756467618-1500x1500.webp
ACE BLEND Calcium,799,999,VITAMINS & SUPPLEMENTS,Multivitamins,ACE BLEND,Calcium bone health,https://cdn2.nutrabay.com/uploads/variant/images/featured_image-NB-NUT-1061-23-1756467618-1500x1500.webp
MYODROL Zinc,299,399,VITAMINS & SUPPLEMENTS,Multivitamins,MYODROL,Zinc immune support,https://cdn2.nutrabay.com/uploads/variant/images/featured_image-NB-NUT-1061-23-1756467618-1500x1500.webp
FUEL ONE Magnesium,699,899,VITAMINS & SUPPLEMENTS,Multivitamins,FUEL ONE,Magnesium relaxation,https://cdn2.nutrabay.com/uploads/variant/images/featured_image-NB-NUT-1061-23-1756467618-1500x1500.webp
NAKPRO PROTEIN Omega 3,899,1199,VITAMINS & SUPPLEMENTS,Omega Fatty Acids,NAKPRO PROTEIN,Pure omega-3 supplement,https://cdn2.nutrabay.com/uploads/variant/images/featured_image-NB-NUT-1061-23-1756467618-1500x1500.webp
AESTHETIC NUTRITION Melatonin,399,599,VITAMINS & SUPPLEMENTS,Multivitamins,AESTHETIC NUTRITION,Melatonin sleep aid,https://cdn2.nutrabay.com/uploads/variant/images/featured_image-NB-NUT-1061-23-1756467618-1500x1500.webp
MONSTER LAB Fat Burner,1999,2499,VITAMINS & SUPPLEMENTS,Fat Burners,MONSTER LAB,Advanced fat burning formula,https://cdn2.nutrabay.com/uploads/variant/images/featured_image-NB-NUT-1061-23-1756467618-1500x1500.webp
ONE SCIENCE L-Carnitine,1299,1599,VITAMINS & SUPPLEMENTS,Fat Burners,ONE SCIENCE,L-Carnitine fat burner,https://cdn2.nutrabay.com/uploads/variant/images/featured_image-NB-NUT-1061-23-1756467618-1500x1500.webp`;

    const lines = csvData.split('\n').filter(line => line.trim());
    const products = [];
    
    lines.forEach(line => {
      const values = line.split(',');
      products.push({
        name: values[0]?.trim(),
        price: parseFloat(values[1]) || 0,
        brand: values[5]?.trim(),
        category: values[3]?.trim(),
        description: values[6]?.trim() || 'Product description',
        image: values[7]?.trim(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
    
    const db = mongoose.connection.db;
    const result = await db.collection('products').insertMany(products);
    
    console.log(`✅ Inserted ${result.insertedCount} products`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

bulkInsert();