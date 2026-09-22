import React, { useState } from 'react';
import { MessageCircle, Phone, MapPin, Instagram, Linkedin, Copy, Check, Send, Sparkles } from 'lucide-react';
import { WHATSAPP_LINK, WHATSAPP_NUMBER } from '../data/projects';

export const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const briefText = "Hi Wilberforce, I need a bulk order quote for [quantity] [tees/vests/polos] for [organization/event] required by [date]. Artwork is [ready / needs design]. Based in [location].";

  const handleCopy = () => {
    navigator.clipboard.writeText(briefText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="contact" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
        {/* Left card: White high-contrast panel matching original */}
        <div className="rounded-3xl bg-white text-black p-7 sm:p-10 md:p-12 shadow-2xl">
          <div className="text-xs uppercase tracking-[0.2em] text-black/50 font-bold">
            Contact • Fastest Response on WhatsApp
          </div>

          <h2 className="font-serif-display text-3xl sm:text-5xl leading-[0.92] tracking-tight mt-3 text-black">
            Let's make your <span className="text-[#FF4D00]">next bulk order</span> print perfect
          </h2>

          <p className="text-sm sm:text-base text-black/70 mt-4 max-w-lg leading-relaxed">
            Bulk tees, reflector vests, event kits, and NGO institutional branding. Share your desired quantity, deadline, and artwork proof. I reply fastest on WhatsApp.
          </p>

          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-[#FF4D00] text-white h-14 px-8 text-sm font-bold hover:bg-black transition-all shadow-[0_4px_20px_rgba(255,77,0,0.3)] hover:scale-[1.02]"
          >
            <MessageCircle size={20} />
            <span>Chat on WhatsApp +256 755943973</span>
          </a>

          {/* 4 contact detail tiles */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div className="rounded-2xl bg-black/[0.04] border border-black/10 p-4">
              <div className="text-[11px] uppercase tracking-wider text-black/50 font-bold flex items-center gap-1.5">
                <Phone size={13} className="text-[#FF4D00]" />
                <span>Phone / WhatsApp</span>
              </div>
              <div className="font-bold text-sm text-black mt-1">
                +256 755943973
              </div>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF4D00] text-xs font-semibold underline mt-0.5 inline-block"
              >
                Open chat directly
              </a>
            </div>

            <div className="rounded-2xl bg-black/[0.04] border border-black/10 p-4">
              <div className="text-[11px] uppercase tracking-wider text-black/50 font-bold flex items-center gap-1.5">
                <MapPin size={13} className="text-[#FF4D00]" />
                <span>Production Hub</span>
              </div>
              <div className="font-bold text-sm text-black mt-1">
                Kampala, Uganda
              </div>
              <div className="text-xs text-black/60 mt-0.5">
                Rogue Ventures Studio & Onsite Delivery
              </div>
            </div>

            <div className="rounded-2xl bg-black/[0.04] border border-black/10 p-4">
              <div className="text-[11px] uppercase tracking-wider text-black/50 font-bold flex items-center gap-1.5">
                <Instagram size={13} className="text-[#FF4D00]" />
                <span>Instagram</span>
              </div>
              <div className="font-bold text-sm text-black mt-1">
                @willinho23
              </div>
              <a
                href="https://instagram.com/willinho23"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black/70 hover:text-black text-xs underline mt-0.5 inline-block"
              >
                instagram.com/willinho23
              </a>
            </div>

            <div className="rounded-2xl bg-black/[0.04] border border-black/10 p-4">
              <div className="text-[11px] uppercase tracking-wider text-black/50 font-bold flex items-center gap-1.5">
                <Linkedin size={13} className="text-[#FF4D00]" />
                <span>LinkedIn</span>
              </div>
              <div className="font-bold text-sm text-black mt-1">
                Wilberforce Mubiru
              </div>
              <span className="text-black/50 text-xs mt-0.5 inline-block">
                Professional Network Profile
              </span>
            </div>
          </div>
        </div>

        {/* Right column: Artist status, brief template */}
        <div className="space-y-5">
          {/* Artist mini card */}
          <div className="rounded-3xl border border-white/10 bg-[#111111] p-6 sm:p-7 shadow-xl">
            <div className="flex items-center gap-4">
              <img
                src="/portfolio/wilberforce-profile.webp"
                alt="Wilberforce Mubiru"
                className="h-14 w-14 rounded-full object-cover object-top border-2 border-[#FF4D00]"
              />
              <div>
                <div className="text-base font-bold text-white">
                  Wilberforce Mubiru
                </div>
                <div className="text-xs text-[#FF4D00] font-semibold">
                  Rogue Ventures • Graphic Artist & Production Lead
                </div>
                <div className="text-[11px] text-white/50">
                  Founder Grin Mates
                </div>
              </div>
            </div>

            <p className="mt-5 text-xs sm:text-sm leading-relaxed text-white/70">
              Direct accountability for Rogue Ventures bulk apparel production, rigorous color separation accuracy, and prompt delivery across East Africa. Let's discuss your timeline today.
            </p>

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white text-black h-11 text-xs font-bold hover:bg-[#FF4D00] hover:text-white transition shadow-sm"
            >
              <MessageCircle size={16} />
              <span>Message Wilberforce Directly</span>
            </a>
          </div>

          {/* Quick brief template widget */}
          <div className="rounded-3xl border border-[#FF4D00]/30 bg-[#FF4D00]/[0.06] p-6">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-[#FF4D00] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} />
                <span>Quick WhatsApp Brief Template</span>
              </div>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-white bg-black/40 hover:bg-black px-2.5 py-1 rounded-full border border-white/15 transition"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div className="mt-3 p-3.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-white/80 leading-relaxed select-all">
              {briefText}
            </div>

            <div className="mt-3 text-[11px] text-white/50">
              Click copy, paste into WhatsApp, fill in your details, and receive an instant quotation.
            </div>
          </div>

          <div className="text-xs text-white/40 px-2 leading-relaxed">
            All design proofs, size breakdowns, and formal proforma invoices are delivered directly via WhatsApp or email upon request.
          </div>
        </div>
      </div>
    </section>
  );
};
