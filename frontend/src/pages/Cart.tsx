import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Tag,
  Percent,
  Gift,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { couponService, type Coupon, type ValidatedCoupon } from "@/services/couponService";
import CartUpsells from "@/components/CartUpsells";
import CartSidebarUpsells from "@/components/CartSidebarUpsells";
import BuyItWith from "@/components/BuyItWith";
import UpsellTest from "@/components/UpsellTest";

const Cart: React.FC = () => {
  const { state, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<ValidatedCoupon | null>(null);
  const [promoError, setPromoError] = useState("");
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [showAvailableCoupons, setShowAvailableCoupons] = useState(false);

  useEffect(() => {
    fetchAvailableCoupons();
  }, []);

  const fetchAvailableCoupons = async () => {
    const coupons = await couponService.getAvailableCoupons();
    setAvailableCoupons(coupons);
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    
    setIsValidating(true);
    setPromoError("");
    
    try {
      const validatedCoupon = await couponService.validateCoupon(
        promoCode,
        state.total
      );
      setAppliedCoupon(validatedCoupon);
      setPromoCode("");
    } catch (error) {
      setPromoError(error instanceof Error ? error.message : "Invalid coupon code");
    } finally {
      setIsValidating(false);
    }
  };

  const removePromo = () => {
    setAppliedCoupon(null);
    setPromoError("");
  };

  const applyCouponDirectly = async (coupon: Coupon) => {
    setIsValidating(true);
    setPromoError("");
    
    try {
      const validatedCoupon = await couponService.validateCoupon(
        coupon.code,
        state.total
      );
      setAppliedCoupon(validatedCoupon);
      setShowAvailableCoupons(false);
    } catch (error) {
      setPromoError(error instanceof Error ? error.message : "Cannot apply this coupon");
    } finally {
      setIsValidating(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-foreground">
            Your Cart is Empty
          </h1>
          <p className="font-body text-muted-foreground">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link to="/">
            <Button size="lg" className="bg-primary hover:bg-primary-hover">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate pricing in INR (prices are already in INR)
  const subtotalINR = state.total;
  const freeShippingThreshold = 1500; // ₹1500 for free shipping
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const discountedSubtotal = subtotalINR - discountAmount;
  const shippingCostINR = (appliedCoupon?.freeShipping || discountedSubtotal >= freeShippingThreshold) ? 0 : 99;
  const finalTotalINR = discountedSubtotal + shippingCostINR;

  // Calculate total savings from upsells
  const upsellSavings = state.items
    .filter(item => item.isUpsell && item.originalPrice)
    .reduce((total, item) => {
      const savings = (item.originalPrice! - item.price) * item.quantity;
      return total + savings;
    }, 0);

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-8 space-y-4 sm:space-y-0">
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground">
            Shopping Cart
          </h1>
          <p className="font-body text-muted-foreground">
            {state.itemCount} {state.itemCount === 1 ? "item" : "items"} in your
            cart
          </p>
        </div>
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50 px-3 sm:px-6 py-3">
              <h2 className="font-semibold text-lg">
                Your Items ({state.items.length})
              </h2>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {state.items.map((item) => (
                  <div key={item.id} className="p-3 sm:p-4">
                    <div className="flex items-start space-x-3 overflow-hidden">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <h3 
                          className="font-semibold text-sm truncate cursor-pointer hover:text-[#F9A245] transition-colors"
                          onClick={() => navigate(`/product/${item.id}`)}
                        >
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">
                          {item.brand} • ₹{item.price.toLocaleString()} each
                        </p>

                        {/* Mobile: Quantity and Total in same row */}
                        <div className="flex items-center justify-between mt-2">
                          {/* Compact Quantity Controls */}
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              className="h-7 w-7 p-0 text-xs"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-medium text-sm min-w-[1.5rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="h-7 w-7 p-0 text-xs"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Price and Remove */}
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm text-black">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="text-[#F9A245] hover:text-[#e8913d] hover:bg-orange-50 h-7 w-7 p-0"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>


                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Clear Cart */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-[#F9A245] hover:text-[#e8913d]"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          </div>
          
          {/* Cart Upsells */}
          <CartUpsells />
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="font-heading">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Promo Code Section */}
              <div className="border border-gray-200 rounded-lg p-4 bg-orange-50">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-[#F9A245]" />
                    <span>Promo Code</span>
                  </div>
                  <button
                    onClick={() => setShowAvailableCoupons(!showAvailableCoupons)}
                    className="text-xs text-[#F9A245] hover:text-[#e8913d] font-medium"
                  >
                    {showAvailableCoupons ? 'Hide' : 'View All'}
                  </button>
                </h3>

                {appliedCoupon ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Gift className="h-4 w-4 text-green-600" />
                        <div>
                          <span className="font-medium text-green-800">
                            {appliedCoupon.code}
                          </span>
                          <p className="text-xs text-green-600">
                            {appliedCoupon.title}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={removePromo}
                        className="text-[#F9A245] hover:text-[#e8913d] text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter promo code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#F9A245] focus:border-[#F9A245]"
                        onKeyPress={(e) => e.key === 'Enter' && handleApplyPromo()}
                      />
                      <Button
                        onClick={handleApplyPromo}
                        disabled={isValidating || !promoCode.trim()}
                        className="bg-[#F9A245] hover:bg-[#e8913d] text-white px-4"
                        size="sm"
                      >
                        {isValidating ? 'Applying...' : 'Apply'}
                      </Button>
                    </div>
                    {promoError && (
                      <p className="text-xs text-red-500 mt-2">{promoError}</p>
                    )}
                    
                    {/* Available Coupons */}
                    {showAvailableCoupons && availableCoupons.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-medium text-gray-700">Available offers:</p>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {availableCoupons.map((coupon) => {
                            const isEligible = state.total >= coupon.minimumOrderValue;
                            return (
                              <div
                                key={coupon.id}
                                className={`p-2 rounded-lg border text-xs ${
                                  isEligible
                                    ? 'bg-white border-[#F9A245] cursor-pointer hover:bg-orange-50'
                                    : 'bg-gray-50 border-gray-200 opacity-60'
                                }`}
                                onClick={() => isEligible && applyCouponDirectly(coupon)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <Tag className="h-3 w-3 text-[#F9A245]" />
                                    <span className="font-medium text-gray-900">
                                      {coupon.code}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <span className="font-medium text-[#F9A245]">
                                      {coupon.discountType === 'percentage'
                                        ? `${coupon.discountValue}% OFF`
                                        : coupon.discountType === 'fixed'
                                        ? `₹${coupon.discountValue} OFF`
                                        : 'FREE SHIPPING'}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-gray-600 mt-1">{coupon.description}</p>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="text-gray-500">
                                    Min: ₹{coupon.minimumOrderValue}
                                  </span>
                                  {coupon.expiresAt && (
                                    <div className="flex items-center space-x-1 text-gray-500">
                                      <Clock className="h-3 w-3" />
                                      <span>
                                        Expires: {new Date(coupon.expiresAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                {!isEligible && (
                                  <p className="text-red-500 text-xs mt-1">
                                    Add ₹{(coupon.minimumOrderValue - state.total).toLocaleString()} more to use this coupon
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Buy It With */}
              <BuyItWith />
              
              {/* Sidebar Upsells */}
              <CartSidebarUpsells />

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Subtotal ({state.itemCount} items)
                  </span>
                  <span className="font-medium text-black">₹{subtotalINR.toLocaleString()}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>
                      Discount ({appliedCoupon.code})
                      {appliedCoupon.discountType === 'percentage' && ` - ${appliedCoupon.discountValue}% off`}
                      {appliedCoupon.discountType === 'fixed' && ` - ₹${appliedCoupon.discountValue} off`}
                    </span>
                    <span className="text-black">-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-black">
                    {shippingCostINR === 0 ? (
                      <span className="text-green-600 font-medium">FREE</span>
                    ) : (
                      `₹${shippingCostINR}`
                    )}
                  </span>
                </div>

                {subtotalINR < freeShippingThreshold && (
                  <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                    Add ₹{(freeShippingThreshold - subtotalINR).toLocaleString()} more
                    for free shipping!
                  </div>
                )}

                <Separator />

                <div className="flex justify-between">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-bold text-xl text-black">
                    ₹{finalTotalINR.toLocaleString()}
                  </span>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-[#F9A245] hover:bg-[#e8913d] text-white"
                  onClick={() => {
                    if (user) {
                      navigate('/checkout');
                    } else {
                      navigate('/login', { state: { from: '/checkout' } });
                    }
                  }}
                >
                  {user ? 'Proceed to Checkout' : 'Login to Checkout'}
                </Button>

                <div className="text-center">
                  <Link
                    to="/"
                    className="text-primary hover:text-primary-hover font-medium"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
