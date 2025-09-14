import React, { useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import products from '@/data/homeproduct.json';
import categories from '@/data/categories.json';
import slidesData from '@/data/slide.json'; // Updated to use single JSON file

import skeletonOverlay from '@/assets/hv.png'; 
import { ChevronLeft, ChevronRight } from 'lucide-react'
type Product = {
  id: number;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  onSale?: boolean;
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

// Custom hook for premium scroll animations
const useScrollAnimation = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [hasAnimated, setHasAnimated] = React.useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, hasAnimated]);

  return { isVisible, elementRef };
};

// Hook for scroll-based header hiding
const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = React.useState('up');
  const [lastScrollY, setLastScrollY] = React.useState(0);

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? 'down' : 'up';
      if (direction !== scrollDirection && (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)) {
        setScrollDirection(direction);
      }
      setLastScrollY(scrollY > 0 ? scrollY : 0);
    };
    window.addEventListener('scroll', updateScrollDirection);
    return () => window.removeEventListener('scroll', updateScrollDirection);
  }, [scrollDirection, lastScrollY]);

  return scrollDirection;
};

const useCarousel = (items: any[], visibleCount: number) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  
  const next = React.useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % Math.max(1, items.length - visibleCount + 1));
  }, [items.length, visibleCount]);

  const prev = React.useCallback(() => {
    setCurrentIndex(prev => prev === 0 ? Math.max(0, items.length - visibleCount) : prev - 1);
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
    currentIndex
  };
};

const SvgIcon = ({ children, size = 24 }: { children: React.ReactNode, size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const StarRating = ({ 
  rating, 
  size = 14, 
  color = "#F9A245", 
  emptyColor = "#D1D5DB" 
}: { 
  rating: number; 
  size?: number;
  color?: string;
  emptyColor?: string;
}) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="relative" style={{ width: `${size}px`, height: `${size}px` }}>
        <div 
          className="absolute"
          style={{
            color: emptyColor,
            fontSize: `${size}px`,
            lineHeight: 1,
          }}
        >
          ★
        </div>
        {i < rating && (
          <div 
            className="absolute overflow-hidden"
            style={{
              width: i + 1 <= rating ? '100%' : `${(rating - i) * 100}%`,
              color: color,
              fontSize: `${size}px`,
              lineHeight: 1,
            }}
          >
            ★
          </div>
        )}
      </div>
    ))}
  </div>
);

// Premium Animated Section Component
const AnimatedSection: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const { isVisible, elementRef } = useScrollAnimation();
  
  return (
    <div
      ref={elementRef}
      className={`transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-12 scale-95'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Premium Box Animation Component
const AnimatedBox: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const { isVisible, elementRef } = useScrollAnimation(0.15);
  
  return (
    <div
      ref={elementRef}
      className={`transition-all duration-500 ease-out transform ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100 rotate-0' 
          : 'opacity-0 translate-y-8 scale-95 -rotate-1'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Index: React.FC = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isDesktop, setIsDesktop] = React.useState(false);
  const [bestSellerAutoSlide, setBestSellerAutoSlide] = React.useState(true);
  const [expertAutoSlide, setExpertAutoSlide] = React.useState(true);
  const { addToCart } = useCart();
  const { scrollY } = useScrollAnimation();

  React.useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const visibleCount = isDesktop ? 4 : 2;
  const bestSellerCarousel = useCarousel(products, visibleCount);
  const expertCarousel = useCarousel([...products, ...products, ...products], isDesktop ? 2 : 1);
  const slides = isDesktop ? slidesData.desktop : slidesData.mobile; // Updated to use single JSON file

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image
    }, 1);
  };

  const features = [
    {
      icon: <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />,
      title: 'Goal Achievement',
      description: 'Reach your fitness goals faster',
      color: 'from-[#F9A245] to-[#FEB47B]',
      iconBg: 'bg-[#40B75D]'
    },
    {
      icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
      title: 'Health & Wellness',
      description: 'Support your overall health',
      color: 'from-[#F9A245] to-[#FEB47B]',
      iconBg: 'bg-[#40B75D]'
    },
    {
      icon: <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />,
      title: 'Premium Quality',
      description: 'Science-backed formulas',
      color: 'from-[#F9A245] to-[#FEB47B]',
      iconBg: 'bg-[#40B75D]'
    },
    {
      icon: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
      title: 'Customer Support',
      description: 'Dedicated assistance',
      color: 'from-[#F9A245] to-[#FEB47B]',
      iconBg: 'bg-[#40B75D]'
    }
  ];

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(prev => (prev + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  React.useEffect(() => {
    if (!bestSellerAutoSlide || bestSellerCarousel.isPaused) return;
    console.log('Best Sellers auto-play started');
    const timer = setInterval(() => {
      console.log('Best Sellers auto-play triggered');
      bestSellerCarousel.next();
    }, 6000);
    return () => {
      console.log('Best Sellers auto-play stopped');
      clearInterval(timer);
    };
  }, [bestSellerAutoSlide, bestSellerCarousel.isPaused, bestSellerCarousel.next]);

  React.useEffect(() => {
    if (!expertAutoSlide || expertCarousel.isPaused) return;
    console.log('Expert carousel auto-play started');
    const timer = setInterval(() => {
      console.log('Expert carousel auto-play triggered');
      expertCarousel.next();
    }, 8000);
    return () => {
      console.log('Expert carousel auto-play stopped');
      clearInterval(timer);
    };
  }, [expertAutoSlide, expertCarousel.isPaused, expertCarousel.next]);

  const SectionTitle = ({ primary, secondary }: { primary: string; secondary: string }) => (
    <div className="text-center space-y-4 mb-10">
      <h2 className="font-bold text-3xl md:text-4xl lg:text-5xl text-gray-900 tracking-tight">
        {primary} <span className="text-[#F9A245]">{secondary}</span>
      </h2>
      <p className="font-medium text-base lg:text-lg text-gray-600 max-w-3xl mx-auto">
        Hand-picked favorites from our fitness experts
      </p>
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-[#fff9f2] to-[#f8fafc] relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[65vh] max-h-[700px] min-h-[400px] sm:h-[70vh] md:h-[95vh] lg:h-[600px] w-full z-10">
        <div className="relative w-full h-full overflow-hidden">
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                i === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div
                className="relative w-full h-full bg-cover bg-center flex items-end md:items-center animate-fade-in"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 md:bg-gradient-to-r md:from-black/60 md:via-black/30 md:to-transparent" />

                {/* Content */}
                <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-10 lg:pl-20 text-white pb-[50px] sm:pb-12 md:pb-16 lg:pb-20">
                  <div className="max-w-2xl space-y-3 sm:space-y-4 md:space-y-6 text-center md:text-left animate-slide-up">
                    
                    {/* Badge */}
                    <span className="hidden md:inline-block bg-[#41B75D] text-white text-[11px] sm:text-xs font-semibold px-3 py-1 rounded-md tracking-wide uppercase shadow-md animate-fade-in-slow">
                      {slides[currentSlide].badge}
                    </span>

                    {/* Heading */}
                    <h1 className="font-bold text-2xl sm:text-4xl md:text-4xl lg:text-5xl leading-snug tracking-tight drop-shadow-2xl animate-fade-in-slow">
                      {slides[currentSlide].heading}
                    </h1>

                    {/* Description */}
                    {isDesktop && (
                      <p className="text-sm sm:text-base md:text-lg font-medium text-white/90 leading-relaxed max-w-lg animate-fade-in-slow">
                        {slides[currentSlide].description}
                      </p>
                    )}

                    {/* CTA Button */}
                    <button className="bg-[#F9A245] hover:bg-[#FEB47B] text-white font-semibold text-xs sm:text-sm py-1.5 px-4 sm:py-3 sm:px-6 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-[#F9A245] hover:border-[#FEB47B] inline-flex items-center gap-2 animate-fade-in-slow mb-4 sm:mb-0">
                      {slides[currentSlide].primaryButtonText}
                      <SvgIcon size={18}>
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </SvgIcon>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Dot Indicators */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => {/* Add slide navigation logic */}}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
              >
                <div
                  className="relative w-full h-full bg-cover bg-center flex items-end md:items-center animate-fade-in"
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 md:bg-gradient-to-r md:from-black/60 md:via-black/30 md:to-transparent" />

          {/* Content */}
          <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-10 lg:pl-20 text-white pb-[50px] sm:pb-12 md:pb-16 lg:pb-20">
            <div className="max-w-2xl space-y-3 sm:space-y-4 md:space-y-6 text-center md:text-left animate-slide-up">
              
              {/* Badge */}
              <span className="hidden md:inline-block bg-[#41B75D] text-white text-[11px] sm:text-xs font-semibold px-3 py-1 rounded-md tracking-wide uppercase shadow-md animate-fade-in-slow">
                {slide.badge}
              </span>

              {/* Heading */}
              <h1 className="font-bold text-2xl sm:text-4xl md:text-4xl lg:text-5xl leading-snug tracking-tight drop-shadow-2xl animate-fade-in-slow">
                {slide.heading}
              </h1>

              {/* Description */}
              {isDesktop && (
                <p className="text-sm sm:text-base md:text-lg font-medium text-white/90 leading-relaxed max-w-lg animate-fade-in-slow">
                  {slide.description}
                </p>
              )}

              {/* CTA Button */}
              <button className="bg-[#F9A245] hover:bg-[#FEB47B] text-white font-semibold text-xs sm:text-sm py-1.5 px-4 sm:py-3 sm:px-6 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-[#F9A245] hover:border-[#FEB47B] inline-flex items-center gap-2 animate-fade-in-slow mb-4 sm:mb-0">
                {slide.primaryButtonText}
                <SvgIcon size={18}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </SvgIcon>
              </button>
            </div>
          </div>
        </div>
      </div>
    ))}

    {/* Dot Indicators */}
    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
      {slides.map((_, i) => (
        <button
          key={i}
          onClick={() => setCurrentSlide(i)}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            i === currentSlide ? 'bg-[#F9A245] w-6' : 'bg-white/50'
          }`}
        />
      ))}
    </div>
  </div>
        </div>
      </section>

      {/* Features Section with Animation */}
      <AnimatedSection>
        <section className="w-full px-2 sm:px-6 lg:px-8 py-6 sm:py-10">
  <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
    {[
      {
        icon: <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />,
        title: 'Free Shipping',
        desc: 'On orders over $50'
      },
      {
        icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
        title: 'Secure Checkout',
        desc: '100% protected'
      },
      {
        icon: <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 7a4 4 0 100 8 4 4 0 000-8z" />,
        title: 'Expert Support',
        desc: 'Available 24/7'
      },
      {
        icon: <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />,
        title: 'Top Quality',
        desc: 'Premium products'
      }
    ].map((item, i) => (
      <div
        key={i}
        className="flex items-start space-x-3 p-2 sm:p-4 rounded-xl bg-white border border-gray-200 hover:border-[#41B75D] transition-all duration-300 hover:shadow-md group transform hover:-translate-y-0.5"
      >
        <div className="p-2 rounded-lg text-[#41B75D] group-hover:bg-[#41B75D] group-hover:text-white transition-colors duration-300">
          <SvgIcon size={24}>{item.icon}</SvgIcon>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm sm:text-base text-gray-900 group-hover:text-[#41B75D] transition-colors">
            {item.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600">{item.desc}</p>
        </div>
      </div>
    ))}
  </div>
</section>
      </AnimatedSection>

      {/* Best Sellers with Animation */}
      <AnimatedSection>
        <section className="w-full px-2 sm:px-4 lg:px-8 py-8 sm:py-10 lg:py-12 bg-white bg-opacity-70 backdrop-blur-sm rounded-t-3xl -mt-6">
  <div className="max-w-7xl mx-auto">
    <SectionTitle primary="BEST" secondary="SELLERS" />

    <div className="relative">
      {/* Right Navigation Button */}
      <button
        onClick={() => {
          bestSellerCarousel.next();
          bestSellerCarousel.pauseAutoPlay();
          setTimeout(() => bestSellerCarousel.resumeAutoPlay(), 3000);
        }}
        className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 hover:bg-[#F9A245] hover:text-white transition-colors"
      >
        <ChevronRight size={20} />
      </button>

      {/* Carousel Container */}
      <div className="overflow-hidden px-1 sm:px-2">
        <div className="flex transition-transform duration-1000 ease-in-out">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 w-full">
            {bestSellerCarousel.visible.map(product => (
              <div
                key={product.id}
                className="group h-full rounded-xl shadow-sm hover:shadow-lg border border-[#fcd8ae] hover:border-[#F9A245]/70 transition-all duration-300 hover:-translate-y-1 overflow-hidden bg-white"
              >
                <div className="p-0 h-full flex flex-col">
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-50 overflow-hidden flex items-center justify-center relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.onSale && (
                      <div className="absolute top-2 left-2 bg-[#F9A245] text-white text-xs px-2 py-1 rounded-md font-medium">
                        SALE
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-3 space-y-1 flex-grow">
                    <span className="text-sm text-gray-800 leading-snug line-clamp-2 group-hover:text-[#F9A245] transition-colors">
                      {product.name}
                    </span>
                    <div className="flex items-center space-x-1">
                      <StarRating rating={product.rating} size={14} color="#F9A245" emptyColor="#D1D5DB" />
                      <span className="text-xs text-gray-500">({product.reviews})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-900">₹{product.price.toFixed(0)}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-500 line-through">₹{product.originalPrice.toFixed(0)}</span>
                      )}
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <div className="p-3 pt-0">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-[#F9A245] hover:bg-[#FEB47B] text-white font-normal text-sm rounded-lg h-9 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-1"
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
      </AnimatedSection>

      {/* Shop by Goal with Animation */}
      <AnimatedSection>
      <section className="w-full px-2 sm:px-4 lg:px-8 py-6 sm:py-10 lg:py-12 bg-gradient-to-br from-[#fff9f2] to-[#f0f4f8]">
  <div className="max-w-7xl mx-auto">
    <SectionTitle primary="SHOP BY" secondary="GOAL" />

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
      {categories.map(category => (
        <div
          key={category.id}
          className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#f2f2f2]"
        >
          {/* Image Wrapper */}
          <div className="aspect-[4/5] bg-gray-100 overflow-hidden relative">
            
            {/* Main Image (NO blur/scale on hover) */}
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover"
            />

            {/* Hover Gradient Overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#facc15]/70 via-[#f97316]/70 to-[#ec4899]/70 z-10 mix-blend-multiply pointer-events-none" />

            {/* Text Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex flex-col justify-end p-5 z-20">
              <div className="text-white">
                <h3 className="font-bold text-lg sm:text-xl lg:text-2xl mb-1 transition-all duration-300 group-hover:text-[#F9A245] group-hover:-translate-y-1">
                  {category.name}
                </h3>
                <p className="text-sm sm:text-base text-white/80 font-medium">
                  {category.count} products
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
      </section>
      </AnimatedSection>

      {/* Loved by Experts with Animation */}
      <AnimatedSection>
      <section className="w-full px-3 sm:px-6 lg:px-8 py-10 bg-white bg-opacity-80 backdrop-blur-sm">
  <div className="max-w-7xl mx-auto">
    <SectionTitle primary="LOVED BY" secondary="EXPERTS" />

    <div className="relative overflow-hidden px-1 sm:px-2">
      {/* Carousel */}
      <div className="overflow-hidden">
        <div className="flex transition-transform duration-1000 ease-in-out">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 w-full">
            {expertCarousel.visible.map(product => (
              <div
                key={product.id}
                className="group border-2 border-[#fcd8ae] rounded-xl bg-white shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="md:flex h-full">
                  {/* Image Section */}
                  <div className="md:w-1/2">
                    <div className="aspect-square bg-gray-50 flex items-center justify-center relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {product.onSale && (
                        <div className="absolute top-2 left-2 bg-[#F9A245] text-white font-bold text-xs px-2 py-1 rounded-md">
                          SALE
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="md:w-1/2 p-4 sm:p-6 flex flex-col justify-center space-y-3 sm:space-y-4">
                    <h3 className="font-semibold text-lg sm:text-xl group-hover:text-[#F9A245] transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <StarRating rating={product.rating} size={18} color="#F9A245" emptyColor="#D1D5DB" />
                      <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-normal text-xl text-gray-900">₹{product.price.toFixed(0)}</span>
                      {product.originalPrice && (
                        <span className="text-base text-gray-500 line-through">₹{product.originalPrice.toFixed(0)}</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-[#F9A245] hover:bg-[#FEB47B] text-white font-semibold py-2.5 px-5 rounded-lg transition duration-300 hover:scale-105 inline-flex items-center justify-center gap-2"
                    >
                      <SvgIcon size={18}>
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </SvgIcon>
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Nav Button */}
      <button 
        onClick={() => {
          expertCarousel.next();
          expertCarousel.pauseAutoPlay();
          setTimeout(() => expertCarousel.resumeAutoPlay(), 3000);
        }} 
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 hover:bg-[#F9A245] hover:text-white transition-colors"
      >
        <SvgIcon size={16}><path d="M9 18l6-6-6-6" /></SvgIcon>
      </button>
    </div>
  </div>
      </section>
      </AnimatedSection>

      {/* Features Section with Animation */}
      <AnimatedSection>
      <section className="w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20 bg-gradient-to-br from-[#fff7ed] via-[#f9fafb] to-[#f3f4f6]">
  <div className="max-w-7xl mx-auto">
    {/* Heading */}
    <div className="text-center mb-10 sm:mb-14">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
        <span className="block sm:inline">WHY CHOOSE</span>{" "}
        <span className="block sm:inline text-[#F9A245]">02 NUTRITION</span>
      </h2>
    </div>

    {/* Grid */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">

      {/* Box Template */}
      {[
        {
          title: "Intent-Driven Nutrition",
          desc: "Formulated with clean, functional ingredients that deliver real outcomes.",
          bg: "https://media.post.rvohealth.io/wp-content/uploads/2022/12/soy-protein-beans-tofu-732x549-thumbnail-732x549.jpg",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#F9A245]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17l-4-4m0 0l4-4m-4 4h8" />
            </svg>
          )
        },
        {
          title: "Science-Backed",
          desc: "Every formulation is rooted in scientific research and clinical evidence.",
          bg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSLqD9voKuua143iGyk_4-v2lvsnL74DZiTA&s",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#F9A245]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.341A8 8 0 118.659 4.572a8.002 8.002 0 0110.77 10.77z" />
            </svg>
          )
        },
        {
          title: "Natural Ingredients",
          desc: "Inspired by nature and crafted without unnecessary additives or fillers.",
          bg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ41Tni7sFbYThBlmMkSwUFfCuLBWfBmHLYQ&s",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#F9A245]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )
        },
        {
          title: "Trusted by Athletes",
          desc: "Endorsed by professionals who demand the best from their bodies.",
          bg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDx4bNrtN2pcfOt15vpFgRxLVFNMzlMgdkRQ&s",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#F9A245]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 010-5.656m1.414 1.414a2 2 0 010 2.828M9 13h6m2 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        }
      ].map((item, i) => (
        <div
          key={i}
          className="relative group aspect-square rounded-2xl overflow-hidden shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-transform border-2 border-transparent hover:border-[#F9A245]"
        >
          <div className="absolute inset-0 bg-cover bg-center z-0 group-hover:scale-105 transition-transform duration-300" style={{ backgroundImage: `url(${item.bg})` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10" />
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F9A245] to-[#FEEBCB] z-20" />
          <div className="relative z-20 p-4 sm:p-5 text-white text-center flex flex-col justify-center items-center h-full">
            <h3 className="text-sm sm:text-lg font-semibold flex items-center justify-center gap-2">
              {item.icon}
              {item.title}
            </h3>
            <p className="text-xs sm:text-sm mt-2 leading-snug">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
      </section>
      </AnimatedSection>

      {/* CTA Section with Animation */}
      <AnimatedSection>
        <section className="w-full px-2 sm:px-6 lg:px-8 pt-10 pb-14 lg:pb-24 bg-gradient-to-br from-[#fff9f2] to-[#f0f4f8]">
  <div className="max-w-7xl mx-auto">
    <div className="relative w-full min-h-[320px] sm:h-96 lg:h-[40rem] overflow-hidden rounded-xl shadow-xl group">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop)',
        }}
      />

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)',
        }}
      />

      {/* Content */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white px-4 w-full flex justify-center">
        <div className="text-center max-w-2xl space-y-4">
          <h3 className="font-extrabold text-2xl sm:text-3xl lg:text-5xl tracking-tight group-hover:text-[#F9A245] transition-colors duration-300">
            FUEL YOUR PASSION
          </h3>
          <p className="font-medium text-sm sm:text-base lg:text-lg opacity-90 leading-snug sm:leading-normal">
            Elevate your fitness journey with goal-based supplement bundles. Whether you're bulking, shredding, or staying fit — we’ve got your back.
          </p>
          <p className="hidden lg:block text-sm lg:text-base text-white/90">
            Shop by goal and discover tailored nutritional solutions trusted by athletes across the globe. Quality. Power. Results.
          </p>
          <button className="bg-[#F9A245] hover:bg-[#FEB47B] text-white text-xs sm:text-sm font-semibold py-2 px-6 rounded-full transition-all duration-300 hover:scale-105 shadow-md inline-flex items-center gap-2 group-hover:shadow-[0_4px_14px_rgba(249,162,69,0.5)] mt-2">
            EXPLORE NOW
            <SvgIcon size={18}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </SvgIcon>
          </button>
        </div>
      </div>
    </div>
  </div>
        </section>
      </AnimatedSection>

    </div>
  );
};

export default Index;