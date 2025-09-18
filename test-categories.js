const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3000/api';

async function testCategories() {
  console.log('🧪 Testing Product Categories...\n');
  
  try {
    // Test Best Sellers
    console.log('🏆 Testing Best Sellers...');
    const bestSellersResponse = await fetch(`${API_BASE}/products?where[bestSeller][equals]=true&limit=5`);
    const bestSellersData = await bestSellersResponse.json();
    console.log(`   Found ${bestSellersData.totalDocs || bestSellersData.docs?.length || 0} best seller products`);
    if (bestSellersData.docs && bestSellersData.docs.length > 0) {
      console.log(`   Sample: ${bestSellersData.docs[0].name}`);
    }
    
    // Test Loved by Experts
    console.log('\\n👨🔬 Testing Loved by Experts...');
    const expertsResponse = await fetch(`${API_BASE}/products?where[lovedByExperts][equals]=true&limit=5`);
    const expertsData = await expertsResponse.json();
    console.log(`   Found ${expertsData.totalDocs || expertsData.docs?.length || 0} expert-loved products`);
    if (expertsData.docs && expertsData.docs.length > 0) {
      console.log(`   Sample: ${expertsData.docs[0].name}`);
    }
    
    // Test Shop by Goal - Muscle Gain
    console.log('\\n🎯 Testing Shop by Goal (MUSCLE_GAIN)...');
    const muscleGainResponse = await fetch(`${API_BASE}/products?where[shopByGoal][equals]=MUSCLE_GAIN&limit=5`);
    const muscleGainData = await muscleGainResponse.json();
    console.log(`   Found ${muscleGainData.totalDocs || muscleGainData.docs?.length || 0} muscle gain products`);
    if (muscleGainData.docs && muscleGainData.docs.length > 0) {
      console.log(`   Sample: ${muscleGainData.docs[0].name}`);
    }
    
    // Test Shop by Goal - Weight Loss
    console.log('\\n🎯 Testing Shop by Goal (WEIGHT_LOSS)...');
    const weightLossResponse = await fetch(`${API_BASE}/products?where[shopByGoal][equals]=WEIGHT_LOSS&limit=5`);
    const weightLossData = await weightLossResponse.json();
    console.log(`   Found ${weightLossData.totalDocs || weightLossData.docs?.length || 0} weight loss products`);
    if (weightLossData.docs && weightLossData.docs.length > 0) {
      console.log(`   Sample: ${weightLossData.docs[0].name}`);
    }
    
    // Test Shop by Goal - Energy Performance
    console.log('\\n🎯 Testing Shop by Goal (ENERGY_PERFORMANCE)...');
    const energyResponse = await fetch(`${API_BASE}/products?where[shopByGoal][equals]=ENERGY_PERFORMANCE&limit=5`);
    const energyData = await energyResponse.json();
    console.log(`   Found ${energyData.totalDocs || energyData.docs?.length || 0} energy performance products`);
    if (energyData.docs && energyData.docs.length > 0) {
      console.log(`   Sample: ${energyData.docs[0].name}`);
    }
    
    // Test Featured Products
    console.log('\\n⭐ Testing Featured Products...');
    const featuredResponse = await fetch(`${API_BASE}/products?where[featured][equals]=true&limit=5`);
    const featuredData = await featuredResponse.json();
    console.log(`   Found ${featuredData.totalDocs || featuredData.docs?.length || 0} featured products`);
    if (featuredData.docs && featuredData.docs.length > 0) {
      console.log(`   Sample: ${featuredData.docs[0].name}`);
    }
    
    // Test Trending Products
    console.log('\\n📈 Testing Trending Products...');
    const trendingResponse = await fetch(`${API_BASE}/products?where[trending][equals]=true&limit=5`);
    const trendingData = await trendingResponse.json();
    console.log(`   Found ${trendingData.totalDocs || trendingData.docs?.length || 0} trending products`);
    if (trendingData.docs && trendingData.docs.length > 0) {
      console.log(`   Sample: ${trendingData.docs[0].name}`);
    }
    
    console.log('\\n✅ Category testing completed!');
    console.log('\\n📝 Summary:');
    console.log('   - If you see products in each category, the fix worked!');
    console.log('   - If any category shows 0 products, there might be additional issues.');
    console.log('   - Make sure your backend server is running on localhost:3000');
    
  } catch (error) {
    console.error('❌ Error testing categories:', error.message);
    console.log('\\n💡 Make sure your backend server is running:');
    console.log('   cd backend && npm run dev');
  }
}

testCategories();