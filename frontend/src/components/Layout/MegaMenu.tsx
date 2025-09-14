import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { productApi, categoryApi, Product } from '@/services/api';

interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories: Subcategory[];
  displayOrder?: number;
  isActive?: boolean;
}

interface Subcategory {
  name: string;
  slug: string;
  items?: (string | { name: string; id: string; slug: string })[];
}

const baseCategories = [
  {
    id: 1,
    name: 'SPORTS NUTRITION',
    slug: 'sports-nutrition',
    subcategories: [
      {
        name: 'Proteins',
        slug: 'proteins',
        items: [
          'Whey Protein',
          'Casein Protein',
          'Plant Protein',
          'Protein Isolate'
        ]
      },
      {
        name: 'Pre-Workout',
        slug: 'pre-workout',
        items: [
          'Pre-Workout Supplements',
          'Energy Boosters',
          'Focus Enhancers'
        ]
      },
      {
        name: 'Gainers',
        slug: 'gainers',
        items: [
          'Weight Gainers',
          'Mass Gainers',
          'Herbal Weight Gainers'
        ]
      },
      {
        name: 'Workout Essentials',
        slug: 'workout-essentials',
        items: [
          'Fat Burners',
          'L-Carnitine',
          'Multivitamins for Bodybuilding',
          'Testosterone Booster',
          'ZMA'
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'VITAMINS & SUPPLEMENTS',
    slug: 'vitamins-supplements',
    subcategories: [
      {
        name: 'Omega Fatty Acids',
        slug: 'omega-fatty-acids',
        items: [
          'Omega 3',
          'Fish Oil',
          'Flaxseed Oil',
          'Cod Liver Oil',
          'Krill Oil'
        ]
      },
      {
        name: 'Multivitamins',
        slug: 'multivitamins',
        items: [
          'Multivitamins - Men',
          'Multivitamins - Women',
          'Multivitamins - Children'
        ]
      },
      {
        name: 'Skin Supplements',
        slug: 'skin-supplements',
        items: [
          'Collagen',
          'Glutathione',
          'Cleansers',
          'Moisturizer',
          'Face Wash',
          'Serum',
          'Under Eye Care'
        ]
      },
      {
        name: 'Hair Supplements',
        slug: 'hair-supplements',
        items: [
          'Hair Regrowth Solution Kits',
          'Multivitamins - General',
          'DHT Blocker',
          'Biotin',
          'Speciality Shampoo',
          'Hair Conditioner',
          'Hair Mask',
          'Glutathione'
        ]
      },
      {
        name: 'Speciality Supplements',
        slug: 'speciality-supplements',
        items: [
          'Probiotics',
          'Collagen',
          'DHT Blocker',
          'Fat Loss Supplements',
          'Performance',
          'Glucosamine Supplements',
          'L-Arginine',
          'Forskolin',
          'Other Supplements',
          'Personal Wellness',
          'CLA'
        ]
      }
    ]
  },
  {
    id: 3,
    name: 'AYURVEDA & HERBS',
    slug: 'ayurveda-herbs',
    subcategories: [
      {
        name: 'Herbs for Weight Loss',
        slug: 'herbs-weight-loss',
        items: [
          'Green Coffee Bean Extracts',
          'Garcinia Cambogia',
          'Green Tea Extract',
          'Guggul'
        ]
      },
      {
        name: 'Vital Herbs',
        slug: 'vital-herbs',
        items: [
          'Ginseng',
          'Ginkgo Biloba',
          'Herbal Weight Gainer',
          'Lutein',
          'Other Herbal Supplements',
          'Women Health Care'
        ]
      },
      {
        name: 'Antioxidants',
        slug: 'antioxidants',
        items: [
          'Milk Thistle',
          'Spirulina',
          'Tulsi',
          'Turmeric',
          'Amla'
        ]
      },
      {
        name: 'Herbs for Immunity',
        slug: 'herbs-immunity',
        items: [
          'Giloy',
          'Ayush Kwath',
          'Amla',
          'Turmeric',
          'Ashwagandha',
          'Neem',
          'Ginger'
        ]
      },
      {
        name: 'Herbs for Personal Care',
        slug: 'herbs-personal-care',
        items: [
          'Ashwagandha',
          'Shilajit',
          'Musli',
          'Maca',
          'Horny Goat Weed'
        ]
      },
      {
        name: 'Herbal Extracts',
        slug: 'herbal-extracts',
        items: [
          'Shatavari Extract',
          'Bilberry Extract',
          'Yashtimadhu Extract',
          'Other Herbs Extract'
        ]
      },
      {
        name: 'Herbs for Digestive Care',
        slug: 'herbs-digestive-care',
        items: [
          'Wheat Grass',
          'Garlic',
          'Triphala',
          'Boswellia',
          'Cinnamon',
          'Licorice',
          'Ginger'
        ]
      },
      {
        name: 'Herbs for Hair Care',
        slug: 'herbs-hair-care',
        items: [
          'Saw Palmetto',
          'Aloe Vera',
          'Brahmi / Shankhpushpi',
          'Moringa',
          'Fenugreek',
          'Neem',
          'Bhringraj'
        ]
      },
      {
        name: 'Herbal Oils',
        slug: 'herbal-oils',
        items: [
          'Coconut Oil',
          'Evening Primrose Oil',
          'Other Herbal Oils'
        ]
      },
      {
        name: 'Herbs for Diabetic Care',
        slug: 'herbs-diabetic-care',
        items: [
          'Diabetic Care',
          'Stevia',
          'Gymnema',
          'Arjuna'
        ]
      }
    ]
  },
  {
    id: 4,
    name: 'HEALTH FOOD & DRINKS',
    slug: 'health-food-drinks',
    subcategories: [
      {
        name: 'Weight Loss Foods',
        slug: 'weight-loss-foods',
        items: [
          'Oats',
          'Meal Replacement',
          'Protein Shakes',
          'Energy Drinks / Powders',
          'Cooking Oils & Sprays',
          'Chia Seeds',
          'Quinoa',
          'Dry Fruits',
          'Honey'
        ]
      },
      {
        name: 'Vinegar and Health Juices',
        slug: 'vinegar-health-juices',
        items: [
          'Apple Cider Vinegar',
          'Aloe Vera Juice',
          'Amla Juice',
          'Wheat Grass Juice',
          'Noni Juice',
          'Karela Jamun Juice',
          'Other Juices',
          'Triphala Juice'
        ]
      },
      {
        name: 'Protein Foods & Bars',
        slug: 'protein-foods-bars',
        items: [
          'Peanut Butter',
          'Muesli',
          'Protein Shakes',
          'Oats',
          'Cereals'
        ]
      },
      {
        name: 'Protein Bars',
        slug: 'protein-bars',
        items: [
          'Protein Cookies',
          'Nut Butters',
          'Snack Energy Bars'
        ]
      },
      {
        name: 'Protein for Wellness',
        slug: 'protein-wellness',
        items: [
          'Plant Proteins',
          'Protein for Women',
          'Meal Replacement',
          'Soy Protein',
          'Protein Blends'
        ]
      },
      {
        name: 'Family Nutrition',
        slug: 'family-nutrition',
        items: [
          'Nutrition for Children',
          'Nutrition for Adults'
        ]
      },
      {
        name: 'Healthy Beverages',
        slug: 'healthy-beverages',
        items: [
          'Green Tea',
          'Herbal Tea',
          'Matcha'
        ]
      }
    ]
  },
  {
    id: 5,
    name: 'FITNESS',
    slug: 'fitness',
    subcategories: [
      {
        name: 'Gym Accessories',
        slug: 'gym-accessories',
        items: [
          'Hand Grips',
          'Multi Gym Accessories',
          'Ab Trainers',
          'Ankle & Wrist Weights'
        ]
      },
      {
        name: 'Fitness Trackers',
        slug: 'fitness-trackers',
        items: [
          'Smart Watches',
          'Earbuds'
        ]
      },
      {
        name: 'Gym Essentials',
        slug: 'gym-essentials',
        items: [
          'Resistance Bands',
          'Gym Gloves',
          'Jump Ropes',
          'Gym Belts',
          'Gym Bags',
          'Yoga Mats',
          'Gym Shakers'
        ]
      },
      {
        name: 'Fitness Clothing',
        slug: 'fitness-clothing',
        items: [
          'MB Activewear',
          'T-shirts',
          'Shorts',
          'Joggers'
        ]
      },
      {
        name: 'Gym Supports',
        slug: 'gym-supports',
        items: [
          'Wrist Support',
          'Knee Support',
          'Abdominal Support',
          'Waist Belts'
        ]
      }
    ]
  },
  {
    id: 6,
    name: 'WELLNESS',
    slug: 'wellness',
    subcategories: [
      {
        name: 'Skin Care',
        slug: 'skin-care',
        items: [
          'Cleansers',
          'Skin Therapy',
          'Moisturizer',
          'Toner',
          'Men\'s Grooming',
          'Face Serum',
          'Face Mask',
          'Body Lotion'
        ]
      },
      {
        name: 'Hair Care',
        slug: 'hair-care',
        items: [
          'Hair Serum',
          'Hair Mask',
          'Hair Oils',
          'Speciality Shampoo',
          'Hair Conditioner'
        ]
      },
      {
        name: 'Personal Care',
        slug: 'personal-care',
        items: [
          'Mask',
          'Pain-Relief',
          'Fragrances'
        ]
      },
      {
        name: 'Herbs for Skin Care',
        slug: 'herbs-skin-care',
        items: [
          'Turmeric',
          'Neem',
          'Amla',
          'Aloe Vera'
        ]
      },
      {
        name: 'Herbs for Hair Growth',
        slug: 'herbs-hair-growth',
        items: [
          'Biotin',
          'Niacin',
          'Saw Palmetto',
          'Fenugreek',
          'Brahmi'
        ]
      }
    ]
  }
];

interface MegaMenuProps {
  isMobile?: boolean;
  onClose?: () => void;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ isMobile = false, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set());
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState(baseCategories);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load categories from API first
        const categoriesResponse = await categoryApi.getCategories();
        const productsResponse = await productApi.getAllProducts();
        
        if (categoriesResponse.success && categoriesResponse.data.length > 0) {
          console.log('API Categories:', categoriesResponse.data);
          // Use API categories - serialize properly
          const apiCategories = JSON.parse(JSON.stringify(categoriesResponse.data)).map(cat => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            subcategories: cat.subcategories || [],
            displayOrder: cat.displayOrder,
            isActive: cat.isActive
          }));
          
          // If we have products, enhance categories with product data
          if (productsResponse.success) {
            console.log('Products for matching:', productsResponse.data.length);
            const serializedProducts = JSON.parse(JSON.stringify(productsResponse.data));
            const enhancedCategories = apiCategories.map(cat => {
              const categoryProducts = serializedProducts.filter(p => {
                if (!p) return false;
                const productCategory = String(p.customCategory || p.category || '').trim().toLowerCase();
                const catName = String(cat.name || '').trim().toLowerCase();
                const catSlug = String(cat.slug || '').trim().toLowerCase().replace(/-/g, ' ');
                
                console.log(`Checking product: ${p.name || p.id}`);
                console.log(`- Product category: '${productCategory}'`);
                console.log(`- Menu category name: '${catName}'`);
                console.log(`- Menu category slug: '${catSlug}'`);
                
                if (!productCategory) {
                  console.log(`- No category found for product`);
                  return false;
                }
                
                // Match by exact name, slug, or partial match
                const matches = productCategory === catName || 
                              productCategory === catSlug ||
                              productCategory.includes(catName) ||
                              catName.includes(productCategory) ||
                              productCategory.includes(catSlug) ||
                              catSlug.includes(productCategory);
                
                console.log(`- Category match: ${matches}`);
                return matches;
              });
              
              console.log(`Found ${categoryProducts.length} products for ${cat.name}`);
              
              const updatedSubcategories = cat.subcategories.map(sub => {
                const subProducts = categoryProducts.filter(p => {
                  if (!p) return false;
                  const productSubcategory = String(p.customSubcategory || p.subcategory || '').trim().toLowerCase();
                  const subName = String(sub.name || '').trim().toLowerCase();
                  const subSlug = String(sub.slug || '').trim().toLowerCase().replace(/-/g, ' ');
                  
                  console.log(`  Checking subcategory for product: ${p.name || p.id}`);
                  console.log(`  - Product subcategory: '${productSubcategory}'`);
                  console.log(`  - Menu subcategory name: '${subName}'`);
                  console.log(`  - Menu subcategory slug: '${subSlug}'`);
                  
                  if (!productSubcategory) {
                    console.log('  - No subcategory found for product');
                    return false;
                  }
                  
                  // Match by exact name, slug, or partial match
                  const matches = productSubcategory === subName || 
                                productSubcategory === subSlug ||
                                productSubcategory.includes(subName) ||
                                subName.includes(productSubcategory) ||
                                productSubcategory.includes(subSlug) ||
                                subSlug.includes(productSubcategory);
                  
                  console.log(`  - Subcategory match: ${matches}`);
                  return matches;
                });
                
                console.log(`Found ${subProducts.length} products for ${sub.name}`);
                
                return {
                  ...sub,
                  items: subProducts.length > 0 
                    ? subProducts.map(p => ({ name: p.name, id: p.id, slug: p.slug || p.id }))
                    : []
                };
              });
              
              return {
                ...cat,
                subcategories: updatedSubcategories
              };
            });
            
            setCategories(enhancedCategories);
          } else {
            setCategories(apiCategories);
          }
        } else {
          console.log('No API categories found, using products only');
          // If no API categories, create categories from products
          if (productsResponse.success && productsResponse.data.length > 0) {
            console.log('Creating categories from products');
            const serializedProducts = JSON.parse(JSON.stringify(productsResponse.data));
            const productCategories = new Map();
            
            // Group products by category
            serializedProducts.forEach(product => {
              const categoryName = product.customCategory || product.category || 'Uncategorized';
              const subcategoryName = product.customSubcategory || product.subcategory || 'General';
              
              if (!productCategories.has(categoryName)) {
                productCategories.set(categoryName, {
                  id: categoryName.toLowerCase().replace(/\s+/g, '-'),
                  name: categoryName,
                  slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
                  subcategories: new Map()
                });
              }
              
              const category = productCategories.get(categoryName);
              if (!category.subcategories.has(subcategoryName)) {
                category.subcategories.set(subcategoryName, {
                  name: subcategoryName,
                  slug: subcategoryName.toLowerCase().replace(/\s+/g, '-'),
                  items: []
                });
              }
              
              category.subcategories.get(subcategoryName).items.push({
                name: product.name,
                id: product.id,
                slug: product.slug || product.id
              });
            });
            
            // Convert to array format
            const dynamicCategories = Array.from(productCategories.values()).map(cat => ({
              ...cat,
              subcategories: Array.from(cat.subcategories.values())
            }));
            
            console.log('Created categories from products:', dynamicCategories);
            setCategories(dynamicCategories);
          } else {
            console.log('No products, using base categories');
            setCategories(baseCategories);
          }
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        setCategories(baseCategories);
      }
    };

    loadData();
  }, []);

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const toggleSubcategory = (subcategorySlug: string) => {
    setExpandedSubcategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subcategorySlug)) {
        newSet.delete(subcategorySlug);
      } else {
        newSet.add(subcategorySlug);
      }
      return newSet;
    });
  };

  if (isMobile) {
    const activeCategory = categories.find(cat => cat.slug === selectedCategory) || categories[0];
    
    return (
      <div className="font-sans bg-white">
        <div className="flex h-[75vh]">
          <div className="w-2/5 bg-gray-50">
            <div className="overflow-y-auto h-full">
              {categories.map((category) => {
                const isSelected = selectedCategory === category.slug || (!selectedCategory && category === categories[0]);
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.slug)}
                    className={`w-full text-left px-4 py-4 text-sm transition-colors ${
                      isSelected 
                        ? 'bg-[#F9AD45] text-white font-medium' 
                        : 'text-gray-700 hover:bg-gray-100 font-normal'
                    }`}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 bg-white">
            <div className="overflow-y-auto h-full p-4">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-[#F9AD45]">
                  {activeCategory.name}
                </h3>
              </div>

              <div className="space-y-6">
                {activeCategory.subcategories?.map((sub) => {
                  const isSubExpanded = expandedSubcategories.has(sub.slug);
                  
                  return (
                    <div key={sub.slug}>
                      <div className="flex items-center justify-between mb-3">
                        <Link
                          to={`/category/${activeCategory.slug}/${sub.slug}`}
                          className="text-base font-medium text-gray-800 hover:text-orange-500 transition-colors"
                          onClick={handleLinkClick}
                        >
                          {sub.name}
                        </Link>
                        
                        {sub.items && sub.items.length > 0 && (
                          <button
                            onClick={() => toggleSubcategory(sub.slug)}
                            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label={isSubExpanded ? 'Collapse items' : 'Expand items'}
                          >
                            {isSubExpanded ? (
                              <span className="text-lg font-light">−</span>
                            ) : (
                              <span className="text-lg font-light">+</span>
                            )}
                          </button>
                        )}
                      </div>

                      {isSubExpanded && sub.items && sub.items.length > 0 && (
                        <div className="ml-4 space-y-2 mb-4">
                          {sub.items.map((item, index) => (
                            <Link
                              key={`${sub.slug}-${index}-${typeof item === 'object' ? item.id : item}`}
                              to={typeof item === 'object' ? `/product/${item.slug || item.id}` : `/category/${activeCategory.slug}/${sub.slug}`}
                              className="block text-xs text-gray-500 hover:text-[#F9AD45] py-0.5 transition-colors leading-relaxed"
                              onClick={handleLinkClick}
                            >
                              {typeof item === 'object' ? item.name : item}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeCategory = categories.find(cat => cat.slug === hoveredCategory) || categories[0];
  
  return (
    <div className="w-full max-w-[1400px] bg-white border border-gray-200 shadow-xl rounded-b-lg font-montserrat flex max-h-[70vh] overflow-hidden">
      <div className="w-60 bg-gray-50 border-r border-gray-200">
        {categories.map((category) => (
          <div
            key={category.id}
            onMouseEnter={() => setHoveredCategory(category.slug)}
            className={`px-4 py-3 border-b border-gray-200 cursor-pointer transition-colors ${
              hoveredCategory === category.slug 
                ? 'bg-[#F9AD45] text-white' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <Link
              to={`/category/${category.slug}`}
              className="block text-base font-medium w-full text-left"
              onClick={handleLinkClick}
            >
              {category.name}
              <span className="float-right">›</span>
            </Link>
          </div>
        ))}
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {activeCategory && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
              {activeCategory.name}
            </h3>
            <div className="grid grid-cols-3 gap-6">
              {activeCategory.subcategories?.map((sub) => (
                <div key={sub.slug} className="space-y-2">
                  <Link
                    to={`/category/${activeCategory.slug}/${sub.slug}`}
                    className="block text-base font-semibold text-gray-700 hover:text-[#F9AD45] transition-colors"
                    onClick={handleLinkClick}
                  >
                    {sub.name}
                  </Link>
                  {sub.items && (
                    <div className="space-y-1 max-h-64 overflow-y-auto">
                      {sub.items.map((item) => (
                        <Link
                          key={typeof item === 'object' ? item.id : item}
                          to={typeof item === 'object' ? `/product/${item.slug || item.id}` : `/category/${activeCategory.slug}/${sub.slug}`}
                          className="block text-sm text-gray-600 hover:text-[#F9AD45] py-0.5 transition-colors truncate"
                          onClick={handleLinkClick}
                          title={typeof item === 'object' ? item.name : item}
                        >
                          {typeof item === 'object' ? item.name : item}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MegaMenu;