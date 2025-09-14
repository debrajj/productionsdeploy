import { useEffect } from 'react';

interface GuestAutoFillProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  updateFormData: (field: string, value: string) => void;
  isLoggedIn: boolean;
}

export const useGuestAutoFill = ({ formData, updateFormData, isLoggedIn }: GuestAutoFillProps) => {
  useEffect(() => {
    if (isLoggedIn) return; // Don't auto-fill for logged-in users

    const loadGuestInfo = () => {
      const guestInfo = localStorage.getItem('nutri_guest_info');
      if (!guestInfo) return;

      try {
        const savedData = JSON.parse(guestInfo);
        
        // Only fill empty fields
        if (!formData.firstName && savedData.firstName) {
          updateFormData('firstName', savedData.firstName);
        }
        if (!formData.lastName && savedData.lastName) {
          updateFormData('lastName', savedData.lastName);
        }
        if (!formData.email && savedData.email) {
          updateFormData('email', savedData.email);
        }
        if (!formData.phone && savedData.phone) {
          updateFormData('phone', savedData.phone);
        }
      } catch (error) {
        console.error('Error loading guest info:', error);
      }
    };

    loadGuestInfo();
  }, [formData, updateFormData, isLoggedIn]);

  const hasGuestInfo = () => {
    return !!localStorage.getItem('nutri_guest_info');
  };

  return { hasGuestInfo: hasGuestInfo() };
};