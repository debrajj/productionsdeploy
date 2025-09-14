import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { productApi, Product } from "@/services/api";
import { mockProductApi, MockProduct } from "@/services/mockApi";
import { Plus, Sparkles } from "lucide-react";

interface UpsellOffer {
  upsellProduct: Product;
  discountPercentage: number;
  description: string;
  active: boolean;
}

const CartSidebarUpsells: React.FC = () => {
  const { state, addToCart, getItemQuantity, applyUpsellDiscount } = useCart();
  const [topUpsell, setTopUpsell] = useState<UpsellOffer | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchTopUpsell = async () => {
      if (state.items.length === 0) {
        setTopUpsell(null);
        return;
      }

      setLoading(true);
      try {
        const allUpsells: UpsellOffer[] = [];
        
        // Fetch upsells for each item in cart
        for (const cartItem of state.items) {
          try {
            // Try API first, fallback to mock data
            let response = await productApi.getProductById(cartItem.id);
            if (!response.success) {
              console.log('API failed, using mock data for:', cartItem.id);
              response = await mockProductApi.getProductById(cartItem.id);
            }
            if (response.success && response.data?.upsells) {
              const availableUpsells = response.data.upsells.filter(
                (upsell: UpsellOffer) => 
                  upsell.active && 
                  getItemQuantity(upsell.upsellProduct.id.toString()) === 0
              );
              allUpsells.push(...availableUpsells);
            }
          } catch (error) {
            console.error(`Failed to fetch upsells for ${cartItem.id}:`, error);
          }
        }

        // Get the best upsell (highest discount or first available)
        const bestUpsell = allUpsells
          .filter((upsell, index, self) =>
            index === self.findIndex(u => u.upsellProduct.id === upsell.upsellProduct.id)
          )
          .sort((a, b) => b.discountPercentage - a.discountPercentage)[0];

        setTopUpsell(bestUpsell || null);
      } catch (error) {
        console.error("Failed to fetch top upsell:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopUpsell();
  }, [state.items, getItemQuantity]);

  const handleAddUpsell = async () => {
    if (!topUpsell) return;

    const productId = topUpsell.upsellProduct.id.toString();
    setIsAdding(true);

    try {
      addToCart({
        id: productId,
        name: topUpsell.upsellProduct.name,
        price: topUpsell.upsellProduct.price,
        image: topUpsell.upsellProduct.image,
      }, 1);

      if (topUpsell.discountPercentage > 0) {
        const relatedProductId = state.items[0]?.id;
        if (relatedProductId) {
          setTimeout(() => {
            applyUpsellDiscount(productId, topUpsell.discountPercentage, relatedProductId);
          }, 100);
        }
      }
    } catch (error) {
      console.error("Failed to add upsell:", error);
    } finally {
      setIsAdding(false);
    }
  };

  if (loading || !topUpsell) {
    return null;
  }

  const hasDiscount = topUpsell.discountPercentage > 0;
  const discountedPrice = hasDiscount 
    ? Math.round(topUpsell.upsellProduct.price * (1 - topUpsell.discountPercentage / 100))
    : topUpsell.upsellProduct.price;

  return (
    <div className="border border-orange-200 rounded-lg p-4 bg-gradient-to-r from-orange-50 to-yellow-50">
      <div className="flex items-center space-x-2 mb-3">
        <Sparkles className="h-4 w-4 text-orange-500" />
        <span className="font-semibold text-sm text-gray-900">Recommended Add-on</span>
      </div>
      
      <div className="flex items-center space-x-3">
        <img
          src={topUpsell.upsellProduct.image}
          alt={topUpsell.upsellProduct.name}
          className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
            {topUpsell.upsellProduct.name}
          </h4>
          
          <div className="flex items-center justify-between mt-1">
            <div className="text-sm">
              <span className="text-gray-900 font-semibold">
                ₹{topUpsell.upsellProduct.price}
              </span>
            </div>
            
            <Button
              size="sm"
              onClick={handleAddUpsell}
              disabled={isAdding}
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1 h-7"
            >
              {isAdding ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
              ) : (
                <>
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-gray-600 mt-2">
        {topUpsell.description}
      </p>
    </div>
  );
};

export default CartSidebarUpsells;