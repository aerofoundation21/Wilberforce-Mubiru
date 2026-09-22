import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface DynamicPreloaderProps {
  onComplete: () => void;
}

const AUTHENTIC_IMAGES = [
  '/portfolio/oxfam-ireland.jpg',
  '/portfolio/ukaid-collection.jpg',
  '/portfolio/belgium-plan-international.jpg',
  '/portfolio/kigorobya-run-2023.jpg',
  '/portfolio/kigorobya-run-merch.jpg',
  '/portfolio/kigorobya-race-day.jpg',
  '/portfolio/tusimba-fundraising-run.jpg',
  '/portfolio/tusimba-team-distribution.jpg',
  '/portfolio/grassland-guardian-uganda.jpg',
  '/portfolio/wilberforce-profile.webp',
  '/portfolio/makindye-safety-vests.jpg',
  '/portfolio/makindye-coreldraw-prepress.jpg',
  '/portfolio/god-is-my-pillar-collection.jpg',
  '/portfolio/uganda-institutions-branding.jpg'
];

export const DynamicPreloader: React.FC<DynamicPreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing production canvas...');
  const [isFinishing, setIsFinishing] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    setHasStarted(true);

    // Preload authentic portfolio images via JavaScript Image API
    let loadedCount = 0;
    const totalImages = AUTHENTIC_IMAGES.length;

    AUTHENTIC_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = () => {
        loadedCount++;
      };
    });

    // JavaScript ticker loop for smooth, cinematic pacing (approx 1.4s)
    const startTime = Date.now();
    const duration = 1400; // ms

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const timePercent = Math.min(100, Math.floor((elapsed / duration) * 100));
      const imagePercent = Math.floor((loadedCount / totalImages) * 100);
      const targetPercent = Math.max(timePercent, imagePercent);

      setProgress((prev) => {
        const next = Math.min(100, Math.max(prev + 2, targetPercent));
        if (next < 25) {
          setStatusText('Initializing Rogue Ventures design studio...');
        } else if (next < 50) {
          setStatusText('Loading Direct-to-Film (DTF) transfer archive...');
        } else if (next < 75) {
          setStatusText('Calibrating pneumatic heat press machine specs...');
        } else if (next < 95) {
          setStatusText('Rendering precision plotter-cut vinyl decals...');
        } else {
          setStatusText('Production catalog ready.');
        }

        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFinishing(true);
            setTimeout(() => {
              onComplete();
            }, 550);
          }, 200);
        }
        return next;
      });
    }, 28);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    setIsFinishing(true);
    setTimeout(onComplete, 200);
  };

  return (
    <div
      id="dynamic-preloader"
      className={`fixed inset-0 z-50 flex flex-col justify-between bg-[#080808] p-6 sm:p-10 transition-opacity duration-500 ease-out select-none ${
        isFinishing ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#FF4D00] animate-ping" />
          <span className="font-mono text-xs uppercase tracking-widest text-white/50">
            Wilberforce Mubiru • Portfolio
          </span>
        </div>

        <button
          onClick={handleSkip}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-[11px] font-mono uppercase tracking-wider text-white/60 hover:text-white hover:border-white/30 transition"
        >
          <span>Skip</span>
          <ArrowRight size={12} />
        </button>
      </div>

      {/* Center Branding & Progress */}
      <div className="mx-auto w-full max-w-xl text-center my-auto py-8">
        {/* Leadership Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-medium mb-6">
          <Sparkles size={13} className="text-amber-400" />
          <span>Global Youth Ambassador (GYA) Theirworld 2026–2028</span>
        </div>

        {/* Master Name */}
        <h1 className="font-serif-display text-4xl sm:text-6xl text-white tracking-tight leading-none mb-3">
          Wilberforce Mubiru
        </h1>

        <p className="text-xs sm:text-sm text-white/60 font-medium tracking-wide uppercase">
          Graphic Artist & Bulk Production Lead • Rogue Ventures
        </p>

        {/* Interactive Progress Bar */}
        <div className="mt-10 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-white/40">
            <span className="text-[#FF4D00] font-semibold">{statusText}</span>
            <span className="text-white/80 font-bold">{progress}%</span>
          </div>

          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
            <div
              className="h-full bg-gradient-to-r from-[#FF4D00] via-[#ff7a3d] to-amber-400 transition-all duration-75 ease-out shadow-[0_0_12px_rgba(255,77,0,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-white/30 pt-1">
            <span>SCREEN PRINTING</span>
            <span>HEAT PRESS MACHINE</span>
            <span>VINYL STICKERS</span>
          </div>
        </div>
      </div>

      {/* Bottom Footer Info */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-white/40">
        <div>Kampala, Uganda • East Africa</div>
        <div className="text-[11px] text-[#FF4D00]">
          Rogue Ventures Production Hub
        </div>
      </div>
    </div>
  );
};
