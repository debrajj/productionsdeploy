import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  MapPin,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import MegaMenu from "./MegaMenu";
import BestsellerMegaMenu from "@/data/bestseller_mega";
import BrandsMegaMenu from "./BrandsMegaMenu";
import AnnouncementBar from "./AnnouncementBar";

import logoImage from "@/assets/O2logo.png";
import { productApi, Product, searchApi, SearchSuggestion } from "@/services/api";

// Custom SVG Icons - All in gray color
const StarIcon = ({ className = "w-4 h-4 text-gray-500" }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const TagIcon = ({ className = "w-4 h-4 text-gray-500" }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7a1 1 0 011.414-1.414L10 14.586l6.293-6.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
    <path
      fillRule="evenodd"
      d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm12 0H5v10h10V5z"
      clipRule="evenodd"
    />
  </svg>
);

const TargetIcon = ({ className = "w-4 h-4 text-gray-500" }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z"
      clipRule="evenodd"
    />
  </svg>
);

const BlogIcon = ({ className = "w-4 h-4 text-gray-500" }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
  </svg>
);

const GiftIcon = ({ className = "w-4 h-4 text-gray-500" }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z"
      clipRule="evenodd"
    />
    <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
  </svg>
);

const SupportIcon = ({ className = "w-4 h-4 text-gray-500" }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
      clipRule="evenodd"
    />
  </svg>
);

const RocketIcon = ({ className = "w-4 h-4 text-gray-500" }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M11.933 13.069s7.059-5.094 6.276-10.924a.465.465 0 00-.112-.268.436.436 0 00-.263-.115C12.137.961 7.16 8.184 7.16 8.184c-4.318-.517-4.004.344-5.974 5.076-.377.902.234 1.213.904.959l2.148-.811 2.59 2.648-.793 2.199c-.248.686.055 1.311.938.926 4.624-2.016 5.466-1.694 4.96-6.112z" />
  </svg>
);

const Header: React.FC = () => {
  const { state } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Force re-render when location changes
  useEffect(() => {
    // This ensures header updates when navigation occurs
  }, [location.pathname]);
  
  // Fallback navigation for when React Router fails
  const handleNavigation = (path: string) => {
    try {
      navigate(path);
    } catch (error) {
      // If React Router fails, use window.location
      window.location.href = path;
    }
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Mumbai");
  const [desktopMegaMenuOpen, setDesktopMegaMenuOpen] = useState(false);
  const [desktopBestsellerMenuOpen, setDesktopBestsellerMenuOpen] =
    useState(false);
  const [desktopBrandsMenuOpen, setDesktopBrandsMenuOpen] = useState(false);

  const [desktopSupportMenuOpen, setDesktopSupportMenuOpen] = useState(false);
  const [desktopHamburgerMenuOpen, setDesktopHamburgerMenuOpen] = useState(false);
  const hamburgerMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mobile menu states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMegaMenuOpen, setMobileMegaMenuOpen] = useState(false);
  const [mobileBestsellerMenuOpen, setMobileBestsellerMenuOpen] =
    useState(false);
  const [mobileBrandsMenuOpen, setMobileBrandsMenuOpen] = useState(false);

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Refs for hover delay timeouts
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const bestsellerMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const brandsMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const supportMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Hover delay functions for mega menus
  const handleMegaMenuEnter = () => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
    }
    // Close other menus first
    setDesktopBestsellerMenuOpen(false);
    setDesktopBrandsMenuOpen(false);
    setDesktopSupportMenuOpen(false);
    setDesktopMegaMenuOpen(true);
  };

  const handleMegaMenuLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setDesktopMegaMenuOpen(false);
    }, 150);
  };

  const handleBestsellerMenuEnter = () => {
    if (bestsellerMenuTimeoutRef.current) {
      clearTimeout(bestsellerMenuTimeoutRef.current);
    }
    // Close other menus first
    setDesktopMegaMenuOpen(false);
    setDesktopBrandsMenuOpen(false);
    setDesktopSupportMenuOpen(false);
    setDesktopBestsellerMenuOpen(true);
  };

  const handleBestsellerMenuLeave = () => {
    bestsellerMenuTimeoutRef.current = setTimeout(() => {
      setDesktopBestsellerMenuOpen(false);
    }, 150);
  };

  const handleBrandsMenuEnter = () => {
    if (brandsMenuTimeoutRef.current) {
      clearTimeout(brandsMenuTimeoutRef.current);
    }
    // Close other menus first
    setDesktopMegaMenuOpen(false);
    setDesktopBestsellerMenuOpen(false);
    setDesktopSupportMenuOpen(false);
    setDesktopBrandsMenuOpen(true);
  };

  const handleBrandsMenuLeave = () => {
    brandsMenuTimeoutRef.current = setTimeout(() => {
      setDesktopBrandsMenuOpen(false);
    }, 150);
  };

  const handleSupportMenuEnter = () => {
    if (supportMenuTimeoutRef.current) {
      clearTimeout(supportMenuTimeoutRef.current);
    }
    // Close other menus first
    setDesktopMegaMenuOpen(false);
    setDesktopBestsellerMenuOpen(false);
    setDesktopBrandsMenuOpen(false);
    setDesktopSupportMenuOpen(true);
  };

  const handleSupportMenuLeave = () => {
    supportMenuTimeoutRef.current = setTimeout(() => {
      setDesktopSupportMenuOpen(false);
    }, 150);
  };

  // State for products from API
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);

  // Load products from API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await productApi.getProducts({ limit: 100 });
        if (response.success) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error('Failed to load products:', error);
        // Fallback to empty array for search
        setProducts([]);
      } finally {
        setProductsLoaded(true);
      }
    };

    loadProducts();
  }, []);

  // Search functionality using API with suggestions - Instant search from 1 character
  const performSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchSuggestions([]);
      setShowSearchResults(false);
      return;
    }

    // Enable instant search from 1 character
    if (searchQuery.trim().length < 1) {
      setSearchResults([]);
      setSearchSuggestions([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);

    try {
      // Get both search suggestions and product results instantly
      const [suggestionsRes, productsRes] = await Promise.all([
        searchApi.getSearchSuggestions(searchQuery.trim()),
        productApi.searchProducts(searchQuery.trim(), 8)
      ]);

      if (suggestionsRes.success) {
        setSearchSuggestions(suggestionsRes.data);
      }

      if (productsRes.success) {
        setSearchResults(productsRes.data);
      }

      setShowSearchResults(true);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
      setSearchSuggestions([]);
      setShowSearchResults(true);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (value.trim().length >= 1) {
      // Debounce search for better performance
      searchTimeoutRef.current = setTimeout(() => {
        performSearch();
      }, 300); // 300ms delay
    } else {
      setSearchResults([]);
      setSearchSuggestions([]);
      setShowSearchResults(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchSuggestions([]);
    setShowSearchResults(false);
  };

  const handleProductClick = (product) => {
    const productSlug = product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    console.log("Navigating to product:", productSlug);
    clearSearch();
    setMobileSearchOpen(false);

    // Small delay to ensure search is cleared before navigation
    setTimeout(() => {
      navigate(`/product/${product.id}`);
    }, 100);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSearchResults && !event.target.closest(".search-container")) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearchResults]);

  // Use a more stable scroll state system
  const [scrollState, setScrollState] = useState({
    isScrolled: false,
    scrollY: 0,
  });

  const scrollTimeoutRef = useRef(null);
  const lastScrollY = useRef(0);

  // Improved scroll handler with debouncing and hysteresis
  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 100;
      const hysteresis = 20;

      if (Math.abs(currentScrollY - lastScrollY.current) > 5) {
        const shouldHide =
          currentScrollY >
          scrollThreshold + (scrollState.isScrolled ? -hysteresis : hysteresis);

        setScrollState((prev) => {
          if (prev.isScrolled !== shouldHide) {
            return { isScrolled: shouldHide, scrollY: currentScrollY };
          }
          return prev;
        });

        lastScrollY.current = currentScrollY;
      }
    }, 10);
  }, [scrollState.isScrolled]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  const handleDesktopMegaMenuToggle = () => {
    setDesktopMegaMenuOpen((prev) => !prev);
    setDesktopSupportMenuOpen(false);
  };

  const handleMobileMegaMenuToggle = () => {
    setMobileMegaMenuOpen((prev) => !prev);
    setMobileBestsellerMenuOpen(false);
    setMobileBrandsMenuOpen(false);
  };

  const handleMobileBestsellerMenuToggle = () => {
    setMobileBestsellerMenuOpen((prev) => !prev);
    setMobileMegaMenuOpen(false);
    setMobileBrandsMenuOpen(false);
  };

  const handleMobileBrandsMenuToggle = () => {
    setMobileBrandsMenuOpen((prev) => !prev);
    setMobileMegaMenuOpen(false);
    setMobileBestsellerMenuOpen(false);
  };

  const handleSearch = (searchValue) => {
    if (searchValue && searchValue.trim().length >= 1) {
      clearSearch();
      setMobileSearchOpen(false);
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileMegaMenuOpen(false);
    setMobileBestsellerMenuOpen(false);
    setMobileBrandsMenuOpen(false);
    setMobileSearchOpen(false);
  };

  const handleSupportMenuToggle = () => {
    setDesktopSupportMenuOpen((prev) => !prev);
    setDesktopMegaMenuOpen(false);
  };

  const toggleMobileSearch = () => {
    setMobileSearchOpen((prev) => !prev);
    // Close menu if open when opening search
    if (!mobileSearchOpen && mobileMenuOpen) {
      setMobileMenuOpen(false);
      setMobileMegaMenuOpen(false);
      setMobileBestsellerMenuOpen(false);
      setMobileBrandsMenuOpen(false);
    }
  };

  return (
    <>
      <AnnouncementBar />
      <header className="bg-white shadow-md sticky top-0 z-[9998]">
        {/* Desktop Header Layout */}
        <div className="hidden md:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Top Row - Fixed height container to prevent layout shift */}
            <div
              className="overflow-hidden transition-all duration-300 ease-out"
              style={{
                height: scrollState.isScrolled ? "0px" : "80px",
                opacity: scrollState.isScrolled ? 0 : 1,
              }}
            >
              <div className="flex justify-between items-center h-20 py-4">
                {/* Logo */}
                <Link
                  to="/"
                  className="flex items-center cursor-pointer flex-shrink-0"
                >
                  <img
                    src={logoImage}
                    alt="O2 Nutrition Logo"
                    className="h-auto w-[260px] object-contain pt-4 pb-4"
                  />
                </Link>

                {/* Desktop Search Bar - Center */}
                <div className="flex items-center flex-1 max-w-xl mx-8">
                  <div className="relative w-full search-container">
                    <input
                      type="text"
                      placeholder="Search for products & brands..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9A246] focus:border-transparent text-sm bg-gray-50 font-['League_Spartan']"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearch(e.target.value);
                        }
                      }}
                    />
                    {searchQuery && (
                      <button
                        onClick={clearSearch}
                        className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 cursor-pointer" />

                    {/* Search Results Dropdown */}
                    {(showSearchResults ||
                      (searchQuery.length > 0 && searchQuery.length < 3)) && (
                      <div
                        className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] max-h-96 overflow-y-auto"
                        style={{
                          position: "fixed",
                          top: "120px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "calc(100vw - 2rem)",
                          maxWidth: "800px",
                        }}
                      >
                        {searchQuery.length > 0 && searchQuery.length < 1 && (
                          <div className="p-4 text-center bg-blue-50 border-b border-blue-200">
                            <p className="text-blue-700 text-sm">
                              💡 Start typing to search instantly
                            </p>
                          </div>
                        )}
                        {isSearching ? (
                          <div className="p-4 text-center">
                            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#F9A246]"></div>
                            <p className="mt-2 text-sm text-gray-600">
                              Searching...
                            </p>
                          </div>
                        ) : (searchSuggestions.length > 0 || searchResults.length > 0) ? (
                          <div>
                            <div className="flex items-center justify-between p-3 border-b border-gray-100">
                              <span className="text-sm font-medium text-gray-700">
                                Search Results
                              </span>
                              <button
                                onClick={clearSearch}
                                className="text-xs text-[#F9A246] hover:text-[#e8933a]"
                              >
                                Clear
                              </button>
                            </div>
                            
                            {/* Search Suggestions */}
                            {searchSuggestions.length > 0 && (
                              <div className="border-b border-gray-100">
                                <div className="p-2">
                                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">
                                    Suggestions
                                  </h4>
                                  {searchSuggestions.map((suggestion, index) => (
                                    <div
                                      key={`${suggestion.type}-${index}`}
                                      onClick={() => {
                                        setSearchQuery(suggestion.value);
                                        if (suggestion.type === 'product') {
                                          const product = searchResults.find(p => p.name === suggestion.value);
                                          if (product) handleProductClick(product);
                                        } else {
                                          setTimeout(() => performSearch(), 100);
                                        }
                                      }}
                                      className="flex items-center p-2 hover:bg-gray-50 cursor-pointer rounded-md mx-1"
                                    >
                                      <div className="flex items-center space-x-2">
                                        {suggestion.type === 'brand' && <TagIcon className="w-4 h-4 text-blue-500" />}
                                        {suggestion.type === 'category' && <TargetIcon className="w-4 h-4 text-green-500" />}
                                        {suggestion.type === 'product' && <Search className="w-4 h-4 text-orange-500" />}
                                        <span className="text-sm text-gray-700">{suggestion.value}</span>
                                        <span className="text-xs text-gray-400 capitalize">({suggestion.type})</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Product Results */}
                            {searchResults.length > 0 && (
                              <div>
                                <div className="p-2">
                                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">
                                    Products ({searchResults.length})
                                  </h4>
                                </div>
                                <div className="max-h-60 overflow-y-auto">
                                  {searchResults.slice(0, 6).map((product) => (
                                <div
                                  key={product.id}
                                  onClick={() => handleProductClick(product)}
                                  onTouchEnd={(e) => {
                                    e.preventDefault();
                                    handleProductClick(product);
                                  }}
                                  className="flex items-center p-3 hover:bg-gray-50 active:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 touch-manipulation"
                                >
                                  <img
                                    src={`${product.image}?w=60&h=60&fit=crop`}
                                    alt={product.name}
                                    className="w-12 h-12 object-cover rounded-lg mr-3"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                      {product.name}
                                    </h4>
                                    <p className="text-xs text-gray-500 truncate">
                                      {product.brand} •{" "}
                                      {product.categorySlug?.replace(/-/g, " ")}
                                    </p>
                                    <p className="text-sm font-bold text-[#F9A246]">
                                      ₹{product.price.toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                                {searchResults.length > 6 && (
                                  <div className="p-3 border-t border-gray-100 text-center">
                                    <span className="text-xs text-gray-500">
                                      Showing 6 of {searchResults.length} results
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ) : searchQuery.length >= 1 ? (
                          <div className="p-4 text-center">
                            <Search className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">
                              No results found
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Try different keywords
                            </p>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side - Login & Cart */}
                <div className="flex items-center space-x-6 flex-shrink-0">
                  <Link
                    to="/cart"
                    className="relative flex items-center cursor-pointer"
                  >
                    <div className="relative bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition-colors">
                      <ShoppingCart className="h-6 w-6 text-gray-700" />
                      {state.itemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold font-['League_Spartan']">
                          {state.itemCount > 99 ? "99+" : state.itemCount}
                        </span>
                      )}
                    </div>
                  </Link>

                  {user ? (
                    <div className="flex items-center space-x-4">
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-2 text-gray-700 hover:text-[#F9A246] transition-colors cursor-pointer"
                      >
                        <User className="h-5 w-5" />
                        <span className="font-medium">{user.firstName || 'User'}</span>
                      </Link>
                      <button
                        onClick={logout}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium font-['League_Spartan']"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      className="bg-[#F9A246] text-white px-6 py-2 rounded-lg hover:bg-[#e8933a] transition-colors font-medium font-['League_Spartan']"
                    >
                      Login
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Row - Always visible with fixed height */}
            <div className="border-t border-gray-200 mt-4">
              <div className="h-16 flex items-center">
                {" "}
                {/* Fixed height container */}
                <nav className="flex items-center justify-center space-x-8 font-['League_Spartan'] w-full text-sm">
                  {/* Shop By Category */}
                  <div
                    className="relative"
                    onMouseEnter={handleMegaMenuEnter}
                    onMouseLeave={handleMegaMenuLeave}
                  >
                    <button className="flex items-center space-x-2 text-gray-700 hover:text-white whitespace-nowrap py-2 transition-colors font-medium bg-gray-100 hover:bg-[#F9A246] px-4 rounded-lg">
                      <Menu className="h-4 w-4 text-gray-500" />
                      <span>Shop By Category</span>
                    </button>

                    {desktopMegaMenuOpen && (
                      <div
                        className="absolute top-full left-0 w-auto min-w-[900px] mt-2 z-[9997] bg-white shadow-xl border border-gray-200 rounded-lg font-['League_Spartan']"
                        onMouseEnter={handleMegaMenuEnter}
                        onMouseLeave={handleMegaMenuLeave}
                      >
                        <MegaMenu
                          onClose={() => setDesktopMegaMenuOpen(false)}
                        />
                      </div>
                    )}
                  </div>

                  <div
                    className="relative"
                    onMouseEnter={handleBestsellerMenuEnter}
                    onMouseLeave={handleBestsellerMenuLeave}
                  >
                    <button className="flex items-center space-x-2 text-gray-700 hover:text-[#F9A246] py-2 transition-colors font-medium whitespace-nowrap">
                      <StarIcon />
                      <span>Best Sellers</span>
                    </button>

                    {desktopBestsellerMenuOpen && (
                      <div
                        className="absolute top-full left-0 w-auto min-w-[900px] mt-2 z-[9997] bg-white shadow-xl border border-gray-200 rounded-lg font-['League_Spartan']"
                        onMouseEnter={handleBestsellerMenuEnter}
                        onMouseLeave={handleBestsellerMenuLeave}
                      >
                        <BestsellerMegaMenu
                          onClose={() => setDesktopBestsellerMenuOpen(false)}
                        />
                      </div>
                    )}
                  </div>

                  <div
                    className="relative"
                    onMouseEnter={handleBrandsMenuEnter}
                    onMouseLeave={handleBrandsMenuLeave}
                  >
                    <button className="flex items-center space-x-2 text-gray-700 hover:text-[#F9A246] py-2 transition-colors font-medium whitespace-nowrap">
                      <TagIcon />
                      <span>Shop by Brands</span>
                    </button>

                    {desktopBrandsMenuOpen && (
                      <div
                        className="absolute top-full left-0 w-auto min-w-[600px] mt-2 z-[9997] bg-white shadow-xl border border-gray-200 rounded-lg font-['League_Spartan']"
                        onMouseEnter={handleBrandsMenuEnter}
                        onMouseLeave={handleBrandsMenuLeave}
                      >
                        <BrandsMegaMenu
                          onClose={() => setDesktopBrandsMenuOpen(false)}
                        />
                      </div>
                    )}
                  </div>

                  <Link
                    to="/offers"
                    className="flex items-center space-x-2 text-gray-700 hover:text-[#F9A246] py-2 transition-colors font-medium whitespace-nowrap"
                  >
                    <TargetIcon />
                    <span>Offer Zone</span>
                  </Link>

                  <Link
                    to="/dubai-import"
                    className="flex items-center space-x-2 text-gray-700 hover:text-[#F9A246] py-2 transition-colors font-medium whitespace-nowrap"
                  >
                    <RocketIcon />
                    <span>Dubai Import</span>
                  </Link>

                  <Link
                    to="/gift-card"
                    className="flex items-center space-x-2 text-gray-700 hover:text-[#F9A246] py-2 transition-colors font-medium whitespace-nowrap"
                  >
                    <GiftIcon />
                    <span>Gift Card</span>
                  </Link>

                  <Link
                    to="/track-order"
                    className="flex items-center space-x-2 text-gray-700 hover:text-[#F9A246] py-2 transition-colors font-medium whitespace-nowrap"
                  >
                    <Search className="h-4 w-4 text-gray-500" />
                    <span>Track Order</span>
                  </Link>

                  <Link
                    to="/store-locator"
                    className="flex items-center space-x-2 text-gray-700 hover:text-[#F9A246] py-2 transition-colors font-medium whitespace-nowrap"
                  >
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>Store Locator</span>
                  </Link>

                  <div
                    className="relative"
                    onMouseEnter={() => {
                      if (hamburgerMenuTimeoutRef.current) {
                        clearTimeout(hamburgerMenuTimeoutRef.current);
                      }
                      setDesktopHamburgerMenuOpen(true);
                    }}
                    onMouseLeave={() => {
                      hamburgerMenuTimeoutRef.current = setTimeout(() => {
                        setDesktopHamburgerMenuOpen(false);
                      }, 150);
                    }}
                  >
                    <button className="flex items-center space-x-2 text-gray-700 hover:text-[#F9A246] py-2 transition-colors font-medium whitespace-nowrap">
                      <Menu className="h-4 w-4 text-gray-500" />
                      <span>More</span>
                    </button>

                    {desktopHamburgerMenuOpen && (
                      <div
                        className="absolute top-full right-0 w-48 mt-2 z-[9997] bg-white shadow-xl border border-gray-200 rounded-lg py-2 font-['League_Spartan']"
                        onMouseEnter={() => {
                          if (hamburgerMenuTimeoutRef.current) {
                            clearTimeout(hamburgerMenuTimeoutRef.current);
                          }
                          setDesktopHamburgerMenuOpen(true);
                        }}
                        onMouseLeave={() => {
                          hamburgerMenuTimeoutRef.current = setTimeout(() => {
                            setDesktopHamburgerMenuOpen(false);
                          }, 150);
                        }}
                      >
                        <Link
                          to="/contact"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#F9A246]"
                        >
                          Contact Us
                        </Link>
                        <Link
                          to="/about"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#F9A246]"
                        >
                          About Us
                        </Link>
                        <Link
                          to="/cart"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#F9A246]"
                        >
                          View Cart
                        </Link>
                        <Link
                          to="/login"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#F9A246]"
                        >
                          Login / Sign Up
                        </Link>
                      </div>
                    )}
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Header Layout - Fixed structure */}
        <div className="md:hidden">
          {/* Main Header Bar */}
          <div className="flex items-center justify-between h-16 px-4 py-2 bg-white border-b border-gray-200">
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-gray-700" />
              ) : (
                <Menu className="h-5 w-5 text-gray-700" />
              )}
            </button>

            <Link
              to="/"
              className="flex items-center flex-1 justify-center px-4 cursor-pointer"
            >
              <img
                src={logoImage}
                alt="O2 Nutrition Logo"
                className="h-auto w-[200px] object-contain"
              />
            </Link>

            <div className="flex items-center space-x-2 flex-shrink-0">
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={toggleMobileSearch}
                aria-label="Toggle search"
              >
                {mobileSearchOpen ? (
                  <X className="h-5 w-5 text-gray-700" />
                ) : (
                  <Search className="h-5 w-5 text-gray-700" />
                )}
              </button>

              <Link
                to="/cart"
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <ShoppingCart className="h-5 w-5 text-gray-700" />
                {state.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold font-['League_Spartan'] text-[10px] min-w-[16px]">
                    {state.itemCount > 99 ? "99+" : state.itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Search Bar - Expandable */}
          <div
            className={`bg-white border-b border-gray-200 transition-all duration-300 ease-in-out overflow-hidden ${
              mobileSearchOpen ? "max-h-16 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-4 py-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products & brands..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9A246] focus:border-transparent text-base bg-gray-50 font-['League_Spartan'] placeholder-gray-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch(e.target.value);
                    }
                  }}
                  autoFocus={mobileSearchOpen}
                  style={{ fontSize: "16px" }}
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />

                {/* Mobile Search Results Dropdown */}
                {(showSearchResults ||
                  (searchQuery.length > 0 && searchQuery.length < 2)) && (
                  <div className="fixed top-20 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-[99998] max-h-80 overflow-y-auto mx-4">
                    {searchQuery.length > 0 && searchQuery.length < 1 && (
                      <div className="p-3 text-center bg-blue-50 border-b border-blue-200">
                        <p className="text-blue-700 text-sm">
                          💡 Start typing to search instantly
                        </p>
                      </div>
                    )}
                    {isSearching ? (
                      <div className="p-4 text-center">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#F9A246]"></div>
                        <p className="mt-2 text-sm text-gray-600">
                          Searching...
                        </p>
                      </div>
                    ) : (searchSuggestions.length > 0 || searchResults.length > 0) ? (
                      <div>
                        <div className="flex items-center justify-between p-3 border-b border-gray-100">
                          <span className="text-sm font-medium text-gray-700">
                            Search Results
                          </span>
                          <button
                            onClick={clearSearch}
                            className="text-xs text-[#F9A246] hover:text-[#e8933a]"
                          >
                            Clear
                          </button>
                        </div>
                        
                        {/* Mobile Search Suggestions */}
                        {searchSuggestions.length > 0 && (
                          <div className="border-b border-gray-100">
                            <div className="p-2">
                              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">
                                Suggestions
                              </h4>
                              {searchSuggestions.slice(0, 4).map((suggestion, index) => (
                                <div
                                  key={`${suggestion.type}-${index}`}
                                  onClick={() => {
                                    setSearchQuery(suggestion.value);
                                    if (suggestion.type === 'product') {
                                      const product = searchResults.find(p => p.name === suggestion.value);
                                      if (product) handleProductClick(product);
                                    } else {
                                      setTimeout(() => performSearch(), 100);
                                    }
                                  }}
                                  className="flex items-center p-2 hover:bg-gray-50 cursor-pointer rounded-md mx-1"
                                >
                                  <div className="flex items-center space-x-2">
                                    {suggestion.type === 'brand' && <TagIcon className="w-4 h-4 text-blue-500" />}
                                    {suggestion.type === 'category' && <TargetIcon className="w-4 h-4 text-green-500" />}
                                    {suggestion.type === 'product' && <Search className="w-4 h-4 text-orange-500" />}
                                    <span className="text-sm text-gray-700">{suggestion.value}</span>
                                    <span className="text-xs text-gray-400 capitalize">({suggestion.type})</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Mobile Product Results */}
                        {searchResults.length > 0 && (
                          <div>
                            <div className="p-2">
                              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">
                                Products ({searchResults.length})
                              </h4>
                            </div>
                            <div className="max-h-48 overflow-y-auto">
                              {searchResults.slice(0, 4).map((product) => (
                                <div
                                  key={product.id}
                                  onClick={() => handleProductClick(product)}
                                  onTouchEnd={(e) => {
                                    e.preventDefault();
                                    handleProductClick(product);
                                  }}
                                  className="flex items-center p-3 hover:bg-gray-50 active:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 touch-manipulation"
                                >
                                  <img
                                    src={`${product.image}?w=60&h=60&fit=crop`}
                                    alt={product.name}
                                    className="w-12 h-12 object-cover rounded-lg mr-3"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                      {product.name}
                                    </h4>
                                    <p className="text-xs text-gray-500 truncate">
                                      {product.brand} •{" "}
                                      {product.categorySlug?.replace(/-/g, " ")}
                                    </p>
                                    <p className="text-sm font-bold text-[#F9A246]">
                                      ₹{product.price.toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            {searchResults.length > 4 && (
                              <div className="p-3 border-t border-gray-100 text-center">
                                <span className="text-xs text-gray-500">
                                  Showing 4 of {searchResults.length} results
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : searchQuery.length >= 1 ? (
                      <div className="p-4 text-center">
                        <Search className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                          No results found
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Try different keywords
                        </p>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Sidebar */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[9996] md:hidden transition-opacity duration-300"
            onClick={closeMobileMenu}
          />

          <div className="fixed top-0 left-0 h-full w-full max-w-sm bg-white shadow-2xl z-[99999] md:hidden overflow-y-auto font-['League_Spartan'] transform transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-[#F9A246] text-white">
              <div className="flex items-center">
                <Link
                  to="/"
                  className="flex items-center"
                  onClick={closeMobileMenu}
                >
                  <img
                    src={logoImage}
                    alt="O2 Nutrition Logo"
                    className="h-auto w-[120px] object-contain brightness-0 invert"
                  />
                </Link>
              </div>
              <button
                onClick={closeMobileMenu}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            <div className="flex flex-col h-full">
              <div className="flex-1 p-4 space-y-2">
                <button
                  onClick={handleMobileMegaMenuToggle}
                  className="w-full flex justify-between items-center text-gray-800 font-semibold py-3 px-4 bg-gray-50 hover:bg-gray-100 transition-all duration-200 rounded-lg border border-gray-200"
                >
                  <span className="flex items-center space-x-3">
                    <Menu className="h-5 w-5 text-[#F9A246]" />
                    <span className="text-base">Shop By Category</span>
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${mobileMegaMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {mobileMegaMenuOpen && (
                  <div className="bg-gray-50 rounded-lg p-2 mb-4 border border-gray-200 transition-all duration-300">
                    <MegaMenu
                      isMobile={true}
                      onClose={() => setMobileMegaMenuOpen(false)}
                    />
                  </div>
                )}

                <button
                  onClick={handleMobileBestsellerMenuToggle}
                  className="w-full flex justify-between items-center text-gray-800 font-semibold py-3 px-4 bg-gray-50 hover:bg-gray-100 transition-all duration-200 rounded-lg border border-gray-200"
                >
                  <span className="flex items-center space-x-3">
                    <StarIcon className="h-5 w-5 text-[#F9A246]" />
                    <span className="text-base">Best Sellers</span>
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${mobileBestsellerMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {mobileBestsellerMenuOpen && (
                  <div className="bg-gray-50 rounded-lg p-2 mb-4 border border-gray-200 transition-all duration-300">
                    <BestsellerMegaMenu
                      isMobile={true}
                      onClose={() => setMobileBestsellerMenuOpen(false)}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Link
                    to="/brands"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-4 text-gray-700 py-3 px-4 hover:bg-gray-50 hover:text-[#F9A246] transition-all duration-200 rounded-lg font-medium text-base"
                  >
                    <TagIcon className="w-5 h-5" />
                    <span>Shop by Brands</span>
                  </Link>

                  <Link
                    to="/offers"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-4 text-gray-700 py-3 px-4 hover:bg-gray-50 hover:text-[#F9A246] transition-all duration-200 rounded-lg font-medium text-base"
                  >
                    <TargetIcon className="w-5 h-5" />
                    <span>Offer Zone</span>
                  </Link>

                  <Link
                    to="/dubai-import"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-4 text-gray-700 py-3 px-4 hover:bg-gray-50 hover:text-[#F9A246] transition-all duration-200 rounded-lg font-medium text-base"
                  >
                    <RocketIcon className="w-5 h-5" />
                    <span>Dubai Import</span>
                  </Link>

                  <Link
                    to="/gift-card"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-4 text-gray-700 py-3 px-4 hover:bg-gray-50 hover:text-[#F9A246] transition-all duration-200 rounded-lg font-medium text-base"
                  >
                    <GiftIcon className="w-5 h-5" />
                    <span>Gift Card</span>
                  </Link>

                  <Link
                    to="/track-order"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-4 text-gray-700 py-3 px-4 hover:bg-gray-50 hover:text-[#F9A246] transition-all duration-200 rounded-lg font-medium text-base"
                  >
                    <Search className="w-5 h-5" />
                    <span>Track Order</span>
                  </Link>

                  <Link
                    to="/store-locator"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-4 text-gray-700 py-3 px-4 hover:bg-gray-50 hover:text-[#F9A246] transition-all duration-200 rounded-lg font-medium text-base"
                  >
                    <MapPin className="w-5 h-5" />
                    <span>Store Locator</span>
                  </Link>
                </div>

                <div className="border-t border-gray-200 my-4" />

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide px-4 mb-2">
                    Account & Support
                  </h3>

                  <Link
                    to="/dashboard"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-4 text-gray-700 py-2 px-4 hover:bg-gray-50 hover:text-[#F9A246] transition-all duration-200 rounded-lg"
                  >
                    <User className="h-5 w-5 text-gray-500" />
                    <span>My Account</span>
                  </Link>

                  <Link
                    to="/cart"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-4 text-gray-700 py-2 px-4 hover:bg-gray-50 hover:text-[#F9A246] transition-all duration-200 rounded-lg"
                  >
                    <ShoppingCart className="h-5 w-5 text-gray-500" />
                    <span>View Cart</span>
                  </Link>

                  <Link
                    to="/contact"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-4 text-gray-700 py-2 px-4 hover:bg-gray-50 hover:text-[#F9A246] transition-all duration-200 rounded-lg"
                  >
                    <SupportIcon className="w-5 h-5 text-gray-500" />
                    <span>Contact Us</span>
                  </Link>

                  <Link
                    to="/track-order"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-4 text-gray-700 py-2 px-4 hover:bg-gray-50 hover:text-[#F9A246] transition-all duration-200 rounded-lg"
                  >
                    <Search className="h-5 w-5 text-gray-500" />
                    <span>Track Order</span>
                  </Link>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-4 pt-3 pb-3 px-4">
                {user ? (
                  <div className="space-y-2">
                    <Link
                      to="/dashboard"
                      onClick={closeMobileMenu}
                      className="flex items-center justify-center w-full bg-[#F9A246] text-white py-3 rounded-lg font-medium hover:bg-[#e8933a] transition-colors"
                    >
                      <User className="h-5 w-5 mr-2" />
                      {user.firstName || 'User'}
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        closeMobileMenu();
                      }}
                      className="flex items-center justify-center w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-center w-full bg-[#F9A246] text-white py-3 rounded-lg font-medium hover:bg-[#e8933a] transition-colors"
                  >
                    <User className="h-5 w-5 mr-2" />
                    Login / Sign Up
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {(desktopMegaMenuOpen ||
        desktopBestsellerMenuOpen ||
        desktopBrandsMenuOpen ||
        desktopSupportMenuOpen ||
        desktopHamburgerMenuOpen) && (
        <div
          className="fixed inset-0 z-30 hidden md:block"
          onClick={() => {
            setDesktopMegaMenuOpen(false);
            setDesktopBestsellerMenuOpen(false);
            setDesktopBrandsMenuOpen(false);
            setDesktopSupportMenuOpen(false);
            setDesktopHamburgerMenuOpen(false);
          }}
        />
      )}
    </>
  );
};

export default Header;
