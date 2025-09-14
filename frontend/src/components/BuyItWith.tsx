import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { productApi, Product } from "@/services/api";
import { mockProductApi, MockProduct } from "@/services/mockApi";
import { Plus } from "lucide-react";

const BuyItWith: React.FC = () => {
  const { state, addToCart, getItemQuantity } = useCart();
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [adding, setAdding] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (state.items.length === 0) {
        setRelatedProducts([]);
        return;
      }

      try {
        // Get products from API - try multiple approaches
        let response;
        const cartItem = state.items[0];
        
        // Try by category first
        if (cartItem.category) {
          response = await productApi.getProductsByCategory(cartItem.category, 10);
        }
        
        // If no category results, try trending products
        if (!response?.success) {
          response = await productApi.getTrendingProducts(10);
        }
        
        // If still no results, get any products
        if (!response?.success) {
          response = await productApi.getProducts({ limit: 10 });
        }
        
        // Fallback to mock data if API completely fails
        if (!response?.success) {
          response = await mockProductApi.getProductsByCategory('SPORTS NUTRITION', 10);
        }
        
        if (response?.success && response.data) {
          // Filter out products already in cart and limit to 3
          const available = response.data
            .filter(product => 
              getItemQuantity(product.id.toString()) === 0 &&
              !state.items.some(item => item.id === product.id.toString())
            )
            .slice(0, 3);
          
          setRelatedProducts(available);
        }
      } catch (error) {
        console.error("Failed to fetch related products:", error);
        // Try mock data as final fallback
        try {
          const mockResponse = await mockProductApi.getProductsByCategory('SPORTS NUTRITION', 3);
          if (mockResponse.success) {
            setRelatedProducts(mockResponse.data.slice(0, 3));
          }
        } catch (mockError) {
          console.error("Mock data also failed:", mockError);
          setRelatedProducts([]);
        }
      }
    };

    fetchRelatedProducts();
  }, [state.items, getItemQuantity]);

  const handleAdd = async (product: Product) => {
    const id = product.id.toString();
    setAdding(id);

    try {
      addToCart({
        id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    } finally {
      setAdding(null);
    }
  };

  if (relatedProducts.length === 0) return null;

  return (
    <div className="border-t pt-4 mt-4">
      <h3 className="font-semibold text-gray-900 mb-3">Buy it with</h3>
      <div className="space-y-3">
        {relatedProducts.map((product) => (
          <div key={product.id} className="flex items-center space-x-3 p-2 border rounded-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-12 h-12 object-cover rounded"
            />
            <div className="flex-1">
              <p className="text-sm font-medium line-clamp-1">{product.name}</p>
              <p className="text-sm text-gray-600">₹{product.price}</p>
            </div>
            <Button
              size="sm"
              onClick={() => handleAdd(product)}
              disabled={adding === product.id.toString()}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {adding === product.id.toString() ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyItWith;