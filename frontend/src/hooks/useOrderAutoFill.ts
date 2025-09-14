import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface OrderAutoFillProps {
  updateFormData: (field: string, value: string) => void;
}

export const useOrderAutoFill = ({ updateFormData }: OrderAutoFillProps) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Auto-fill from user registration data
    if (user.firstName) updateFormData('firstName', user.firstName);
    if (user.lastName) updateFormData('lastName', user.lastName);
    if (user.email) updateFormData('email', user.email);
    if (user.phone) updateFormData('phone', user.phone);

    // Auto-fill default address if available
    const defaultAddr = (user as any).defaultAddress;
    if (defaultAddr) {
      if (defaultAddr.address) updateFormData('address', defaultAddr.address);
      if (defaultAddr.city) updateFormData('city', defaultAddr.city);
      if (defaultAddr.state) updateFormData('state', defaultAddr.state);
      if (defaultAddr.zipCode) updateFormData('zipCode', defaultAddr.zipCode);
    }
  }, [user, updateFormData]);
};