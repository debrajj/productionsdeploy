import React from "react";
import { Gift, Heart, Star, Check, Mail, Phone } from "lucide-react";

const GiftCard: React.FC = () => {
  const benefits = [
    {
      icon: Gift,
      title: "Perfect Gift",
      description: "Give the gift of health and fitness to your loved ones",
    },
    {
      icon: Star,
      title: "No Expiry",
      description: "Our gift cards never expire, use them anytime",
    },
    {
      icon: Heart,
      title: "Personal Touch",
      description: "Add a custom message to make it more personal",
    },
    {
      icon: Check,
      title: "Instant Delivery",
      description: "Digital delivery straight to their inbox",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading font-bold text-4xl lg:text-5xl text-foreground mb-6">
            Gift Cards
          </h1>
          <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto">
            Give the perfect gift of health and wellness. Our gift cards are
            ideal for fitness enthusiasts and health-conscious loved ones.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="font-bold text-2xl sm:text-3xl text-gray-900 mb-3">
              Why Choose Our <span className="text-[#F9A245]">Gift Cards</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="text-center bg-gray-50 rounded-xl p-4 hover:bg-white hover:shadow-md hover:border hover:border-[#F9A245] transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#F9A245] to-[#FEB47B] rounded-full flex items-center justify-center mx-auto mb-3">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">
                  {benefit.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-[#F9A245] to-[#FEB47B] rounded-3xl p-12">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gift className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Gift Cards Coming Soon!</h2>
            <p className="text-xl text-white/90 mb-6">We're working on bringing you the perfect gift card experience.</p>
            <p className="text-white/80">Stay tuned for updates!</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl sm:text-4xl text-gray-900 mb-4">
              How It <span className="text-[#F9A245]">Works</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple steps to send the perfect gift
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Choose & Customize",
                description: "Select amount, design, and add personal message",
                icon: Gift,
              },
              {
                step: "2",
                title: "Secure Payment",
                description: "Complete your purchase with our secure checkout",
                icon: Check,
              },
              {
                step: "3",
                title: "Instant Delivery",
                description: "Gift card is delivered instantly to recipient's email",
                icon: Mail,
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#F9A245] to-[#FEB47B] rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-[#F9A245] rounded-full flex items-center justify-center">
                    <span className="text-[#F9A245] font-bold text-sm">
                      {item.step}
                    </span>
                  </div>
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-gradient-to-br from-[#F9A245] to-[#FEB47B]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-bold text-3xl sm:text-4xl text-white mb-4">
            Need Help?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Our customer support team is here to help you with any questions
            about gift cards.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@o2nutrition.com"
              className="inline-flex items-center bg-white text-[#F9A245] font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors shadow-lg"
            >
              <Mail className="w-5 h-5 mr-2" />
              Email Support
            </a>
            <a
              href="tel:+911234567890"
              className="inline-flex items-center border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-[#F9A245] transition-colors"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GiftCard;