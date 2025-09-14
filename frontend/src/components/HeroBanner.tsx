import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { heroBannerApi, HeroBanner as HeroBannerType } from '../services/api';

// Import static banner images
import desktopBanner1 from '../assets/Banners/Desktop/1 - DEsktop.png';
import mobileBanner1 from '../assets/Banners/Phone/1 - Mobile Banner.png';

// Static banners configuration
const STATIC_BANNERS: HeroBannerType[] = [
  {
    id: 'static-1',
    title: 'Premium Supplements',
    description: 'Discover our range of high-quality supplements',
    ctaText: 'Shop Now',
    ctaLink: '/products',
    desktopImage: { url: desktopBanner1, alt: 'Premium Supplements' },
    mobileImage: { url: mobileBanner1, alt: 'Premium Supplements Mobile' },
    isActive: true,
  },
  {
    id: 'static-2', 
    title: 'Health & Wellness',
    description: 'Your journey to better health starts here',
    ctaText: 'Explore',
    ctaLink: '/categories',
    desktopImage: { url: desktopBanner1, alt: 'Health & Wellness' },
    mobileImage: { url: mobileBanner1, alt: 'Health & Wellness Mobile' },
    isActive: true,
  },
  {
    id: 'static-3',
    title: 'Expert Approved',
    description: 'Products recommended by health experts',
    ctaText: 'Learn More',
    ctaLink: '/about',
    desktopImage: { url: desktopBanner1, alt: 'Expert Approved' },
    mobileImage: { url: mobileBanner1, alt: 'Expert Approved Mobile' },
    isActive: true,
  },
];

const HeroBanner: React.FC = () => {
  const [banners, setBanners] = useState<HeroBannerType[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const result = await heroBannerApi.getAllBanners();
        console.log('Banner fetch result:', result);
        
        if (result.success && result.data && result.data.length > 0) {
          const backendBanner = result.data[0];
          console.log('Backend banner:', backendBanner);
          console.log('Is active:', backendBanner.isActive);
          console.log('Desktop image URL:', backendBanner.desktopImage?.url);
          
          // Always use backend banner if it exists and is active
          if (backendBanner.isActive) {
            setBanners([backendBanner]);
            console.log('✅ Using backend banner');
          } else {
            setBanners(STATIC_BANNERS);
            console.log('❌ Backend banner inactive, using static');
          }
        } else {
          setBanners(STATIC_BANNERS);
          console.log('❌ No backend banner data, using static');
        }
        
        setError(false);
      } catch (error) {
        console.error('Failed to fetch dynamic banner:', error);
        setBanners(STATIC_BANNERS);
        setError(false);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
    
    // Refresh every 30 seconds to catch backend changes
    const interval = setInterval(fetchBanners, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  if (loading) {
    return (
      <div className="w-full h-64 md:h-96 bg-gray-200 animate-pulse rounded-lg"></div>
    );
  }



  // Always show API data if available, otherwise show error
  if (!banners.length) {
    return (
      <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-lg shadow-lg bg-gray-800 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Loading Hero Banner...</h2>
          <p>Error: {error ? 'API Failed' : 'No banner data'}</p>
        </div>
      </div>
    );
  }

  const banner = banners[currentBanner];
  const fallbackImage = isDesktop ? desktopBanner1 : mobileBanner1;
  const imageUrl = isDesktop 
    ? (banner.desktopImage?.url || fallbackImage)
    : (banner.mobileImage?.url || banner.desktopImage?.url || fallbackImage);

  return (
    <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-lg shadow-lg">
      <img
        src={imageUrl || fallbackImage}
        alt={banner.title || 'Hero Banner'}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.src = fallbackImage;
        }}
      />
      
      {(banner.title || banner.description || banner.ctaText) && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-2xl">
            {banner.title && (
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                {banner.title}
              </h1>
            )}
            
            {banner.description && (
              <p className="text-lg md:text-xl mb-6 opacity-90">
                {banner.description}
              </p>
            )}
            
            {banner.ctaText && banner.ctaLink && (
              <Link
                to={banner.ctaLink}
                className="inline-block bg-[#F9A245] hover:bg-[#e8933a] text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-300"
              >
                {banner.ctaText}
              </Link>
            )}
          </div>
        </div>
      )}

      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentBanner ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroBanner;