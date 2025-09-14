import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { productApi, Product } from '@/services/api';

const BrandPage: React.FC = () => {
  const { brandSlug } = useParams<{ brandSlug: string }>();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [brandProducts, setBrandProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [brandName, setBrandName] = useState('');

  useEffect(() => {
    const loadBrandProducts = async () => {
      if (!brandSlug) return;
      
      try {
        setLoading(true);
        // Decode brand name to match exact backend format
        let decodedBrandName = brandSlug.replace(/-/g, ' ');
        
        // Handle special cases like AS-IT-IS
        if (brandSlug === 'as-it-is') {
          decodedBrandName = 'AS-IT-IS';
        }
        setBrandName(decodedBrandName);
        
        let allProducts: Product[] = [];
        let page = 1;
        let hasMore = true;
        
        // Fetch all products by paginating through all pages
        while (hasMore) {
          const response = await productApi.getProducts({ page, limit: 100 });
          
          if (response.success && response.data) {
            allProducts = [...allProducts, ...response.data];
            hasMore = response.pagination?.hasNextPage || false;
            page++;
          } else {
            hasMore = false;
          }
        }
        
        console.log(`Total products fetched: ${allProducts.length}`);
        
        // Filter products by brand name - STRICT EXACT MATCH ONLY
        const filteredProducts = allProducts.filter(product => {
          const productBrand = product.brand === 'other' && product.customBrand 
            ? product.customBrand.trim()
            : (product.brand || '').trim();
          
          // STRICT exact match (case insensitive)
          return productBrand.toLowerCase() === decodedBrandName.toLowerCase();
        });
        
        console.log(`Products found for brand "${decodedBrandName}": ${filteredProducts.length}`);
        setBrandProducts(filteredProducts);

      } catch (error) {
        console.error('Failed to load brand products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBrandProducts();
  }, [brandSlug]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    }, 1);
  };

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  if (!brandName) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Brand Not Found</h1>
          <Link to="/brands" className="text-[#F9A246] hover:underline">
            Back to Brands
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <nav className="text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-[#F9A246]">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/brands" className="hover:text-[#F9A246]">Brands</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{brandName}</span>
          </nav>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{brandName}</h1>
          <p className="text-gray-600">
            {brandProducts.length} product{brandProducts.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
            ))}
          </div>
        ) : brandProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {brandProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-[#F9A246] group"
              >
                <div onClick={() => handleProductClick(product)} className="cursor-pointer">
                  <div className="aspect-square bg-gray-50 overflow-hidden rounded-t-lg">
                    <img
                      src={`${product.image}?w=400&h=400&fit=crop`}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
                
                <div className="p-4">
                  <div onClick={() => handleProductClick(product)} className="cursor-pointer">
                    <h3 className="font-medium text-gray-900 group-hover:text-[#F9A246] transition-colors text-sm leading-tight mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-xs ${
                              i < (product.rating || 0) ? 'text-[#F9A246]' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">({product.reviews || 0})</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-[#F9A246] hover:bg-[#e8933a] text-white font-medium text-sm py-2 rounded-lg transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mb-4">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Products Available</h2>
              <p className="text-gray-600 mb-6">
                We don't have any products from {brandName} at the moment.
              </p>
              <Link
                to="/brands"
                className="inline-flex items-center px-4 py-2 bg-[#F9A246] text-white rounded-lg hover:bg-[#e8933a] transition-colors"
              >
                Browse Other Brands
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandPage;