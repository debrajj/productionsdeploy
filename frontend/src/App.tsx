import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { GiftCardProvider } from "@/context/GiftCardContext";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ContactFloat from "@/components/ContactFloat";
import AppLoader from "@/components/AppLoader";
import { useAppLoader } from "@/hooks/useAppLoader";
import Index from "./pages/Index";
import Category from "./pages/Category";
import CategoryPage from "./pages/CategoryPage";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ThankYou from "./pages/ThankYou";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import TrackOrder from "./pages/TrackOrder";
import Offers from "./pages/Offers";
import GiftCard from "./pages/GiftCard";
import ShippingReturns from "./pages/ShippingReturns";
import FAQs from "./pages/FAQs";
import Disclaimer from "./pages/Disclaimer";
import StoreLocator from "./pages/StoreLocator";
import BrandsPage from "./pages/BrandsPage";
import BrandPage from "./pages/BrandPage";
import GoalPage from "./pages/GoalPage";
import NotFound from "./pages/NotFound";
import ApiProducts from "./pages/ApiProducts";
import SearchPage from "./pages/SearchPage";

import DubaiImport from "./pages/DubaiImport";
import TermsConditions from "./pages/TermsConditions";
import SubscriptionPopup from "@/components/SubscriptionPopup";
import Chatbot from "@/components/Chatbot";
import ErrorBoundary from "@/components/ErrorBoundary";
const queryClient = new QueryClient();

const App = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const { isLoading } = useAppLoader();

  return (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <GiftCardProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AppLoader isLoading={isLoading} />
              <BrowserRouter>
                <ScrollToTop />
                <div className="min-h-screen flex flex-col bg-background font-body">
                  <Header />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/category/:categorySlug" element={<CategoryPage />} />
                      <Route path="/category/:categorySlug/:subcategorySlug" element={<CategoryPage />} />
                      <Route path="/product/:slug" element={<ProductDetail />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/thank-you" element={<ThankYou />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/register" element={<Signup />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/track-order" element={<TrackOrder />} />
                      <Route path="/offers" element={<Offers />} />
                      <Route path="/gift-card" element={<GiftCard />} />
                      <Route path="/shipping-returns" element={<ShippingReturns />} />
                      <Route path="/faqs" element={<FAQs />} />
                      <Route path="/disclaimer" element={<Disclaimer />} />
                      <Route path="/store-locator" element={<StoreLocator />} />
                      <Route path="/brands" element={<BrandsPage />} />
                      <Route path="/brand/:brandSlug" element={<BrandPage />} />
                      <Route path="/goal/:slug" element={<GoalPage />} />
                      <Route path="/api-products" element={<ApiProducts />} />
                      <Route path="/search" element={<SearchPage />} />

                      <Route path="/dubai-import" element={<DubaiImport />} />
                      <Route path="/terms-conditions" element={<TermsConditions />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                  <ContactFloat onChatbotToggle={() => setIsChatbotOpen(!isChatbotOpen)} />
                  <SubscriptionPopup />
                  <Chatbot isOpen={isChatbotOpen} onToggle={() => setIsChatbotOpen(!isChatbotOpen)} />
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </GiftCardProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
  )
}

export default App;
