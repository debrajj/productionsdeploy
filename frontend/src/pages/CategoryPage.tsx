import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { productApi, categoryApi, Product } from "@/services/api";



// Star Rating Component
const StarRating: React.FC<{
  rating: number;
  size?: number;
  color?: string;
  emptyColor?: string;
}> = ({ rating, size = 16, color = "#F9A245", emptyColor = "#D1D5DB" }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`${
            star <= rating
              ? `text-[${color}] fill-[${color}]`
              : `text-[${emptyColor}]`
          }`}
        />
      ))}
    </div>
  );
};

const CategoryPage: React.FC = () => {
  const { categorySlug, subcategorySlug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<any>(null);
  const [currentSubcategory, setCurrentSubcategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState('default');
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load categories from API
        const categoriesResponse = await categoryApi.getCategories();
        let apiCategories = [];
        
        if (categoriesResponse.success) {
          apiCategories = categoriesResponse.data;
          setCategories(apiCategories);
        }
        
        // Find current category
        const category = apiCategories.find((cat) => cat.slug === categorySlug);
        setCurrentCategory(category);

        // First try to get all products
        const allProductsResponse = await productApi.getProducts({ limit: 200 });
        let allProducts = [];
        
        if (allProductsResponse.success) {
          allProducts = allProductsResponse.data;
          
          // Filter products based on category/subcategory
          let filtered = allProducts;
          
          if (category) {
            const subcategory = subcategorySlug
              ? category.subcategories?.find((sub) => sub.slug === subcategorySlug)
              : null;
            setCurrentSubcategory(subcategory);
            
            // Filter by category name
            filtered = allProducts.filter(product => 
              product.category?.toLowerCase() === category.name?.toLowerCase()
            );
            
            // Further filter by subcategory if specified
            if (subcategory) {
              filtered = filtered.filter(product => 
                product.subcategory?.toLowerCase() === subcategory.name?.toLowerCase()
              );
            }
          } else {
            // Fallback: try to match by URL slugs
            const categoryName = categorySlug?.replace(/-/g, ' ');
            const subcategoryName = subcategorySlug?.replace(/-/g, ' ');
            
            filtered = allProducts.filter(product => {
              const categoryMatch = !categoryName || 
                product.category?.toLowerCase().includes(categoryName.toLowerCase()) ||
                product.category?.toLowerCase().replace(/\s+/g, '-') === categorySlug;
              
              const subcategoryMatch = !subcategoryName || 
                product.subcategory?.toLowerCase().includes(subcategoryName.toLowerCase()) ||
                product.subcategory?.toLowerCase().replace(/\s+/g, '-') === subcategorySlug;
              
              return categoryMatch && subcategoryMatch;
            });
          }
          
          setAllProducts(filtered);
          setFilteredProducts(filtered);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [categorySlug, subcategorySlug]);

  // Sort products when sortBy changes
  useEffect(() => {
    let sorted = [...allProducts];
    
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Keep original order
        break;
    }
    
    setFilteredProducts(sorted);
  }, [sortBy, allProducts]);

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.slug}`);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      },
      1
    );
  };

  // Always show products even if category not found in API
  const displayCategory = currentCategory || { name: categorySlug?.replace(/-/g, ' ').toUpperCase(), slug: categorySlug };
  const displaySubcategory = currentSubcategory || (subcategorySlug ? { name: subcategorySlug.replace(/-/g, ' ').toUpperCase(), slug: subcategorySlug } : null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600">
          <Link to="/" className="hover:text-[#F9A245] capitalize">
            Home
          </Link>
          <span>/</span>
          <Link
            to={`/category/${displayCategory.slug}`}
            className="hover:text-[#F9A245] capitalize"
          >
            {displayCategory.name}
          </Link>
          {displaySubcategory && (
            <>
              <span>/</span>
              <span className="text-gray-900 font-medium capitalize">
                {displaySubcategory.name}
              </span>
            </>
          )}
        </div>
      </nav>

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-2xl lg:text-3xl text-gray-900 mb-1">
              {displaySubcategory ? displaySubcategory.name : displayCategory.name}
            </h1>
            <p className="text-gray-600 text-sm">
              {filteredProducts.length} products found
            </p>
          </div>
          
          {/* Sort Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F9A245] focus:border-transparent"
            >
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Subcategories (if viewing main category) */}
      {!displaySubcategory && currentCategory?.subcategories && (
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-3">Browse by Subcategory</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {currentCategory.subcategories.map((subcategory: any) => (
              <Link
                key={subcategory.slug}
                to={`/category/${displayCategory.slug}/${subcategory.slug}`}
                className="p-3 border border-gray-200 rounded-lg hover:border-[#F9A245] hover:shadow-md transition-all"
              >
                <h3 className="font-medium text-gray-900 text-sm">
                  {subcategory.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {
                    filteredProducts.filter(
                      (p) => p.subcategorySlug === subcategory.slug
                    ).length
                  }{" "}
                  products
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#F9A246] mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
            >
              {/* Product Image */}
              <div className="aspect-square bg-gray-50 overflow-hidden relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform cursor-pointer"
                  onClick={() => handleProductClick(product)}
                />
                {product.onSale && (
                  <div className="absolute top-2 left-2 bg-[#F9A246] text-white text-xs px-2 py-1 rounded">
                    SALE
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-2">
                <h3
                  className="font-medium text-lg text-gray-900 line-clamp-2 group-hover:text-[#F9A245] transition-colors cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  {product.name}
                </h3>

                <div className="flex items-center space-x-1">
                  <StarRating
                    rating={product.rating}
                    size={14}
                    color="#F9A245"
                    emptyColor="#D1D5DB"
                  />
                  <span className="text-xs text-gray-500">
                    ({product.reviews})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-xl text-gray-900">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="p-2 bg-[#F9A245] text-white rounded-lg hover:bg-[#e8913d] transition-colors"
                  >
                    <ShoppingCart size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="font-semibold text-xl text-gray-900 mb-2">
            No Products Found
          </h2>
          <p className="text-gray-600 mb-4">
            We don't have any products in this category yet.
          </p>
          <Link to="/">
            <button className="bg-[#F9A245] text-white px-6 py-2 rounded-lg hover:bg-[#e8913d] transition-colors">
              Browse All Products
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
