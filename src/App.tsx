import React, { useState } from 'react';
import { DynamicPreloader } from './components/DynamicPreloader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustedBy } from './components/TrustedBy';
import { Portfolio } from './components/Portfolio';
import { Services } from './components/Services';
import { Experience } from './components/Experience';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="min-h-screen bg-[#080808] text-white selection:bg-[#FF4D00] selection:text-white">
      {/* Dynamic JavaScript Preloader when website opens */}
      {isLoading && (
        <DynamicPreloader onComplete={() => setIsLoading(false)} />
      )}

      {/* Top sticky navigation */}
      <Navbar />

      <main className={`transition-opacity duration-700 ${isLoading ? 'opacity-20' : 'opacity-100'}`}>
        {/* Hero Section with authentic layout and optimized load speed */}
        <Hero />

        {/* Client trust strip */}
        <TrustedBy />

        {/* Portfolio Showcase with authentic works & case study modals */}
        <Portfolio />

        {/* Core Services and Capabilities: Screen Printing, Heat Press, Vinyl Stickers */}
        <Services />

        {/* Professional Experience: GYA Theirworld 2026-2028 & Rogue Ventures */}
        <Experience />

        {/* About Wilberforce Mubiru */}
        <About />

        {/* Contact and WhatsApp Direct Ordering */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
