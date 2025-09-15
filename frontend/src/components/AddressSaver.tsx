import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Save } from 'lucide-react';

interface AddressSaverProps {
  formData: {
    firstName: string;
    lastName: string;
    address: string;
    apartment: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
  onAddressSaved?: () => void;
}

export const AddressSaver: React.FC<AddressSaverProps> = ({ formData, onAddressSaved }) => {
  const { user, addAddress, addresses } = useAuth();
  const { toast } = useToast();
  const [saveAddress, setSaveAddress] = useState(false);
  const [setAsDefault, setSetAsDefault] = useState(addresses.length === 0);

  // Check if address already exists
  const addressExists = addresses.some(addr => 
    addr.address.toLowerCase() === formData.address.toLowerCase() &&
    addr.zipCode === formData.zipCode &&
    addr.city.toLowerCase() === formData.city.toLowerCase()
  );

  const handleSaveAddress = async () => {
    if (!user || !saveAddress) return;

    // Check for duplicate before saving
    if (addressExists) {
      toast({
        title: "Address Already Exists",
        description: "This address is already saved in your address book.",
        variant: "destructive"
      });
      return;
    }

    const addressData = {
      type: 'home' as const,
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: formData.address,
      apartment: formData.apartment,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      phone: formData.phone,
      isDefault: setAsDefault || addresses.length === 0
    };

    const success = await addAddress(addressData);
    if (success) {
      toast({
        title: "Address Saved",
        description: "Your address has been saved for future orders."
      });
      onAddressSaved?.();
    }
  };

  if (!user) return null;

  return (
    <div 
      className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3"
      data-save-address={saveAddress}
    >
      <div className="flex items-center space-x-2">
        <MapPin className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-900">Save Address</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="saveAddress"
            checked={saveAddress}
            onCheckedChange={(checked) => setSaveAddress(checked as boolean)}
          />
          <label htmlFor="saveAddress" className="text-sm text-blue-800">
            {addressExists ? "Address already saved" : "Save this address for future orders"}
          </label>
          {addressExists && (
            <span className="text-xs text-orange-600 ml-2">✓ Already in address book</span>
          )}
        </div>
        
        {saveAddress && (
          <div className="flex items-center space-x-2 ml-6">
            <Checkbox
              id="setDefault"
              checked={setAsDefault}
              onCheckedChange={(checked) => setSetAsDefault(checked as boolean)}
            />
            <label htmlFor="setDefault" className="text-sm text-blue-700">
              Set as default address
            </label>
          </div>
        )}
      </div>

      {saveAddress && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSaveAddress}
          className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Address
        </Button>
      )}
    </div>
  );
};