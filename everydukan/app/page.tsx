"use client";

import React from 'react';
import Footer from './components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-gray-900 p-8 text-center">
      <header className="text-3xl font-bold text-amber-500">EveryDukan</header>
      <main className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-4xl font-extrabold mb-4">We are EveryDukan</h1>
        <p className="text-lg max-w-2xl">
          A team of four individuals dedicated to creating innovative app solutions.
          We are not a business, just passionate creators building tools for a better experience.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
