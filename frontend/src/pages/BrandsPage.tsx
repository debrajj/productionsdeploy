import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, ChevronDown, Filter } from 'lucide-react';
import { productApi, Product } from '@/services/api';

// Static brands list - keeping existing names
const staticBrands = [
  'ALPINO', 'AS-IT-IS', 'AVVATAR', 'AESTHETIC NUTRTION', 'BOLT', 'BPI', 'BEAST LIFE', 'DYMATIZE',
  'FAST AND UP', 'GASPARI', 'GAT', 'GNC', 'GHOST', 'HEALTH FARM', 'INTERNATIONAL PROTEIN', 'ISOPURE',
  'KAGED', 'KEVIN LEVRONE', 'LABRADA', 'MONSTER LAB', 'MUSCLE BLAZE', 'MUSCLETECH', 'MUTANT', 'MYFITNESS',
  'MYFITNESS PEANUT BUTTER', 'NEUHERBS', 'NAKPRO', 'ONE SCIENCE', 'ON (OPTIMUM NUTRITION)', 'POLE NUTRITION',
  'PROSUPPS', 'PINTOLA', 'RONNIE COLEMAN', 'RAW NUTRTION', 'RYSE', 'THE WHOLE TRUTH NUTRITION', 'WELLBEING',
  'XTEND', 'YOGABAR', 'RANBDS', 'APPLIED NUTRTION', 'BSN', 'DENIS JAMES', 'DEXTER JACKSON', 'EXALT',
  'INSANE LABZ', 'MHP', 'MI (MUSCLE IMPACT NUTRITION) 02 BRAND', 'NOW', 'NUTREX', 'NUTRAMARC', 'REDCON',
  'RULE ONE', 'UNIVERSAL', 'ATOM', 'TRUE BASICS', 'CLOMA PHARMA', 'CENTRUM', 'CONDEMNED', 'MUSCLEMEDS', 'ULTIMATE NUTRITION', 'FA ICE HYDRO', 'ANDROPIQUE', 'CUREGARDEN', 'TATA 1MG', 'ACE BLEND', 'NATUREYZ', 'HEALTHYHEY NUTRITION', 'MIDUTY', 'WHATS UP WELLNESS', 'MYODROL', 'CARBAMIDE FORTE', 'BEAUTYWISE', 'FUEL ONE', 'NAKPRO PROTEIN'
];

const BrandsPage: React.FC = () => {
  const [selectedLetter, setSelectedLetter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [brandsWithData, setBrandsWithData] = useState<Array<{name: string, productCount: number, hasProducts: boolean}>>(
    staticBrands.map(brand => ({ name: brand, productCount: 0, hasProducts: false }))
  );
  const [loading, setLoading] = useState(false);

  // Load brands from API
  useEffect(() => {
    const loadBrands = async () => {
      let apiBrandMap = new Map<string, number>();
      let page = 1;
      let hasMore = true;
      
      try {
        console.log('Fetching all products for brands...');
        
        // Fetch all products by paginating through all pages
        while (hasMore) {
          const response = await productApi.getProducts({ page, limit: 100 });
          console.log(`API Response page ${page}:`, response);
          
          if (response.success && response.data) {
            console.log(`Products found on page ${page}:`, response.data.length);
            
            response.data.forEach(product => {
              // Get the EXACT brand name from backend
              let brandName = '';
              if (product.brand === 'other' && product.customBrand) {
                brandName = product.customBrand.trim();
              } else if (product.brand && product.brand !== 'other') {
                brandName = product.brand.trim();
              }
              
              // STRICT validation - only valid brand names
              if (brandName && brandName !== 'other' && brandName !== '' && brandName !== 'unknown') {
                apiBrandMap.set(brandName, (apiBrandMap.get(brandName) || 0) + 1);
              }
            });
            
            // Check if there are more pages
            hasMore = response.pagination?.hasNextPage || false;
            page++;
          } else {
            hasMore = false;
          }
        }
      } catch (error) {
        console.error('Failed to load brands:', error);
      }
      
      console.log('All API brands found:', Array.from(apiBrandMap.keys()));
      console.log('Total unique brands:', apiBrandMap.size);
      
      // Only show brands that actually exist in the backend
      const brandsData: Array<{name: string, productCount: number, hasProducts: boolean}> = [];
      
      // Add API brands (these are the actual brands from backend)
      apiBrandMap.forEach((count, brandName) => {
        brandsData.push({
          name: brandName,
          productCount: count,
          hasProducts: true
        });
      });
      
      // Add static brands only if they don't have products (for display purposes)
      staticBrands.forEach(brand => {
        if (!apiBrandMap.has(brand)) {
          brandsData.push({
            name: brand,
            productCount: 0,
            hasProducts: false
          });
        }
      });
      
      // Sort brands alphabetically
      brandsData.sort((a, b) => a.name.localeCompare(b.name));
      
      console.log('Final brands data:', brandsData.length);
      console.log('Brands with products:', brandsData.filter(b => b.hasProducts).length);
      setBrandsWithData(brandsData);
      setLoading(false);
    };

    loadBrands();
  }, []);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const filteredBrands = useMemo(() => {
    let filtered = brandsWithData;
    if (searchQuery) filtered = filtered.filter(brand => brand.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (selectedLetter !== 'ALL') filtered = filtered.filter(brand => brand.name.charAt(0).toUpperCase() === selectedLetter);
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedLetter, searchQuery, brandsWithData]);

  const getBrandSlug = (brand: string) => {
    // Handle special cases
    if (brand === 'AS-IT-IS') return 'as-it-is';
    return brand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#F9A246] to-orange-600 bg-clip-text text-transparent mb-1">Shop by Brands</h1>
          <p className="text-gray-700">Discover products from your favorite nutrition brands</p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center justify-between bg-gradient-to-r from-[#F9A246] to-orange-500 text-white p-3 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <span className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="font-medium">Filters</span>
              {(searchQuery || selectedLetter !== 'ALL') && (
                <span className="bg-white text-[#F9A246] text-xs px-2 py-1 rounded-full font-semibold">Active</span>
              )}
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Mobile Filters Dropdown */}
        {showMobileFilters && (
          <div className="md:hidden mb-4 bg-white rounded-lg border-2 border-orange-200 shadow-lg p-4">
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9A246] focus:border-[#F9A246]"
                />
                {searchQuery ? (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <X className="h-4 w-4 text-orange-400 hover:text-orange-600" />
                  </button>
                ) : (
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-400 h-4 w-4" />
                )}
              </div>
            </div>
            <div className="grid grid-cols-9 gap-1">
              <button
                onClick={() => setSelectedLetter('ALL')}
                className={`px-2 py-1 text-xs rounded-md font-medium transition-all ${selectedLetter === 'ALL' ? 'bg-gradient-to-r from-[#F9A246] to-orange-500 text-white shadow-md' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}`}
              >
                ALL
              </button>
              {alphabet.map((letter) => (
                <button
                  key={letter}
                  onClick={() => setSelectedLetter(letter)}
                  className={`px-2 py-1 text-xs rounded-md font-medium transition-all ${selectedLetter === letter ? 'bg-gradient-to-r from-[#F9A246] to-orange-500 text-white shadow-md' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}`}
                >
                  {letter}
                </button>
              ))}
            </div>
            {(searchQuery || selectedLetter !== 'ALL') && (
              <button
                onClick={() => { setSearchQuery(''); setSelectedLetter('ALL'); }}
                className="w-full mt-3 px-3 py-2 bg-gradient-to-r from-orange-200 to-orange-300 text-orange-800 rounded-lg text-sm font-medium hover:from-orange-300 hover:to-orange-400 transition-all"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        <div className="flex gap-4">
          {/* Desktop Sidebar - 18% width */}
          <div className="hidden md:block" style={{ width: '18%' }}>
            <div className="bg-white rounded-lg shadow-lg border-2 border-orange-200 p-4 sticky top-8">
              <h2 className="font-bold text-[#F9A246] mb-3 text-sm">Filters</h2>
              
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 pr-8 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9A246] focus:border-[#F9A246] text-sm"
                  />
                  {searchQuery ? (
                    <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <X className="h-3 w-3 text-orange-400 hover:text-orange-600" />
                    </button>
                  ) : (
                    <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-orange-400 h-3 w-3" />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-orange-700 mb-2">Letter</label>
                <div className="grid grid-cols-4 gap-1">
                  <button
                    onClick={() => setSelectedLetter('ALL')}
                    className={`px-1 py-1 text-xs rounded-md font-medium transition-all ${selectedLetter === 'ALL' ? 'bg-gradient-to-r from-[#F9A246] to-orange-500 text-white shadow-md' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}`}
                  >
                    ALL
                  </button>
                  {alphabet.map((letter) => (
                    <button
                      key={letter}
                      onClick={() => setSelectedLetter(letter)}
                      className={`px-1 py-1 text-xs rounded-md font-medium transition-all ${selectedLetter === letter ? 'bg-gradient-to-r from-[#F9A246] to-orange-500 text-white shadow-md' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}`}
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              </div>

              {(searchQuery || selectedLetter !== 'ALL') && (
                <button
                  onClick={() => { setSearchQuery(''); setSelectedLetter('ALL'); }}
                  className="w-full mt-3 px-3 py-2 bg-gradient-to-r from-orange-200 to-orange-300 text-orange-800 rounded-lg text-xs font-medium hover:from-orange-300 hover:to-orange-400 transition-all"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Content - 82% width on desktop, full width on mobile */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-gray-200 h-24 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : filteredBrands.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {filteredBrands.map((brand) => (
                  <Link
                    key={brand.name}
                    to={`/brand/${getBrandSlug(brand.name)}`}
                    className={`bg-white h-24 rounded-lg shadow-md hover:shadow-xl transition-all border-2 ${brand.hasProducts ? 'border-orange-200 hover:border-[#41B75D]' : 'border-gray-200 hover:border-gray-300'} group hover:scale-105 flex flex-col items-center justify-center p-3 relative`}
                  >
                    <h3 className={`font-semibold ${brand.hasProducts ? 'text-gray-800 group-hover:text-[#41B75D]' : 'text-gray-500'} transition-colors text-center text-sm leading-tight`}>
                      {brand.name}
                    </h3>
                    {brand.hasProducts && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-white rounded-lg border-2 border-orange-200 shadow-lg">
                <p className="text-orange-600 mb-3 font-medium">No brands found</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedLetter('ALL'); }}
                  className="px-4 py-2 bg-gradient-to-r from-[#F9A246] to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 text-sm font-medium shadow-md hover:shadow-lg transition-all"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandsPage;