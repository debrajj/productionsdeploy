import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

// New data structure based on the Word document
const brandCategories = [
  {
    id: 1,
    name: 'SPORTS NUTRITION',
    slug: 'sports-nutrition',
    brands: [
      'Muscleblaze',
      'TrueBasics',
      'Fuel One',
      'Optimum Nutrition',
      'Ultimate Nutrition',
      'MuscleTech',
      'MyProtein',
      'Isopure',
      'Dymatize',
      'One Science',
      'GNC',
      'AS-IT-IS Nutrition',
      'Labrada',
      'Atom',
      'Nakpro',
      'Cloma Pharma',
      'Condemned',
      'Musclemeds',
      'Universal',
      'Fa Ice Hydro',
      'ANDROPIQUE',
      'Fuel One',
      'True Basics',
      'Nakpro Protein',
      'Ace Blend',
      'Myodrol'
    ]
  },
  {
    id: 2,
    name: 'VITAMINS & SUPPLEMENTS',
    slug: 'vitamins-supplements',
    brands: [
      'Healthkart HK Vitals',
      'TrueBasics',
      'GNC',
      'NOW',
      'INLIFE',
      'Natures Velvet',
      'NutraFirst',
      'Plix Olena',
      'HealthyHey Nutrition',
      'Centrum',
      'CureGarden',
      'Tata 1mg',
      'Natureyz',
      'Miduty',
      'Whats Up Wellness',
      'Carbamide Forte',
      'Beautywise'
    ]
  },
  {
    id: 3,
    name: 'HEALTH FOOD AND DRINKS',
    slug: 'health-food-drinks',
    brands: [
      'Myfitness',
      'MuscleBlaze',
      'Healthkart HK Vitals',
      'Yoga Bar',
      'Gritzo',
      'Amway'
    ]
  },
  {
    id: 4,
    name: 'FITNESS',
    slug: 'fitness',
    brands: [
      'Noise',
      'MuscleXP',
      'GHC',
      'Biofit'
    ]
  },
  {
    id: 5,
    name: 'WELLNESS',
    slug: 'wellness',
    brands: [
      'NutraFirst',
      'Amway',
      'Man Arden',
      'INLIFE'
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
    const activeCategory = brandCategories.find(cat => cat.slug === selectedCategory) || brandCategories[0];
    
    return (
      <div className="font-sans bg-white">
        {/* Clean HealthKart Style Layout */}
        <div className="flex h-[75vh]">
          {/* Left Side - Categories */}
          <div className="w-2/5 bg-gray-50">
            <div className="overflow-y-auto h-full">
              {brandCategories.map((category) => {
                const isSelected = selectedCategory === category.slug || (!selectedCategory && category === brandCategories[0]);
                
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

          {/* Right Side - Brands */}
          <div className="flex-1 bg-white">
            <div className="overflow-y-auto h-full p-4">
              {/* Category Title */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-[#F9AD45]">
                  {activeCategory.name}
                </h3>
              </div>

              {/* Brands List */}
              <div className="space-y-2">
                {activeCategory.brands.map((brand) => (
                  <Link
                    key={brand}
                    to={`/brand/${brand.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block text-sm text-gray-600 hover:text-[#F9AD45] py-2 transition-colors border-b border-gray-100"
                    onClick={handleLinkClick}
                  >
                    {brand}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Version - HealthKart Style
  const activeCategory = brandCategories.find(cat => cat.slug === hoveredCategory) || brandCategories[0];
  
  return (
    <div className="w-full max-w-[1200px] bg-white border border-gray-200 shadow-xl rounded-b-lg font-montserrat flex max-h-[70vh] overflow-hidden">
      {/* Left Sidebar - Categories */}
      <div className="w-60 bg-gray-50 border-r border-gray-200">
        {brandCategories.map((category) => (
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

      {/* Right Content - Brands */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeCategory && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
              {activeCategory.name}
            </h3>
            <div className="grid grid-cols-3 gap-6">
              {activeCategory.brands.map((brand) => (
                <div key={brand} className="space-y-1">
                  <Link
                    to={`/brand/${brand.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block text-base font-medium text-gray-700 hover:text-[#F9AD45] transition-colors py-1"
                    onClick={handleLinkClick}
                  >
                    {brand}
                  </Link>
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