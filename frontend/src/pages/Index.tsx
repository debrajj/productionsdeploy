import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import slidesData from "@/data/slide.json";
import ShopByGoal from "@/components/ShopByGoal";
import SubscribeCTA from "@/components/SubscribeCTA";
import { productApi, Product as ApiProduct } from "@/services/api";

// Import banner images
import desktopBanner1 from "@/assets/Banners/Desktop/1 - DEsktop.png";
import desktopBanner2 from "@/assets/Banners/Desktop/2 - DESKTOP.png";
import desktopBanner3 from "@/assets/Banners/Desktop/3 - Desktop.png";
import mobileBanner1 from "@/assets/Banners/Phone/1 - Mobile Banner.png";
import mobileBanner2 from "@/assets/Banners/Phone/Banners 2 - Mobile.png";
import mobileBanner3 from "@/assets/Banners/Phone/3 - Mobile.png";
import creativeBanner from "@/assets/Banners/creative.png";

import skeletonOverlay from "@/assets/hv.png";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
type Product = {
  id: string | number;
  name: string;
  image: string;
  slug: string;
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
  bestSeller?: boolean;
  lovedByExperts?: boolean;
  description?: string;
  nutritionInfo?: {
    [key: string]: string | number;
  };
  ingredients?: string[];
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

type Category = {
  id: number;
  name: string;
  slug: string;
  image: string;
  count: number;
};

type HeroSlide = {
  id: number;
  image: string;
  badge: string;
  heading: string;
  description: string;
  primaryButtonText: string;
};

const useCarousel = (items: any[], visibleCount: number) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  const next = React.useCallback(() => {
    setCurrentIndex(
      (prev) => (prev + 1) % Math.max(1, items.length - visibleCount + 1)
    );
  }, [items.length, visibleCount]);

  const prev = React.useCallback(() => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(0, items.length - visibleCount) : prev - 1
    );
  }, [items.length, visibleCount]);

  const pauseAutoPlay = React.useCallback(() => setIsPaused(true), []);
  const resumeAutoPlay = React.useCallback(() => setIsPaused(false), []);

  const visible = items.slice(currentIndex, currentIndex + visibleCount);

  return {
    visible,
    next,
    prev,
    isPaused,
    pauseAutoPlay,
    resumeAutoPlay,
    currentIndex,
  };
};

const SvgIcon = ({
  children,
  size = 24,
}: {
  children: React.ReactNode;
  size?: number;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const StarRating = ({
  rating,
  size = 14,
  color = "#F9A245",
  emptyColor = "#E5E7EB",
}: {
  rating: number;
  size?: number;
  color?: string;
  emptyColor?: string;
}) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <span
        key={i}
        style={{
          color: i < Math.floor(rating) ? "#F9A245" : "#E5E7EB",
          fontSize: `${size}px`,
          lineHeight: 1,
        }}
      >
        ★
      </span>
    ))}
  </div>
);

// Products will be loaded from API

const Index: React.FC = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isDesktop, setIsDesktop] = React.useState(false);
  const [bestSellerAutoSlide, setBestSellerAutoSlide] = React.useState(true);
  const [expertAutoSlide, setExpertAutoSlide] = React.useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [lovedByExperts, setLovedByExperts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart, state } = useCart();

  const [activeBanners, setActiveBanners] = useState([
    {
      desktopImage: desktopBanner1,
      mobileImage: mobileBanner1,
    },
    {
      desktopImage: desktopBanner2,
      mobileImage: mobileBanner2,
    },
    {
      desktopImage: desktopBanner3,
      mobileImage: mobileBanner3,
    },
  ]);

  // Add backend banner
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const { heroBannerApi } = await import('@/services/api');
        const result = await heroBannerApi.getAllBanners();
        
        if (result.success && result.data && result.data.length > 0) {
          const banner = result.data[0];
          if (banner.isActive && banner.desktopImage?.url) {
            setActiveBanners(prev => [
              {
                desktopImage: banner.desktopImage.url,
                mobileImage: banner.mobileImage?.url || banner.desktopImage.url,
              },
              ...prev
            ]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch banner:', error);
      }
    };
    
    fetchBanner();
  }, []);

  // Load products from API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);

        const [bestSellersResponse, expertsResponse] = await Promise.all([
          productApi.getBestSellerProducts(8),
          productApi.getLovedByExpertsProducts(4),
        ]);

        if (bestSellersResponse.success) {
          const transformedBestSellers = bestSellersResponse.data.map(
            (apiProduct: ApiProduct) => ({
              id: apiProduct.id,
              name: apiProduct.name,
              image: apiProduct.image,
              slug: apiProduct.slug,
              rating: apiProduct.rating || 0,
              reviews: apiProduct.reviews || 0,
              price: apiProduct.price,
              originalPrice: apiProduct.originalPrice,
              onSale: apiProduct.onSale,
              category: apiProduct.category,
              categorySlug: apiProduct.categorySlug,
              subcategory: apiProduct.subcategory,
              subcategorySlug: apiProduct.subcategorySlug,
              brand: apiProduct.brand,
              featured: apiProduct.featured,
              trending: apiProduct.trending,
              bestSeller: apiProduct.bestSeller,
              lovedByExperts: apiProduct.lovedByExperts,
              description: apiProduct.description,
              nutritionInfo: apiProduct.nutritionInfo,
              ingredients: apiProduct.ingredients?.map((ing) => ing.name) || [],
            })
          );
          setBestSellers(transformedBestSellers);
        }

        if (expertsResponse.success) {
          const transformedExperts = expertsResponse.data.map(
            (apiProduct: ApiProduct) => ({
              id: apiProduct.id,
              name: apiProduct.name,
              image: apiProduct.image,
              slug: apiProduct.slug,
              rating: apiProduct.rating || 0,
              reviews: apiProduct.reviews || 0,
              price: apiProduct.price,
              originalPrice: apiProduct.originalPrice,
              onSale: apiProduct.onSale,
              category: apiProduct.category,
              categorySlug: apiProduct.categorySlug,
              subcategory: apiProduct.subcategory,
              subcategorySlug: apiProduct.subcategorySlug,
              brand: apiProduct.brand,
              featured: apiProduct.featured,
              trending: apiProduct.trending,
              bestSeller: apiProduct.bestSeller,
              lovedByExperts: apiProduct.lovedByExperts,
              description: apiProduct.description,
              nutritionInfo: apiProduct.nutritionInfo,
              ingredients: apiProduct.ingredients?.map((ing) => ing.name) || [],
            })
          );
          setLovedByExperts(transformedExperts);
        }

        const allApiProducts = [
          ...(bestSellersResponse.data || []),
          ...(expertsResponse.data || []),
        ];
        const transformedAllProducts = allApiProducts.map(
          (apiProduct: ApiProduct) => ({
            id: apiProduct.id,
            name: apiProduct.name,
            image: apiProduct.image,
            slug: apiProduct.slug,
            rating: apiProduct.rating || 0,
            reviews: apiProduct.reviews || 0,
            price: apiProduct.price,
            originalPrice: apiProduct.originalPrice,
            onSale: apiProduct.onSale,
            category: apiProduct.category,
            categorySlug: apiProduct.categorySlug,
            subcategory: apiProduct.subcategory,
            subcategorySlug: apiProduct.subcategorySlug,
            brand: apiProduct.brand,
            featured: apiProduct.featured,
            trending: apiProduct.trending,
            bestSeller: apiProduct.bestSeller,
            lovedByExperts: apiProduct.lovedByExperts,
            description: apiProduct.description,
            nutritionInfo: apiProduct.nutritionInfo,
            ingredients: apiProduct.ingredients?.map((ing) => ing.name) || [],
          })
        );
        setProducts(transformedAllProducts);
      } catch (error) {
        console.error("Failed to load products from API:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  React.useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Dynamic product filtering functions
  const getFeaturedProducts = () =>
    products.filter((product) => product.featured);
  const getTrendingProducts = () =>
    products.filter((product) => product.trending);
  const getProductsByCategory = (categorySlug: string) =>
    products.filter((product) => product.categorySlug === categorySlug);
  const getBestSellerProducts = () => bestSellers;
  const getExpertProducts = () => lovedByExperts;

  const visibleCount = isDesktop ? 4 : 2;
  const bestSellerCarousel = useCarousel(getBestSellerProducts(), visibleCount);
  const expertCarousel = useCarousel(getExpertProducts(), isDesktop ? 2 : 1);
  const slides = isDesktop ? slidesData.desktop : slidesData.mobile;

  const handleAddToCart = (product: Product) => {
    addToCart(
      {
        id: String(product.id),
        name: product.name,
        price: product.price,
        image: product.image,
      },
      1
    );
  };

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.slug || product.id}`);
  };

  const features = [
    {
      icon: (
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      ),
      title: "Goal Achievement",
      description: "Reach your fitness goals faster",
      color: "from-[#F9A245] to-[#FEB47B]",
      iconBg: "bg-[#40B75D]",
    },
    {
      icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
      title: "Health & Wellness",
      description: "Support your overall health",
      color: "from-[#F9A245] to-[#FEB47B]",
      iconBg: "bg-[#40B75D]",
    },
    {
      icon: (
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      ),
      title: "Premium Quality",
      description: "Science-backed formulas",
      color: "from-[#F9A245] to-[#FEB47B]",
      iconBg: "bg-[#40B75D]",
    },
    {
      icon: (
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      ),
      title: "Customer Support",
      description: "Dedicated assistance",
      color: "from-[#F9A245] to-[#FEB47B]",
      iconBg: "bg-[#40B75D]",
    },
  ];

  React.useEffect(() => {
    const timer = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % activeBanners.length),
      5000
    );
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  React.useEffect(() => {
    if (!bestSellerAutoSlide || bestSellerCarousel.isPaused) return;
    const timer = setInterval(() => {
      bestSellerCarousel.next();
    }, 6000);
    return () => {
      clearInterval(timer);
    };
  }, [
    bestSellerAutoSlide,
    bestSellerCarousel.isPaused,
    bestSellerCarousel.next,
  ]);

  React.useEffect(() => {
    if (!expertAutoSlide || expertCarousel.isPaused) return;
    const timer = setInterval(() => {
      expertCarousel.next();
    }, 8000);
    return () => {
      clearInterval(timer);
    };
  }, [expertAutoSlide, expertCarousel.isPaused, expertCarousel.next]);

  const SectionTitle = ({
    primary,
    secondary,
  }: {
    primary: string;
    secondary: string;
  }) => {
    return (
      <div className="text-center space-y-2 mb-8">
        <h2 className="font-bold text-gray-900 tracking-tight leading-tight text-[clamp(1.875rem,3vw,2.5rem)]">
          {primary} <span className="text-[#F9A245]">{secondary}</span>
        </h2>
      </div>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="bg-gradient-to-b from-[#fff9f2] to-[#f8fafc] overflow-x-hidden min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#F9A246] mb-4"></div>
          <p className="text-gray-600 font-medium">
            Loading Best Sellers & Expert Picks...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section
        className={`relative bg-gradient-to-b from-[#f8fafc] via-[#fff9f2] to-[#f8fafc] ${isDesktop ? "min-h-[500px]" : ""}`}
        style={{
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
          marginRight: "calc(-50vw + 50%)",
        }}
      >
        <div className={`relative w-full overflow-hidden`}>
          {/* Dynamic Banners */}
          {activeBanners.map((banner, i) => (
            <div key={i} className={currentSlide === i ? "block" : "hidden"}>
              <div className={`relative w-full animate-fade-in`}>
                <img
                  src={isDesktop ? banner.desktopImage : banner.mobileImage}
                  alt="Banner"
                  className="w-full h-auto"
                  onError={(e) => {
                    e.currentTarget.src = isDesktop
                      ? desktopBanner1
                      : mobileBanner1;
                  }}
                />
                {/* Dot Indicators - positioned on image */}
                {currentSlide === i && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center space-x-2 z-10">
                    {activeBanners.map((_, dotIndex) => (
                      <button
                        key={dotIndex}
                        onClick={() => setCurrentSlide(dotIndex)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          dotIndex === currentSlide
                            ? "bg-[#F9A245] w-6"
                            : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-8 bg-gradient-to-b from-[#f8fafc] via-[#fff9f2] to-[#f8fafc] md:-mt-1"
        style={{
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
          marginRight: "calc(-50vw + 50%)",
          paddingLeft: "clamp(1rem, 4vw, 4rem)",
          paddingRight: "clamp(1rem, 4vw, 4rem)",
        }}
      >
        <div className="w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              icon: (
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              ),
              title: "Free Shipping",
              desc: "Free shipping over ₹600",
            },
            {
              icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
              title: "Secure Checkout",
              desc: "100% protected payment",
            },
            {
              icon: (
                <path d="M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
              ),
              title: "Expert Support",
              desc: "Available 24/7 support",
            },
            {
              icon: (
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              ),
              title: "Top Quality",
              desc: "Premium quality products",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3 p-4 rounded-2xl bg-white border border-gray-200 
             hover:bg-[#41B75D] hover:border-[#41B75D] transition-all duration-300 
             hover:shadow-lg transform hover:-translate-y-1 group"
            >
              <div
                className="p-2 rounded-lg text-black group-hover:text-white 
               transition-colors duration-300"
              >
                <div className="w-8 h-8">
                  <SvgIcon size={32}>{item.icon}</SvgIcon>
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3
                  className="font-semibold text-base text-gray-900 
                 group-hover:text-white transition-colors"
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm text-gray-500 
                 group-hover:text-white/80 transition-colors"
                >
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div
        className="bg-gradient-to-b from-[#f8fafc] via-[#fff9f2] to-[#f8fafc] overflow-x-hidden"
        style={{
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
          marginRight: "calc(-50vw + 50%)",
        }}
      >
        {/* Best Sellers - Only show if products are marked as bestSeller */}
        {bestSellers.length > 0 && (
          <section
            className="py-8 bg-gradient-to-b from-[#f8fafc] via-[#fff9f2] to-[#f8fafc] rounded-t-3xl relative z-10"
            style={{
              width: "100vw",
              marginLeft: "calc(-50vw + 50%)",
              marginRight: "calc(-50vw + 50%)",
              paddingLeft: "clamp(1rem, 4vw, 4rem)",
              paddingRight: "clamp(1rem, 4vw, 4rem)",
            }}
          >
            <div className="w-full">
              <SectionTitle primary="BEST" secondary="SELLERS" />

              <div className="relative">
                {/* Right Navigation Button */}
                <button
                  onClick={() => {
                    bestSellerCarousel.next();
                    bestSellerCarousel.pauseAutoPlay();
                    setTimeout(() => bestSellerCarousel.resumeAutoPlay(), 3000);
                  }}
                  className="absolute -right-1 sm:-right-3 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-[#F9A245] hover:text-white transition-colors border border-gray-200"
                >
                  <ChevronRight size={20} />
                </button>

                {/* Carousel */}
                <div className="overflow-hidden">
                  <div className="flex transition-transform duration-1000 ease-in-out">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full p-1">
                      {bestSellerCarousel.visible.map((product) => (
                        <div
                          key={product.id}
                          className="group min-h-[360px] rounded-xl shadow-md hover:shadow-xl border border-[#fcd8ae] hover:border-[#F9A245] transition-all duration-300 ease-out hover:-translate-y-1 overflow-hidden bg-gradient-to-br from-white to-gray-50"
                        >
                          <div className="p-0 h-full flex flex-col">
                            {/* Image */}
                            <div
                              className="aspect-square bg-gray-50 overflow-hidden flex items-center justify-center relative cursor-pointer"
                              onClick={() => handleProductClick(product)}
                            >
                              <img
                                src={`${product.image}?w=1024&h=1024&fit=crop`}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                              />
                            </div>

                            {/* Info */}
                            <div className="p-4 space-y-3 flex-grow">
                              <span
                                className="text-sm sm:text-base font-normal text-gray-800 leading-snug line-clamp-2 group-hover:text-[#F9A245] transition-colors cursor-pointer"
                                onClick={() => handleProductClick(product)}
                              >
                                {product.name}
                              </span>
                              <div className="flex items-center space-x-2">
                                <StarRating
                                  rating={product.rating || 0}
                                  size={16}
                                  color="#F9A245"
                                  emptyColor="#E5E7EB"
                                />
                                <span className="text-sm text-gray-500">
                                  ({product.reviews || 0})
                                </span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <span className="text-xl font-bold text-gray-900">
                                  ₹{product.price.toLocaleString()}
                                </span>
                                {product.originalPrice && (
                                  <span className="text-base text-gray-500 line-through">
                                    ₹{product.originalPrice.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Button */}
                            <div className="p-4 pt-0">
                              <button
                                onClick={() => handleAddToCart(product)}
                                className="w-full text-xs sm:text-sm font-medium h-9 rounded-lg border border-[#F9A245] bg-[#F9A245] text-white transition-all duration-300 ease-in-out hover:bg-transparent hover:text-gray-800"
                              >
                                ADD TO CART
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Shop by Goal Component */}
        <ShopByGoal />

        {/* Subscribe CTA Section */}
        <section
          className="py-12 sm:py-16 bg-gradient-to-b from-[#f8fafc] via-[#fff9f2] to-[#f8fafc] relative overflow-hidden"
          style={{
            width: '100vw',
            marginLeft: 'calc(-50vw + 50%)',
            marginRight: 'calc(-50vw + 50%)',
            paddingLeft: "clamp(1rem, 4vw, 4rem)",
            paddingRight: "clamp(1rem, 4vw, 4rem)",
          }}
        >
          <div className="w-full">
            <div className="relative overflow-hidden rounded-lg sm:rounded-2xl shadow-lg" style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}>
              <div className="absolute inset-0 bg-black bg-opacity-60"></div>
              
              <div className="relative z-10 py-8 sm:py-12 px-4 sm:px-8">
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-3 tracking-tight text-[#F9A245]">🚀 Join 10,000+ Athletes!</h2>
                  <p className="text-sm sm:text-lg text-white/90 font-medium">
                    Exclusive deals | Pro tips | Early access
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mt-4 text-sm text-white/80">
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span>No spam</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span>Unsubscribe anytime</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span>Exclusive deals</span>
                    </div>
                  </div>
                </div>
                <div className="max-w-lg sm:max-w-2xl mx-auto">
                  <SubscribeCTA 
                    variant="banner"
                    title=""
                    description=""
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Loved by Experts - Only show if products are marked as lovedByExperts */}
        {lovedByExperts.length > 0 && (
          <section
            className="py-8 bg-gradient-to-b from-[#f8fafc] via-[#fff9f2] to-[#f8fafc] relative z-10"
            style={{
              width: "100vw",
              marginLeft: "calc(-50vw + 50%)",
              marginRight: "calc(-50vw + 50%)",
              paddingLeft: "clamp(1rem, 4vw, 4rem)",
              paddingRight: "clamp(1rem, 4vw, 4rem)",
            }}
          >
            <div className="w-full">
              <div className="text-center space-y-2 mb-8">
                <h2 className="font-bold text-gray-900 tracking-tight leading-tight text-[clamp(1.875rem,3vw,2.5rem)]">
                  LOVED BY <span className="text-[#F9A245]">EXPERTS</span>
                </h2>
              </div>

              {/* Carousel Container */}
              <div className="relative overflow-hidden">
                {/* Right Navigation Button - FIXED */}
                <button
                  onClick={() => {
                    expertCarousel.next();
                    expertCarousel.pauseAutoPlay();
                    setTimeout(() => expertCarousel.resumeAutoPlay(), 3000);
                  }}
                  className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-10 
                   bg-white rounded-full shadow-md p-2 border border-gray-200 
                   hover:bg-[#F9A245] hover:text-white transition-colors"
                >
                  <ChevronRight size={20} />
                </button>

                {/* Carousel Slides */}
                <div className="overflow-hidden">
                  <div className="flex transition-transform duration-1000 ease-in-out">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 w-full">
                      {expertCarousel.visible.map((product) => (
                        <div
                          key={product.id}
                          className="group border-2 border-[#fcd8ae] rounded-xl 
                           bg-white shadow-lg hover:shadow-xl transition-all 
                           duration-300 overflow-hidden"
                          onClick={() => handleProductClick(product)}
                        >
                          <div className="md:flex h-full">
                            {/* Image */}
                            <div className="md:w-1/2">
                              <div
                                className="aspect-square bg-gray-100 flex items-center 
                                    justify-center overflow-hidden rounded-l-xl"
                              >
                                <img
                                  src={`${product.image}?w=1024&h=1024&fit=crop`}
                                  alt={product.name}
                                  className="w-full h-full object-cover transition-transform 
                                   duration-500 group-hover:scale-[1.03]"
                                />
                              </div>
                            </div>

                            {/* Content */}
                            <div
                              className="md:w-1/2 p-6 flex flex-col 
                                  justify-center space-y-4"
                            >
                              <span
                                className="text-sm sm:text-base font-normal text-gray-800 leading-snug line-clamp-2 group-hover:text-[#F9A245] transition-colors cursor-pointer"
                                onClick={() => handleProductClick(product)}
                              >
                                {product.name}
                              </span>

                              <div className="flex items-center space-x-2">
                                <StarRating
                                  rating={product.rating || 0}
                                  size={18}
                                  color="#F9A245"
                                  emptyColor="#E5E7EB"
                                />
                                <span className="text-sm sm:text-base text-gray-500">
                                  ({product.reviews || 0} reviews)
                                </span>
                              </div>

                              <div className="flex items-center space-x-2">
                                <span className="text-2xl font-bold text-gray-900">
                                  ₹{product.price.toLocaleString()}
                                </span>
                                {product.originalPrice && (
                                  <span className="text-lg text-gray-500 line-through">
                                    ₹{product.originalPrice.toLocaleString()}
                                  </span>
                                )}
                              </div>

                              {/* Add to Cart */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCart(product);
                                }}
                                className="w-full text-xs sm:text-sm font-medium h-9 rounded-lg border border-[#F9A245] bg-[#F9A245] text-white transition-all duration-300 ease-in-out hover:bg-transparent hover:text-gray-800"
                              >
                                ADD TO CART
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section
          className="py-12 bg-gradient-to-b from-[#f8fafc] via-[#fff9f2] to-[#f8fafc] relative overflow-hidden"
          style={{
            width: "100vw",
            marginLeft: "calc(-50vw + 50%)",
            marginRight: "calc(-50vw + 50%)",
            paddingLeft: "clamp(1rem, 4vw, 4rem)",
            paddingRight: "clamp(1rem, 4vw, 4rem)",
          }}
        >
          <div className="w-full relative z-10">
            <div className="text-center space-y-2 mb-8">
              <h2 className="font-bold text-gray-900 tracking-tight leading-tight text-[clamp(1.875rem,3vw,2.5rem)]">
                WHY CHOOSE <span className="text-[#F9A245]">O2 NUTRITION</span>
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Trusted by 10,000+ professionals worldwide
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                {
                  title: "Pharmaceutical Grade",
                  desc: "Rigorous testing ensures uncompromising purity and potency in every product.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                },
                {
                  title: "Clinical Research",
                  desc: "Backed by peer-reviewed studies from leading research institutions.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  ),
                },
                {
                  title: "Ethically Sourced",
                  desc: "Sustainably harvested ingredients free from artificial compounds.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  ),
                },
                {
                  title: "Elite Endorsed",
                  desc: "Trusted by Olympic athletes and world-class professionals globally.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  ),
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl border border-[#fcd8ae] hover:border-[#F9A245] transition-all duration-300 hover:-translate-y-1 min-h-[240px]"
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:scale-110"
                    style={{ 
                      backgroundImage: `url(${[
                        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
                        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
                        'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=300&fit=crop',
                        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
                      ][i]})` 
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 group-hover:from-[#F9A245]/80 group-hover:via-[#F9A245]/50 group-hover:to-[#F9A245]/30 transition-all duration-300" />
                  <div className="relative z-10 p-4 sm:p-6 text-center space-y-3 sm:space-y-4 h-full flex flex-col justify-center">
                    <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#F9A245] group-hover:scale-110 transition-all duration-300 border border-white/30">
                      {item.icon}
                    </div>
                    <h3 className="text-sm sm:text-lg font-bold text-white transition-colors drop-shadow-lg">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/90 leading-relaxed transition-colors drop-shadow-md">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="py-8 bg-gradient-to-b from-[#f8fafc] via-[#fff9f2] to-[#f8fafc]"
          style={{
            width: "100vw",
            marginLeft: "calc(-50vw + 50%)",
            marginRight: "calc(-50vw + 50%)",
            paddingLeft: "clamp(1rem, 4vw, 4rem)",
            paddingRight: "clamp(1rem, 4vw, 4rem)",
          }}
        >
          <div className="w-full">
            <div className="relative w-full h-[400px] xs:h-[450px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[640px] overflow-hidden rounded-xl shadow-xl isolate">
              {/* Full background image */}
              <img
                src={creativeBanner}
                alt="Athlete"
                className="absolute inset-0 w-full h-full object-cover object-center z-0"
              />

              {/* Orange ellipse - responsive sizing and positioning */}
              <div
                className="absolute bg-[#F9A245] rounded-full z-5"
                style={{
                  width: "clamp(250px, 50vw, 700px)",
                  height: "clamp(250px, 50vw, 700px)",
                  top: "clamp(-5px, -8vw, -60px)",
                  left: "clamp(-80px, -12vw, -140px)",
                  opacity: 1,
                }}
              />

              {/* Text inside ellipse - improved mobile layout */}
              <div
                className="absolute top-[8%] xs:top-[10%] sm:top-[15%] md:top-[15%] lg:top-[10%] left-[5%] xs:left-[6%] sm:left-[5%] md:left-[5%] lg:left-[5%] z-20 w-[50%] xs:w-[45%] sm:w-[85%] md:w-[60%] lg:w-[38%] p-3 xs:p-3 sm:p-4 text-white"
                style={{
                  boxSizing: "border-box",
                }}
              >
                <h3 className="uppercase font-bold tracking-tight text-[clamp(1rem,6vw,4.5rem)] leading-[0.9] xs:leading-[0.9] sm:leading-[1.05]">
                  FUEL YOUR
                  <br />
                  PASSION
                </h3>

                <p className="mt-1.5 xs:mt-1.5 sm:mt-4 text-[clamp(0.75rem,2.8vw,1.2rem)] leading-tight xs:leading-tight sm:leading-relaxed opacity-90 font-light">
                  Elevate your fitness journey with goal-based supplement
                  bundles. Whether you're bulking, shredding, or staying fit —
                  we've got your back.
                </p>

                <p className="mt-1 xs:mt-1 sm:mt-3 text-[clamp(0.75rem,2.8vw,1.2rem)] leading-tight xs:leading-tight sm:leading-relaxed opacity-90 font-light hidden xs:hidden sm:block">
                  Shop by goal and discover tailored nutritional solutions
                  trusted by athletes across the globe. Quality. Power. Results.
                </p>
              </div>

              {/* CTA pill bottom-right - improved mobile positioning */}
              <div className="absolute right-1.5 xs:right-1.5 sm:right-3 bottom-1.5 xs:bottom-1.5 sm:bottom-3 z-20">
                <button
                  onClick={() => navigate("/products")}
                  className="inline-flex items-center gap-1 xs:gap-1 sm:gap-2 rounded-lg bg-[#F9A245] hover:bg-transparent hover:text-gray-800 text-white font-medium px-3 py-2 text-xs sm:text-sm transition-all duration-300 border border-[#F9A245]"
                >
                  VIEW PRODUCTS
                  <svg
                    width="12"
                    height="12"
                    className="xs:w-3 xs:h-3 sm:w-4 sm:h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Sticky Cart Button */}
      {state.itemCount > 0 && (
        <div className="fixed bottom-4 right-4 z-[9999]">
          <button
            onClick={() => navigate("/cart")}
            className="bg-[#F9A245] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#e8933a] transition-all duration-300 flex items-center space-x-2"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="font-bold">{state.itemCount}</span>
          </button>
        </div>
      )}
    </>
  );
};

export default Index;
