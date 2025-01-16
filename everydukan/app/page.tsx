"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Smartphone, Bell, Tag, TrendingUp, ShoppingCart, Sparkles, Zap, Download } from 'lucide-react';
import Footer from './components/Footer';

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const playStoreUrl = "https://play.google.com/store/apps/details?id=com.everydukan";

  const features: Feature[] = [
    {
      title: "🛍️ Discover D2C Brands",
      description: "Access India's top D2C brands directly! Explore unique products and exclusive launches you won't find anywhere else.",
      icon: <ShoppingBag className="w-8 h-8 text-amber-500" />
    },
    {
      title: "🔔 Smart Deal Alerts",
      description: "Never miss a sale! Get instant notifications when prices drop on your wishlist items. Be the first to know, first to shop!",
      icon: <Bell className="w-8 h-8 text-amber-500" />
    },
    {
      title: "✨ Personalized Savings",
      description: "Your personal deal hunter! Get tailored recommendations based on your style and shopping habits.",
      icon: <Sparkles className="w-8 h-8 text-amber-500" />
    },
    {
      title: "💸 Exclusive Discounts",
      description: "Access secret deals and hidden gems! Unlock special offers available only to EveryDukan members.",
      icon: <TrendingUp className="w-8 h-8 text-amber-500" />
    }
  ];

  // Stats section data
  const stats = [
    { label: 'Active Users', value: '50K+', icon: '👥' },
    { label: 'D2C Brands', value: '500+', icon: '🏪' },
    { label: 'Daily Deals', value: '1000+', icon: '🏷️' },
    { label: 'Avg. Savings', value: '25%', icon: '💰' }
  ];

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-amber-500">
                EveryDukan <span className="text-amber-600">🛍️</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-amber-500">Features</a>
              <a href="#stats" className="text-gray-600 hover:text-amber-500">Why Us</a>
              <button 
                onClick={() => window.open(playStoreUrl, '_blank')}
                className="bg-amber-500 text-white px-6 py-2 rounded-full hover:bg-amber-600 transition-all transform hover:scale-105 flex items-center">
                <Download className="w-5 h-5 mr-2" />
                Get the App
              </button>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-amber-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">India's Best-Kept</span>
                  <span className="block text-amber-500">Shopping Secret! 🎉</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Your smart shopping companion that finds the hottest deals from your favorite D2C brands. 
                  Save big on trendy fashion, must-have gadgets, and more! ✨
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <button 
                    onClick={() => window.open(playStoreUrl, '_blank')}
                    className="w-full md:w-auto flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-white bg-amber-500 hover:bg-amber-600 md:text-lg transition-all transform hover:scale-105">
                    <Smartphone className="w-5 h-5 mr-2" />
                    Download & Start Saving
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12" id="stats">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-amber-50 p-6 rounded-xl text-center transform hover:scale-105 transition-transform">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-amber-600">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
        
      {/* Features Section */}
      <div className="py-16 bg-gradient-to-b from-white to-amber-50" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Shop Smarter, Save Bigger! 💡
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Why smart shoppers choose EveryDukan for their D2C shopping needs
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  <div className="p-3 inline-block bg-amber-100 rounded-lg">
                    {feature.icon}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Download App Section */}
      <div className="bg-amber-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Saving? 🚀
          </h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Join thousands of smart shoppers who save big on their favorite D2C brands every day!
          </p>
          <button 
            onClick={() => window.open(playStoreUrl, '_blank')}
            className="bg-white text-amber-500 px-8 py-4 rounded-full text-lg font-semibold hover:bg-amber-50 transition-all transform hover:scale-105 flex items-center mx-auto">
            <Download className="w-6 h-6 mr-2" />
            Download EveryDukan Now
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-50">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#features" 
              className="block px-3 py-2 text-gray-600 hover:text-amber-500 hover:bg-amber-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}>
              Features
            </a>
            <a href="#stats" 
              className="block px-3 py-2 text-gray-600 hover:text-amber-500 hover:bg-amber-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}>
              Why Us
            </a>
            <button 
              onClick={() => {
                window.open(playStoreUrl, '_blank');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600">
              Download App
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Home;