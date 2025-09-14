import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FAQAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const faqs = [
    {
      question: "How do I place an order?",
      answer: "Browse products, add to cart, and checkout. We accept UPI, cards, and COD."
    },
    {
      question: "What are your delivery times?",
      answer: "Delhi NCR: 1-2 days, Major cities: 2-4 days, Other locations: 4-7 days."
    },
    {
      question: "Are your products authentic?",
      answer: "Yes, all products are 100% authentic and sourced from authorized distributors."
    },
    {
      question: "What is your return policy?",
      answer: "7-day return policy for unopened products in original packaging."
    },
    {
      question: "Do you offer free shipping?",
      answer: "Yes, free shipping on orders above ₹2,000. Below that, ₹99 shipping charge applies."
    },
    {
      question: "How do gift cards work?",
      answer: "Gift cards are delivered via email with unique codes, valid for 12 months."
    },
    {
      question: "Need more help?",
      answer: "Email: support@o2nutrition.com | Phone: +91-98888-99909"
    }
  ];

  return (
    <div className="space-y-4 font-body text-gray-700">
      {faqs.map((faq, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-heading font-semibold text-lg text-gray-900">{faq.question}</h3>
            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openIndex === index ? 'rotate-180' : ''}`} />
          </button>
          {openIndex === index && (
            <div className="px-6 pb-6">
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const FAQs: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center text-gray-600 hover:text-[#F9A245] mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>
      
      <h1 className="font-heading font-bold text-3xl text-gray-900 mb-8">Frequently Asked Questions</h1>
      
      <FAQAccordion />

      <div className="mt-8 text-center">
        <Link to="/">
          <Button className="bg-[#F9A245] hover:bg-[#e8913d] text-white">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FAQs;
