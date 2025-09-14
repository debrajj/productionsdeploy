import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, ChevronDown } from "lucide-react";

const FAQAccordion: React.FC = () => {
  const faqs = [
    {
      question: "How can I track my order?",
      answer: "Once your order is shipped, you'll receive a tracking number via email. You can also track your order in the 'My Orders' section of your account."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for unopened products. Please contact our support team to initiate a return."
    },
    {
      question: "Do you offer nutrition consultation?",
      answer: "Yes! Our certified nutritionists are available for personalized consultations. Contact us to schedule an appointment."
    },
    {
      question: "Are your products authentic?",
      answer: "Absolutely! We source all products directly from authorized distributors and manufacturers to ensure 100% authenticity."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-semibold text-gray-900">{faq.question}</h3>
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

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission here
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#F9A246] to-[#FEB47B] py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading font-bold text-4xl lg:text-5xl text-white mb-6">
            Contact Us
          </h1>
          <p className="font-body text-xl text-white/90 max-w-2xl mx-auto">
            Have questions about our products or need assistance? We're here to help! 
            Reach out to us through any of the channels below.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-[#F9A246] p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Phone</h3>
                  <p className="text-gray-600">+91 98765 43210</p>
                  <p className="text-sm text-gray-500">Mon-Sat, 9AM-7PM</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-[#F9A246] p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600">support@o2nutrition.com</p>
                  <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-[#F9A246] p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Address</h3>
                  <p className="text-gray-600">
                    123 Nutrition Street<br />
                    Health District<br />
                    Mumbai, Maharashtra 400001
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-[#F9A246] p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Business Hours</h3>
                  <p className="text-gray-600">
                    Monday - Saturday: 9:00 AM - 7:00 PM<br />
                    Sunday: 10:00 AM - 5:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9A246] focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9A246] focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9A246] focus:border-transparent"
                    placeholder="What is this regarding?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9A246] focus:border-transparent resize-vertical"
                    placeholder="Please describe your inquiry in detail..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#F9A246] text-white py-3 px-6 rounded-lg hover:bg-[#e8933a] transition-colors font-semibold flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
          <FAQAccordion />
        </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;