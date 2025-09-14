export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  brand: string;
  description: string;
  nutritionInfo: string;
  ingredients: string;
  inStock: boolean;
  featured: boolean;
  trending: boolean;
  onSale: boolean;
  variants?: {
    weight?: string[];
    flavor?: string[];
  };
  rating: number;
  reviews: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  subcategories?: Array<{
    name: string;
    slug: string;
  }>;
}

export const categories: Category[] = [
  {
    id: '1',
    name: 'Protein',
    slug: 'protein',
    icon: '🧬',
    subcategories: [
      { name: '100% Performance Whey', slug: 'performance-whey' },
      { name: 'Whey Protein', slug: 'whey-protein' },
      { name: 'Nitro Iso Whey', slug: 'nitro-iso-whey' },
      { name: 'Plant Protein', slug: 'plant-protein' },
      { name: 'Mass Gainer', slug: 'mass-gainer' },
      { name: 'Collagen Protein', slug: 'collagen-protein' },
      { name: 'Protein Bars', slug: 'protein-bars' },
      { name: 'Shaker Bottles', slug: 'shaker-bottles' },
    ]
  },
  {
    id: '2',
    name: 'Pre, Intra & Creatine',
    slug: 'pre-intra-creatine',
    icon: '⚡',
    subcategories: [
      { name: 'Pre Workout', slug: 'pre-workout' },
      { name: 'Creatine Monohydrate', slug: 'creatine-monohydrate' },
      { name: 'EAAs & BCAAs', slug: 'eaas-bcaas' },
      { name: 'Citrulline', slug: 'citrulline' },
    ]
  },
  {
    id: '3',
    name: 'Muscle Performance',
    slug: 'muscle-performance',
    icon: '💪',
    subcategories: [
      { name: 'Testosterone Boosters', slug: 'testosterone-boosters' },
      { name: 'Glutamine', slug: 'glutamine' },
      { name: 'Energy Drinks', slug: 'energy-drinks' },
    ]
  },
  {
    id: '4',
    name: 'Healthy Weight',
    slug: 'healthy-weight',
    icon: '🔥',
    subcategories: [
      { name: 'Fat Burners', slug: 'fat-burners' },
      { name: 'L-Carnitine', slug: 'l-carnitine' },
      { name: 'CLA', slug: 'cla' },
    ]
  },
  {
    id: '5',
    name: 'Vitamins & Supplements',
    slug: 'vitamins-supplements',
    icon: '🧠',
    subcategories: [
      { name: 'Multivitamins', slug: 'multivitamins' },
      { name: 'Fish Oil', slug: 'fish-oil' },
      { name: 'Bone & Joint Support', slug: 'bone-joint-support' },
      { name: 'Greens & Superfoods', slug: 'greens-superfoods' },
    ]
  }
];

export const brands = [
  'Bodybuilding.com Signature',
  'Bucked Up',
  'RYSE',
  'Kaged',
  'PANDA Supplements',
  'Optimum Nutrition',
  'Dymatize',
  'MuscleTech',
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Gold Standard 100% Whey Protein',
    price: 4999,
    originalPrice: 5799,
    image: '/placeholder.svg',
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    category: 'protein',
    brand: 'Optimum Nutrition',
    description: 'The world\'s best-selling whey protein powder. Each serving provides 24g of high-quality protein to support muscle growth and recovery.',
    nutritionInfo: 'Serving Size: 1 scoop (30g)\nCalories: 120\nProtein: 24g\nCarbohydrates: 3g\nFat: 1g',
    ingredients: 'Whey Protein Isolates, Whey Protein Concentrate, Whey Peptides, Natural and Artificial Flavors, Lecithin, Salt, Sucralose, Acesulfame Potassium',
    inStock: true,
    featured: true,
    trending: true,
    onSale: true,
    variants: {
      weight: ['1 lb', '2 lbs', '5 lbs', '10 lbs'],
      flavor: ['Vanilla', 'Chocolate', 'Strawberry', 'Cookies & Cream']
    },
    rating: 4.8,
    reviews: 2847
  },
  {
    id: '2',
    name: 'Creatine Monohydrate Powder',
    price: 2099,
    image: '/placeholder.svg',
    images: ['/placeholder.svg', '/placeholder.svg'],
    category: 'pre-intra-creatine',
    brand: 'MuscleTech',
    description: 'Pure creatine monohydrate to enhance strength, power, and muscle mass. Unflavored and mixes easily.',
    nutritionInfo: 'Serving Size: 1 scoop (5g)\nCreatine Monohydrate: 5g',
    ingredients: 'Creatine Monohydrate',
    inStock: true,
    featured: true,
    trending: false,
    onSale: false,
    variants: {
      weight: ['300g', '500g', '1kg']
    },
    rating: 4.6,
    reviews: 1523
  },
  {
    id: '3',
    name: 'Pre-Workout Energy Blend',
    price: 3299,
    originalPrice: 3699,
    image: '/placeholder.svg',
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    category: 'pre-intra-creatine',
    brand: 'RYSE',
    description: 'High-stim pre-workout with beta-alanine, caffeine, and citrulline for explosive energy and pumps.',
    nutritionInfo: 'Serving Size: 1 scoop (15g)\nCaffeine: 300mg\nBeta-Alanine: 3.2g\nL-Citrulline: 6g',
    ingredients: 'L-Citrulline, Beta-Alanine, Caffeine Anhydrous, Natural Flavors, Sucralose, Silicon Dioxide',
    inStock: true,
    featured: false,
    trending: true,
    onSale: true,
    variants: {
      weight: ['20 servings', '40 servings'],
      flavor: ['Blue Razz', 'Fruit Punch', 'Green Apple']
    },
    rating: 4.7,
    reviews: 892
  },
  {
    id: '4',
    name: 'Plant-Based Protein Powder',
    price: 4199,
    image: '/placeholder.svg',
    images: ['/placeholder.svg', '/placeholder.svg'],
    category: 'protein',
    brand: 'Bodybuilding.com Signature',
    description: 'Complete plant-based protein with pea, rice, and hemp proteins. Perfect for vegans and vegetarians.',
    nutritionInfo: 'Serving Size: 1 scoop (33g)\nProtein: 25g\nCarbohydrates: 4g\nFat: 2g\nFiber: 3g',
    ingredients: 'Pea Protein Isolate, Brown Rice Protein, Hemp Protein, Natural Flavors, Stevia Leaf Extract',
    inStock: true,
    featured: true,
    trending: false,
    onSale: false,
    variants: {
      weight: ['2 lbs', '4 lbs'],
      flavor: ['Vanilla', 'Chocolate', 'Unflavored']
    },
    rating: 4.4,
    reviews: 675
  },
  {
    id: '5',
    name: 'Mass Gainer Complex',
    price: 6699,
    originalPrice: 7499,
    image: '/placeholder.svg',
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    category: 'protein',
    brand: 'Dymatize',
    description: 'High-calorie mass gainer with 50g protein and complex carbohydrates for serious muscle building.',
    nutritionInfo: 'Serving Size: 2 scoops (168g)\nCalories: 650\nProtein: 50g\nCarbohydrates: 85g\nFat: 8g',
    ingredients: 'Whey Protein Concentrate, Maltodextrin, Oat Flour, Natural Flavors, Digestive Enzymes',
    inStock: true,
    featured: false,
    trending: true,
    onSale: true,
    variants: {
      weight: ['6 lbs', '12 lbs'],
      flavor: ['Chocolate', 'Vanilla', 'Strawberry']
    },
    rating: 4.5,
    reviews: 1234
  },
  {
    id: '6',
    name: 'Fat Burner Thermogenic',
    price: 2899,
    image: '/placeholder.svg',
    images: ['/placeholder.svg', '/placeholder.svg'],
    category: 'healthy-weight',
    brand: 'Bucked Up',
    description: 'Advanced thermogenic fat burner with green tea extract, caffeine, and L-carnitine.',
    nutritionInfo: 'Serving Size: 2 capsules\nCaffeine: 200mg\nGreen Tea Extract: 500mg\nL-Carnitine: 1000mg',
    ingredients: 'Green Tea Extract, Caffeine Anhydrous, L-Carnitine, Forskolin, Capsicum Extract',
    inStock: true,
    featured: false,
    trending: false,
    onSale: false,
    variants: {
      weight: ['60 capsules', '120 capsules']
    },
    rating: 4.3,
    reviews: 456
  }
];

export const featuredProducts = products.filter(p => p.featured);
export const trendingProducts = products.filter(p => p.trending);
export const saleProducts = products.filter(p => p.onSale);