import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Disclaimer: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center text-gray-600 hover:text-[#F9A245] mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>
      
      <h1 className="font-heading font-bold text-3xl text-gray-900 mb-8">Disclaimer</h1>
      
      <div className="space-y-6 font-body text-gray-700">
        <div>
          <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">General Information</h3>
          <p>Information on this website is for general purposes only. We make no warranties about accuracy or completeness.</p>
        </div>

        <div>
          <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">Health Disclaimer</h3>
          <p>Our products are not intended to diagnose, treat, cure, or prevent any disease. Consult your healthcare provider before use.</p>
        </div>

        <div>
          <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">Individual Results</h3>
          <p>Results may vary from person to person. We do not guarantee specific results from product use.</p>
        </div>

        <div>
          <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">Pregnancy & Nursing</h3>
          <p>Consult your healthcare provider before using any products if pregnant or nursing.</p>
        </div>

        <div>
          <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">Usage Instructions</h3>
          <p>Follow product label instructions. Do not exceed recommended dosages. Keep out of reach of children.</p>
        </div>

        <div>
          <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">Contact Us</h3>
          <p>Questions? Email: <a href="mailto:support@o2nutrition.com" className="text-[#F9A245]">support@o2nutrition.com</a></p>
          <p>Phone: <a href="tel:+919888899909" className="text-[#F9A245]">+91-98888-99909</a></p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link to="/">
          <Button className="bg-[#F9A245] hover:bg-[#e8913d] text-white">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Disclaimer;
