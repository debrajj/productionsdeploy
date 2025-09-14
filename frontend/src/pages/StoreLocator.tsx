import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const HealthKart: React.FC = () => {
  const stores = [
    {
      id: 1,
      name: "O2 Nutrition - Pitampura",
      address: "Shop No. 14A, G. Floor, Pocket-2, Paschim Puri, Pitampura Club Road, Opp. Gurudwara, New Delhi - 110063",
      phone: "+91-98888-99909",
      hours: "Mon-Sat: 9 AM - 8 PM, Sun: 10 AM - 6 PM",
      type: "Main Store"
    },
    {
      id: 2,
      name: "O2 Nutrition - Rohini",
      address: "Shop No. 25, Sector-3, Rohini, Near Metro Station, New Delhi - 110085",
      phone: "+91-98888-99910",
      hours: "Mon-Sat: 9 AM - 8 PM, Sun: Closed",
      type: "Branch Store"
    },
    {
      id: 3,
      name: "O2 Nutrition - Janakpuri",
      address: "A-2/15, Janakpuri District Centre, Near PVR Cinema, New Delhi - 110058",
      phone: "+91-98888-99911",
      hours: "Mon-Sat: 10 AM - 9 PM, Sun: 10 AM - 6 PM",
      type: "Branch Store"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center text-gray-600 hover:text-[#F9A245] mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>
      
      <h1 className="font-heading font-bold text-3xl text-gray-900 mb-4">Store Locator</h1>
      <p className="font-body text-gray-600 mb-8">Visit our physical stores across Delhi for personalized nutrition guidance</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <Card key={store.id} className="border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="mb-4">
                <h3 className="font-heading font-semibold text-lg text-gray-900">{store.name}</h3>
                <span className="inline-block px-2 py-1 bg-[#F9A245]/10 text-[#F9A245] text-xs font-medium rounded-full mt-1">
                  {store.type}
                </span>
              </div>
              
              <div className="space-y-3 font-body text-gray-600">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-[#F9A245] mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{store.address}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-[#F9A245]" />
                  <a href={`tel:${store.phone}`} className="text-sm hover:text-[#F9A245]">
                    {store.phone}
                  </a>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-[#F9A245]" />
                  <p className="text-sm">{store.hours}</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-[#F9A245] text-[#F9A245] hover:bg-[#F9A245] hover:text-white"
                  onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(store.address)}`, '_blank')}
                >
                  Get Directions
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center bg-gray-50 rounded-lg p-8">
        <h2 className="font-heading font-semibold text-xl text-gray-900 mb-4">Can't Visit Our Stores?</h2>
        <p className="font-body text-gray-600 mb-6">
          Shop online and get your favorite supplements delivered to your doorstep across India
        </p>
        <Link to="/">
          <Button className="bg-[#F9A245] hover:bg-[#e8913d] text-white">
            Shop Online Now
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HealthKart;
