import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Mail } from 'lucide-react';

interface GuestCheckoutSaverProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    apartment: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export const GuestCheckoutSaver: React.FC<GuestCheckoutSaverProps> = ({ formData }) => {
  const { toast } = useToast();
  const [createAccount, setCreateAccount] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(true);

  const handleSaveGuestInfo = () => {
    // Save guest info to localStorage for future use
    const guestInfo = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      lastUsed: new Date().toISOString()
    };
    
    localStorage.setItem('nutri_guest_info', JSON.stringify(guestInfo));
    
    if (createAccount) {
      // Redirect to signup with pre-filled data
      const signupData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone
      };
      localStorage.setItem('nutri_signup_prefill', JSON.stringify(signupData));
    }

    toast({
      title: "Information Saved",
      description: createAccount 
        ? "Your info is saved. Create an account after checkout for faster future orders."
        : "Your info is saved for faster checkout next time."
    });
  };

  return (
    <Card className="border-orange-200">
      <CardHeader className="bg-orange-50">
        <CardTitle className="flex items-center text-orange-800">
          <UserPlus className="h-5 w-5 mr-2" />
          Save for Next Time
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        <p className="text-sm text-orange-700">
          Make future orders faster by saving your information
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="createAccount"
              checked={createAccount}
              onCheckedChange={(checked) => setCreateAccount(checked as boolean)}
            />
            <label htmlFor="createAccount" className="text-sm text-orange-800">
              Create an account after checkout for faster future orders
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="emailUpdates"
              checked={emailUpdates}
              onCheckedChange={(checked) => setEmailUpdates(checked as boolean)}
            />
            <label htmlFor="emailUpdates" className="text-sm text-orange-700">
              Get order updates and special offers via email
            </label>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSaveGuestInfo}
          className="w-full border-orange-300 text-orange-700 hover:bg-orange-100"
        >
          <Mail className="h-4 w-4 mr-2" />
          Save My Information
        </Button>
      </CardContent>
    </Card>
  );
};