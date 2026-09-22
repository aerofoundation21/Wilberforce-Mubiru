import React from 'react';
import { MessageCircle, ExternalLink, Instagram, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { WHATSAPP_LINK } from '../data/projects';

export const About: React.FC = () => {
  return (
    <section id="about" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t border-white/[0.08]">
      <div className="grid md:grid-cols-[0.4fr_1fr] gap-8 md:gap-16 items-start">
        {/* Left header */}
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#FF4D00] font-semibold">
            <Award size={14} />
            <span>About The Artist</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-5xl leading-[0.95] tracking-tight mt-3 text-white">
            Design that <span className="text-[#FF4D00]">prints right</span> the first time
          </h2>
          <div className="mt-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-xs text-white/60 space-y-1">
            <div className="text-white font-medium">Headquarters</div>
            <div>Kampala, Uganda</div>
            <div className="pt-2 text-[#FF4D00] font-medium">Rogue Ventures Studio</div>
          </div>
        </div>

        {/* Right bio text */}
        <div className="space-y-6">
          <p className="text-lg sm:text-xl leading-relaxed text-white/85 font-normal">
            I am <span className="text-white font-semibold">Wilberforce Mubiru</span>, a{' '}
            <span className="text-[#FF4D00] font-semibold">Graphic Artist</span>, Web Developer, and{' '}
            <span className="text-amber-400 font-semibold">Global Youth Ambassador (GYA) at Theirworld (2026–2028)</span> based in Kampala. I lead production at{' '}
            <span className="font-bold text-white underline decoration-[#FF4D00] decoration-2 underline-offset-4">Rogue Ventures</span>{' '}
            handling Direct-to-Film (DTF) transfers, pneumatic heat press machinery, weatherproof vinyl stickers, and apparel branding for world-class NGOs like{' '}
            <span className="text-white font-medium">OXFAM, UKaid, Plan International, Belgium Partner in Development</span>, and major athletic events including the{' '}
            <span className="text-white font-medium">Kigorobya Archdeaconry Run</span> and{' '}
            <span className="text-white font-medium">Tusimba Fundraising Run</span>.
          </p>

          <p className="text-base leading-relaxed text-white/65">
            I am also the Founder of <span className="text-white font-medium">Grin Mates</span>, a pioneering platform that rewards everyday people for eco-friendly actions through Green Points. Our mission is clear: make environmental sustainability genuinely rewarding. From multi-stage manual screen printing to calibrated Direct-to-Film (DTF) transfers and reflective safety garments, I own the complete production workflow, color accuracy, and delivery at scale.
          </p>

          {/* Value props */}
          <div className="grid sm:grid-cols-2 gap-3.5 pt-2">
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3.5 flex items-start gap-3">
              <CheckCircle2 size={18} className="text-[#FF4D00] shrink-0 mt-0.5" />
              <div className="text-xs text-white/70">
                <strong className="text-white block mb-0.5">Strict Color Accuracy</strong>
                Pantone matching system calibrations for institutional compliance.
              </div>
            </div>
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3.5 flex items-start gap-3">
              <CheckCircle2 size={18} className="text-[#FF4D00] shrink-0 mt-0.5" />
              <div className="text-xs text-white/70">
                <strong className="text-white block mb-0.5">Rapid Turnaround & Delivery</strong>
                Fast batch packing, sizing, and direct logistical distribution.
              </div>
            </div>
          </div>

          {/* Social and WhatsApp buttons */}
          <div className="flex flex-wrap gap-3 pt-3">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white text-black px-6 h-11 text-xs font-semibold hover:bg-[#FF4D00] hover:text-white transition shadow-md"
            >
              <MessageCircle size={16} />
              <span>Chat on WhatsApp</span>
            </a>

            <a
              href="https://instagram.com/willinho23"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 h-11 text-xs text-white/80 hover:text-white hover:border-white transition"
            >
              <Instagram size={16} className="text-[#FF4D00]" />
              <span>Instagram: <strong>@willinho23</strong></span>
              <ExternalLink size={12} className="opacity-50" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
