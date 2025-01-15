import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Metadata configuration
export const metadata: Metadata = {
  metadataBase: new URL('https://everydukan.com'),
  title: {
    default: "EveryDukan - Indian D2C Brands & Marketplace Deals",
    template: "%s | EveryDukan"
  },
  description: "Discover the best deals and discounts from Indian D2C brands. EveryDukan helps you save money with exclusive offers, real-time deal alerts, and smart recommendations.",
  keywords: [
    "Indian D2C brands",
    "online shopping deals",
    "discount alerts",
    "shopping companion app",
    "Indian marketplace deals",
    "exclusive offers",
    "smart shopping",
    "price alerts",
    "brand discovery",
    "shopping recommendations"
  ],
  authors: [{ name: "EveryDukan Team" }],
  creator: "EveryDukan",
  publisher: "EveryDukan",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: 'shopping',
  
  // OpenGraph metadata
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://everydukan.com',
    title: 'EveryDukan - Smart Shopping Companion for Indian D2C Brands',
    description: 'Save money on your favorite Indian D2C brands with exclusive deals, personalized recommendations, and real-time alerts.',
    siteName: 'EveryDukan',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'EveryDukan - Smart Shopping Companion'
    }],
  },
  
  // Twitter metadata
  twitter: {
    card: 'summary_large_image',
    title: 'EveryDukan - Smart Shopping Companion',
    description: 'Discover and save on Indian D2C brands',
    images: ['/twitter-image.png'],
    creator: '@everydukan',
    site: '@everydukan',
  },
  
  // App-specific metadata
  applicationName: "EveryDukan",
  appleWebApp: {
    capable: true,
    title: "EveryDukan",
    statusBarStyle: "black-translucent",
  },
  
  // Manifest
  manifest: '/manifest.json',
  
  // Icons
  icons: {
    icon: [
      { url: '/logo.png' } 
    ],
  },
};

// Viewport configuration
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f59e0b' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html 
      lang="en" 
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to critical domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* PWA meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Microsoft Tile Color */}
        <meta name="msapplication-TileColor" content="#f59e0b" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body 
        className="min-h-screen bg-white dark:bg-gray-900 antialiased"
      >
        {children}
      </body>
    </html>
  );
}