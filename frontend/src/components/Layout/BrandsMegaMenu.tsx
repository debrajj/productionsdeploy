import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productApi, brandApi, Product } from '@/services/api';

interface BrandsMegaMenuProps {
  isMobile?: boolean;
  onClose?: () => void;
}

// Popular brands to always show in mega menu
const popularBrands = [
  'ON (OPTIMUM NUTRITION)', 'MUSCLETECH', 'DYMATIZE', 'BSN', 'GASPARI', 'GAT',
  'MUSCLE BLAZE', 'AS-IT-IS', 'GHOST', 'KAGED', 'LABRADA', 'MUTANT'
];

const BrandsMegaMenu: React.FC<BrandsMegaMenuProps> = ({ isMobile = false, onClose }) => {
  const [brandsWithData, setBrandsWithData] = useState<Array<{name: string, productCount: number, slug: string}>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const loadBrands = async () => {
      if (!isMounted) return;
      
      let apiBrandMap = new Map<string, number>();
      let apiBrands: string[] = [];
      
      try {
        // Get brands from dedicated API
        const brandsResponse = await brandApi.getBrands();
        if (brandsResponse.success) {
          apiBrands = brandsResponse.data;
        }
        
        // Get product counts
        const response = await productApi.getProducts({ limit: 1000 });
        if (response.success && isMounted) {
          response.data.forEach(product => {
            const brandName = (product.customBrand || product.brand || product.brandName || product.manufacturer || '').toUpperCase().trim();
            if (brandName && brandName !== 'OTHER' && brandName !== '' && brandName !== 'UNKNOWN') {
              apiBrandMap.set(brandName, (apiBrandMap.get(brandName) || 0) + 1);
            }
          });
          
          // Combine popular brands with API brands
          const allBrands = [...new Set([...popularBrands, ...apiBrands, ...Array.from(apiBrandMap.keys())])]
            .map(name => {
              const upperName = name.toUpperCase();
              const productCount = apiBrandMap.get(upperName) || 0;
              console.log(`Brand: ${name}, Count: ${productCount}`);
              return {
                name,
                productCount,
                slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
              };
            })
            .sort((a, b) => {
              // Prioritize popular brands, then by product count
              const aIsPopular = popularBrands.includes(a.name);
              const bIsPopular = popularBrands.includes(b.name);
              if (aIsPopular && !bIsPopular) return -1;
              if (!aIsPopular && bIsPopular) return 1;
              return b.productCount - a.productCount;
            });
          
          console.log('All brands with counts:', allBrands.slice(0, 5));
          
          setBrandsWithData(allBrands);
        }
      } catch (error) {
        console.error('Failed to load brands:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadBrands();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="grid grid-cols-2 gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="bg-white p-4">
        <h3 className="text-lg font-semibold text-[#F9A246] mb-4">Popular Brands</h3>
        <div className="grid grid-cols-2 gap-2">
          {brandsWithData.slice(0, 8).map((brand) => (
            <Link
              key={brand.name}
              to={`/brand/${brand.slug}`}
              className="block p-2 text-sm text-gray-700 hover:text-[#F9A246] hover:bg-gray-50 rounded-lg transition-colors relative"
              onClick={handleLinkClick}
            >
              <div className="font-medium">{brand.name}</div>
              {brand.productCount > 0 && (
                <div className="absolute top-1 right-1 w-3 h-3 bg-green-500 rounded-full border border-white shadow-sm"></div>
              )}
            </Link>
          ))}
        </div>
        <Link
          to="/brands"
          className="block mt-4 text-center text-sm text-[#F9A246] hover:text-orange-600 font-medium"
          onClick={handleLinkClick}
        >
          View All Brands →
        </Link>
      </div>
    );
  }

  // Desktop Version
  return (
    <div className="w-full max-w-[600px] bg-white border border-gray-200 shadow-xl rounded-b-lg p-6">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Popular Brands</h3>
        <p className="text-sm text-gray-600">Discover products from top nutrition brands</p>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        {brandsWithData.slice(0, 12).map((brand) => (
          <Link
            key={brand.name}
            to={`/brand/${brand.slug}`}
            className="block p-3 border border-gray-200 rounded-lg hover:border-[#F9A246] hover:shadow-md transition-all group relative"
            onClick={handleLinkClick}
          >
            <div className="font-medium text-gray-800 group-hover:text-[#F9A246] transition-colors">
              {brand.name}
            </div>
            {brand.productCount > 0 && (
              <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full border border-white shadow-sm"></div>
            )}
          </Link>
        ))}
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <Link
          to="/brands"
          className="inline-flex items-center text-[#F9A246] hover:text-orange-600 font-medium text-sm transition-colors"
          onClick={handleLinkClick}
        >
          View All {brandsWithData.length} Brands →
        </Link>
      </div>
    </div>
  );
};

export default BrandsMegaMenu;