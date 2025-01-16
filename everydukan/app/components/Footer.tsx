"use client";
import React from 'react';
import Link from 'next/link';
import { Home, HelpCircle, FileText, Settings, Download, ShoppingBag, Tag, Bell, Instagram, Twitter, ShoppingCart } from 'lucide-react';

const Footer = () => {
  const playStoreUrl = "https://play.google.com/store/apps/details?id=com.deals.d2c";

  // Pre-footer CTA Section
  const PreFooterCTA = () => (
    <div className="bg-amber-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-amber-900 mb-4">
          Savings Ka Real Superstar! 🌟
        </h2>
        <p className="text-xl text-amber-800 mb-8 max-w-2xl mx-auto">
          Join the smart shoppers ki family and save more than your dadiji at a seasonal sale!
        </p>
        <button 
          onClick={() => window.open(playStoreUrl, '_blank')}
          className="bg-amber-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-amber-600 transition-colors flex items-center mx-auto">
          <Download className="w-6 h-6 mr-2" />
          Download Karo, Save Karo! 🎉
        </button>
      </div>
    </div>
  );

  return (
    <>
      <PreFooterCTA />
      <footer className="bg-amber-900 text-white">
        {/* Desktop Footer */}
        <div className="hidden md:block py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">EveryDukan</h3>
              <p className="text-amber-100 mb-6">
                Bachat ki guarantee, jaise mummy ke haath ka khana! 💝
              </p>
              <div className="flex space-x-4">
                <a href="https://instagram.com/everydukan" className="text-amber-100 hover:text-amber-300">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="https://twitter.com/everydukan" className="text-amber-100 hover:text-amber-300">
                  <Twitter className="w-6 h-6" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3 text-amber-100">
                <li>
                  <Link href="/" className="hover:text-amber-300 transition-colors flex items-center">
                    <ShoppingBag className="w-4 h-4 mr-2" /> Deals Ki Dukan
                  </Link>
                </li>
                <li>
                  <Link href="/help-support" className="hover:text-amber-300 transition-colors flex items-center">
                    <HelpCircle className="w-4 h-4 mr-2" /> Help & Support
                  </Link>
                </li>
                <li>
                  <Link href="/terms-service" className="hover:text-amber-300 transition-colors flex items-center">
                    <FileText className="w-4 h-4 mr-2" /> Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-amber-300 transition-colors flex items-center">
                    <Settings className="w-4 h-4 mr-2" /> Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Humse Judo 🤝</h3>
              <ul className="space-y-3 text-amber-100">
                <li>📧 contact.sushilpandey@gmail.com</li>
                <li>📍 Mumbai, Aamchi Mumbai!</li>
                <li className="flex items-center">
                  <Tag className="w-4 h-4 mr-2" /> #SaveWithEveryDukan
                </li>
                <li className="flex items-center">
                  <Bell className="w-4 h-4 mr-2" /> #BachatKaSuperhero
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">App Download Karo! 📱</h3>
              <p className="text-amber-100 mb-4">
                Deals aise dhundo, jaise mummy subzi dhundti hain! 🥬
              </p>
              <button 
                onClick={() => window.open(playStoreUrl, '_blank')}
                className="bg-amber-500 text-white px-6 py-3 rounded-full hover:bg-amber-600 transition-colors flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Download Now
              </button>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-amber-800">
            <p className="text-center text-amber-100">
              © {new Date().getFullYear()} EveryDukan. Sabse Sasta, Sabse Accha! 🛍️
            </p>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="fixed bottom-0 w-full md:hidden bg-amber-900">
          <div className="grid grid-cols-5 gap-1">
            <Link href="/" 
              className="flex flex-col items-center justify-center py-3 hover:bg-amber-800">
              <Home className="w-6 h-6" />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link href="/help-support"
              className="flex flex-col items-center justify-center py-3 hover:bg-amber-800">
              <HelpCircle className="w-6 h-6" />
              <span className="text-xs mt-1">Help</span>
            </Link>
            <button 
              onClick={() => window.open(playStoreUrl, '_blank')}
              className="flex flex-col items-center justify-center py-3 bg-amber-500 hover:bg-amber-600">
              <Download className="w-6 h-6" />
              <span className="text-xs mt-1">Get App</span>
            </button>
            <Link href="/terms-service"
              className="flex flex-col items-center justify-center py-3 hover:bg-amber-800">
              <FileText className="w-6 h-6" />
              <span className="text-xs mt-1">Terms</span>
            </Link>
            <Link href="/privacy-policy"
              className="flex flex-col items-center justify-center py-3 hover:bg-amber-800">
              <Settings className="w-6 h-6" />
              <span className="text-xs mt-1">Privacy</span>
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;