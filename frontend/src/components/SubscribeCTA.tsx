import React, { useState } from 'react';
import { Mail, CheckCircle, Sparkles } from 'lucide-react';

interface SubscribeCTAProps {
  variant?: 'banner' | 'inline' | 'sidebar';
  title?: string;
  description?: string;
}

const SubscribeCTA: React.FC<SubscribeCTAProps> = ({ 
  variant = 'inline',
  title = "Join O2 Nutrition Family!",
  description = "Get exclusive deals & fitness tips"
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/subscribers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setShowSuccess(true);
        setEmail('');
        setTimeout(() => setShowSuccess(false), 4000);
      }
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (variant === 'banner') {
    return (
      <div className="relative overflow-hidden">
        <div className="relative z-10 text-center">
          {/* Success State */}
          {showSuccess ? (
            <div className="animate-fade-in">
              <div className="flex items-center justify-center mb-2 sm:mb-3">
                <div className="bg-green-500 rounded-full p-2 animate-bounce">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2">
                🎉 Welcome to O2 Family!
              </h3>
              <p className="text-sm sm:text-base text-white/90">
                Check inbox for deals & tips!
              </p>
            </div>
          ) : (
            <div className="animate-fade-in">
              {/* Form */}
              <form onSubmit={handleSubmit} className="max-w-sm sm:max-w-lg mx-auto">
                <div className="relative group">
                  <div className={`relative flex items-center bg-white/95 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 ${
                    isFocused ? 'ring-1 ring-white/30' : ''
                  }`}>
                    <div className="absolute left-2 sm:left-3 text-gray-400 group-focus-within:text-[#F9A245] transition-colors">
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                    <input
                      type="email"
                      placeholder="Your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      required
                      className="flex-1 pl-8 sm:pl-10 pr-2 py-2 sm:py-3 text-gray-800 text-xs sm:text-sm bg-transparent rounded-l-lg sm:rounded-l-xl focus:outline-none placeholder-gray-500"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting || !email}
                      className={`px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-[#F9A245] to-[#E86A12] text-white font-bold text-xs sm:text-sm rounded-r-lg sm:rounded-r-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                        isSubmitting ? 'animate-pulse' : 'hover:from-[#E86A12] hover:to-[#F9A245] active:scale-95'
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 sm:w-3 sm:h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span className="hidden sm:inline text-xs">Joining...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <Sparkles className="w-2 h-2 sm:w-3 sm:h-3" />
                          <span className="text-xs sm:text-sm">JOIN</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </form>
              
              {/* Trust indicators - mobile optimized */}
              <div className="mt-2 sm:mt-3 flex items-center justify-center space-x-2 sm:space-x-4 text-white/80 text-xs">
                <div className="flex items-center space-x-1">
                  <span className="text-green-400">✓</span>
                  <span>No spam</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-green-400">✓</span>
                  <span>Unsubscribe anytime</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-green-400">✓</span>
                  <span>Exclusive deals</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#F9A245]"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#F9A245] text-white py-2 rounded hover:bg-[#E86A12] disabled:opacity-50"
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
        {showSuccess && (
          <div className="mt-2 text-center text-sm text-green-600">✅ Subscribed!</div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#F9A245] p-4 rounded-lg">
      <div className="text-center mb-3">
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-[#F9A245]"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#F9A245] text-white px-4 py-2 rounded hover:bg-[#E86A12] disabled:opacity-50"
        >
          {isSubmitting ? '...' : 'Join'}
        </button>
      </form>
      {showSuccess && (
        <div className="mt-2 text-center text-sm text-green-600">✅ Subscribed!</div>
      )}
    </div>
  );
};

export default SubscribeCTA;