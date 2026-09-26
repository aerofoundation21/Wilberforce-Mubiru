import React, { useState } from 'react';
import { MessageCircle, Menu, X, ArrowUpRight } from 'lucide-react';
import { WHATSAPP_LINK } from '../data/projects';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#080808]/90 border-b border-white/[0.08] transition-all duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="h-9 w-9 rounded-full bg-[#FF4D00] grid place-items-center text-white font-bold text-xs tracking-tight shadow-[0_0_15px_rgba(255,77,0,0.4)] group-hover:scale-105 transition duration-300">
            RV
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
              Rogue Ventures
              <span className="text-[10px] uppercase font-bold text-[#FF4D00] bg-[#FF4D00]/10 border border-[#FF4D00]/30 px-1.5 py-0.2 rounded-full">
                Studio
              </span>
            </div>
            <div className="text-[11px] tracking-wide text-white/50">
              Wilberforce Mubiru • Graphic Artist & Lead
            </div>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-white/70">
          <a href="#graphics-catalog" className="hover:text-[#FF4D00] transition py-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00]"></span>
            <span>Graphics &amp; Print</span>
          </a>
          <a href="#web-mobile-catalog" className="hover:text-emerald-400 transition py-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Web &amp; Mobile App</span>
          </a>
          <a href="#services" className="hover:text-white transition py-1">Services</a>
          <a href="#experience" className="hover:text-white transition py-1">Experience</a>
          <a href="#about" className="hover:text-white transition py-1">About</a>
          <a href="#contact" className="hover:text-white transition py-1">Contact</a>
        </nav>

        {/* Action Button */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white text-black px-4.5 h-9 text-[13px] font-semibold hover:bg-[#FF4D00] hover:text-white transition shadow-sm"
          >
            <MessageCircle size={15} />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-9 px-3 rounded-full bg-[#FF4D00] text-white text-xs font-semibold"
          >
            <MessageCircle size={14} className="mr-1" />
            WhatsApp
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/[0.06] transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#0c0c0c] px-5 py-4 space-y-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-white/40 mb-2">
            Navigation
          </div>
          <a
            href="#graphics-catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-sm text-[#FF4D00] font-semibold"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00]"></span>
            <span>Graphics Design &amp; Artist Catalog</span>
          </a>
          <a
            href="#web-mobile-catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-sm text-emerald-400 font-semibold"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Web &amp; Mobile App Development Catalog</span>
          </a>
          <a
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-white/80 hover:text-white font-medium"
          >
            Capabilities & Services
          </a>
          <a
            href="#experience"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-white/80 hover:text-white font-medium"
          >
            Experience at Rogue Ventures
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-white/80 hover:text-white font-medium"
          >
            About Wilberforce Mubiru
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-white/80 hover:text-white font-medium"
          >
            Contact & Brief Template
          </a>
          <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs text-white/50">
            <span>Kampala, Uganda</span>
            <a href="https://instagram.com/willinho23" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1">
              @willinho23 <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
