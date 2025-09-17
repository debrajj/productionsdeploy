import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { MapPin, Check } from 'lucide-react';

interface SavedAddressesProps {
  onSelectAddress: (address: any) => void;
  selectedAddressId?: string;
}

export const SavedAddresses: React.FC<SavedAddressesProps> = ({ 
  onSelectAddress, 
  selectedAddressId 
}) => {
  const { addresses, user } = useAuth();

  // Only show for logged-in users
  if (!user) return null;

  const validAddresses = addresses.filter((addr, index, self) => 
    addr.address && addr.city && addr.zipCode && 
    self.findIndex(a => a.address === addr.address && a.zipCode === addr.zipCode) === index
  );
  
  // Show placeholder if no addresses but user is logged in
  if (validAddresses.length === 0) {
    return (
      <Card className="border-gray-200">
        <CardHeader className="bg-gray-50">
          <CardTitle className="flex items-center text-gray-700">
            <MapPin className="h-5 w-5 mr-2" />
            Saved Addresses
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-sm text-gray-600">
            No saved addresses yet. Your address will be saved after placing an order.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200">
      <CardHeader className="bg-orange-50">
        <CardTitle className="flex items-center text-orange-800">
          <MapPin className="h-5 w-5 mr-2" />
          Saved Addresses
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        <p className="text-sm text-orange-700">
          Choose from your saved addresses
        </p>
        
        {validAddresses.map((address) => (
          <div 
            key={address.id} 
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedAddressId === address.id 
                ? 'border-[#F9A245] bg-orange-50' 
                : 'border-gray-200 hover:border-[#F9A245]'
            }`}
            onClick={() => onSelectAddress(address)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-sm">
                    {address.firstName} {address.lastName}
                  </p>
                  {address.isDefault && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {address.address}
                  {address.apartment && `, ${address.apartment}`}
                </p>
                <p className="text-sm text-gray-600">
                  {address.city}, {address.state} - {address.zipCode}
                </p>
              </div>
              
              {selectedAddressId === address.id ? (
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-[#F9A245] text-white px-2 py-1 rounded font-medium">
                    ✓ Selected
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAddress(null);
                    }}
                    className="text-xs text-red-600 hover:text-red-800 underline"
                  >
                    Unselect
                  </button>
                </div>
              ) : (
                <span className="text-xs text-gray-500">Click to select</span>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};