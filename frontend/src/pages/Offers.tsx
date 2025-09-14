import React, { useState, useEffect } from "react";
import {
  Clock,
  Star,
  Tag,
  Gift,
  Zap,
  Target,
  Percent,
  ShoppingCart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { productApi, Product } from "@/services/api";
import SubscribeCTA from "@/components/SubscribeCTA";
import PageLoader from "@/components/PageLoader";

const Offers: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [hotDeals, setHotDeals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOfferProducts = async () => {
      try {
        setLoading(true);
        const response = await productApi.getProducts({ onSale: true, limit: 8 });
        if (response.success) {
          setHotDeals(response.data);
        }
      } catch (error) {
        console.error('Failed to load offer products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOfferProducts();
  }, []);

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.slug || product.id}`);
  };

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

  const calculateDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  const offerCategories = [
    {
      name: "Flash Sale",
      icon: Zap,
      color: "from-red-500 to-orange-500",
      count: "25+",
    },
    {
      name: "Bundle Offers",
      icon: Gift,
      color: "from-purple-500 to-pink-500",
      count: "15+",
    },
    {
      name: "Clearance",
      icon: Tag,
      color: "from-green-500 to-teal-500",
      count: "50+",
    },
    {
      name: "New Launches",
      icon: Target,
      color: "from-blue-500 to-indigo-500",
      count: "10+",
    },
  ];

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading font-bold text-4xl lg:text-5xl text-foreground mb-6">
            Offer Zone
          </h1>
          <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover amazing deals and exclusive offers on premium supplements.
            Limited time savings on your favorite health and fitness products.
          </p>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {offerCategories.map((category, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 sm:p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-100"
              >
                <div
                  className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 bg-gradient-to-br ${category.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <category.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">
                  {category.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#F9A245] font-medium">
                  {category.count} deals
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hot Deals with Background Banner */}
      <section
        className="relative py-12 sm:py-16 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=1920&h=1080&fit=crop')`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-bold text-3xl sm:text-4xl text-white mb-4">
              🔥 HOT DEALS 🔥
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Limited time offers - grab them before they're gone!
            </p>
          </div>

          {hotDeals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {hotDeals.map((deal) => (
                <div
                  key={deal.id}
                  className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden cursor-pointer"
                  onClick={() => handleProductClick(deal)}
                >
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <img
                      src={deal.image}
                      alt={deal.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {deal.originalPrice && (
                      <div className="absolute top-2 left-2">
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          -{calculateDiscount(deal.originalPrice, deal.price)}%
                        </span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Limited
                    </div>
                  </div>

                  <div className="p-3 sm:p-4">
                    <p className="text-xs text-[#F9A245] font-semibold mb-1">
                      {deal.brand}
                    </p>
                    <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2">
                      {deal.name}
                    </h3>

                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < Math.floor(deal.rating || 0) ? "text-[#F9A245] fill-current" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-2">
                        ({deal.rating || 0})
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-base text-gray-900">
                          ₹{deal.price.toLocaleString()}
                        </span>
                        {deal.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{deal.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(deal);
                      }}
                      className="w-full bg-[#F9A245] hover:bg-[#FEB47B] text-white font-semibold text-sm py-2 rounded-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-white font-medium text-lg mb-4">No offers available at the moment</p>
              <p className="text-white/80">Check back soon for amazing deals!</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter with Gradient Background */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-[#f8fafc] via-[#fff9f2] to-[#f8fafc] relative overflow-hidden">
        <div className="relative overflow-hidden rounded-xl mx-4 sm:mx-6 lg:mx-8" style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#F9A245]/80 via-[#E86A12]/70 to-[#40B75D]/80"></div>
          <div className="relative z-10 py-12 sm:py-16 px-4 sm:px-8">
            <div className="text-center text-white mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4">🎯 Never Miss a Deal!</h2>
              <p className="text-base sm:text-xl opacity-90">Get exclusive offers & supplement deals delivered to your inbox</p>
            </div>
            <div className="max-w-4xl mx-auto">
              <SubscribeCTA 
                variant="banner"
                title=""
                description=""
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Offers;
