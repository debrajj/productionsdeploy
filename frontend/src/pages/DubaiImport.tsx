import React from "react";
import { Globe, Shield, Award, Truck } from "lucide-react";

const DubaiImport: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading font-bold text-4xl lg:text-5xl text-foreground mb-6">
            Dubai Import
          </h1>
          <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto">
            Premium international nutrition products sourced directly from Dubai's finest suppliers.
          </p>
        </div>
      </section>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-lg p-8 shadow-md">
            <Globe className="w-12 h-12 text-[#F9A246] mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Global Sourcing</h2>
            <p className="text-gray-600">
              Direct partnerships with premium Dubai suppliers ensure authentic, world-class nutrition products.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-md">
            <Shield className="w-12 h-12 text-[#F9A246] mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quality Assured</h2>
            <p className="text-gray-600">
              Every import undergoes strict quality testing to meet international standards for purity and potency.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-md">
            <Award className="w-12 h-12 text-[#F9A246] mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Exclusive Products</h2>
            <p className="text-gray-600">
              Access to premium brands and formulations available exclusively through our Dubai connections.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-md">
            <Truck className="w-12 h-12 text-[#F9A246] mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Fast Delivery</h2>
            <p className="text-gray-600">
              Efficient import logistics ensure fresh products reach you quickly and safely.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-8 shadow-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Why Choose Dubai Import?</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4">
              Dubai serves as a global hub for premium nutrition products, connecting the best manufacturers 
              from around the world. Our strategic location and partnerships allow us to source authentic, 
              high-quality supplements that meet international standards.
            </p>
            <p className="mb-4">
              Every product in our Dubai Import collection is carefully selected for its proven effectiveness, 
              superior quality, and trusted reputation in the global fitness community.
            </p>
            <p>
              Experience the difference that premium international nutrition can make in your fitness journey 
              with our exclusive Dubai Import range.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DubaiImport;