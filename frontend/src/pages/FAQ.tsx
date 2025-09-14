import React, { useState } from "react";
import { ChevronDown, Search, HelpCircle } from "lucide-react";

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      category: "Orders & Shipping",
      questions: [
        {
          question: "How can I track my order?",
          answer: "Once your order is shipped, you'll receive a tracking number via email. You can also track your order in the 'My Orders' section of your account."
        },
        {
          question: "What are your shipping charges?",
          answer: "We offer free shipping on orders above ₹1500. For orders below ₹1500, shipping charges are ₹99 across India."
        },
        {
          question: "How long does delivery take?",
          answer: "Standard delivery takes 3-7 business days. Express delivery (available in select cities) takes 1-2 business days."
        }
      ]
    },
    {
      category: "Returns & Refunds",
      questions: [
        {
          question: "What is your return policy?",
          answer: "We offer a 30-day return policy for unopened products. Please contact our support team to initiate a return."
        },
        {
          question: "How do I return a product?",
          answer: "Contact our customer support team with your order details. We'll provide you with a return label and instructions."
        },
        {
          question: "When will I receive my refund?",
          answer: "Refunds are processed within 5-7 business days after we receive the returned product."
        }
      ]
    },
    {
      category: "Products & Quality",
      questions: [
        {
          question: "Are your products authentic?",
          answer: "Absolutely! We source all products directly from authorized distributors and manufacturers to ensure 100% authenticity."
        },
        {
          question: "Do you offer nutrition consultation?",
          answer: "Yes! Our certified nutritionists are available for personalized consultations. Contact us to schedule an appointment."
        },
        {
          question: "How do I know which product is right for me?",
          answer: "Our product pages include detailed descriptions and benefits. You can also chat with our nutrition experts for personalized recommendations."
        }
      ]
    },
    {
      category: "Account & Payment",
      questions: [
        {
          question: "How do I create an account?",
          answer: "Click on 'Login' in the top right corner, then select 'Create Account'. Fill in your details to get started."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit/debit cards, UPI, net banking, and digital wallets like Paytm, PhonePe, and Google Pay."
        },
        {
          question: "Is my payment information secure?",
          answer: "Yes, we use industry-standard SSL encryption to protect your payment information. We never store your card details."
        }
      ]
    },
    {
      category: "Gift Cards",
      questions: [
        {
          question: "Do gift cards expire?",
          answer: "No, our gift cards never expire. Your recipient can use them whenever they're ready to shop."
        },
        {
          question: "Can I use multiple gift cards on one order?",
          answer: "Yes, you can apply multiple gift cards to a single order until the full amount is covered."
        },
        {
          question: "What if I lose my gift card code?",
          answer: "Don't worry! Contact our customer support with your purchase details and we'll help you recover your gift card."
        }
      ]
    }
  ];

  const allQuestions = faqs.flatMap((category, categoryIndex) =>
    category.questions.map((q, questionIndex) => ({
      ...q,
      globalIndex: categoryIndex * 100 + questionIndex,
      category: category.category
    }))
  );

  const filteredQuestions = searchQuery
    ? allQuestions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allQuestions;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#F9A246] to-[#FEB47B] py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading font-bold text-4xl lg:text-5xl text-white mb-6">
            Frequently Asked Questions
          </h1>
          <p className="font-body text-xl text-white/90 max-w-2xl mx-auto">
            Find answers to common questions about our products, orders, and services.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9A246] focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* FAQ Categories or Search Results */}
        {searchQuery ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Search Results ({filteredQuestions.length})
            </h2>
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((faq) => (
                <div key={faq.globalIndex} className="bg-white rounded-lg shadow-md border border-gray-200">
                  <button
                    onClick={() => setOpenIndex(openIndex === faq.globalIndex ? null : faq.globalIndex)}
                    className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <span className="text-sm text-[#F9A246] font-medium">{faq.category}</span>
                      <h3 className="font-semibold text-gray-900 mt-1">{faq.question}</h3>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openIndex === faq.globalIndex ? 'rotate-180' : ''}`} />
                  </button>
                  {openIndex === faq.globalIndex && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">Try searching with different keywords</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.category}</h2>
                <div className="space-y-4">
                  {category.questions.map((faq, questionIndex) => {
                    const globalIndex = categoryIndex * 100 + questionIndex;
                    return (
                      <div key={globalIndex} className="bg-white rounded-lg shadow-md border border-gray-200">
                        <button
                          onClick={() => setOpenIndex(openIndex === globalIndex ? null : globalIndex)}
                          className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition-colors"
                        >
                          <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                          <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openIndex === globalIndex ? 'rotate-180' : ''}`} />
                        </button>
                        {openIndex === globalIndex && (
                          <div className="px-6 pb-6">
                            <p className="text-gray-600">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact Support */}
        <div className="mt-16 bg-gradient-to-br from-[#F9A246] to-[#FEB47B] rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Still have questions?</h3>
          <p className="text-white/90 mb-6">
            Can't find what you're looking for? Our support team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center bg-white text-[#F9A246] font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Contact Support
            </a>
            <a
              href="mailto:support@o2nutrition.com"
              className="inline-flex items-center border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-[#F9A246] transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;