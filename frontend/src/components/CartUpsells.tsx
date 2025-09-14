import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { productApi, Product } from "@/services/api";
import { mockProductApi, MockProduct } from "@/services/mockApi";
import { ShoppingCart, Tag, Plus, CheckCircle } from "lucide-react";

interface UpsellOffer {
  upsellProduct: Product;
  discountPercentage: number;
  description: string;
  active: boolean;
}

interface CartUpsellsProps {
  className?: string;
}

const CartUpsells: React.FC<CartUpsellsProps> = ({ className = "" }) => {
  const { state, addToCart, getItemQuantity, applyUpsellDiscount } = useCart();
  const [upsells, setUpsells] = useState<UpsellOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingItems, setAddingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchCartUpsells = async () => {
      if (state.items.length === 0) {
        setUpsells([]);
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
              // Filter out products already in cart
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

        // Remove duplicates based on product ID
        const uniqueUpsells = allUpsells.filter((upsell, index, self) =>
          index === self.findIndex(u => u.upsellProduct.id === upsell.upsellProduct.id)
        );

        setUpsells(uniqueUpsells);
      } catch (error) {
        console.error("Failed to fetch cart upsells:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartUpsells();
  }, [state.items, getItemQuantity]);

  const handleAddUpsell = async (upsell: UpsellOffer) => {
    const productId = upsell.upsellProduct.id.toString();
    setAddingItems(prev => new Set(prev).add(productId));

    try {
      // Add the upsell product to cart
      addToCart({
        id: productId,
        name: upsell.upsellProduct.name,
        price: upsell.upsellProduct.price,
        image: upsell.upsellProduct.image,
      }, 1);

      // Apply discount if available
      if (upsell.discountPercentage > 0) {
        // Find a related product in cart (use first cart item as reference)
        const relatedProductId = state.items[0]?.id;
        if (relatedProductId) {
          setTimeout(() => {
            applyUpsellDiscount(productId, upsell.discountPercentage, relatedProductId);
          }, 100);
        }
      }
    } catch (error) {
      console.error("Failed to add upsell:", error);
    } finally {
      setAddingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  if (loading || upsells.length === 0) {
    return null;
  }

  return (
    <Card className={`mt-6 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Tag className="h-5 w-5 mr-2 text-orange-500" />
          Recommended for You
        </CardTitle>
        <p className="text-sm text-gray-600">
          Complete your order with these popular add-ons
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {upsells.slice(0, 4).map((upsell) => {
            const productId = upsell.upsellProduct.id.toString();
            const isAdding = addingItems.has(productId);
            const hasDiscount = upsell.discountPercentage > 0;
            const discountedPrice = hasDiscount 
              ? Math.round(upsell.upsellProduct.price * (1 - upsell.discountPercentage / 100))
              : upsell.upsellProduct.price;

            return (
              <div
                key={upsell.upsellProduct.id}
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors"
              >
                <img
                  src={upsell.upsellProduct.image}
                  alt={upsell.upsellProduct.name}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
                    {upsell.upsellProduct.name}
                  </h4>
                  
                  {hasDiscount && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs mt-1">
                      {upsell.discountPercentage}% OFF
                    </Badge>
                  )}
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-sm">
                      {hasDiscount ? (
                        <>
                          <span className="text-gray-500 line-through text-xs">
                            ₹{upsell.upsellProduct.price}
                          </span>
                          <span className="text-green-600 font-semibold ml-2">
                            ₹{discountedPrice}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-900 font-semibold">
                          ₹{upsell.upsellProduct.price}
                        </span>
                      )}
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={() => handleAddUpsell(upsell)}
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
            );
          })}
        </div>
        
        {upsells.length > 4 && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              +{upsells.length - 4} more recommendations available
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CartUpsells;