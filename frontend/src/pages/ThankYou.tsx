import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Download, Truck, Mail, Gift, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ThankYou: React.FC = () => {
  const [giftCode, setGiftCode] = useState('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const orderNumber = location.state?.orderNumber || 'ORDER-ERROR';
  const estimatedDelivery = '15/09/2025';

  useEffect(() => {
    // Only generate gift card if a gift card was purchased
    const urlParams = new URLSearchParams(window.location.search);
    const isGiftCardPurchase = urlParams.get('giftcard') === 'true';
    
    if (isGiftCardPurchase) {
      const generateGiftCard = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/payment-success`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 100 })
          });
          const data = await response.json();
          if (data.success) {
            setGiftCode(data.giftCode);
          }
        } catch (error) {
          console.error('Failed to generate gift card');
        } finally {
          setLoading(false);
        }
      };
      generateGiftCard();
    } else {
      setLoading(false);
    }
  }, []);

  const copyGiftCode = () => {
    navigator.clipboard.writeText(giftCode);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Success Icon */}
        <div className="w-20 h-20 mx-auto bg-secondary/20 rounded-full flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-secondary" />
        </div>

        {/* Thank You Message */}
        <div className="space-y-4">
          <h1 className="font-heading font-bold text-4xl text-foreground">
            Thank You for Your Order!
          </h1>
          <p className="font-body text-lg text-muted-foreground">
            Your order has been successfully placed and is being processed.
          </p>
        </div>

        {/* Gift Card */}
        {giftCode && (
          <Card className="bg-gradient-to-r from-[#F9A245]/10 to-[#FEB47B]/10 border-[#F9A245]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-[#F9A245]" />
                Your Gift Card
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  As a thank you, here's your unique 12-digit gift card code:
                </p>
                <div className="bg-white p-4 rounded-lg border border-[#F9A245]/30 flex items-center justify-between">
                  <span className="font-mono text-lg font-bold text-[#F9A245]">{giftCode}</span>
                  <Button onClick={copyGiftCode} variant="outline" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  This code is valid for one-time use and never expires.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Order Number:</span>
                <p className="font-semibold">{orderNumber}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Order Date:</span>
                <p className="font-semibold">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Confirmation Email</h3>
                <p className="text-sm text-muted-foreground">
                  You'll receive an order confirmation email shortly.
                </p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Order Processing</h3>
                <p className="text-sm text-muted-foreground">
                  We'll prepare your order for shipping within 24 hours.
                </p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                  <Download className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Track Your Order</h3>
                <p className="text-sm text-muted-foreground">
                  You'll receive tracking information once shipped.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/track-order">
            <Button variant="outline" size="lg">
              Track Your Order
            </Button>
          </Link>
          <Link to="/">
            <Button size="lg" className="bg-primary hover:bg-primary-hover">
              Continue Shopping
            </Button>
          </Link>
        </div>


      </div>
    </div>
  );
};

export default ThankYou;