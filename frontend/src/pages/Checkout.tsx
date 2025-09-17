import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CreditCard,
  Truck,
  Lock,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  Shield,
  Check,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useCheckout } from "@/hooks/useCheckout";
import { useOrderAutoFill } from "@/hooks/useOrderAutoFill";
import { AddressSaver } from "@/components/AddressSaver";
import { SavedAddresses } from "@/components/SavedAddresses";
import { QuickReorder } from "@/components/QuickReorder";
import { GuestCheckoutSaver } from "@/components/GuestCheckoutSaver";

const Checkout: React.FC = () => {
  const { state, clearCart } = useCart();
  const { user, isLoading, addAddress, addresses, createOrder } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const checkout = useCheckout();
  const [selectedAddressId, setSelectedAddressId] = React.useState<string>();
  
  // Auto-fill order form with user registration data
  useOrderAutoFill({ updateFormData: checkout.updateFormData });
  
  const hasGuestInfo = !user && !!localStorage.getItem('nutri_guest_info');
  
  // Get applied coupon from localStorage (set by cart page)
  const [appliedCoupon, setAppliedCoupon] = React.useState<any>(null);
  
  React.useEffect(() => {
    const loadCoupon = () => {
      const savedCoupon = localStorage.getItem('appliedCoupon');
      if (savedCoupon) {
        try {
          const coupon = JSON.parse(savedCoupon);
          console.log('Loaded coupon:', coupon);
          setAppliedCoupon(coupon);
        } catch (error) {
          console.error('Failed to parse applied coupon:', error);
        }
      }
    };
    
    loadCoupon();
    // Listen for storage changes
    window.addEventListener('storage', loadCoupon);
    return () => window.removeEventListener('storage', loadCoupon);
  }, []);

  // Handle address selection
  const handleSelectAddress = (address: any) => {
    if (address === null) {
      setSelectedAddressId(undefined);
      return;
    }
    setSelectedAddressId(address.id);
    checkout.updateFormData('firstName', address.firstName);
    checkout.updateFormData('lastName', address.lastName);
    checkout.updateFormData('address', address.address);
    checkout.updateFormData('apartment', address.apartment || '');
    checkout.updateFormData('city', address.city);
    checkout.updateFormData('state', address.state);
    checkout.updateFormData('zipCode', address.zipCode);
    checkout.updateFormData('phone', address.phone);
  };

  // Debug: Check if user is logged in
  // console.log('Is user logged in?', !!user);
  // console.log('User data:', user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to place an order.",
        variant: "destructive"
      });
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    // Skip address validation if using saved address
    const isUsingSelectedAddress = !!selectedAddressId;
    if (!isUsingSelectedAddress && !checkout.validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Check all required fields and try again.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate payment method even when using saved address
    if (checkout.paymentMethod === 'card') {
      if (!checkout.formData.nameOnCard || !checkout.formData.cardNumber || !checkout.formData.expiryDate || !checkout.formData.cvv) {
        toast({
          title: "Please complete payment details",
          description: "Card information is required.",
          variant: "destructive"
        });
        return;
      }
    }
    
    if (checkout.paymentMethod === 'upi' && !checkout.formData.upiId) {
      toast({
        title: "Please enter UPI ID",
        description: "UPI ID is required for UPI payment.",
        variant: "destructive"
      });
      return;
    }

    checkout.setProcessing(true);

    try {
      // Create order data without order number - backend will generate it
      const orderData = {
        userId: user.id,
        customerEmail: user.email,
        items: state.items.map((item) => ({
          id: item.id.toString(),
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          // Variant details
          selectedFlavor: item.selectedFlavor,
          selectedWeight: item.selectedWeight,
          variantId: item.variantId,
          variantType: item.variantType,
          // Legacy support
          variant: item.selectedFlavor || item.selectedWeight ? 
            `${item.selectedFlavor || ''}${item.selectedFlavor && item.selectedWeight ? ' - ' : ''}${item.selectedWeight || ''}`.trim() : undefined,
          // Upsell tracking
          isUpsell: item.isUpsell || false,
          upsellDiscount: item.upsellDiscount || 0,
          originalPrice: item.originalPrice || item.price,
        })),
        subtotal: subtotalINR,
        total: finalTotalINR,
        shippingCost: shippingCostINR,
        discountAmount: discountAmount,
        couponCode: appliedCoupon?.code || null,
        discount: discountAmount,
        deliveryMethod: checkout.deliveryMethod,
        paymentMethod: checkout.paymentMethod.toUpperCase(),
        shippingAddress: {
          id: '1',
          type: 'home' as const,
          firstName: checkout.formData.firstName,
          lastName: checkout.formData.lastName,
          address: checkout.formData.address,
          apartment: checkout.formData.apartment,
          city: checkout.formData.city,
          state: checkout.formData.state,
          zipCode: checkout.formData.zipCode,
          phone: checkout.formData.phone,
          isDefault: true
        }
      };

      // Save address if checkbox is checked (before creating order)
      const addressSaverElement = document.querySelector('[data-save-address="true"]');
      if (addressSaverElement && user) {
        // Check if address already exists (more comprehensive check)
        const addressExists = addresses.some(addr => 
          addr.address.toLowerCase().trim() === checkout.formData.address.toLowerCase().trim() &&
          addr.zipCode.trim() === checkout.formData.zipCode.trim() &&
          addr.city.toLowerCase().trim() === checkout.formData.city.toLowerCase().trim() &&
          addr.firstName.toLowerCase().trim() === checkout.formData.firstName.toLowerCase().trim() &&
          addr.lastName.toLowerCase().trim() === checkout.formData.lastName.toLowerCase().trim()
        );
        
        if (!addressExists) {
          const addressData = {
            type: 'home' as const,
            firstName: checkout.formData.firstName,
            lastName: checkout.formData.lastName,
            address: checkout.formData.address,
            apartment: checkout.formData.apartment,
            city: checkout.formData.city,
            state: checkout.formData.state,
            zipCode: checkout.formData.zipCode,
            phone: checkout.formData.phone,
            isDefault: addresses.length === 0
          };
          
          try {
            await addAddress(addressData);
            console.log('Address saved successfully');
          } catch (error) {
            console.error('Failed to save address:', error);
          }
        }
      }
      
      // Create order
      const success = await createOrder(orderData);
      if (!success) {
        throw new Error('Order creation failed');
      }

      // Generate order number and add to order data
      const orderNumber = `ORD-${Date.now()}`;
      orderData.orderNumber = orderNumber;
      
      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${orderNumber} has been confirmed.`,
      });
      
      navigateToThankYou(orderNumber);
      
      function navigateToThankYou(orderNum: string) {
        // Clear cart and redirect to thank you page
        clearCart();
        const isGiftCardPurchase = sessionStorage.getItem("isGiftCardPurchase") === "true";
        sessionStorage.removeItem("isGiftCardPurchase");

        // Store order number for thank you page
        sessionStorage.setItem('orderNumber', orderNum);
        
        // Force page refresh to ensure thank you page loads
        window.location.href = '/thank-you' + (isGiftCardPurchase ? '?giftcard=true' : '');
      }

    } catch (error) {
      console.error("Order creation failed:", error);
      toast({
        title: "Order Failed",
        description:
          "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      checkout.setProcessing(false);
    }
  };

  // Redirect to login if not authenticated
  if (!isLoading && !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="font-bold text-2xl mb-4">Login Required</h1>
        <p className="text-gray-600 mb-6">
          Please login to place an order.
        </p>
        <Link to="/login" state={{ from: '/checkout' }}>
          <Button className="bg-[#F9A245] hover:bg-[#e8913d] text-white">
            Login to Continue
          </Button>
        </Link>
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="font-bold text-2xl mb-4">No Items in Cart</h1>
        <p className="text-gray-600 mb-6">
          Add some products to your cart before checkout.
        </p>
        <Link to="/">
          <Button className="bg-[#F9A245] hover:bg-[#e8913d] text-white">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  // Calculate pricing in INR (prices are already in INR)
  const subtotalINR = state.total;
  const discountAmount = appliedCoupon ? (appliedCoupon.discountAmount || 0) : 0;
  const discountedSubtotal = Math.max(0, subtotalINR - discountAmount);
  const deliveryCharges = {
    standard: 99,
  };
  const shippingCostINR = (appliedCoupon?.freeShipping || discountedSubtotal >= 1500) ? 0 :
    deliveryCharges[checkout.deliveryMethod as keyof typeof deliveryCharges];
  const finalTotalINR = discountedSubtotal + shippingCostINR;
  
  // Debug logging
  console.log('Checkout pricing:', {
    subtotalINR,
    appliedCoupon,
    discountAmount,
    discountedSubtotal,
    shippingCostINR,
    finalTotalINR
  });

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Link
            to="/cart"
            className="flex items-center text-gray-600 hover:text-[#F9A245] transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Cart
          </Link>
        </div>
        <h1 className="font-bold text-3xl text-gray-900">Checkout</h1>
        <p className="text-gray-600 mt-2">Complete your order securely</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          {/* Quick Reorder Section */}
          <div className="mb-6">
            <QuickReorder />
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-8">
            {/* User Information */}
            {user ? (
              <Card className="border-gray-200">
                <CardHeader className="bg-green-50">
                  <CardTitle className="flex items-center text-gray-900">
                    <Mail className="h-5 w-5 mr-2 text-green-600" />
                    Logged in as {user?.firstName || 'User'} {user?.lastName || ''}
                  </CardTitle>
                </CardHeader>

              </Card>
            ) : hasGuestInfo && (
              <Card className="border-blue-200">
                <CardHeader className="bg-blue-50">
                  <CardTitle className="flex items-center text-blue-900">
                    <Mail className="h-5 w-5 mr-2 text-blue-600" />
                    Welcome Back!
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-sm text-blue-700">
                    ✓ We've pre-filled your information from your last order to make checkout faster.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Saved Addresses */}
            <SavedAddresses 
              onSelectAddress={handleSelectAddress}
              selectedAddressId={selectedAddressId}
            />
            
            {/* Shipping Address */}
            <Card className="border-gray-200">
              <CardHeader className="bg-gray-50">
                <CardTitle className="flex items-center text-gray-900">
                  <MapPin className="h-5 w-5 mr-2 text-[#F9A245]" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className={`space-y-4 pt-6 ${selectedAddressId ? 'opacity-50' : ''}`}>
                {selectedAddressId && (
                  <div className="bg-orange-50 border border-[#F9A245] rounded-lg p-3 mb-4">
                    <p className="text-orange-800 text-sm font-medium">✓ Using saved address</p>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label
                      htmlFor="firstName"
                      className="text-gray-700 font-medium"
                    >
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={checkout.formData.firstName}
                      onChange={(e) => checkout.updateFormData("firstName", e.target.value)}
                      className={`mt-1 focus:ring-[#F9A245] focus:border-[#F9A245] ${checkout.errors.firstName ? 'border-red-500' : ''}`}
                      disabled={!!selectedAddressId}
                      required
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="lastName"
                      className="text-gray-700 font-medium"
                    >
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={checkout.formData.lastName}
                      onChange={(e) => checkout.updateFormData("lastName", e.target.value)}
                      className={`mt-1 focus:ring-[#F9A245] focus:border-[#F9A245] ${checkout.errors.lastName ? 'border-red-500' : ''}`}
                      disabled={!!selectedAddressId}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="address"
                    className="text-gray-700 font-medium"
                  >
                    Street Address *
                  </Label>
                  <Input
                    id="address"
                    placeholder="123 Main Street"
                    value={checkout.formData.address}
                    onChange={(e) => checkout.updateFormData("address", e.target.value)}
                    className={`mt-1 focus:ring-[#F9A245] focus:border-[#F9A245] ${checkout.errors.address ? 'border-red-500' : ''}`}
                    disabled={!!selectedAddressId}
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="apartment"
                    className="text-gray-700 font-medium"
                  >
                    Apartment, Suite, etc. (Optional)
                  </Label>
                  <Input
                    id="apartment"
                    placeholder="Apt 4B"
                    value={checkout.formData.apartment}
                    onChange={(e) => checkout.updateFormData("apartment", e.target.value)}
                    className="mt-1 focus:ring-[#F9A245] focus:border-[#F9A245]"
                    disabled={!!selectedAddressId}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-gray-700 font-medium">
                      City *
                    </Label>
                    <Input
                      id="city"
                      placeholder="Mumbai"
                      value={checkout.formData.city}
                      onChange={(e) => checkout.updateFormData("city", e.target.value)}
                      className={`mt-1 focus:ring-[#F9A245] focus:border-[#F9A245] ${checkout.errors.city ? 'border-red-500' : ''}`}
                      disabled={!!selectedAddressId}
                      required
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="state"
                      className="text-gray-700 font-medium"
                    >
                      State *
                    </Label>
                    <Select
                      onValueChange={(value) => checkout.updateFormData("state", value)}
                    >
                      <SelectTrigger className="mt-1 focus:ring-[#F9A245] focus:border-[#F9A245]">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="an">Andaman and Nicobar Islands</SelectItem>
                        <SelectItem value="ap">Andhra Pradesh</SelectItem>
                        <SelectItem value="ar">Arunachal Pradesh</SelectItem>
                        <SelectItem value="as">Assam</SelectItem>
                        <SelectItem value="br">Bihar</SelectItem>
                        <SelectItem value="ch">Chandigarh</SelectItem>
                        <SelectItem value="ct">Chhattisgarh</SelectItem>
                        <SelectItem value="dn">Dadra and Nagar Haveli</SelectItem>
                        <SelectItem value="dd">Daman and Diu</SelectItem>
                        <SelectItem value="dl">Delhi</SelectItem>
                        <SelectItem value="ga">Goa</SelectItem>
                        <SelectItem value="gj">Gujarat</SelectItem>
                        <SelectItem value="hr">Haryana</SelectItem>
                        <SelectItem value="hp">Himachal Pradesh</SelectItem>
                        <SelectItem value="jk">Jammu and Kashmir</SelectItem>
                        <SelectItem value="jh">Jharkhand</SelectItem>
                        <SelectItem value="ka">Karnataka</SelectItem>
                        <SelectItem value="kl">Kerala</SelectItem>
                        <SelectItem value="la">Ladakh</SelectItem>
                        <SelectItem value="ld">Lakshadweep</SelectItem>
                        <SelectItem value="mp">Madhya Pradesh</SelectItem>
                        <SelectItem value="mh">Maharashtra</SelectItem>
                        <SelectItem value="mn">Manipur</SelectItem>
                        <SelectItem value="ml">Meghalaya</SelectItem>
                        <SelectItem value="mz">Mizoram</SelectItem>
                        <SelectItem value="nl">Nagaland</SelectItem>
                        <SelectItem value="or">Odisha</SelectItem>
                        <SelectItem value="py">Puducherry</SelectItem>
                        <SelectItem value="pb">Punjab</SelectItem>
                        <SelectItem value="rj">Rajasthan</SelectItem>
                        <SelectItem value="sk">Sikkim</SelectItem>
                        <SelectItem value="tn">Tamil Nadu</SelectItem>
                        <SelectItem value="tg">Telangana</SelectItem>
                        <SelectItem value="tr">Tripura</SelectItem>
                        <SelectItem value="up">Uttar Pradesh</SelectItem>
                        <SelectItem value="ut">Uttarakhand</SelectItem>
                        <SelectItem value="wb">West Bengal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label
                      htmlFor="zipCode"
                      className="text-gray-700 font-medium"
                    >
                      PIN Code *
                    </Label>
                    <div className="relative">
                      <Input
                        id="zipCode"
                        placeholder="400001"
                        value={checkout.formData.zipCode}
                        onChange={(e) => checkout.updateFormData("zipCode", e.target.value)}
                        className={`mt-1 focus:ring-[#F9A245] focus:border-[#F9A245] ${checkout.errors.zipCode ? 'border-red-500' : ''}`}
                        disabled={!!selectedAddressId}
                        required
                      />
                      {checkout.formData.zipCode && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {checkout.pincodeValidating ? (
                            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                          ) : checkout.isPincodeValid ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : checkout.formData.zipCode.length === 6 ? (
                            <XCircle className="h-4 w-4 text-red-500" />
                          ) : null}
                        </div>
                      )}
                    </div>
                    {checkout.errors.zipCode && (
                      <p className="text-xs text-red-500 mt-1">{checkout.errors.zipCode}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-gray-700 font-medium">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={checkout.formData.phone}
                    onChange={(e) => checkout.updateFormData("phone", e.target.value)}
                    className={`mt-1 focus:ring-[#F9A245] focus:border-[#F9A245] ${checkout.errors.phone ? 'border-red-500' : ''}`}
                    disabled={!!selectedAddressId}
                    required
                  />
                </div>
                
                {/* Address Saver for logged-in users */}
                {user && (
                  <AddressSaver 
                    formData={checkout.formData}
                    onAddressSaved={() => {
                      // Optionally refresh addresses or show success message
                    }}
                  />
                )}
                
                {/* Guest Checkout Saver for non-logged-in users */}
                {!user && (
                  <GuestCheckoutSaver formData={checkout.formData} />
                )}
              </CardContent>
            </Card>

            {/* Delivery Method */}
            <Card className="border-gray-200">
              <CardHeader className="bg-gray-50">
                <CardTitle className="flex items-center text-gray-900">
                  <Truck className="h-5 w-5 mr-2 text-[#F9A245]" />
                  Delivery Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-3">
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      checkout.deliveryMethod === "standard"
                        ? "border-[#F9A245] bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => checkout.updateDeliveryMethod("standard")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            checkout.deliveryMethod === "standard"
                              ? "border-[#F9A245] bg-[#F9A245]"
                              : "border-gray-300"
                          }`}
                        >
                          {checkout.deliveryMethod === "standard" && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Standard Delivery
                          </h4>
                          <p className="text-sm text-gray-600">
                            5-7 business days
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">₹99</p>
                      </div>
                    </div>
                  </div>




                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="border-gray-200">
              <CardHeader className="bg-gray-50">
                <CardTitle className="flex items-center text-gray-900">
                  <CreditCard className="h-5 w-5 mr-2 text-[#F9A245]" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Payment Method Selection */}
                <div className="space-y-3">
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      checkout.paymentMethod === "card"
                        ? "border-[#F9A245] bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => checkout.updatePaymentMethod("card")}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          checkout.paymentMethod === "card"
                            ? "border-[#F9A245] bg-[#F9A245]"
                            : "border-gray-300"
                        }`}
                      >
                        {checkout.paymentMethod === "card" && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-5 w-5 text-gray-600" />
                        <span className="font-medium text-gray-900">
                          Credit/Debit Card
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      checkout.paymentMethod === "upi"
                        ? "border-[#F9A245] bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => checkout.updatePaymentMethod("upi")}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          checkout.paymentMethod === "upi"
                            ? "border-[#F9A245] bg-[#F9A245]"
                            : "border-gray-300"
                        }`}
                      >
                        {checkout.paymentMethod === "upi" && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-5 w-5 text-gray-600" />
                        <span className="font-medium text-gray-900">
                          UPI Payment
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      checkout.paymentMethod === "cod"
                        ? "border-[#F9A245] bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => checkout.updatePaymentMethod("cod")}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          checkout.paymentMethod === "cod"
                            ? "border-[#F9A245] bg-[#F9A245]"
                            : "border-gray-300"
                        }`}
                      >
                        {checkout.paymentMethod === "cod" && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-gray-600" />
                        <span className="font-medium text-gray-900">
                          Cash on Delivery
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Details (only show when card is selected) */}
                {checkout.paymentMethod === "card" && (
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div>
                      <Label
                        htmlFor="nameOnCard"
                        className="text-gray-700 font-medium"
                      >
                        Name on Card *
                      </Label>
                      <Input
                        id="nameOnCard"
                        placeholder="John Doe"
                        value={checkout.formData.nameOnCard}
                        onChange={(e) => checkout.updateFormData("nameOnCard", e.target.value)}
                        className={`mt-1 focus:ring-[#F9A245] focus:border-[#F9A245] ${checkout.errors.nameOnCard ? 'border-red-500' : ''}`}
                        required
                      />
                      {checkout.errors.nameOnCard && (
                        <p className="text-xs text-red-500 mt-1">{checkout.errors.nameOnCard}</p>
                      )}
                    </div>

                    <div>
                      <Label
                        htmlFor="cardNumber"
                        className="text-gray-700 font-medium"
                      >
                        Card Number *
                      </Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={checkout.formData.cardNumber}
                        onChange={(e) => checkout.updateFormData("cardNumber", e.target.value)}
                        className={`mt-1 focus:ring-[#F9A245] focus:border-[#F9A245] ${checkout.errors.cardNumber ? 'border-red-500' : ''}`}
                        required
                      />
                      {checkout.errors.cardNumber && (
                        <p className="text-xs text-red-500 mt-1">{checkout.errors.cardNumber}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="expiryDate"
                          className="text-gray-700 font-medium"
                        >
                          Expiry Date *
                        </Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={checkout.formData.expiryDate}
                          onChange={(e) => checkout.updateFormData("expiryDate", e.target.value)}
                          className={`mt-1 focus:ring-[#F9A245] focus:border-[#F9A245] ${checkout.errors.expiryDate ? 'border-red-500' : ''}`}
                          required
                        />
                        {checkout.errors.expiryDate && (
                          <p className="text-xs text-red-500 mt-1">{checkout.errors.expiryDate}</p>
                        )}
                      </div>
                      <div>
                        <Label
                          htmlFor="cvv"
                          className="text-gray-700 font-medium"
                        >
                          CVV *
                        </Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={checkout.formData.cvv}
                          onChange={(e) => checkout.updateFormData("cvv", e.target.value)}
                          className={`mt-1 focus:ring-[#F9A245] focus:border-[#F9A245] ${checkout.errors.cvv ? 'border-red-500' : ''}`}
                          required
                        />
                        {checkout.errors.cvv && (
                          <p className="text-xs text-red-500 mt-1">{checkout.errors.cvv}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Lock className="h-4 w-4" />
                      <span>
                        Your payment information is secure and encrypted
                      </span>
                    </div>
                  </div>
                )}

                {/* UPI Details (only show when UPI is selected) */}
                {checkout.paymentMethod === "upi" && (
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div>
                      <Label
                        htmlFor="upiId"
                        className="text-gray-700 font-medium"
                      >
                        UPI ID *
                      </Label>
                      <Input
                        id="upiId"
                        placeholder="yourname@paytm"
                        value={checkout.formData.upiId || ''}
                        onChange={(e) => checkout.updateFormData("upiId", e.target.value)}
                        className={`mt-1 focus:ring-[#F9A245] focus:border-[#F9A245] ${checkout.errors.upiId ? 'border-red-500' : ''}`}
                        required
                      />
                      {checkout.errors.upiId && (
                        <p className="text-xs text-red-500 mt-1">{checkout.errors.upiId}</p>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>
                        You will be redirected to your UPI app to complete the
                        payment
                      </p>
                    </div>
                  </div>
                )}

                {/* COD Details (only show when COD is selected) */}
                {checkout.paymentMethod === "cod" && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start space-x-2">
                        <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800">
                            Cash on Delivery
                          </h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            Pay ₹{finalTotalINR.toLocaleString()} when your
                            order is delivered. Please keep exact change ready.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-[#F9A245] hover:bg-[#e8913d] text-white"
              disabled={checkout.isProcessing}
            >
              {checkout.isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                `Complete Order - ₹${finalTotalINR.toLocaleString()}`
              )}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="border-gray-200">
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 space-y-4 pt-6">
              {/* Order Items */}
              <div className="space-y-3">
                {state.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        Qty: {item.quantity}
                        {item.selectedFlavor && ` • ${item.selectedFlavor}`}
                        {item.selectedWeight && ` • ${item.selectedWeight}`}
                      </p>
                      {item.isUpsell && item.upsellDiscount && (
                        <p className="text-xs text-green-600">
                          {item.upsellDiscount}% off upsell discount
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {item.originalPrice && item.originalPrice > item.price ? (
                        <div>
                          <p className="text-xs text-gray-500 line-through">
                            ₹{(item.originalPrice * item.quantity).toLocaleString()}
                          </p>
                          <p className="font-medium text-[#F9A245]">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      ) : (
                        <p className="font-medium text-[#F9A245]">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Pricing Breakdown */}
              <div className="space-y-2">
                {(() => {
                  const originalTotal = state.items.reduce((sum, item) => 
                    sum + (item.originalPrice || item.price) * item.quantity, 0
                  );
                  const totalDiscount = originalTotal - subtotalINR;
                  
                  return (
                    <>
                      {totalDiscount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Original Price ({state.itemCount} items)
                          </span>
                          <span className="text-gray-500 line-through">
                            ₹{originalTotal.toLocaleString()}
                          </span>
                        </div>
                      )}
                      
                      {totalDiscount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-green-600">
                            Discount
                          </span>
                          <span className="text-green-600 font-medium">
                            -₹{totalDiscount.toLocaleString()}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Subtotal ({state.itemCount} items)
                        </span>
                        <span className="font-medium">
                          ₹{subtotalINR.toLocaleString()}
                        </span>
                      </div>
                      
                      {appliedCoupon && (
                        <div className="flex justify-between text-green-600">
                          <span>
                            Discount ({appliedCoupon.code})
                          </span>
                          <span className="font-medium">
                            -₹{discountAmount.toLocaleString()}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Standard Delivery
                        </span>
                        <span className="font-medium">
                          {shippingCostINR === 0 ? (
                            <span className="text-green-600">FREE</span>
                          ) : (
                            `₹${shippingCostINR}`
                          )}
                        </span>
                      </div>

                      <Separator />

                      <div className="flex justify-between font-bold text-lg">
                        <span className="text-gray-900">Total</span>
                        <span className="text-[#F9A245]">
                          ₹{finalTotalINR.toLocaleString()}
                        </span>
                      </div>
                      
                      {totalDiscount > 0 && (
                        <div className="text-center text-sm text-green-600 font-medium">
                          You saved ₹{totalDiscount.toLocaleString()}!
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Security Badge */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Secure checkout powered by SSL encryption</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
