"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Smartphone, Bell, Tag, TrendingUp } from 'lucide-react';
 
interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);  
   
   

  useEffect(() => {
    const animateStats = () => {
      const duration = 2000; // Animation duration in milliseconds
      const steps = 60; // Number of steps in animation
      const interval = duration / steps;
      
      let currentStep = 0;
      
      const timer = setInterval(() => {
        if (currentStep >= steps) {
          clearInterval(timer);
          return;
        }
        
        currentStep++;
      }, interval);
    };

    // Start animation when component mounts
    animateStats();
  }, []);

  const features: Feature[] = [
    {
      title: "Discover D2C Brands",
      description: "Shop directly from India's most innovative brands with exclusive deals and offers.",
      icon: <ShoppingBag className="w-6 h-6 text-amber-500" />
    },
    {
      title: "Smart Deal Alerts",
      description: "Get instant notifications when prices drop on your favorite items.",
      icon: <Bell className="w-6 h-6 text-amber-500" />
    },
    {
      title: "Personalized Savings",
      description: "Receive tailored deal recommendations based on your shopping preferences.",
      icon: <Tag className="w-6 h-6 text-amber-500" />
    },
    {
      title: "Exclusive Discounts",
      description: "Get access to special discounts and limited-time offers from top D2C brands.",
      icon: <TrendingUp className="w-6 h-6 text-amber-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-amber-500">EveryDukan</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button className="bg-amber-500 text-white px-6 py-2 rounded-full hover:bg-amber-600">
                Download App
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
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Save More on</span>
                  <span className="block text-amber-500">Indian D2C Brands</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Your smart shopping companion that finds the best deals, tracks prices, and notifies you of savings across all your favorite Indian D2C brands.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 md:py-4 md:text-lg md:px-10">
                      <Smartphone className="w-5 h-5 mr-2" />
                      Get Started
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

        
      {/* Features Section */}
      <div className="py-12 bg-gray-50" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Smart Shopping, Smarter Savings
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              Everything you need to save money while shopping from your favorite brands.
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="p-2 inline-block bg-amber-100 rounded-lg">
                    {feature.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#features" className="block px-3 py-2 text-gray-600">Features</a>
            <a href="#how-it-works" className="block px-3 py-2 text-gray-600">How it Works</a>
            <button className="block w-full text-left px-3 py-2 bg-amber-500 text-white rounded">
              Download App
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;