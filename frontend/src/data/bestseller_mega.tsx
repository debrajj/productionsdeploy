import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { productApi } from '@/services/api';

interface MegaMenuProps {
  isMobile?: boolean;
  onClose?: () => void;
}

const BestsellerMegaMenu: React.FC<MegaMenuProps> = ({ isMobile = false, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set());
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBestsellers = async () => {
      try {
        setLoading(true);
        const response = await productApi.getProducts({ limit: 200 });
        
        if (response.success) {
          // Filter bestseller products and exclude specific IDs
          const bestsellerProducts = response.data.filter(product => 
            (product.bestSeller || product.featured || product.trending || (product.rating && product.rating >= 4.0)) &&
            product.id !== '688C53A564607D0680FD2296' &&
            product.id !== '688C554264607D0680FD22DE'
          );

          // Group products by category
          const categoryMap = new Map();
          bestsellerProducts.forEach(product => {
            const catName = product.category?.toUpperCase();
            if (!catName || catName === 'OTHER' || catName === '688C53A564607D0680FD2296' || catName === '688C554264607D0680FD22DE') return;
            const subName = product.subcategory || 'General';
            
            if (!categoryMap.has(catName)) {
              categoryMap.set(catName, {
                id: catName.toLowerCase().replace(/\s+/g, '-'),
                name: catName,
                slug: catName.toLowerCase().replace(/\s+/g, '-'),
                subcategories: new Map()
              });
            }
            
            const category = categoryMap.get(catName);
            if (!category.subcategories.has(subName)) {
              category.subcategories.set(subName, {
                name: subName,
                slug: subName.toLowerCase().replace(/\s+/g, '-'),
                items: []
              });
            }
            
            category.subcategories.get(subName).items.push({ name: product.name, id: product.id, slug: product.slug || product.id });
          });

          // Convert to array format and limit items to 6 per subcategory
          const categoriesArray = Array.from(categoryMap.values()).map(cat => ({
            ...cat,
            subcategories: Array.from(cat.subcategories.values()).map(sub => ({
              ...sub,
              items: sub.items.slice(0, 6)
            }))
          }));

          setCategories(categoriesArray);
        }
      } catch (error) {
        console.error('Failed to load bestsellers:', error);
        // Fallback categories
        setCategories([
          {
            id: 'sports-nutrition',
            name: 'SPORTS NUTRITION',
            slug: 'sports-nutrition',
            subcategories: [
              { name: 'Proteins', slug: 'proteins', items: ['Whey Protein Pro', 'Casein Elite', 'Plant Protein', 'Isolate Premium', 'Protein Blend', 'Recovery Protein'] },
              { name: 'Pre/Post Workout', slug: 'pre-post-workout', items: ['Pre-Workout Boost', 'Creatine Power', 'BCAA Energy', 'Post Recovery', 'Nitric Oxide', 'Beta Alanine'] }
            ]
          },
          {
            id: 'vitamins-supplements',
            name: 'VITAMINS & SUPPLEMENTS',
            slug: 'vitamins-supplements',
            subcategories: [
              { name: 'Multivitamins', slug: 'multivitamins', items: ['Daily Multi Men', 'Daily Multi Women', 'Senior Formula', 'Active Multi', 'Complete Multi', 'Premium Multi'] },
              { name: 'Omega Fatty Acids', slug: 'omega-fatty-acids', items: ['Fish Oil 1000mg', 'Omega-3 Triple', 'Krill Oil', 'Flaxseed Oil', 'Cod Liver Oil', 'Algae Omega'] }
            ]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadBestsellers();
  }, []);

  const handleLinkClick = () => {
    if (onClose) onClose();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F9A246]"></div>
        <span className="ml-3 text-gray-600">Loading bestsellers...</span>
      </div>
    );
  }

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
                        ? 'bg-[#F9A246] text-white font-medium' 
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
                <h3 className="text-lg font-medium text-[#F9A246]">
                  {activeCategory?.name}
                </h3>
              </div>

              <div className="space-y-6">
                {activeCategory?.subcategories?.map((sub) => {
                  const isSubExpanded = expandedSubcategories.has(sub.slug);
                  
                  return (
                    <div key={sub.slug}>
                      <div className="flex items-center justify-between mb-3">
                        <Link
                          to={`/category/${activeCategory.slug}/${sub.slug}`}
                          className="text-base font-medium text-gray-800 hover:text-[#F9A246] transition-colors"
                          onClick={handleLinkClick}
                        >
                          {sub.name}
                        </Link>
                        
                        <button
                          onClick={() => toggleSubcategory(sub.slug)}
                          className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {isSubExpanded ? '−' : '+'}
                        </button>
                      </div>

                      {isSubExpanded && (
                        <div className="ml-4 space-y-2 mb-4">
                          {sub.items?.map((item, index) => (
                            <Link
                              key={`${sub.slug}-${index}`}
                              to={typeof item === 'object' ? `/product/${item.id}` : `/category/${activeCategory.slug}/${sub.slug}`}
                              className="block text-xs text-gray-500 hover:text-[#F9A246] py-0.5 transition-colors leading-relaxed"
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

  // Desktop Version
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
                ? 'bg-[#F9A246] text-white' 
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
              {activeCategory.name} - Bestsellers
            </h3>
            <div className="grid grid-cols-3 gap-6">
              {activeCategory.subcategories?.map((sub) => (
                <div key={sub.slug} className="space-y-2">
                  <Link
                    to={`/category/${activeCategory.slug}/${sub.slug}`}
                    className="block text-base font-semibold text-gray-700 hover:text-[#F9A246] transition-colors"
                    onClick={handleLinkClick}
                  >
                    {sub.name}
                  </Link>
                  <div className="space-y-1">
                    {sub.items?.map((item, index) => (
                      <Link
                        key={index}
                        to={typeof item === 'object' ? `/product/${item.id}` : `/category/${activeCategory.slug}/${sub.slug}`}
                        className="block text-sm text-gray-600 hover:text-[#F9A246] py-0.5 transition-colors truncate"
                        onClick={handleLinkClick}
                        title={typeof item === 'object' ? item.name : item}
                      >
                        {typeof item === 'object' ? item.name : item}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BestsellerMegaMenu;