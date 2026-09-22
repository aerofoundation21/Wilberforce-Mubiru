import React from 'react';
import { Palette, Printer, Shield, Flame, Globe, ArrowRight, MessageCircle } from 'lucide-react';
import { WHATSAPP_LINK } from '../data/projects';

export const Services: React.FC = () => {
  return (
    <section id="services" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t border-white/[0.08]">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-[#FF4D00] font-semibold">
            Capabilities & Solutions
          </div>
          <h2 className="font-serif-display text-3xl sm:text-5xl tracking-tight text-white mt-2 leading-[0.95]">
            Graphic first. <span className="text-white/40">Print and web that ships.</span>
          </h2>
        </div>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-white bg-white/[0.04] border border-white/10 px-4 py-2 rounded-full hover:border-white transition"
        >
          <MessageCircle size={14} className="text-[#FF4D00]" />
          <span>Chat on WhatsApp for instant quote</span>
        </a>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-12 gap-5">
        {/* Featured Card (Orange background) */}
        <div className="md:col-span-7 rounded-3xl bg-[#FF4D00] text-white p-7 sm:p-9 relative overflow-hidden flex flex-col justify-between shadow-2xl">
          <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/15 blur-3xl pointer-events-none" />

          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-black/25 backdrop-blur-sm px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
              <Palette size={13} />
              <span>Most Requested • Graphic First</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-bold tracking-tight mt-4 leading-tight">
              Graphic Design & Institutional Brand Systems
            </h3>
            <p className="text-sm sm:text-base text-white/90 mt-3 max-w-lg leading-relaxed font-normal">
              Vector logos, campaign posters, brand identity manuals, event visual packs, and investor pitch decks. Built from day one for Pantone color accuracy, high-mesh screen separations, and international NGO visual compliance.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {['Logos', 'Event Visual Packs', 'Vector Proofs', 'Pantone Calibration', 'Brand Guidelines', 'Social Media Kits'].map((skill) => (
                <span key={skill} className="px-3 py-1.5 rounded-full bg-white text-black text-xs font-bold shadow-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-between">
            <span className="text-xs font-medium text-white/80">Vector artwork delivered print-ready in CMYK & Spot Colors</span>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-black text-white px-5 py-2.5 text-xs font-bold hover:bg-neutral-900 transition"
            >
              <span>Commission Design</span>
              <ArrowRight size={13} />
            </a>
          </div>
        </div>

        {/* Card 2: Screen Printing on Multi-Station Carousel */}
        <div className="md:col-span-5 rounded-3xl bg-[#111111] border border-white/10 p-7 sm:p-8 flex flex-col justify-between hover:border-white/20 transition">
          <div>
            <div className="h-10 w-10 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#FF4D00] mb-4">
              <Printer size={20} />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Screen Printing & Carousel Presses
            </h3>
            <p className="text-xs sm:text-sm text-white/60 mt-3 leading-relaxed">
              High-volume manual and semi-automated carousel screen printing for runs of 100 to 10,000+ units. Master of plastisol, water-based discharge, high-density puff, and Pantone spot-color separation.
            </p>
            <div className="mt-5 space-y-2 text-xs text-white/70">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF4D00]"></span>
                <span>T-shirts, field polos, crewneck fleeces & tote bags</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF4D00]"></span>
                <span>Heat-tunnel cured for lifetime wash durability</span>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-white/[0.06] text-xs text-white/40">
            Capacity: 1,500+ garments printed daily at Rogue Ventures
          </div>
        </div>

        {/* Card 3: Pneumatic Heat Press Machine & DTF */}
        <div className="md:col-span-4 rounded-3xl bg-[#111111] border border-white/10 p-7 sm:p-8 flex flex-col justify-between hover:border-white/20 transition">
          <div>
            <div className="h-10 w-10 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#FF4D00] mb-4">
              <Flame size={20} />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Heat Press Machine & DTF Transfers
            </h3>
            <p className="text-xs sm:text-sm text-white/60 mt-2.5 leading-relaxed">
              Industrial high-pressure pneumatic heat press machinery delivering multi-gradient Direct-to-Film (DTF) transfers and reflective thermoplastic bonding with flawless adhesion.
            </p>
          </div>
          <div className="mt-6 text-[11px] text-[#FF4D00] font-semibold uppercase tracking-wider">
            Deep penetration & soft-hand stretch finish
          </div>
        </div>

        {/* Card 4: Precision Vinyl Stickers & Decals */}
        <div className="md:col-span-4 rounded-3xl bg-[#111111] border border-white/10 p-7 sm:p-8 flex flex-col justify-between hover:border-white/20 transition">
          <div>
            <div className="h-10 w-10 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#FF4D00] mb-4">
              <Shield size={20} />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Vinyl Stickers & Plotter-Cut Decals
            </h3>
            <p className="text-xs sm:text-sm text-white/60 mt-2.5 leading-relaxed">
              Weatherproof cast vinyl stickers, die-cut vehicle decals, event directional signage, packaging size markers, and outdoor UV-laminated labels engineered for extreme durability.
            </p>
          </div>
          <div className="mt-6 text-[11px] text-[#FF4D00] font-semibold uppercase tracking-wider">
            Waterproof, scratch-resistant & UV-stable
          </div>
        </div>

        {/* Card 5: Web Development & Interactive Design */}
        <div className="md:col-span-4 rounded-3xl bg-[#111111] border border-white/10 p-7 sm:p-8 flex flex-col justify-between hover:border-white/20 transition">
          <div>
            <div className="h-10 w-10 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#FF4D00] mb-4">
              <Globe size={20} />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Web Development & Platforms
            </h3>
            <p className="text-xs sm:text-sm text-white/60 mt-2.5 leading-relaxed">
              Modern digital experiences built with React, Vite, TypeScript, and responsive Tailwind CSS. From online portfolios to interactive platforms like Grin Mates eco rewards.
            </p>
          </div>
          <div className="mt-6 text-[11px] text-[#FF4D00] font-semibold uppercase tracking-wider">
            Fast load speeds & fluid UI
          </div>
        </div>
      </div>
    </section>
  );
};
