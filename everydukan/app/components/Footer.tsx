"use client";
import React from 'react';
import Link from 'next/link';
import { Home, HelpCircle, FileText, Settings, Download } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 w-full bg-amber-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Footer */}
        <div className="hidden md:block py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">EveryDukan</h3>
              <p className="text-amber-100 text-sm">
                Your smart shopping companion for the best deals on Indian D2C brands.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-amber-100">
                <li>
                  <Link href="/" className="hover:text-amber-300 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/help-support" className="hover:text-amber-300 transition-colors">
                    Help & Support
                  </Link>
                </li>
                <li>
                  <Link href="/terms-service" className="hover:text-amber-300 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-amber-300 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-amber-100">
                <li>Email: support@everydukan.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Location: Mumbai, India</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Download App</h3>
              <button className="bg-amber-500 text-white px-6 py-2 rounded-full hover:bg-amber-600 transition-colors flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Get the App
              </button>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-amber-800">
            <p className="text-center text-amber-100">
              © {new Date().getFullYear()} EveryDukan. All rights reserved.
            </p>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden">
          <div className="grid grid-cols-5 gap-1">
            <Link href="/" 
              className="flex flex-col items-center justify-center py-2 hover:bg-amber-800">
              <Home className="w-6 h-6" />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link href="/help-support"
              className="flex flex-col items-center justify-center py-2 hover:bg-amber-800">
              <HelpCircle className="w-6 h-6" />
              <span className="text-xs mt-1">Help</span>
            </Link>
            <Link href="/terms-service"
              className="flex flex-col items-center justify-center py-2 hover:bg-amber-800">
              <FileText className="w-6 h-6" />
              <span className="text-xs mt-1">Terms</span>
            </Link>
            <Link href="/privacy-policy"
              className="flex flex-col items-center justify-center py-2 hover:bg-amber-800">
              <Settings className="w-6 h-6" />
              <span className="text-xs mt-1">Privacy</span>
            </Link>
            <button 
              className="flex flex-col items-center justify-center py-2 hover:bg-amber-800"
              onClick={() => window.open('https://app.everydukan.com/download', '_blank')}>
              <Download className="w-6 h-6" />
              <span className="text-xs mt-1">Get App</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;