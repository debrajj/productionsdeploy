import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { productApi, Product } from '../services/api';
import { Search, Filter, Grid, List } from 'lucide-react';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query);
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      const response = await productApi.searchProducts(searchTerm, 50);
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const filteredProducts = products.filter(product => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.brand && product.brand !== filters.brand) return false;
    if (filters.minPrice && product.price < parseFloat(filters.minPrice)) return false;
    if (filters.maxPrice && product.price > parseFloat(filters.maxPrice)) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return (b.rating || 0) - (a.rating || 0);
      case 'name': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Search
          </button>
        </form>
        
        {query && (
          <h1 className="text-2xl font-bold text-gray-900">
            Search results for "{query}" ({sortedProducts.length} products)
          </h1>
        )}
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <select
          value={filters.category}
          onChange={(e) => setFilters({...filters, category: e.target.value})}
          className="px-3 py-2 border rounded"
        >
          <option value="">All Categories</option>
          {Array.from(new Set(products.map(p => p.category))).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={filters.brand}
          onChange={(e) => setFilters({...filters, brand: e.target.value})}
          className="px-3 py-2 border rounded"
        >
          <option value="">All Brands</option>
          {Array.from(new Set(products.map(p => p.brand))).map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
          className="px-3 py-2 border rounded w-24"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
          className="px-3 py-2 border rounded w-24"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="name">Sort by Name</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-white'}`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-white'}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4">Searching...</p>
        </div>
      ) : sortedProducts.length > 0 ? (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6" 
          : "space-y-4"
        }>
          {sortedProducts.map(product => (
            <div
              key={product.id}
              onClick={() => navigate(`/product/${product.slug || product.id}`)}
              className={`cursor-pointer border rounded-lg hover:shadow-lg transition-shadow ${
                viewMode === 'list' ? 'flex p-4' : 'p-4'
              }`}
            >
              <img
                src={product.image}
                alt={product.name}
                className={viewMode === 'list' 
                  ? "w-24 h-24 object-cover rounded mr-4" 
                  : "w-full h-48 object-cover rounded mb-4"
                }
              />
              <div className="flex-1">
                <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{product.brand}</p>
                <p className="text-gray-600 text-sm mb-2">{product.category}</p>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-lg text-orange-600">₹{product.price}</p>
                  {product.rating && (
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm ml-1">{product.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-8">
          <Search className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your search terms or filters</p>
        </div>
      ) : null}
    </div>
  );
};

export default SearchPage;