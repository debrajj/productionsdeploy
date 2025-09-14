import React from "react";

const TermsConditions: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading font-bold text-4xl lg:text-5xl text-foreground mb-6">
            Terms & Conditions
          </h1>
          <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto">
            Please read these terms and conditions carefully before using our services.
          </p>
        </div>
      </section>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg p-8 shadow-md">
          <div className="prose prose-lg max-w-none text-gray-600">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="mb-6">
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Product Information</h2>
            <p className="mb-6">
              We strive to provide accurate product information. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Orders and Payment</h2>
            <p className="mb-6">
              All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason at any time.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Shipping and Delivery</h2>
            <p className="mb-6">
              Delivery times are estimates and may vary. We are not responsible for delays caused by circumstances beyond our control.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Returns and Refunds</h2>
            <p className="mb-6">
              Returns are accepted within 30 days of purchase in original condition. Refunds will be processed within 7-10 business days.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Privacy Policy</h2>
            <p className="mb-6">
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect and use your information.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
            <p className="mb-6">
              We shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Information</h2>
            <p>
              If you have any questions about these Terms & Conditions, please contact us through our Contact Us page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;