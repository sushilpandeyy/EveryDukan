"use client";
import React, { useState } from 'react';
import { ShoppingBag, Smartphone, Bell, Tag, TrendingUp, ShoppingCart, Sparkles, Gift, Download } from 'lucide-react';
import Footer from './components/Footer';

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const playStoreUrl = "https://github.com/sushilpandeyy/everydukan";

  const features: Feature[] = [
    {
      title: "🏪 Shopping Jo Mummy Bhi Proud Ho Jaye",
      description: "From local markets to premium brands, we've got more variety than your mom's masala box! Sab kuch milega at prices that'll make your dadi proud.",
      icon: <ShoppingBag className="w-8 h-8 text-amber-500" />
    },
    {
      title: "🔥 Deals Ekdum Dhamakedar",
      description: "Our deals are hotter than Delhi summers! Discover offers that'll make you say 'Arre waah!' Warning: May cause excessive WhatsApp forwards.",
      icon: <Tag className="w-8 h-8 text-amber-500" />
    },
    {
      title: "🎟️ Coupon Paradise",
      description: "Each deal checked more carefully than mom checking price tags at Sarojini! It's like having a money-saving superpower without wearing a cape!",
      icon: <Sparkles className="w-8 h-8 text-amber-500" />
    },
    {
      title: "🎁 Referral Rewards",
      description: "Share the savings like mom shares beta/beti ki success stories! More rewarding than finding money in old kurta pockets.",
      icon: <Gift className="w-8 h-8 text-amber-500" />
    }
  ];

  const bonusFeatures = [
    { icon: "🎯", title: "Smart Categories", desc: "Find shops faster than your dad finds discounts" },
    { icon: "📱", title: "Smooth Interface", desc: "Ekdum butter, jaise fresh malai" },
    { icon: "🔔", title: "Deal Alerts", desc: "Never miss a sale (unless you're watching cricket finals)" },
    { icon: "💫", title: "Daily Updates", desc: "Fresh deals served daily, like your morning chai!" }
  ];

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-amber-500">
                EveryDukan <span className="text-2xl">🛍️</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-amber-500">Features</a>
              <a href="#bonus" className="text-gray-600 hover:text-amber-500">Bonus Features</a>
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
                  <span className="block">Har Deal</span>
                  <span className="block text-amber-500">Ekdum Jhakaas! 🎯</span>
                </h1>
                <p className="mt-3 text-xl text-gray-600 sm:mt-5 sm:max-w-xl sm:mx-auto md:mt-5 lg:mx-0">
                  Tired of paying full price like you're some Ambani? 
                  Put away that calculator, kyunki EveryDukan is here to make sure you save like a pro! 🕵️‍♂️
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <button 
                    onClick={() => window.open(playStoreUrl, '_blank')}
                    className="w-full md:w-auto flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-white bg-amber-500 hover:bg-amber-600 md:text-xl transition-all transform hover:scale-105">
                    <Smartphone className="w-6 h-6 mr-2" />
                    Ab Shopping Ka Mazaa Lo!
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gradient-to-b from-white to-amber-50" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Features That'll Make You Go "Bilkul Solid Hai Boss!" 🚀
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              More exciting than finding extra sukha puri in your golgappa plate!
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

      {/* Bonus Features Section */}
      <div className="bg-amber-50 py-16" id="bonus">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Bonus Features Jinpe Mummy Bhi Kare Trust! ✨
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {bonusFeatures.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-amber-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready For Savings Ka Dhamaka? 🎊
          </h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Join the smart shoppers who save more than aunties at a kitty party sale!
          </p>
          <button 
            onClick={() => window.open(playStoreUrl, '_blank')}
            className="bg-white text-amber-500 px-8 py-4 rounded-full text-lg font-semibold hover:bg-amber-50 transition-all transform hover:scale-105 flex items-center mx-auto">
            <Download className="w-6 h-6 mr-2" />
            Download EveryDukan Now
          </button>
          <p className="text-amber-100 mt-4 text-sm italic">
            P.S. No wallets were harmed in the making of this app! 😉
          </p>
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
            <a href="#bonus" 
              className="block px-3 py-2 text-gray-600 hover:text-amber-500 hover:bg-amber-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}>
              Bonus Features
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