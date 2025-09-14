import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ShippingReturns: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center text-gray-600 hover:text-[#F9A245] mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>
      
      <h1 className="font-heading font-bold text-3xl text-gray-900 mb-8">Shipping & Returns</h1>
      
      <div className="space-y-8 font-body text-gray-700">
        <div>
          <h2 className="font-heading font-semibold text-xl text-gray-900 mb-4">Shipping Information</h2>
          <ul className="space-y-2">
            <li>• Free shipping on orders above ₹2,000</li>
            <li>• Standard shipping: ₹99 for orders below ₹2,000</li>
            <li>• Express shipping: ₹199 (1-2 business days)</li>
            <li>• Delivery time: 2-7 business days across India</li>
          </ul>
        </div>

        <div>
          <h2 className="font-heading font-semibold text-xl text-gray-900 mb-4">Returns Policy</h2>
          <ul className="space-y-2">
            <li>• 7-day return policy from delivery date</li>
            <li>• Products must be unopened and in original packaging</li>
            <li>• Refund processing: 5-7 business days</li>
            <li>• Customer bears return shipping costs</li>
          </ul>
        </div>

        <div>
          <h2 className="font-heading font-semibold text-xl text-gray-900 mb-4">Contact Support</h2>
          <p>Email: <a href="mailto:support@o2nutrition.com" className="text-[#F9A245]">support@o2nutrition.com</a></p>
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

export default ShippingReturns;
