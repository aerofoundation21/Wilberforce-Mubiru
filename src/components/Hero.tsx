import React from 'react';
import { MessageCircle, ArrowDown, Sparkles, CheckCircle2, Shield } from 'lucide-react';
import { WHATSAPP_LINK } from '../data/projects';

export const Hero: React.FC = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 md:pt-14 pb-12">
      <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 items-start">
        {/* Left Column: Headlines, CTAs, Metrics */}
        <div>
          {/* Availability pill */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium tracking-wide text-white/75 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4D00] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF4D00]"></span>
              </span>
              <span className="uppercase text-[11px] font-semibold text-white/70">
                Rogue Ventures • DTF, Heat Press & Apparel Production • Kampala
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
              <span className="text-[11px] font-semibold">GYA Theirworld 2026–2028</span>
            </div>
          </div>

          {/* Main Title with Instrument Serif accent */}
          <h1 className="font-serif-display text-[44px] sm:text-[64px] lg:text-[76px] leading-[0.92] tracking-[-0.03em] font-normal">
            <span className="text-[#FF4D00]">Logo & Graphic Artist</span>
            <span className="block text-white/95 mt-1">| Web & Mobile Developer</span>
            <span className="block text-white/60 text-[30px] sm:text-[42px] lg:text-[48px] mt-2 tracking-[-0.02em] font-sans font-light">
              & Brand Specialist at <strong className="text-white font-medium">Rogue Ventures</strong>
            </span>
          </h1>

          <p className="mt-5 text-[15px] sm:text-[17px] leading-relaxed text-white/70 max-w-xl font-normal">
            Specializing in Web &amp; Mobile App Development (Grin Mates Web3), CorelDRAW vector prepress, Logo Design, Direct-to-Film (DTF) transfers, pneumatic heat press machinery, screen printing, and turnkey merchandise kits for leading international NGOs, charity marathons, and environmental initiatives.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap gap-3.5 items-center">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full bg-[#FF4D00] text-white px-6 h-12 font-semibold text-sm hover:bg-[#ff5f1a] transition-all shadow-[0_0_0_1px_rgba(255,77,0,0.3),0_10px_30px_rgba(255,77,0,0.3)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageCircle size={18} />
              <span>Chat on WhatsApp +256 755943973</span>
            </a>

            <a
              href="#graphics-catalog"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-5 h-12 text-xs sm:text-sm font-medium hover:bg-white hover:text-black transition-all hover:border-white"
            >
              <span>Graphics &amp; Print Catalog</span>
              <ArrowDown size={14} />
            </a>

            <a
              href="#web-mobile-catalog"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 px-5 h-12 text-xs sm:text-sm font-medium hover:bg-emerald-500 hover:text-black transition-all"
            >
              <span>Web &amp; Mobile Catalog</span>
              <ArrowDown size={14} />
            </a>
          </div>

          {/* Stats Bar */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-w-lg">
            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-4 transition hover:bg-white/[0.05]">
              <div className="text-2xl font-bold tracking-tight text-white flex items-baseline gap-1">
                500+
                <span className="text-xs text-[#FF4D00] font-mono">delivered</span>
              </div>
              <div className="text-[11px] uppercase tracking-wider text-white/50 mt-1 font-medium leading-snug">
                Bulk tees, vests & hoodies printed
              </div>
            </div>

            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-4 transition hover:bg-white/[0.05]">
              <div className="text-2xl font-bold tracking-tight text-white flex items-baseline gap-1">
                7+ NGOs
                <Shield size={14} className="text-[#FF4D00]" />
              </div>
              <div className="text-[11px] uppercase tracking-wider text-white/50 mt-1 font-medium leading-snug">
                OXFAM, UKaid, Belgium, Plan & more
              </div>
            </div>

            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-4 col-span-2 sm:col-span-1 transition hover:bg-white/[0.05]">
              <div className="text-2xl font-bold tracking-tight text-[#FF4D00] flex items-baseline gap-1">
                Grin Mates
                <Sparkles size={14} className="text-white/60" />
              </div>
              <div className="text-[11px] uppercase tracking-wider text-white/50 mt-1 font-medium leading-snug">
                Founder • Eco rewards platform
              </div>
            </div>
          </div>

          {/* Client Badges Bar */}
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 text-xs text-white/50">
            <span className="font-semibold uppercase tracking-wider text-white/40 shrink-0">
              Trusted by:
            </span>
            <div className="flex flex-wrap gap-2">
              {['OXFAM', 'UKaid', 'Ireland', 'Belgium', 'Plan Int.', 'Nivana', 'Dr. Kasenene'].map((client) => (
                <span
                  key={client}
                  className="px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-white/80 text-[11px] font-medium"
                >
                  {client}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Authentic Profile Card */}
        <div className="relative lg:sticky lg:top-24">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#121212] shadow-2xl group">
            <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900">
              <img
                src="/portfolio/wilberforce-profile.webp"
                alt="Wilberforce Mubiru - Graphic Artist at Rogue Ventures"
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover object-top filter contrast-[1.03] transition duration-700 group-hover:scale-[1.02]"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Bottom tag info inside image */}
              <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-end">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FF4D00] text-black text-[11px] font-bold uppercase tracking-wider mb-2">
                    <CheckCircle2 size={12} /> Lead Graphic Artist
                  </div>
                  <div className="text-xl font-bold tracking-tight text-white">
                    Wilberforce Mubiru
                  </div>
                  <div className="text-xs text-white/80 mt-0.5">
                    GYA Theirworld (2026–2028) • Rogue Ventures
                  </div>
                </div>

                <div className="h-11 w-11 rounded-full bg-white text-black flex flex-col items-center justify-center shadow-lg">
                  <span className="text-[12px] font-black leading-none">UG</span>
                  <span className="text-[9px] uppercase tracking-tighter text-black/60 font-semibold">Kampala</span>
                </div>
              </div>
            </div>

            {/* Quick action bar beneath photo */}
            <div className="p-4 bg-[#141414] border-t border-white/[0.06] flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-[#FF4D00] font-semibold">
                  Location & Availability
                </div>
                <div className="text-xs font-medium text-white/90">
                  Kampala, Uganda • Open for bulk orders
                </div>
              </div>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#FF4D00] text-white px-4 h-9 inline-flex items-center gap-1.5 text-xs font-semibold hover:bg-[#ff611e] transition"
              >
                <MessageCircle size={14} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
