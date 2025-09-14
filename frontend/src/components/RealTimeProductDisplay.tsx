import React, { useState, useEffect } from 'react';
import { megaMenuService } from '@/services/megaMenuService';

const RealTimeProductDisplay: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await megaMenuService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    
    // Auto-refresh every 10 seconds for real-time updates
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F9AD45] mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading real-time product data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Real-Time Product Categories</h2>
      
      {categories.map((category) => (
        <div key={category.id} className="mb-8">
          <h3 className="text-xl font-semibold text-[#F9AD45] mb-4">{category.name}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.subcategories?.map((sub: any) => (
              <div key={sub.slug} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-3">{sub.name}</h4>
                
                {sub.products && sub.products.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm text-green-600 font-medium">
                      {sub.products.length} products available
                    </p>
                    {sub.products.slice(0, 8).map((product: any) => (
                      <div key={product.id} className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-gray-500">₹{product.price}</div>
                      </div>
                    ))}
                    {sub.products.length > 8 && (
                      <p className="text-xs text-[#F9AD45]">
                        +{sub.products.length - 8} more products
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No products yet</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RealTimeProductDisplay;