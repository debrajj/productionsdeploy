import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Award,
  Leaf,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import productData from "@/data/homeproduct.json";
import { useCart } from "@/context/CartContext";

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

// Extract products from the new JSON structure
const products = (productData as ProductData).products;

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);

  // Add state for selected flavor and weight
  const [selectedFlavor, setSelectedFlavor] = useState<string | undefined>(
    undefined
  );
  const [selectedWeight, setSelectedWeight] = useState<string | undefined>(
    undefined
  );
  const [selectedPrice, setSelectedPrice] = useState<number | undefined>(
    undefined
  );

  // Scroll to top when component loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Find product by name slug from URL
  const product = products.find((p) => {
    const productSlug = p.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return productSlug === id;
  });

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

  // Set default selected flavor/weight on mount or when product changes
  useEffect(() => {
    if (variantFlavors.length > 0) setSelectedFlavor(variantFlavors[0]);
    if (variantWeights.length > 0) setSelectedWeight(variantWeights[0]);
  }, [product?.id]);

  // Update price when flavor/weight changes
  useEffect(() => {
    if (Array.isArray(product?.variants)) {
      const match = product.variants.find(
        (v) => v.flavor === selectedFlavor && v.weight === selectedWeight
      );
      setSelectedPrice(match ? match.price : undefined);
    }
  }, [selectedFlavor, selectedWeight, product?.variants]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-heading font-bold text-2xl mb-4">
          Product Not Found
        </h1>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(
      {
        ...product,
        id: product.id.toString(), // Convert to string for cart compatibility
      },
      quantity
    );
  };

  const features = [
    { icon: Truck, text: "Free shipping on orders over ₹1500" },
    { icon: Shield, text: "100% authentic products guarantee" },
    { icon: RotateCcw, text: "30-day return policy" },
  ];

  const getCertificationIcon = (cert: string) => {
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

  // Get certifications - use product's certifications or default ones
  const displayCertifications =
    product.certifications && product.certifications.length > 0
      ? product.certifications
      : defaultCertifications;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Breadcrumb */}
        <nav className="mb-4 sm:mb-6">
          <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600">
            <Link
              to="/"
              className="hover:text-[#F9A245] transition-colors capitalize"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              to={`/category/${product.categorySlug}`}
              className="hover:text-[#F9A245] transition-colors capitalize"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate capitalize">
              {product.name}
            </span>
          </div>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Product Images */}
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="space-y-4">
                <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden group">
                  <img
                    src={
                      product.images && product.images.length > 0
                        ? product.images[selectedImageIndex]
                        : product.image
                    }
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Thumbnail Gallery */}
                {product.images && product.images.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          selectedImageIndex === index
                            ? "border-[#F9A245] shadow-lg scale-105"
                            : "border-gray-200 hover:border-gray-300 hover:scale-102"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4 sm:p-6 lg:p-8 bg-white">
              <div className="space-y-4 sm:space-y-6">
                {/* Product Header */}
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge
                      variant="secondary"
                      className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-200"
                    >
                      {product.subcategory || product.category}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-blue-100 text-blue-600 hover:bg-blue-200"
                    >
                      {product.brand}
                    </Badge>
                    {product.onSale && (
                      <Badge
                        variant="destructive"
                        className="text-xs bg-red-100 text-red-600 hover:bg-red-200"
                      >
                        SALE
                      </Badge>
                    )}
                  </div>

                  <h1 className="font-heading font-bold text-xl sm:text-2xl lg:text-3xl text-gray-900 mb-3 leading-tight">
                    {product.name}
                  </h1>
                  {/* Flavor and Weight Selectors (single line, just above quantity) */}
                  {product.variants &&
                    (variantFlavors.length > 0 ||
                      variantWeights.length > 0) && (
                      <div className="flex flex-row flex-wrap items-center gap-4 mb-4">
                        {variantFlavors.length > 0 && (
                          <div className="flex items-center gap-2">
                            <label className="text-sm font-medium">
                              Flavour:
                            </label>
                            <select
                              className="border rounded px-2 py-1 text-sm"
                              value={selectedFlavor}
                              onChange={(e) =>
                                setSelectedFlavor(e.target.value)
                              }
                            >
                              {variantFlavors.map((fl, idx) => (
                                <option key={idx} value={fl}>
                                  {fl}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                        {variantWeights.length > 0 && (
                          <div className="flex items-center gap-2">
                            <label className="text-sm font-medium">
                              Quantity:
                            </label>
                            <select
                              className="border rounded px-2 py-1 text-sm"
                              value={selectedWeight}
                              onChange={(e) =>
                                setSelectedWeight(e.target.value)
                              }
                            >
                              {variantWeights.map((wt, idx) => (
                                <option key={idx} value={wt}>
                                  {wt}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                        {selectedPrice !== undefined && (
                          <div className="mb-4">
                            <span className="text-2xl sm:text-3xl font-bold text-[#F9A245]">
                              ₹{selectedPrice.toLocaleString('en-IN')}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < product.rating
                              ? "fill-[#F9A245] text-[#F9A245]"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>

                  {/* Benefits */}
                {product.benefits && product.benefits.length > 0 && (
                  <div className="bg-green-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Key Benefits</span>
                    </h3>
                    <ul className="space-y-2">
                      {product.benefits.map((benefit, index) => (
                        <li
                          key={index}
                          className="flex items-start space-x-3 text-sm text-gray-700"
                        >
                          <span className="text-green-600 mt-0.5 font-bold text-base">
                            ✓
                          </span>
                          <span className="leading-relaxed">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quantity Selection */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="font-body font-medium mb-3 block text-gray-900">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-[#F9A245] hover:bg-[#F9A245] hover:text-white transition-all duration-200 font-medium"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium text-lg">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-[#F9A245] hover:bg-[#F9A245] hover:text-white transition-all duration-200 font-medium"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {/* Desktop: Two buttons in one line */}
                  <div className="hidden md:flex space-x-3">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-[#F9A245] hover:bg-[#e8913d] text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </button>
                    <Link to="/checkout" className="flex-1">
                      <button className="w-full border-2 border-[#F9A245] text-[#F9A245] hover:bg-[#F9A245] hover:text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
                        Buy Now
                      </button>
                    </Link>
                  </div>

                  {/* Mobile: Single button */}
                  <div className="md:hidden">
                    <button
                      onClick={handleAddToCart}
                      className="w-full bg-[#F9A245] hover:bg-[#e8913d] text-white py-4 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg active:scale-95"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>
                        Add to Cart - ₹{(product.price * quantity).toFixed(0)}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Bundled Offers */}
                {product.bundledOffers && product.bundledOffers.length > 0 && (
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 sm:p-5">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <span className="text-xl">🎁</span>
                      <span>Bundle & Save More</span>
                    </h3>
                    <div className="space-y-3">
                      {product.bundledOffers.map((bundle) => (
                        <div
                          key={bundle.id}
                          className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                            selectedBundle === bundle.id
                              ? "border-[#F9A245] bg-white shadow-md"
                              : "border-gray-200 hover:border-gray-300 bg-white/50"
                          }`}
                          onClick={() =>
                            setSelectedBundle(
                              selectedBundle === bundle.id ? null : bundle.id
                            )
                          }
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex-1 pr-4">
                              <div className="font-medium text-gray-900 mb-1">
                                {bundle.name}
                              </div>
                              <p className="text-sm text-gray-600">
                                {bundle.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-[#F9A245]">
                                ₹{bundle.bundlePrice.toFixed(0)}
                              </div>
                              <div className="text-sm text-gray-500 line-through">
                                ₹{bundle.originalPrice.toFixed(0)}
                              </div>
                              <div className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">
                                Save ₹{bundle.savings.toFixed(0)}
                              </div>
                            </div>
                          </div>
                          <button
                            className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${
                              selectedBundle === bundle.id
                                ? "bg-[#F9A245] text-white shadow-md"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {selectedBundle === bundle.id
                              ? "Selected Bundle"
                              : "Select This Bundle"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 sm:p-5">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Why Shop With Us
                  </h3>
                  <div className="space-y-3">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-[#F9A245] rounded-full flex items-center justify-center">
                          <feature.icon className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm text-gray-700 font-medium">
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications - Now shows for all products */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    <span>Certifications</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {displayCertifications.map((cert, index) => {
                      const IconComponent = getCertificationIcon(cert);
                      return (
                        <div
                          key={index}
                          className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-blue-100 hover:border-blue-200 transition-colors"
                        >
                          <IconComponent className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-gray-700">
                            {cert}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm overflow-hidden">
          <Tabs defaultValue="nutrition" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-none">
              <TabsTrigger
                value="description"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg mx-1"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="nutrition"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg mx-1"
              >
                Nutrition
              </TabsTrigger>
              <TabsTrigger
                value="ingredients"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg mx-1"
              >
                Ingredients
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-0">
              <div className="p-6 sm:p-8">
                <p className="font-body text-gray-700 leading-relaxed text-base">
                  {product.description ||
                    "Product description will be updated soon."}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="nutrition" className="mt-0">
              <div className="p-6 sm:p-8">
                {product.nutritionInfo ? (
                  <div className="space-y-4">
                    <div className="mb-6">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        Nutritional Information
                      </h3>
                      <p className="text-sm text-gray-600">
                        Complete nutritional breakdown per serving
                      </p>
                    </div>
                    {Object.entries(product.nutritionInfo).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <span className="font-medium text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <span className="text-gray-900 font-semibold">
                            {value}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">
                      Nutrition information will be updated soon.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="ingredients" className="mt-0">
              <div className="p-6 sm:p-8">
                {product.ingredients && product.ingredients.length > 0 ? (
                  <div className="space-y-4">
                    <div className="mb-6">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        Ingredients List
                      </h3>
                      <p className="text-sm text-gray-600">
                        All ingredients used in this product
                      </p>
                    </div>
                    <div className="space-y-3">
                      {product.ingredients.map((ingredient, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 py-3 px-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <span className="flex-shrink-0 w-6 h-6 bg-[#F9A245] rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                            {index + 1}
                          </span>
                          <span className="font-body text-gray-700 leading-relaxed font-medium">
                            {ingredient}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">
                      Ingredients information will be updated soon.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
