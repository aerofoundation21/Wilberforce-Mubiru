import React from 'react';
import { Briefcase, Sparkles, CheckCircle2, PenTool, Layers, ArrowRight, Award, Compass, FileCheck, ShieldCheck } from 'lucide-react';
import { MobileAppShowcase } from './MobileAppShowcase';

export const Experience: React.FC = () => {
  return (
    <section id="experience" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20 border-t border-white/[0.08]">
      <div className="flex items-baseline justify-between mb-8">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-[#FF4D00] font-semibold flex items-center gap-1.5">
            <Briefcase size={14} />
            <span>Track Record & Leadership</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl text-white mt-1">
            Professional Experience
          </h2>
        </div>
        <div className="text-xs text-white/40 font-mono">
          Kampala, Uganda • 2021 to Present
        </div>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
        {/* Card 1: GYA Theirworld 2026-2028 */}
        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-500/[0.08] to-[#111111] p-6 sm:p-8 hover:border-amber-400/60 transition duration-300 relative group flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-amber-400 font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  International Leadership • 2026–2028
                </div>
                <div className="text-2xl font-bold tracking-tight text-white mt-1.5">
                  Theirworld
                </div>
                <div className="text-sm font-semibold text-amber-300/90 mt-0.5">
                  Global Youth Ambassador (GYA)
                </div>
                <div className="text-xs text-white/50 mt-1">
                  Global Education Advocacy & Youth Mobilization
                </div>
              </div>

              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 grid place-items-center text-amber-400 font-bold text-sm shrink-0">
                GYA
              </div>
            </div>

            <p className="mt-5 text-xs sm:text-sm text-white/80 leading-relaxed">
              Selected to join the prestigious global network of young leaders and education advocates at <strong className="text-white">Theirworld</strong>, advancing the worldwide campaign to end the global education crisis and unlock the potential of the next generation.
            </p>

            <ul className="mt-4 space-y-2.5 text-xs text-white/70">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-amber-400 shrink-0 mt-0.5" />
                <span>Championing inclusive, quality education and youth empowerment programs across Uganda and East Africa.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-amber-400 shrink-0 mt-0.5" />
                <span>Mobilizing grassroots youth cohorts and collaborating with international ambassadors on UN SDG 4 targets.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-amber-400 shrink-0 mt-0.5" />
                <span>Applying visual communication, creative campaigns, and community workshops to amplify youth voices in global policy.</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-wrap gap-2">
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 font-medium">
              Global Youth Ambassador
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/[0.05] text-[11px] text-white/60">
              2026–2028 Cohort
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/[0.05] text-[11px] text-white/60">
              SDG 4 Education
            </span>
          </div>
        </div>

        {/* Card 2: Rogue Ventures - Logo Designer & Lead Graphic Artist */}
        <div className="rounded-3xl border border-[#FF4D00]/40 bg-gradient-to-b from-[#FF4D00]/[0.08] to-[#111111] p-6 sm:p-8 hover:border-[#FF4D00]/70 transition duration-300 relative group flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-[#FF4D00] font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF4D00]"></span>
                  Primary Production & Creative Role
                </div>
                <div className="text-2xl font-bold tracking-tight text-white mt-1.5">
                  Rogue Ventures
                </div>
                <div className="text-sm font-bold text-[#FF4D00] mt-0.5">
                  Logo Designer & Lead Graphic Artist
                </div>
                <div className="text-xs text-white/50 mt-1">
                  CorelDRAW Vector Master, Institutional Logo Design, Screen Printing & Prepress
                </div>
              </div>

              <div className="h-12 w-12 rounded-2xl bg-[#FF4D00]/20 border border-[#FF4D00]/40 grid place-items-center text-[#FF4D00] font-bold text-sm shrink-0">
                RV
              </div>
            </div>

            <ul className="mt-5 space-y-2.5 text-xs text-white/80">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-[#FF4D00] shrink-0 mt-0.5" />
                <span><strong className="text-white">CorelDRAW Master Vector Logo Design:</strong> Redrew, standardized, and digitized heraldic logos for 9 major institutions including Electoral Commission, UCU, UMA, Cavendish, PSFU, UPPC, Makerere University, and URA.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-[#FF4D00] shrink-0 mt-0.5" />
                <span><strong className="text-white">Technical Prepress & Spot Separations:</strong> CorelDRAW 2018 vector artwork, Bézier node editing, mayoral campaign graphics (Mayor Makindye Division), and Class of 2024 graduation stoles (Harvest International School).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-[#FF4D00] shrink-0 mt-0.5" />
                <span><strong className="text-white">Rotary Carousel Screen Printing:</strong> Direct production lead for multi-color screen printing on moisture-wicking and cotton apparel (Tusimba Charity Run, Kigorobya Marathon, Grassland Guardian, and international NGOs).</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-wrap gap-2">
            <span className="px-2.5 py-1 rounded-full bg-[#FF4D00]/15 border border-[#FF4D00]/30 text-[11px] text-[#FF4D00] font-bold">
              CorelDRAW Vector Master
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#FF4D00]/10 border border-[#FF4D00]/20 text-[11px] text-white/90">
              Logo Designer
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/[0.05] text-[11px] text-white/70">
              Screen Printing Carousel
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/[0.05] text-[11px] text-white/70">
              Prepress Film Output
            </span>
          </div>
        </div>

        {/* Card 3: Grin Mates */}
        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/[0.08] to-[#111111] p-6 sm:p-8 hover:border-emerald-400/60 transition duration-300 relative group flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-emerald-400 font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Founder, Vision Lead & Full-Stack Developer
                </div>
                <div className="text-2xl font-bold tracking-tight text-white mt-1.5">
                  Grin Mates
                </div>
                <div className="text-sm font-semibold text-emerald-300 mt-0.5">
                  Web &amp; Mobile App Development
                </div>
                <div className="text-xs text-white/50 mt-1">
                  Pixel 9 Pro (API 36) • MetaMask Web3 • Celo cUSD Ticketing
                </div>
              </div>

              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 grid place-items-center text-emerald-400 font-bold text-sm shrink-0">
                GM
              </div>
            </div>

            <p className="mt-5 text-xs sm:text-sm text-white/80 leading-relaxed">
              Founded Grin Mates and engineered the complete Web3 mobile application (<code className="text-emerald-400 font-mono text-[11px]">go_green_mates</code>) tested on Google Pixel 9 Pro. Implemented MetaMask wallet authentication, Celo cUSD ticket payments, and paperless QR access control.
            </p>

            <p className="mt-3 text-xs text-white/60 leading-relaxed">
              Designed the brand identity, minimalist splash architecture, and automated eco-points rewards incentivizing verified climate actions like tree planting and plastic recycling.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-wrap gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-medium">
              Web &amp; Mobile Dev
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[11px] text-white/70">
              MetaMask Web3
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[11px] text-white/70">
              Celo cUSD
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[11px] text-white/70">
              Green Points
            </span>
          </div>
        </div>
      </div>

      {/* DEDICATED SECTION: Rogue Ventures - Logo Designer & CorelDRAW Works */}
      <div className="mt-12 rounded-3xl border border-white/10 bg-[#121212] p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF4D00]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4D00]/10 border border-[#FF4D00]/30 text-xs font-bold text-[#FF4D00] uppercase tracking-wider">
              <PenTool size={13} /> Rogue Ventures Production Studio
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-2">
              Wilberforce Mubiru: Logo Designer & CorelDRAW Specialist
            </h3>
            <p className="text-sm text-white/60 mt-1 max-w-2xl">
              At Rogue Ventures Kampala, Wilberforce bridges high-precision vector graphic design with industrial apparel manufacturing. Every logo, heraldic crest, and prepress layout is mathematically engineered in CorelDRAW for flawless screen printing, DTF transfers, and ceremonial fabric output.
            </p>
          </div>

          <a
            href="#portfolio"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-white/90 text-black text-xs font-bold transition shadow-lg shrink-0 self-start md:self-auto"
          >
            <span>Explore CorelDRAW Artworks</span>
            <ArrowRight size={14} />
          </a>
        </div>

        {/* 3 Pillars of Rogue Ventures Work */}
        <div className="grid md:grid-cols-3 gap-6 pt-8">
          {/* Pillar 1: Institutional Vector Logo Suite */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 hover:border-white/20 transition flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FF4D00]/10 border border-[#FF4D00]/20 flex items-center justify-center text-[#FF4D00] mb-4">
                <Award size={20} />
              </div>
              <h4 className="text-base font-bold text-white tracking-tight">
                Institutional & Authority Logos
              </h4>
              <p className="text-xs text-white/60 mt-2 leading-relaxed">
                Vectorized and standardized master vector archives for top statutory authorities and universities across Uganda.
              </p>

              <div className="mt-4 space-y-1.5 text-xs text-white/80">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00]"></span>
                  <span>The Electoral Commission</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00]"></span>
                  <span>Uganda Christian University (UCU)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00]"></span>
                  <span>Uganda Manufacturers Association (UMA)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00]"></span>
                  <span>Cavendish University Uganda</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00]"></span>
                  <span>Private Sector Foundation (PSFU) & URA</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/[0.06] text-[11px] font-mono text-[#FF4D00]">
              Format: CorelDRAW (.CDR) & Vector PDF Proofs
            </div>
          </div>

          {/* Pillar 2: CorelDRAW 2018 Prepress Engineering */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 hover:border-white/20 transition flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FF4D00]/10 border border-[#FF4D00]/20 flex items-center justify-center text-[#FF4D00] mb-4">
                <Compass size={20} />
              </div>
              <h4 className="text-base font-bold text-white tracking-tight">
                CorelDRAW Prepress & Spot Separation
              </h4>
              <p className="text-xs text-white/60 mt-2 leading-relaxed">
                Hands-on prepress engineering inside CorelDRAW 2018. Converting campaign graphics, photographic portraits, and typography into high-contrast separations ready for print.
              </p>

              <div className="mt-4 space-y-1.5 text-xs text-white/80">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00]"></span>
                  <span>Mayor Makindye Division Mayoral Campaign</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00]"></span>
                  <span>National Unity Platform (NUP) Umbrella Vector</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00]"></span>
                  <span>Halftone portrait curves & measurement grids</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00]"></span>
                  <span>High-visibility reflective safety vests layout</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/[0.06] text-[11px] font-mono text-[#FF4D00]">
              Tool: CorelDRAW 2018 (64-Bit Edition)
            </div>
          </div>

          {/* Pillar 3: Ceremonial Stoles & Screen Printing */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 hover:border-white/20 transition flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FF4D00]/10 border border-[#FF4D00]/20 flex items-center justify-center text-[#FF4D00] mb-4">
                <ShieldCheck size={20} />
              </div>
              <h4 className="text-base font-bold text-white tracking-tight">
                Ceremonial Apparel & Screen Printing
              </h4>
              <p className="text-xs text-white/60 mt-2 leading-relaxed">
                Direct translation from digital CorelDRAW layouts into physical ceremonial satin sashes, marathon singlets, and high-volume NGO apparel runs.
              </p>

              <div className="mt-4 space-y-1.5 text-xs text-white/80">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00]"></span>
                  <span>Harvest International School Class of 2024 Stoles</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00]"></span>
                  <span>Tusimba Charity Run (1,500+ Screen-Printed Kits)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00]"></span>
                  <span>Kigorobya Archdeaconry Marathon Singlets</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00]"></span>
                  <span>Grassland Guardian Organic Field Uniforms</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/[0.06] text-[11px] font-mono text-[#FF4D00]">
              Output: High-Lustre Satin & Rotary Screen Printing
            </div>
          </div>
        </div>
      </div>

      {/* DEDICATED SECTION: Grin Mates Web & Mobile Application Development */}
      <MobileAppShowcase />
    </section>
  );
};
