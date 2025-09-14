import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useApiData } from '../hooks/useApiData'
import { Product } from '../services/api'

const ProductsFromAPI: React.FC = () => {
  const { products, categories, loading, error } = useApiData()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Loading products from API...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  const { organizedProducts, statistics } = products

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products from Backend API</h1>
      
      {/* Statistics */}
      <div className="bg-gray-100 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{statistics?.totalProducts || 0}</div>
            <div className="text-sm text-gray-600">Total Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{statistics?.totalCategories || 0}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{statistics?.totalBrands || 0}</div>
            <div className="text-sm text-gray-600">Brands</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{categories.length}</div>
            <div className="text-sm text-gray-600">API Categories</div>
          </div>
        </div>
      </div>

      {/* Products by Category */}
      {organizedProducts && Object.keys(organizedProducts).map((categoryName) => (
        <div key={categoryName} className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {categoryName} ({organizedProducts[categoryName].totalProducts} products)
          </h2>
          
          {Object.keys(organizedProducts[categoryName].products).map((subcategoryName) => (
            <div key={subcategoryName} className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                {subcategoryName} ({organizedProducts[categoryName].products[subcategoryName].length} items)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {organizedProducts[categoryName].products[subcategoryName].map((product: Product) => (
                  <div 
                    key={product.id} 
                    className="bg-white border rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(product.slug ? `/product/slug/${product.slug}` : `/product/${product.id}`)}
                  >
                    {product.image && (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-md mb-3"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg'
                        }}
                      />
                    )}
                    
                    <h4 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h4>
                    
                    <div className="flex items-center mb-2">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1 text-sm">{product.rating || 0} ({product.reviews || 0} reviews)</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-green-600">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                        )}
                      </div>
                      {product.onSale && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">SALE</span>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      <div>Brand: {product.customBrand || product.brand}</div>
                      <div>Category: {product.customCategory || product.category}</div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {product.featured && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Featured</span>
                      )}
                      {product.trending && (
                        <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">Trending</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default ProductsFromAPI