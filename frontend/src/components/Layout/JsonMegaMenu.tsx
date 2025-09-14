import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import homeProductData from '@/data/homeproduct.json';

interface JsonMegaMenuProps {
  isMobile?: boolean;
  onClose?: () => void;
}

const JsonMegaMenu: React.FC<JsonMegaMenuProps> = ({ isMobile = false, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const categories = homeProductData.categories.map(cat => {
    const categoryProducts = homeProductData.products.filter(p => p.category === cat.name);
    
    const updatedSubcategories = cat.subcategories.map(sub => {
      const subProducts = categoryProducts.filter(p => 
        p.subcategory?.toLowerCase() === sub.name.toLowerCase()
      );
      
      return {
        ...sub,
        items: categoryProducts.map(p => ({ name: p.name, id: p.id.toString() }))
      };
    });
    
    return { ...cat, subcategories: updatedSubcategories };
  });

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  if (isMobile) {
    const activeCategory = categories.find(cat => cat.slug === selectedCategory) || categories[0];
    
    return (
      <div className="font-sans bg-white">
        <div className="flex h-[75vh]">
          <div className="w-2/5 bg-gray-50">
            <div className="overflow-y-auto h-full">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`w-full text-left px-4 py-4 text-sm transition-colors ${
                    selectedCategory === category.slug || (!selectedCategory && category === categories[0])
                      ? 'bg-[#F9AD45] text-white font-medium' 
                      : 'text-gray-700 hover:bg-gray-100 font-normal'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-white">
            <div className="overflow-y-auto h-full p-4">
              <h3 className="text-lg font-medium text-[#F9AD45] mb-6">
                {activeCategory.name}
              </h3>

              <div className="space-y-6">
                {activeCategory.subcategories.map((sub) => (
                  <div key={sub.slug}>
                    <Link
                      to={`/category/${activeCategory.slug}/${sub.slug}`}
                      className="text-base font-medium text-gray-800 hover:text-orange-500 transition-colors block mb-3"
                      onClick={handleLinkClick}
                    >
                      {sub.name}
                    </Link>
                    
                    {sub.items && sub.items.length > 0 && (
                      <div className="ml-4 space-y-2">
                        {sub.items.map((item, index) => (
                          <Link
                            key={typeof item === 'object' ? item.id : index}
                            to={typeof item === 'object' ? `/product/${item.id}` : `/category/${activeCategory.slug}/${sub.slug}`}
                            className="block text-xs text-gray-500 hover:text-[#F9AD45] py-0.5 transition-colors"
                            onClick={handleLinkClick}
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
              {activeCategory.subcategories.map((sub) => (
                <div key={sub.slug} className="space-y-2">
                  <Link
                    to={`/category/${activeCategory.slug}/${sub.slug}`}
                    className="block text-base font-semibold text-gray-700 hover:text-[#F9AD45] transition-colors"
                    onClick={handleLinkClick}
                  >
                    {sub.name}
                  </Link>
                  {sub.items && (
                    <div className="space-y-1">
                      {sub.items.map((item, index) => (
                        <Link
                          key={typeof item === 'object' ? item.id : index}
                          to={typeof item === 'object' ? `/product/${item.id}` : `/category/${activeCategory.slug}/${sub.slug}`}
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

export default JsonMegaMenu;