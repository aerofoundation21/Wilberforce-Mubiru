import React from 'react';
import { TRUSTED_CLIENTS } from '../data/projects';
import { Award, ShieldCheck } from 'lucide-react';

export const TrustedBy: React.FC = () => {
  return (
    <section className="border-y border-white/[0.08] bg-white/[0.02]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
        <div className="text-xs uppercase tracking-[0.2em] text-white/40 shrink-0 flex items-center gap-1.5 font-semibold">
          <ShieldCheck size={16} className="text-[#FF4D00]" />
          <span>Institutions & Partners</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {TRUSTED_CLIENTS.map((client) => (
            <span
              key={client}
              className="px-4 py-2 rounded-full bg-white text-black text-xs font-semibold tracking-tight shadow-sm hover:scale-105 transition duration-200"
            >
              {client}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
