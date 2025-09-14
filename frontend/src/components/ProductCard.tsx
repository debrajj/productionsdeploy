import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/services/api';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(product.slug ? `/product/${product.slug}` : `/product/${product.id}`);
  };

  return (
    <div 
      className="bg-white border rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleClick}
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
        {product.bestSeller && (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Best Seller</span>
        )}
        {product.lovedByExperts && (
          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Expert Choice</span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;