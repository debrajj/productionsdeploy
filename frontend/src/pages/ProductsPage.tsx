import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productApi, categoryApi, brandApi } from '../services/api';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsRes, categoriesRes, brandsRes] = await Promise.all([
          productApi.getProducts(),
          categoryApi.getCategories(),
          brandApi.getBrands()
        ]);

        if (productsRes.success) setProducts(productsRes.data);
        if (categoriesRes.success) setCategories(categoriesRes.data);
        if (brandsRes.success) setBrands(brandsRes.data);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredProducts = products.filter(product => {
    const categoryMatch = !selectedCategory || 
      (product.customCategory || product.category) === selectedCategory;
    const brandMatch = !selectedBrand || 
      (product.customBrand || product.brand) === selectedBrand;
    return categoryMatch && brandMatch;
  });

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      
      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4">
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>

        <select 
          value={selectedBrand} 
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Brands</option>
          {brands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <div 
            key={product.id} 
            className="border rounded-lg p-4 hover:shadow-lg cursor-pointer"
            onClick={() => navigate(`/product/${product.slug || product.id}`)}
          >
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h3 className="font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-2">
              {product.customBrand || product.brand}
            </p>
            <p className="text-gray-600 text-sm mb-2">
              {product.customCategory || product.category}
            </p>
            <p className="font-bold text-lg">₹{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;