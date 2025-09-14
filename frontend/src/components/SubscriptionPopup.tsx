import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const SubscriptionPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const popupExpiry = localStorage.getItem('subscriptionPopupShown');
    const sessionShown = sessionStorage.getItem('popupShownThisSession');
    
    let shouldShow = true;
    
    if (popupExpiry) {
      const expiryDate = new Date(popupExpiry);
      const now = new Date();
      shouldShow = now > expiryDate;
    }
    
    if (shouldShow && !sessionShown) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        sessionStorage.setItem('popupShownThisSession', 'true');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/subscribers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, phone }),
      });

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          localStorage.setItem('subscriptionPopupShown', tomorrow.toISOString());
          setIsVisible(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    localStorage.setItem('subscriptionPopupShown', tomorrow.toISOString());
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#F9A245]/30 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white/20 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-[#E86A12]/40 rounded-full animate-bounce"></div>
      </div>
      
      <div 
        className="relative bg-black rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative p-8 text-white">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all duration-300 hover:rotate-90"
          >
            <X size={20} />
          </button>
          
          <div className="text-center mb-6">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#F9A245] to-[#E86A12] rounded-full mb-4 shadow-lg">
                <span className="text-2xl">💪</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">FUEL YOUR PASSION</h2>
            <p className="text-lg text-white/90 font-medium leading-relaxed">Join O2 Nutrition family! Get exclusive supplement deals, fitness tips & expert guidance!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F9A245] bg-white/95 backdrop-blur-sm border border-white/20 shadow-lg transition-all duration-300 hover:bg-white"
            />
            <input
              type="tel"
              placeholder="Enter your phone (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F9A245] bg-white/95 backdrop-blur-sm border border-white/20 shadow-lg transition-all duration-300 hover:bg-white"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#F9A245] to-[#E86A12] hover:from-[#E86A12] hover:to-[#F9A245] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-[0_0_25px_rgba(249,162,69,0.4)] transform hover:scale-105 active:scale-95"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Joining O2 Family...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>🏆</span>
                  <span>JOIN O2 NUTRITION</span>
                </div>
              )}
            </button>
            {showSuccess && (
              <div className="mt-4 p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl text-center font-bold shadow-lg animate-pulse">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-xl">✅</span>
                  <span>Welcome to O2 Nutrition! Get ready for exclusive supplement deals!</span>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPopup;