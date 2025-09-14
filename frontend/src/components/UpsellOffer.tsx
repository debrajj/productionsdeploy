import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { Product } from "@/services/api";
import { ArrowRight, CheckCircle, Plus, ShoppingCart, Tag } from "lucide-react";
import React, { useEffect, useState } from "react";

interface UpsellOffer {
  upsellProduct: Product;
  discountPercentage: number;
  description: string;
  active: boolean;
}

interface UpsellOfferProps {
  currentProductId: string;
  upsells: UpsellOffer[];
  currentProductPrice: number;
}

const UpsellOffer: React.FC<UpsellOfferProps> = ({
  currentProductId,
  upsells,
  currentProductPrice,
}) => {
  const {
    addToCart,
    getItemQuantity,
    applyUpsellDiscount,
    removeUpsellDiscount,
  } = useCart();
  const [loading, setLoading] = useState<string | null>(null);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  // Debug logging
  console.log("UpsellOffer Debug:", {
    currentProductId,
    currentProductIdType: typeof currentProductId,
    upsellsCount: upsells?.length,
    upsells,
    currentProductPrice,
    cartQuantity: getItemQuantity(currentProductId.toString()),
  });

  // Check if current product is in cart - convert both IDs to strings for comparison
  const isCurrentProductInCart =
    getItemQuantity(currentProductId.toString()) > 0;

  console.log("Is current product in cart:", isCurrentProductInCart);

  // Filter active upsells
  const activeUpsells = upsells.filter((upsell) => upsell.active);

  // Check if upsell product is already in cart
  const isUpsellInCart = (upsellProductId: string) => {
    return getItemQuantity(upsellProductId.toString()) > 0;
  };

  // Calculate savings for each upsell (only if discount > 0)
  const calculateSavings = (upsell: UpsellOffer) => {
    if (upsell.discountPercentage <= 0) return 0;

    const upsellPrice = upsell.upsellProduct.price;
    const totalOriginalPrice = currentProductPrice + upsellPrice;
    const discountAmount =
      (totalOriginalPrice * upsell.discountPercentage) / 100;
    return Math.round(discountAmount);
  };

  // Handle adding both products to cart
  const handleAddUpsell = async (upsell: UpsellOffer) => {
    if (!isCurrentProductInCart) {
      // If current product is not in cart, just add the upsell product
      addToCart(
        {
          id: upsell.upsellProduct.id.toString(),
          name: upsell.upsellProduct.name,
          price: upsell.upsellProduct.price,
          image: upsell.upsellProduct.image,
        },
        1
      );
      setAddedItems((prev) =>
        new Set(prev).add(upsell.upsellProduct.id.toString())
      );
      return;
    }

    // If current product is in cart, add both with discount logic
    setLoading(upsell.upsellProduct.id);

    try {
      // Add the upsell product
      addToCart(
        {
          id: upsell.upsellProduct.id.toString(),
          name: upsell.upsellProduct.name,
          price: upsell.upsellProduct.price,
          image: upsell.upsellProduct.image,
        },
        1
      );

      // Mark as added
      setAddedItems((prev) =>
        new Set(prev).add(upsell.upsellProduct.id.toString())
      );

      // Apply the upsell discount only if discount > 0
      if (upsell.discountPercentage > 0) {
        setTimeout(() => {
          applyUpsellDiscount(
            upsell.upsellProduct.id.toString(),
            upsell.discountPercentage,
            currentProductId.toString()
          );
        }, 100); // Small delay to ensure item is added first
      }
    } catch (error) {
      console.error("Failed to add upsell:", error);
    } finally {
      setLoading(null);
    }
  };

  // Handle removing upsell (when main product is removed from cart)
  useEffect(() => {
    if (!isCurrentProductInCart) {
      // If main product is removed from cart, remove all related upsell discounts
      activeUpsells.forEach((upsell) => {
        if (
          isUpsellInCart(upsell.upsellProduct.id) &&
          upsell.discountPercentage > 0
        ) {
          removeUpsellDiscount(
            upsell.upsellProduct.id.toString(),
            currentProductId.toString()
          );
        }
      });
    }
  }, [
    isCurrentProductInCart,
    activeUpsells,
    removeUpsellDiscount,
    currentProductId,
  ]);

  // Don't show if no active upsells or current product not in cart
  if (activeUpsells.length === 0 || !isCurrentProductInCart) {
    return null;
  }

  return (
    <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          🎯 Complete Your Stack!
        </h3>
        <p className="text-gray-600">
          These products work perfectly together. Add them to your cart and
          enjoy exclusive savings!
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {activeUpsells.map((upsell) => {
          const savings = calculateSavings(upsell);
          const isInCart = isUpsellInCart(upsell.upsellProduct.id);
          const isAdded = addedItems.has(upsell.upsellProduct.id.toString());
          const hasDiscount = upsell.discountPercentage > 0;

          return (
            <Card
              key={upsell.upsellProduct.id}
              className="relative overflow-hidden"
            >
              {isAdded && (
                <div className="absolute top-2 right-2 z-10">
                  <CheckCircle className="h-6 w-6 text-green-500 bg-white rounded-full" />
                </div>
              )}

              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  {hasDiscount ? (
                    <>
                      <Badge
                        variant="secondary"
                        className="bg-orange-100 text-orange-800"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {upsell.discountPercentage}% OFF
                      </Badge>
                      <div className="text-sm text-gray-500">
                        Save ₹{savings}
                      </div>
                    </>
                  ) : (
                    <>
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Perfect Match
                      </Badge>
                      <div className="text-sm text-gray-500">Add Together</div>
                    </>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={upsell.upsellProduct.image}
                    alt={upsell.upsellProduct.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">
                      {upsell.upsellProduct.name}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {upsell.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm">
                    {hasDiscount ? (
                      <>
                        <span className="text-gray-500 line-through">
                          ₹{upsell.upsellProduct.price}
                        </span>
                        <span className="text-green-600 font-semibold ml-2">
                          ₹
                          {Math.round(
                            upsell.upsellProduct.price *
                              (1 - upsell.discountPercentage / 100)
                          )}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-900 font-semibold">
                        ₹{upsell.upsellProduct.price}
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  onClick={() => handleAddUpsell(upsell)}
                  disabled={loading === upsell.upsellProduct.id || isInCart}
                  className={`w-full ${
                    hasDiscount
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                  size="sm"
                >
                  {loading === upsell.upsellProduct.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : isInCart ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Already in Cart
                    </>
                  ) : isAdded ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {hasDiscount ? "Add to Cart" : "Add Together"}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <div className="inline-flex items-center text-sm text-gray-600 bg-white px-4 py-2 rounded-full border border-orange-200">
          <ArrowRight className="h-4 w-4 mr-2 text-orange-500" />
          {activeUpsells.some((upsell) => upsell.discountPercentage > 0)
            ? "Discounts automatically applied at checkout"
            : "Perfect product combinations for your needs"}
        </div>
      </div>
    </div>
  );
};

export default UpsellOffer;
