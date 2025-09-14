import React, { useState, useEffect } from 'react';
import { productApi, Product } from '@/services/api';
import { useCart } from '@/context/CartContext';
import { useNavigate } from 'react-router-dom';


const ApiProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    brand: '',
    featured: false,
    trending: false,
    onSale: false,
  });
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productApi.getProducts({
        ...filters,
        search: filters.search || undefined,
        category: filters.category || undefined,
        brand: filters.brand || undefined,
        featured: filters.featured || undefined,
        trending: filters.trending || undefined,
        onSale: filters.onSale || undefined,
      });
      
      if (response.success) {
        setProducts(response.data);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      setError('Error connecting to API: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">API Products</h1>
          
          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F9A246]"
              />
              
              <input
                type="text"
                placeholder="Category"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F9A246]"
              />
              
              <input
                type="text"
                placeholder="Brand"
                value={filters.brand}
                onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F9A246]"
              />
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.featured}
                  onChange={(e) => setFilters({ ...filters, featured: e.target.checked })}
                  className="mr-2"
                />
                Featured
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.trending}
                  onChange={(e) => setFilters({ ...filters, trending: e.target.checked })}
                  className="mr-2"
                />
                Trending
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.onSale}
                  onChange={(e) => setFilters({ ...filters, onSale: e.target.checked })}
                  className="mr-2"
                />
                On Sale
              </label>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#F9A246] mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">{error}</p>
            <button
              onClick={loadProducts}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            <div className="mb-4">
              <p className="text-gray-600">Found {products.length} products</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  <div
                    className="aspect-square bg-gray-100 cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-4">
                    <h3
                      className="font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-[#F9A246]"
                      onClick={() => handleProductClick(product)}
                    >
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center mb-2">
                      <span className="text-sm text-gray-500 mr-2">
                        {product.brand}
                      </span>
                      {product.featured && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1">
                          Featured
                        </span>
                      )}
                      {product.trending && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-1">
                          Trending
                        </span>
                      )}
                      {product.onSale && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                          Sale
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center mb-2">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    
                    {product.rating && (
                      <div className="flex items-center mb-3">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < Math.floor(product.rating!) ? 'text-yellow-400' : 'text-gray-300'}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 ml-1">
                          ({product.reviews || 0})
                        </span>
                      </div>
                    )}
                    
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-[#F9A246] text-white py-2 px-4 rounded-md hover:bg-[#e8933a] transition-colors duration-300"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No products found matching your criteria.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ApiProducts;