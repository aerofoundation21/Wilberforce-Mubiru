import React, { useState } from 'react';
import { Smartphone, Wallet, QrCode, CreditCard, Sparkles, CheckCircle2, ChevronRight, Layers, ArrowRight, ShieldCheck, Upload, Zap } from 'lucide-react';

interface ScreenData {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  image: string;
  headline: string;
  description: string;
  features: string[];
  techStack: string[];
}

const SCREENS: ScreenData[] = [
  {
    id: 'onboarding',
    name: 'MetaMask Onboarding',
    badge: 'Web3 Auth',
    tagline: 'Engage • Empower • Earn',
    image: '/portfolio/grin-mates-onboarding.svg',
    headline: 'Seamless MetaMask Wallet Integration & Non-Custodial Sign-In',
    description: 'Designed and engineered the complete Web3 authentication funnel on Android Pixel 9 Pro. Facilitates friction-free non-custodial crypto wallet connectivity with fallback guest exploration mode ("Continue without an account").',
    features: [
      'MetaMask Mobile SDK one-tap cryptographic handshake',
      'Gas-optimized Celo network connectivity for instant micro-payments',
      'Automated Green-Points loyalty engine for verified eco-actions',
      'Direct link to download & configure MetaMask wallet'
    ],
    techStack: ['MetaMask SDK', 'Celo Network', 'Web3.js / Ethers', 'Android Pixel 9 Pro']
  },
  {
    id: 'events',
    name: 'Events & Tickets',
    badge: 'Ticketing Feed',
    tagline: 'Climate Summits & Marathons',
    image: '/portfolio/grin-mates-events.svg',
    headline: 'Real-Time Decentralized Environmental Event Marketplace',
    description: 'Developed the mobile event discovery and ticketing hub. Shows upcoming regional climate gatherings including Global Climate Summit 2025 in Nairobi, Kenya (15.00 cUSD / +150 eco-points) and Tree Planting Marathon in Kampala, Uganda (5.00 cUSD / +50 eco-points).',
    features: [
      'Real-time remaining ticket quotas (e.g. 150 tickets left, 766 left)',
      'Multi-currency support: Celo cUSD stablecoin + Eco Points bounty',
      'High-contrast calendar badges (NOV 15, OCT 28) with geolocation metadata',
      'Full 5-tab bottom navigation (Home, Services, Go Green, Events, Wallet)'
    ],
    techStack: ['Celo cUSD', 'Firestore Realtime', 'Event Dispatcher', 'Responsive Mobile UI']
  },
  {
    id: 'tickets',
    name: 'My Tickets & QR Vault',
    badge: 'Dynamic Passes',
    tagline: 'Paperless Gate Check-in',
    image: '/portfolio/grin-mates-tickets.svg',
    headline: 'Cryptographic Pass Vault with Real-Time QR Gate Verification',
    description: 'Engineered the "My Tickets" user ticket repository providing paperless, tamper-proof admission. Manages ticket lifecycle states with unique cryptographic identifiers for swift scanner validation at event venues.',
    features: [
      'Dynamic lifecycle states: Active (emerald badge) vs. Used (neutral gray)',
      'Cryptographic serial numbering (e.g. TICKET-2025-001, TICKET-2025-002)',
      'Instant QR code generation optimized for low-light venue gate scanners',
      'Offline pass caching ensuring entry even with zero cellular signal'
    ],
    techStack: ['QR Cryptography', 'Offline Cache', 'State Lifecycle', 'Gate Scanner API']
  },
  {
    id: 'checkout',
    name: 'cUSD Web3 Checkout',
    badge: 'Micro-Payments',
    tagline: 'Instant Smart Settlement',
    image: '/portfolio/grin-mates-checkout.svg',
    headline: 'Native Bottom-Sheet Web3 Checkout & Ticket Issuance',
    description: 'Built the seamless in-app booking modal for the Global Climate Summit 2025. Combines comprehensive venue and organizer briefing with transparent 15.00 cUSD pricing and automated +150 Eco Points loyalty allocation.',
    features: [
      'Smooth native bottom-sheet drawer with drag gesture handle',
      'Transparent on-chain settlement with zero hidden ticketing surcharges',
      'Immediate loyalty credit (+150 Eco Points) credited to user wallet',
      'One-tap "Purchase Ticket" trigger with optimistic state updating'
    ],
    techStack: ['Smart Contract Calls', 'Bottom Sheet UX', 'Token Allocation', 'Low-Latency RPC']
  },
  {
    id: 'splash',
    name: 'Splash & Identity',
    badge: 'Brand System',
    tagline: 'Minimalist Launch Screen',
    image: '/portfolio/grin-mates-splash.svg',
    headline: 'Refined Visual Brand Identity & App Launch Architecture',
    description: 'Crafted the minimalist launch splash screen for Grin Mates. Features the bespoke dual-tone emblem combining warm sunset orange with organic forest green and mirrored reflective geometry.',
    features: [
      'Custom typographic logo with leaf insignia crowning the letter "i"',
      'Mirrored geometric reflection establishing visual balance and symmetry',
      'Prepress vector asset generation guaranteeing crispness on 4K mobile displays',
      'Android Splash API compliance for instantaneous cold-start load times'
    ],
    techStack: ['CorelDRAW Vector', 'Android Splash API', 'High-DPI SVG', 'Typography System']
  }
];

export const MobileAppShowcase: React.FC = () => {
  const [activeScreenId, setActiveScreenId] = useState<string>('onboarding');
  const activeScreen = SCREENS.find((s) => s.id === activeScreenId) || SCREENS[0];

  return (
    <div className="mt-12 rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-emerald-950/20 via-[#101010] to-[#0A0A0A] p-6 sm:p-10 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-white/[0.08] relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Smartphone size={14} /> Web &amp; Mobile Application Development
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-2.5">
            Grin Mates: Web3 Mobile App &amp; Ticketing Architecture
          </h3>
          <p className="text-sm text-white/60 mt-1 max-w-2xl leading-relaxed">
            Full-stack mobile application engineered and tested on Google Pixel 9 Pro (<code className="text-emerald-400 font-mono text-xs">package: go_green_mates</code>). Features MetaMask non-custodial wallet sign-in, Celo cUSD blockchain event booking, offline-ready QR check-in passes, and a gamified green-points loyalty economy.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400/90 bg-black/40 border border-emerald-500/20 px-3.5 py-2 rounded-xl shrink-0 self-start md:self-center">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Pixel 9 Pro • Android API 36</span>
        </div>
      </div>

      {/* Screen Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto py-5 scrollbar-none border-b border-white/[0.06] relative z-10">
        {SCREENS.map((screen) => {
          const isActive = screen.id === activeScreenId;
          return (
            <button
              key={screen.id}
              onClick={() => setActiveScreenId(screen.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                isActive
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 font-bold'
                  : 'bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08] border border-white/5'
              }`}
            >
              <span>{screen.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                  isActive ? 'bg-black/20 text-black font-bold' : 'bg-white/10 text-white/50'
                }`}
              >
                {screen.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage */}
      <div className="mt-8 grid lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left: Pixel 9 Pro Device Frame */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[320px] aspect-[9/18] rounded-[44px] p-2 bg-[#1C1C1E] border-2 border-white/20 shadow-2xl shadow-emerald-950/50 group">
            {/* Screen Inner Container */}
            <div className="w-full h-full rounded-[38px] overflow-hidden bg-white relative flex flex-col">
              <img
                src={activeScreen.image}
                alt={activeScreen.name}
                className="w-full h-full object-contain bg-white"
              />
            </div>

            {/* Quick Screen Caption Overlay on Hover */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/90 border border-white/15 text-[11px] font-mono text-emerald-400 whitespace-nowrap shadow-xl">
              {activeScreen.tagline}
            </div>
          </div>
        </div>

        {/* Right: Technical Architecture & Feature Breakdown */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
              <Sparkles size={14} /> Screen Deep Dive • {activeScreen.badge}
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {activeScreen.headline}
            </h4>
            <p className="text-sm text-white/70 mt-3 leading-relaxed">
              {activeScreen.description}
            </p>

            {/* Key Capabilities List */}
            <div className="mt-5 space-y-2.5">
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                Engineering Implementations:
              </div>
              <div className="space-y-2">
                {activeScreen.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-white/80">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Technology Badges */}
          <div className="pt-4 border-t border-white/[0.08]">
            <div className="text-[11px] font-mono text-white/50 mb-2">Technologies &amp; Protocols:</div>
            <div className="flex flex-wrap gap-2">
              {activeScreen.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Pillars of Grin Mates Web & Mobile Stack */}
      <div className="mt-12 pt-8 border-t border-white/[0.08] grid sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 hover:border-emerald-500/30 transition">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
            <Wallet size={18} />
          </div>
          <div className="text-sm font-bold text-white">MetaMask Web3 Auth</div>
          <div className="text-xs text-white/60 mt-1 leading-relaxed">
            Non-custodial cryptographic wallet authentication with guest browsing fallback.
          </div>
        </div>

        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 hover:border-emerald-500/30 transition">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
            <CreditCard size={18} />
          </div>
          <div className="text-sm font-bold text-white">Celo cUSD Payments</div>
          <div className="text-xs text-white/60 mt-1 leading-relaxed">
            Sub-cent transaction gas fees for climate summit and marathon ticket purchasing.
          </div>
        </div>

        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 hover:border-emerald-500/30 transition">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
            <QrCode size={18} />
          </div>
          <div className="text-sm font-bold text-white">QR Gate Verification</div>
          <div className="text-xs text-white/60 mt-1 leading-relaxed">
            Offline-cached cryptographic QR admission tokens with Active vs. Used status tracking.
          </div>
        </div>

        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 hover:border-emerald-500/30 transition">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
            <Sparkles size={18} />
          </div>
          <div className="text-sm font-bold text-white">Eco Points Incentives</div>
          <div className="text-xs text-white/60 mt-1 leading-relaxed">
            Automated +50 to +150 point reward bounties allocated upon event participation.
          </div>
        </div>
      </div>
    </div>
  );
};
