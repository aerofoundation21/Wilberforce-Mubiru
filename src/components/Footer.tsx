import React from 'react';
import { WHATSAPP_LINK } from '../data/projects';
import { ArrowUp, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/[0.08] bg-[#050505] py-12 text-xs text-white/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Copyright */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <span className="h-6 w-6 rounded-full bg-[#FF4D00] text-black font-black text-[10px] grid place-items-center">
                RV
              </span>
              <span className="font-bold text-white text-sm">Rogue Ventures</span>
              <span className="text-white/30">•</span>
              <span className="text-white/80 font-medium">Wilberforce Mubiru</span>
            </div>
            <p className="text-[11px] text-white/40">
              © {new Date().getFullYear()} Rogue Ventures. Graphic Artist | Web Developer & Brand Specialist • Kampala, Uganda.
            </p>
          </div>

          {/* Quick links & Back to Top */}
          <div className="flex items-center gap-6 text-xs">
            <a href="#work" className="hover:text-white transition">Portfolio</a>
            <a href="#services" className="hover:text-white transition">Services</a>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF4D00] hover:text-[#ff6b26] font-semibold transition"
            >
              WhatsApp
            </a>
            <a
              href="https://instagram.com/willinho23"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              Instagram
            </a>
            <button
              onClick={scrollToTop}
              className="h-8 w-8 rounded-full bg-white/[0.06] hover:bg-[#FF4D00] hover:text-white text-white/70 grid place-items-center transition"
              aria-label="Scroll to top"
            >
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
