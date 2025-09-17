import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UpsellOffer from "@/components/UpsellOffer";
import SubscribeCTA from "@/components/SubscribeCTA";
import ProductImageGallery from "@/components/ProductImageGallery";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/hooks/useWishlist";
import { Product as ApiProduct, productApi } from "@/services/api";
import {
  Award,
  CheckCircle,
  Heart,
  Leaf,
  RotateCcw,
  Share2,
  Shield,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

// Type definitions for the new JSON structure
type Product = {
  id: number;
  name: string;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  onSale?: boolean;
  category?: string;
  categorySlug?: string;
  subcategory?: string;
  subcategorySlug?: string;
  brand?: string;
  featured?: boolean;
  trending?: boolean;
  description?: string;
  benefits?: string[];
  certifications?: string[];
  nutritionInfo?: {
    [key: string]: string | number;
  };
  ingredients?: string[];
  subscriptionOptions?: {
    available: boolean;
    discounts: {
      monthly: number;
      quarterly: number;
      biannual: number;
    };
  };
  bundledOffers?: Array<{
    id: string;
    name: string;
    description: string;
    products: number[];
    originalPrice: number;
    bundlePrice: number;
    savings: number;
  }>;
  variants?: Array<{
    flavor: string;
    weight: string;
    price: number;
  }>;
  upsells?: Array<{
    upsellProduct: Product;
    discountPercentage: number;
    description: string;
    active: boolean;
  }>;
};

type ProductData = {
  categories: Array<{
    id: number;
    name: string;
    slug: string;
    subcategories: Array<{
      name: string;
      slug: string;
      items: string[];
    }>;
  }>;
  products: Product[];
};

// Products will be loaded from API

const ProductDetail: React.FC = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  // Early return if no slug provided
  if (!slug) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-heading font-bold text-2xl mb-4">Invalid Product URL</h1>
        <p className="text-gray-600 mb-4">No product identifier provided in the URL.</p>
        <Link to="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Load product and variants from API
  useEffect(() => {
    const loadProduct = async () => {
      if (!slug) {
        setError("No product identifier provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        let response;
        
        // Check if slug looks like an ID (MongoDB ObjectId pattern)
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(slug);
        
        if (isObjectId) {
          // If it's an ID, load by ID directly
          response = await productApi.getProductById(slug);
        } else {
          // Try by slug first
          response = await productApi.getProductBySlug(slug);
          
          // If slug fails, try by ID as fallback
          if (!response.success) {
            console.log(`Loading by slug failed: ${response.error}. Trying by ID...`);
            response = await productApi.getProductById(slug);
          }
        }
        
        if (response.success && response.data) {
          console.log('Product loaded:', response.data);
          setProduct(response.data);
          // Set initial price from variants or base price
          if (response.data.variants && response.data.variants.length > 0) {
            setSelectedPrice(response.data.variants[0].price);
          } else {
            setSelectedPrice(response.data.price);
          }
        } else {
          const errorMsg = response.error || "Product not found";
          console.error('Product loading failed:', errorMsg, response);
          setError(errorMsg);
        }

        // Load variants from API (non-blocking)
        try {
          const variantsResponse = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/product-variants`);
          const variantsResult = await variantsResponse.json();
          if (variantsResult.success) {
            setApiVariants(variantsResult.data);
          }
        } catch (error) {
          console.warn('Failed to fetch variants:', error);
          // Don't fail the whole component for variants
        }
      } catch (err) {
        console.error("Failed to load product:", err);
        setError("Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  // Add state for selected flavor and weight
  const [selectedFlavor, setSelectedFlavor] = useState<string | undefined>(
    undefined
  );
  const [selectedWeight, setSelectedWeight] = useState<string | undefined>(
    undefined
  );
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [recentlyViewed, setRecentlyViewed] = useState<ApiProduct[]>([]);
  const [apiVariants, setApiVariants] = useState<{flavors: string[], weights: string[]}>({ flavors: [], weights: [] });

  // Scroll to top when component loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Track recently viewed and load recent products
  useEffect(() => {
    if (product) {
      // Add current product to recently viewed
      const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      const filtered = viewed.filter((p: any) => p.id !== product.id);
      const updated = [{ id: product.id, name: product.name, viewedAt: Date.now() }, ...filtered].slice(0, 10);
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));

      // Load recently viewed products
      const loadRecentProducts = async () => {
        try {
          const recentIds = updated.slice(1, 5).map((p: any) => p.id); // Skip current product, get next 4
          if (recentIds.length > 0) {
            const response = await productApi.getProducts({ limit: 4 });
            if (response.success) {
              setRecentlyViewed(response.data.slice(0, 4));
            }
          }
        } catch (error) {
          console.error('Failed to load recent products:', error);
        }
      };

      loadRecentProducts();
    }
  }, [product]);

  // Product is loaded from API state

  // Extract unique flavors and weights from variants (array of objects)
  const variantFlavors = Array.from(
    new Set(
      Array.isArray(product?.variants)
        ? product.variants.map((v) => v.flavor)
        : []
    )
  );
  const variantWeights = Array.from(
    new Set(
      Array.isArray(product?.variants)
        ? product.variants.map((v) => v.weight)
        : []
    )
  );

  // Set default selected flavor/weight on mount or when product loads
  useEffect(() => {
    if (product && selectedPrice === 0) {
      // Option 2: Variants with individual pricing
      if (product.variants && product.variants.length > 0) {
        const variantFlavors = Array.from(new Set(product.variants.map(v => v.flavor).filter(Boolean)));
        const variantWeights = Array.from(new Set(product.variants.map(v => v.weight).filter(Boolean)));
        
        if (variantFlavors.length > 0 && !selectedFlavor) {
          setSelectedFlavor(variantFlavors[0]);
        }
        if (variantWeights.length > 0 && !selectedWeight) {
          setSelectedWeight(variantWeights[0]);
        }
        setSelectedPrice(product.variants[0]?.price || product.price);
      }
      // Option 1: Simple Flavors & Weights
      else {
        if (product.simpleFlavors && !selectedFlavor) {
          const flavors = product.simpleFlavors.split(',').map(f => f.trim());
          setSelectedFlavor(flavors[0]);
        }
        if (product.simpleWeights && !selectedWeight) {
          const weights = product.simpleWeights.split(',').map(w => w.trim());
          setSelectedWeight(weights[0]);
        }
        setSelectedPrice(product.price);
      }
    }
  }, [product]);

  // Update price when flavor/weight changes
  useEffect(() => {
    if (product) {
      // Option 2: Variants with individual pricing - find matching variant
      if (product.variants && product.variants.length > 0) {
        if (selectedFlavor && selectedWeight) {
          const match = product.variants.find(
            (v) => v.flavor === selectedFlavor && v.weight === selectedWeight
          );
          setSelectedPrice(match ? match.price : product.price);
        } else if (selectedFlavor || selectedWeight) {
          // If only one variant is selected, find the first matching variant
          const match = product.variants.find(
            (v) => (selectedFlavor ? v.flavor === selectedFlavor : true) && 
                   (selectedWeight ? v.weight === selectedWeight : true)
          );
          setSelectedPrice(match ? match.price : product.price);
        } else {
          // No variant selected, use first variant price or base price
          setSelectedPrice(product.variants[0]?.price || product.price);
        }
      }
      // Option 1: Simple Flavors & Weights - use base price
      else if (product.simpleFlavors || product.simpleWeights) {
        setSelectedPrice(product.price);
      }
      // Fallback to base price
      else {
        setSelectedPrice(product.price);
      }
    }
  }, [selectedFlavor, selectedWeight, product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#F9A246] mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-heading font-bold text-2xl mb-4">
          Product Not Found
        </h1>
        <p className="text-gray-600 mb-4">{error || "This product is not available"}</p>
        <p className="text-sm text-gray-500 mb-4">Product ID/Slug: {slug}</p>
        
        {error && error.includes('slug') && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-yellow-800">
              💡 This product may have an invalid URL. Try accessing it from the product list.
            </p>
          </div>
        )}
        
        <div className="space-x-2">
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
          <Link to="/products">
            <Button variant="outline">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Safety check for product data
  if (!product.name || !product.price) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-heading font-bold text-2xl mb-4">
          Invalid Product Data
        </h1>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: selectedPrice || product.price,
      image: product.image,
      selectedFlavor,
      selectedWeight,
      variantType: (product.variants && product.variants.length > 0) ? 'complex' as const : 'simple' as const,
      variantId: (product.variants && selectedFlavor && selectedWeight) 
        ? product.variants.find(v => v.flavor === selectedFlavor && v.weight === selectedWeight)?.id
        : undefined
    };
    addToCart(cartItem, quantity);
  };

  const handleBuyNow = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: selectedPrice || product.price,
      image: product.image,
      selectedFlavor,
      selectedWeight,
      variantType: (product.variants && product.variants.length > 0) ? 'complex' as const : 'simple' as const,
      variantId: (product.variants && selectedFlavor && selectedWeight) 
        ? product.variants.find(v => v.flavor === selectedFlavor && v.weight === selectedWeight)?.id
        : undefined
    };
    addToCart(cartItem, quantity);
    navigate("/checkout");
  };

  const features = [
    { icon: Truck, text: "Free shipping on orders over ₹1500" },
    { icon: Shield, text: "100% authentic products guarantee" },
    { icon: RotateCcw, text: "30-day return policy" },
  ];

  const getCertificationIcon = (cert: string) => {
    if (!cert || typeof cert !== 'string') return CheckCircle;
    const certLower = cert.toLowerCase();
    if (certLower.includes("organic") || certLower.includes("natural"))
      return Leaf;
    if (certLower.includes("gmp") || certLower.includes("iso")) return Award;
    return CheckCircle;
  };

  // Default certifications for products that don't have specific ones
  const defaultCertifications = [
    "GMP Certified",
    "ISO 22000",
    "FSSAI Approved",
    "Quality Assured",
  ];

  // Get certifications - use product's certifications or default ones, but limit to 4
  const displayCertifications = (
    product.certifications && product.certifications.length > 0
      ? product.certifications
      : defaultCertifications
  ).slice(0, 4);

  try {
    return (
      <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Breadcrumb */}
        <nav className="mb-3 sm:mb-4">
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Link
              to="/"
              className="hover:text-[#F9A245] transition-colors"
            >
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-700 font-medium truncate">
              {String(product.name || '')}
            </span>
          </div>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-8">
          <ProductImageGallery
            mainImage={product.image}
            additionalImages={product.images || []}
            productName={product.name}
          />

          <div className="space-y-6">
            {/* Product Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {product.onSale && (
                    <Badge className="bg-[#F9A246] text-white text-xs">
                      Sale
                    </Badge>
                  )}
                  {product.featured && (
                    <Badge variant="secondary" className="text-xs">
                      Featured
                    </Badge>
                  )}
                </div>
                <h1 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-gray-900 leading-tight">
                  {String(product.name || '')}
                </h1>
              </div>

              {/* Rating and Reviews */}
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        style={{
                          color: i < Math.floor(product.rating || 0) ? "#F9A245" : "#E5E7EB",
                          fontSize: `16px`,
                          lineHeight: 1,
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({product.reviews || 0})
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{(selectedPrice * quantity).toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-500 line-through">
                      ₹{(product.originalPrice * quantity).toLocaleString()}
                    </span>
                  )}
                  {product.originalPrice && (
                    <Badge className="bg-[#F9A246] text-white text-xs">
                      {Math.round(
                        ((product.originalPrice - product.price) /
                          product.originalPrice) *
                          100
                      )}
                      % OFF
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">Inclusive of all taxes</p>
              </div>

              {/* Variant Selectors */}
              {(() => {
                // Option 1: Variants with individual pricing (prioritize over simple options)
                if (product?.variants && product.variants.length > 0) {
                  const variantFlavors = Array.from(new Set(product.variants.map(v => v.flavor).filter(f => f && f.trim() !== '')));
                  const variantWeights = Array.from(new Set(product.variants.map(v => v.weight).filter(w => w && w.trim() !== '')));
                  
                  return (
                    <div className="space-y-4 pt-2">
                      {variantFlavors.length > 0 && (
                        <div className="space-y-3">
                          <label className="text-sm font-semibold text-gray-900">
                            Flavor
                          </label>
                          <Select
                            value={selectedFlavor}
                            onValueChange={setSelectedFlavor}
                          >
                            <SelectTrigger className="w-full h-12 border-2 border-gray-200 hover:border-[#F9A245] focus:border-[#F9A245] focus:ring-2 focus:ring-[#F9A245]/20 rounded-lg bg-white">
                              <SelectValue
                                placeholder="Choose flavor"
                                className="text-gray-700"
                              />
                            </SelectTrigger>
                            <SelectContent className="border-2 border-gray-200 rounded-lg shadow-lg">
                              {variantFlavors.map((flavor, index) => (
                                <SelectItem
                                  key={`flavor-${index}`}
                                  value={flavor}
                                  className="hover:bg-[#F9A245]/10 hover:text-black focus:bg-[#F9A245]/10 focus:text-black cursor-pointer py-3"
                                >
                                  {String(flavor || '')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      
                      {variantWeights.length > 0 && (
                        <div className="space-y-3">
                          <label className="text-sm font-semibold text-gray-900">
                            Weight
                          </label>
                          <Select
                            value={selectedWeight}
                            onValueChange={setSelectedWeight}
                          >
                            <SelectTrigger className="w-full h-12 border-2 border-gray-200 hover:border-[#F9A245] focus:border-[#F9A245] focus:ring-2 focus:ring-[#F9A245]/20 rounded-lg bg-white">
                              <SelectValue
                                placeholder="Choose weight"
                                className="text-gray-700"
                              />
                            </SelectTrigger>
                            <SelectContent className="border-2 border-gray-200 rounded-lg shadow-lg">
                              {variantWeights.map((weight, index) => {
                                // Find variant with this weight to show price
                                const variantWithPrice = product.variants.find(v => v.weight === weight);
                                return (
                                  <SelectItem
                                    key={`weight-${index}`}
                                    value={weight}
                                    className="hover:bg-[#F9A245]/10 hover:text-black focus:bg-[#F9A245]/10 focus:text-black cursor-pointer py-3"
                                  >
                                    <div className="flex justify-between items-center w-full">
                                      <span>{String(weight || '')}</span>
                                      {variantWithPrice && (
                                        <span className="text-sm text-gray-500 ml-2">
                                          ₹{variantWithPrice.price.toLocaleString()}
                                        </span>
                                      )}
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      
                      {/* Show current variant price */}
                      {(selectedFlavor || selectedWeight) && (
                        <div className="p-4 bg-gradient-to-r from-[#F9A245]/10 to-[#F9A245]/5 rounded-lg border border-[#F9A245]/20">
                          <div className="text-sm text-gray-700 mb-1">
                            <strong>Selected:</strong> {selectedFlavor && selectedWeight ? `${selectedFlavor} - ${selectedWeight}` : selectedFlavor || selectedWeight}
                          </div>
                          <div className="text-xl font-bold text-[#F9A245]">
                            ₹{(selectedPrice || product.price).toLocaleString()}
                          </div>

                        </div>
                      )}
                    </div>
                  );
                }
                
                // Option 2: Simple Flavors & Weights (fallback when no variants)
                if (product?.simpleFlavors || product?.simpleWeights) {
                  return (
                    <div className="space-y-4 pt-2">
                      {product.simpleFlavors && (
                        <div className="space-y-3">
                          <label className="text-sm font-semibold text-gray-900">
                            Flavor
                          </label>
                          <Select
                            value={selectedFlavor}
                            onValueChange={setSelectedFlavor}
                          >
                            <SelectTrigger className="w-full h-12 border-2 border-gray-200 hover:border-[#F9A245] focus:border-[#F9A245] focus:ring-2 focus:ring-[#F9A245]/20 rounded-lg bg-white">
                              <SelectValue
                                placeholder="Choose flavor"
                                className="text-gray-700"
                              />
                            </SelectTrigger>
                            <SelectContent className="border-2 border-gray-200 rounded-lg shadow-lg">
                              {product.simpleFlavors.split(',').filter(f => f.trim()).map((flavor, index) => (
                                <SelectItem
                                  key={`flavor-${index}`}
                                  value={flavor.trim()}
                                  className="hover:bg-[#F9A245]/10 hover:text-black focus:bg-[#F9A245]/10 focus:text-black cursor-pointer py-3"
                                >
                                  {String(flavor || '').trim()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      
                      {product.simpleWeights && (
                        <div className="space-y-3">
                          <label className="text-sm font-semibold text-gray-900">
                            Weight
                          </label>
                          <Select
                            value={selectedWeight}
                            onValueChange={setSelectedWeight}
                          >
                            <SelectTrigger className="w-full h-12 border-2 border-gray-200 hover:border-[#F9A245] focus:border-[#F9A245] focus:ring-2 focus:ring-[#F9A245]/20 rounded-lg bg-white">
                              <SelectValue
                                placeholder="Choose weight"
                                className="text-gray-700"
                              />
                            </SelectTrigger>
                            <SelectContent className="border-2 border-gray-200 rounded-lg shadow-lg">
                              {product.simpleWeights.split(',').filter(w => w.trim()).map((weight, index) => (
                                <SelectItem
                                  key={`weight-${index}`}
                                  value={weight.trim()}
                                  className="hover:bg-[#F9A245]/10 hover:text-black focus:bg-[#F9A245]/10 focus:text-black cursor-pointer py-3"
                                >
                                  {String(weight || '').trim()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  );
                }
                
                return null;
              })()}

              {/* Quantity and Add to Cart */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">
                    Quantity:
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-gray-50 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 hover:bg-gray-50 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    className="flex-1 bg-[#F9A245] hover:bg-[#F9A245]/90 text-white py-3 px-6"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 border-[#F9A245] text-[#F9A245] hover:bg-[#F9A245] hover:text-white py-3 px-6"
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toggleWishlist(product.id.toString(), {
                        name: product.name,
                        price: product.price,
                        image: product.image,
                      });
                    }}
                    className={
                      isInWishlist(product.id.toString())
                        ? "bg-red-50 border-red-200 text-red-600"
                        : ""
                    }
                  >
                    <Heart
                      className={`w-4 h-4 mr-2 ${
                        isInWishlist(product.id.toString())
                          ? "fill-red-500 text-red-500"
                          : ""
                      }`}
                    />
                    {isInWishlist(product.id.toString())
                      ? "Remove from Wishlist"
                      : "Add to Wishlist"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: product.name,
                          text: `Check out ${
                            product.name
                          } - ₹${product.price.toLocaleString()}`,
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Product link copied to clipboard!");
                      }
                    }}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-[#F9A245]" />
                      <span className="text-sm text-gray-700">
                        {feature.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed">
                  {product.description ||
                    "This premium product is carefully crafted to meet the highest quality standards. Experience the perfect blend of taste, nutrition, and wellness in every serving."}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ingredients" className="mt-6">
            <Card>
              <CardContent className="p-6">
                {product.ingredients ? (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Ingredients:
                    </h3>
                    <p className="text-gray-700">
                      {typeof product.ingredients === 'string' 
                        ? product.ingredients
                        : Array.isArray(product.ingredients)
                        ? product.ingredients
                            .map((ingredient) =>
                              typeof ingredient === "object" && ingredient?.name
                                ? ingredient.name
                                : String(ingredient || '')
                            )
                            .join(", ")
                        : 'Ingredients information available on packaging'
                      }
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-700">
                    Made with premium, carefully selected ingredients to ensure
                    quality and effectiveness.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nutrition" className="mt-6">
            <Card>
              <CardContent className="p-6">
                {product.nutritionImage && (
                  <div className="mb-6 text-center">
                    <img
                      src={product.nutritionImage.startsWith('http') ? product.nutritionImage : `${import.meta.env.VITE_API_ENDPOINT}${product.nutritionImage}`}
                      alt="Nutrition Facts"
                      className="max-w-full h-auto mx-auto rounded-lg shadow-sm"
                    />
                  </div>
                )}
                {product.nutritionInfo ? (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Nutrition Information:
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(product.nutritionInfo)
                        .filter(([key]) => key !== 'nutritionImage')
                        .map(([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between py-2 border-b border-gray-100"
                          >
                            <span className="text-gray-600 capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}:
                            </span>
                            <span className="font-medium text-gray-900">
                              {value}
                            </span>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700">
                    Detailed nutrition information is available on the product
                    packaging.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Certifications */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Certifications & Quality Assurance
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {displayCertifications.map((cert, index) => {
              const Icon = getCertificationIcon(cert);
              return (
                <div
                  key={index}
                  className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200"
                >
                  <Icon className="w-8 h-8 text-[#F9A245] mb-2" />
                  <span className="text-sm font-medium text-gray-900 text-center">
                    {String(cert || '')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subscribe CTA */}
        <section className="mb-8 py-8 bg-gradient-to-b from-[#f8fafc] via-[#fff9f2] to-[#f8fafc] relative overflow-hidden rounded-xl">
          <div className="relative overflow-hidden rounded-xl" style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>
            <div className="absolute inset-0 bg-gradient-to-r from-[#F9A245]/80 via-[#E86A12]/70 to-[#40B75D]/80"></div>
            <div className="relative z-10 py-8 sm:py-12 px-4 sm:px-8">
              <div className="text-center text-white mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-3xl font-bold mb-2">💪 Love this product? Get more deals!</h2>
                <p className="text-sm sm:text-lg opacity-90">Subscribe for exclusive supplement offers & fitness tips</p>
              </div>
              <div className="max-w-2xl mx-auto">
                <SubscribeCTA 
                  variant="banner"
                  title=""
                  description=""
                />
              </div>
            </div>
          </div>
        </section>

        {/* Upsell Offers Section */}
        {product?.upsells && product.upsells.length > 0 && (
          <UpsellOffer
            currentProductId={product.id}
            upsells={product.upsells}
            currentProductPrice={selectedPrice || product.price}
          />
        )}

        {/* Recently Viewed Section */}
        {recentlyViewed.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recently Viewed</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recentlyViewed.map((recentProduct) => (
                <div
                  key={recentProduct.id}
                  className="group rounded-xl shadow-md hover:shadow-xl border border-gray-200 hover:border-[#F9A245] transition-all duration-300 overflow-hidden bg-white cursor-pointer"
                  onClick={() => navigate(`/product/${recentProduct.id}`)}
                >
                  <div className="aspect-square bg-gray-50 overflow-hidden flex items-center justify-center">
                    <img
                      src={`${recentProduct.image}?w=300&h=300&fit=crop`}
                      alt={recentProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3 space-y-2">
                    <span className="text-sm font-normal text-gray-800 leading-snug line-clamp-2 group-hover:text-[#F9A245] transition-colors">
                      {String(recentProduct.name || '')}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={`recent-${recentProduct.id}-star-${i}`}
                            style={{
                              color: i < Math.floor(recentProduct.rating || 0) ? "#F9A245" : "#E5E7EB",
                              fontSize: "14px",
                              lineHeight: 1,
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        ({recentProduct.reviews || 0})
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{recentProduct.price.toLocaleString()}
                      </span>
                      {recentProduct.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{recentProduct.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('ProductDetail render error:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-4">Error loading product: {error.message}</p>
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
        </div>
      </div>
    );
  }
};

export default ProductDetail;
