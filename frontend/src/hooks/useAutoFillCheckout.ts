import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
}

interface UseAutoFillCheckoutProps {
  formData: CheckoutFormData;
  updateFormData: (field: string, value: string) => void;
}

export const useAutoFillCheckout = ({ formData, updateFormData }: UseAutoFillCheckoutProps) => {
  const { user, addresses } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Auto-fill user basic info
    if (user.firstName && !formData.firstName) {
      updateFormData('firstName', user.firstName);
    }
    if (user.lastName && !formData.lastName) {
      updateFormData('lastName', user.lastName);
    }
    if (user.email && !formData.email) {
      updateFormData('email', user.email);
    }
    if (user.phone && !formData.phone) {
      updateFormData('phone', user.phone);
    }

    // Auto-fill default address if available
    const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
    if (defaultAddress && !formData.address) {
      updateFormData('address', defaultAddress.address);
      updateFormData('apartment', defaultAddress.apartment || '');
      updateFormData('city', defaultAddress.city);
      updateFormData('state', defaultAddress.state);
      updateFormData('zipCode', defaultAddress.zipCode);
    }
  }, [user, addresses, formData, updateFormData]);

  return {
    hasUserData: !!user,
    hasAddresses: addresses.length > 0,
    defaultAddress: addresses.find(addr => addr.isDefault) || addresses[0]
  };
};