import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Search, ShoppingBag } from 'lucide-react';

const NotFound: React.FC = () => {
  const location = useLocation();

  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-8xl text-[#F9A245] mb-4">404</h1>
          <h2 className="font-heading font-semibold text-2xl text-gray-900 mb-4">Oops! Page Not Found</h2>
          <p className="font-body text-gray-600 mb-8">
            The page you're looking for seems to have taken a protein break. 
            Let's get you back on track!
          </p>
        </div>
        
        <div className="space-y-4">
          <Link to="/" className="block">
            <Button className="w-full bg-[#F9A245] hover:bg-[#e8913d] text-white font-heading font-semibold">
              <Home className="h-4 w-4 mr-2" />
              Go Back Home
            </Button>
          </Link>
          
          <div className="grid grid-cols-2 gap-4">
            <Link to="/">
              <Button variant="outline" className="w-full border-[#F9A245] text-[#F9A245] hover:bg-[#F9A245] hover:text-white">
                <Search className="h-4 w-4 mr-2" />
                Browse Products
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="outline" className="w-full border-[#F9A245] text-[#F9A245] hover:bg-[#F9A245] hover:text-white">
                <ShoppingBag className="h-4 w-4 mr-2" />
                View Cart
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="font-body text-sm text-gray-500">
            Need help? Contact us at{' '}
            <a href="mailto:support@o2nutrition.com" className="text-[#F9A245] hover:underline">
              support@o2nutrition.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
