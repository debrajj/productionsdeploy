import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, X, ChevronDown, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import MegaMenu from './MegaMenu';
import logoImage from '@/assets/lgo.png';

// Hook for scroll-based header hiding
const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState('up');
  const [lastScrollY, setLastScrollY] = useState(0);

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

// Custom SVG Icons - All in gray color
const StarIcon = ({ className = "w-4 h-4 text-gray-500" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const TagIcon = ({ className = "w-4 h-4 text-gray-500" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7a1 1 0 011.414-1.414L10 14.586l6.293-6.293a1 1 0 011.414 0z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm12 0H5v10h10V5z" clipRule="evenodd" />
  </svg>
);

const TargetIcon = ({ className = "w-4 h-4 text-gray-500" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
  </svg>
);

const BlogIcon = ({ className = "w-4 h-4 text-gray-500" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
  </svg>
);

const GiftIcon = ({ className = "w-4 h-4 text-gray-500" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
    <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
  </svg>
);

const SupportIcon = ({ className = "w-4 h-4 text-gray-500" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
  </svg>
);

const RocketIcon = ({ className = "w-4 h-4 text-gray-500" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.933 13.069s7.059-5.094 6.276-10.924a.465.465 0 00-.112-.268.436.436 0 00-.263-.115C12.137.961 7.16 8.184 7.16 8.184c-4.318-.517-4.004.344-5.974 5.076-.377.902.234 1.213.904.959l2.148-.811 2.59 2.648-.793 2.199c-.248.686.055 1.311.938.926 4.624-2.016 5.466-1.694 4.96-6.112z" />
  </svg>
);

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMegaMenuOpen, setMobileMegaMenuOpen] = useState(false);
  const [desktopMegaMenuOpen, setDesktopMegaMenuOpen] = useState(false);
  const [desktopSupportMenuOpen, setDesktopSupportMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  
  const { state } = useCart();
  const scrollDirection = useScrollDirection();

  const handleDesktopMegaMenuToggle = () => {
    setDesktopMegaMenuOpen(prev => !prev);
  };

  const handleMobileMegaMenuToggle = () => {
    setMobileMegaMenuOpen(prev => !prev);
  };

  const handleSearch = (searchValue) => {
    if (searchValue.trim()) {
      console.log('Searching for:', searchValue.trim());
      setMobileSearchOpen(false);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileMegaMenuOpen(false);
    setMobileSearchOpen(false);
  };

  return (
    <header className={`bg-white shadow-md sticky top-0 z-50 transition-transform duration-300 ${
      scrollDirection === 'down' ? 'hidden lg:-translate-y-full' : 'translate-y-0'
    }`}> 
      {/* Desktop Header Layout */}
      <div className="hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Row - Logo, Search, Login & Cart */}
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center cursor-pointer">
              <img 
                src={logoImage} 
                alt="NutriVibe Shop Logo" 
                className="h-auto w-[105px] object-contain"
              />
            </Link>

            {/* Desktop Search Bar - Center */}
            <div className="flex items-center flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for products & brands..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-gray-50 font-['League_Spartan']"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch((e.target as HTMLInputElement).value);
                    }
                  }}
                />
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-gray-50 font-['League_Spartan']"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch(e.target.value);
                      }
                    }}
                  />
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 cursor-pointer" />
                </div>
              </div>

              {/* Right Side - Login & Cart */}
              <div className="flex items-center space-x-6">
                {/* Login Button */}
                <Link to="/login" className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors font-medium font-['League_Spartan']">
                  Login
                </Link>

                {/* Cart with Quantity */}
                <Link to="/cart" className="relative flex items-center cursor-pointer">
                  <div className="relative bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition-colors">
                    <ShoppingCart className="h-6 w-6 text-gray-700" />
                    {state.itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold font-['League_Spartan']">
                        {state.itemCount > 99 ? '99+' : state.itemCount}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Navigation Row */}
          <div className="border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex items-center space-x-8 py-3 font-['League_Spartan']">
                {/* Shop By Category */}
                <div 
                  className="relative"
                  onMouseEnter={() => setDesktopMegaMenuOpen(true)}
                  onMouseLeave={() => setDesktopMegaMenuOpen(false)}
                >
                  <button
                    className="flex items-center space-x-2 text-gray-700 hover:text-teal-600 whitespace-nowrap py-2 transition-colors font-medium bg-gray-100 px-3 rounded-lg"
                  >
                    <Menu className="h-4 w-4 text-gray-500" />
                    <span>Shop By Category</span>
                  </button>

                  {desktopMegaMenuOpen && (
                    <div 
                      className="absolute top-full left-0 w-auto min-w-[900px] mt-2 z-40 bg-white shadow-xl border border-gray-200 rounded-lg font-['League_Spartan']"
                    >
                      <MegaMenu onClose={() => setDesktopMegaMenuOpen(false)} />
                    </div>
                  )}
                </div>

                {/* Best Sellers */}
                <Link to="/best-sellers" className="flex items-center space-x-2 text-gray-700 hover:text-teal-600 py-2 transition-colors font-medium whitespace-nowrap">
                  <StarIcon />
                  <span>Best Sellers</span>
                </Link>
                
                {/* Brands */}
                <Link to="/brands" className="flex items-center space-x-2 text-gray-700 hover:text-teal-600 py-2 transition-colors font-medium whitespace-nowrap">
                  <TagIcon />
                  <span>Brands</span>
                </Link>
                
                {/* Offer Zone */}
                <Link to="/offers" className="flex items-center space-x-2 text-gray-700 hover:text-teal-600 py-2 transition-colors font-medium whitespace-nowrap">
                  <TargetIcon />
                  <span>Offer Zone</span>
                </Link>
                
                {/* Blogs */}
                <Link to="/about" className="flex items-center space-x-2 text-gray-700 hover:text-teal-600 py-2 transition-colors font-medium whitespace-nowrap">
                  <BlogIcon />
                  <span>About Us</span>
                </Link>

                {/* Gift Card */}
                <Link to="/gift-card" className="flex items-center space-x-2 text-gray-700 hover:text-teal-600 py-2 transition-colors font-medium whitespace-nowrap">
                  <GiftIcon />
                  <span>Gift Card</span>
                </Link>
                
                {/* Customer Support - with dropdown */}
                <div 
                  className="relative"
                  onMouseEnter={() => setDesktopSupportMenuOpen(true)}
                  onMouseLeave={() => setDesktopSupportMenuOpen(false)}
                >
                  <button
                    className="flex items-center space-x-2 text-gray-700 hover:text-teal-600 whitespace-nowrap py-2 transition-colors font-medium"
                  >
                    <SupportIcon />
                    <span>Customer Support</span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>

                  {desktopSupportMenuOpen && (
                    <div 
                      className="absolute top-full left-0 w-48 mt-2 z-40 bg-white shadow-xl border border-gray-200 rounded-lg py-2 font-['League_Spartan']"
                    >
                      <Link to="/contact" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600">
                        Contact Us
                      </Link>
                      <Link to="/about" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600">
                        About Us
                      </Link>
                      <Link to="/track-order" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600">
                        Track Order
                      </Link>
                      <Link to="/cart" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600">
                        View Cart
                      </Link>
                      <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600">
                        Login / Sign Up
                      </Link>
                    </div>
                  )}
                </div>

                {/* Store Locator */}
                <Link to="/store-locator" className="flex items-center space-x-2 text-gray-700 hover:text-teal-600 py-2 transition-colors font-medium whitespace-nowrap">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>Store locator</span>
                </Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Mobile Header Layout */}
        <div className="md:hidden">
          {/* Main Mobile Header Row */}
          <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
            {/* Mobile Menu Button - Left */}
            <button 
              className="p-2 hover:bg-gray-100 rounded transition-colors" 
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5 text-gray-700" /> : <Menu className="h-5 w-5 text-gray-700" />}
            </button>

            {/* Logo - Center */}
            <Link to="/" className="flex items-center mx-4">
              <div className="flex items-center">
                <div className="text-lg font-bold text-gray-800 font-['League_Spartan']">HEALT</div>
                <div className="text-lg font-bold text-white bg-teal-500 px-1 ml-1 font-['League_Spartan']">H</div>
                <div className="text-lg font-bold text-teal-500 font-['League_Spartan']">K</div>
                <div className="text-lg font-bold text-gray-800 font-['League_Spartan']">ART</div>
              </div>
            </Link>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-3">
              {/* User/Login */}
              <Link to="/login" className="p-2 hover:bg-gray-100 rounded transition-colors">
                <User className="h-5 w-5 text-gray-700" />
              </Link>

              {/* Search */}
              <button 
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                onClick={() => setMobileSearchOpen(prev => !prev)}
              >
                <Search className="h-5 w-5 text-gray-700" />
              </button>

              {/* Cart */}
              <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded transition-colors">
                <ShoppingCart className="h-5 w-5 text-gray-700" />
                {state.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold text-[10px] min-w-[16px] font-['League_Spartan']">
                    {state.itemCount > 99 ? '99+' : state.itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar - Expandable */}
          {mobileSearchOpen && (
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products & brands..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white font-['League_Spartan']"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(e.target.value);
                    }
                  }}
                  autoFocus
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu Sidebar */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
            onClick={closeMobileMenu}
          />
          
          {/* Sidebar */}
          <div className="fixed top-0 left-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 md:hidden overflow-y-auto font-['League_Spartan']">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-teal-500 text-white">
              <div className="flex items-center space-x-3">
                <Link to="/" className="flex items-center" onClick={closeMobileMenu}>
                  <img 
                    src={logoImage} 
                    alt="NutriVibe Shop Logo" 
                    className="h-auto w-[80px] object-contain"
                  />
                </Link>
              </div>
              <button onClick={closeMobileMenu} className="p-2 hover:bg-white hover:bg-opacity-20 rounded">
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex flex-col h-full">
              {/* Main Navigation */}
              <div className="flex-1 p-4 space-y-2">
                {/* Shop By Category (Mobile) - Opens MegaMenu */}
                <button
                  onClick={handleMobileMegaMenuToggle}
                  className="w-full flex justify-between items-center text-gray-800 font-semibold py-4 px-4 bg-gray-50 hover:bg-gray-100 transition-all duration-200 rounded-lg border border-gray-200"
                >
                  <span className="flex items-center space-x-3">
                    <Menu className="h-5 w-5 text-teal-500" />
                    <span className="text-base">Shop By Category</span>
                  </span>
                  <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${mobileMegaMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Mobile MegaMenu */}
                {mobileMegaMenuOpen && (
                  <div className="bg-gray-50 rounded-lg p-2 mb-4 border border-gray-200">
                    <MegaMenu isMobile={true} onClose={() => setMobileMegaMenuOpen(false)} />
                  </div>
                )}

                {/* Navigation Links */}
                <div className="space-y-2">
                  <Link to="/best-sellers" onClick={closeMobileMenu} className="flex items-center space-x-4 text-gray-700 py-4 px-4 hover:bg-gray-50 hover:text-teal-500 transition-all duration-200 rounded-lg font-medium text-base">
                    <StarIcon className="w-5 h-5" />
                    <span>Best Sellers</span>
                  </Link>
                  
                  <Link to="/brands" onClick={closeMobileMenu} className="flex items-center space-x-4 text-gray-700 py-4 px-4 hover:bg-gray-50 hover:text-teal-500 transition-all duration-200 rounded-lg font-medium text-base">
                    <TagIcon className="w-5 h-5" />
                    <span>Top Brands</span>
                  </Link>
                  
                  <Link to="/offers" onClick={closeMobileMenu} className="flex items-center space-x-4 text-gray-700 py-4 px-4 hover:bg-gray-50 hover:text-teal-500 transition-all duration-200 rounded-lg font-medium text-base">
                    <TargetIcon className="w-5 h-5" />
                    <span>Offer Zone</span>
                  </Link>

                  <Link to="/gift-card" onClick={closeMobileMenu} className="flex items-center space-x-4 text-gray-700 py-4 px-4 hover:bg-gray-50 hover:text-teal-500 transition-all duration-200 rounded-lg font-medium text-base">
                    <GiftIcon className="w-5 h-5" />
                    <span>Gift Card</span>
                  </Link>
                  
                  <Link to="/new-launches" onClick={closeMobileMenu} className="flex items-center space-x-4 text-gray-700 py-4 px-4 hover:bg-gray-50 hover:text-teal-500 transition-all duration-200 rounded-lg font-medium text-base">
                    <RocketIcon className="w-5 h-5" />
                    <span>New Launches</span>
                  </Link>
                  
                  <Link to="/about" onClick={closeMobileMenu} className="flex items-center space-x-4 text-gray-700 py-4 px-4 hover:bg-gray-50 hover:text-teal-500 transition-all duration-200 rounded-lg font-medium text-base">
                    <BlogIcon className="w-5 h-5" />
                    <span>About Us</span>
                  </Link>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-6" />

                {/* Support & Account Section */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide px-4 mb-3">Account & Support</h3>
                  
                  <Link to="/account" onClick={closeMobileMenu} className="flex items-center space-x-4 text-gray-700 py-3 px-4 hover:bg-gray-50 hover:text-teal-500 transition-all duration-200 rounded-lg">
                    <User className="h-5 w-5 text-gray-500" />
                    <span>My Account</span>
                  </Link>
                  
                  <Link to="/orders" onClick={closeMobileMenu} className="flex items-center space-x-4 text-gray-700 py-3 px-4 hover:bg-gray-50 hover:text-teal-500 transition-all duration-200 rounded-lg">
                    <ShoppingCart className="h-5 w-5 text-gray-500" />
                    <span>My Orders</span>
                  </Link>
                  
                  <Link to="/contact" onClick={closeMobileMenu} className="flex items-center space-x-4 text-gray-700 py-3 px-4 hover:bg-gray-50 hover:text-teal-500 transition-all duration-200 rounded-lg">
                    <SupportIcon className="w-5 h-5 text-gray-500" />
                    <span>Contact Us</span>
                  </Link>
                  
                  <Link to="/track-order" onClick={closeMobileMenu} className="flex items-center space-x-4 text-gray-700 py-3 px-4 hover:bg-gray-50 hover:text-teal-500 transition-all duration-200 rounded-lg">
                    <Search className="h-5 w-5 text-gray-500" />
                    <span>Track Order</span>
                  </Link>

                  <Link to="/store-locator" onClick={closeMobileMenu} className="flex items-center space-x-4 text-gray-700 py-3 px-4 hover:bg-gray-50 hover:text-teal-500 transition-all duration-200 rounded-lg">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <span>Store Locator</span>
                  </Link>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="border-t border-gray-200 mt-6 pt-4 pb-4 px-4">
                <Link to="/login" onClick={closeMobileMenu} className="flex items-center justify-center w-full bg-teal-500 text-white py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors">
                  <User className="h-5 w-5 mr-2" />
                  Login / Sign Up
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Overlay */}
      {desktopMegaMenuOpen && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setDesktopMegaMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;