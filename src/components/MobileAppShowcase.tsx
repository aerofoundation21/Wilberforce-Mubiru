import React, { useState } from 'react';
import { Smartphone, Ticket, CreditCard, Sparkles, CheckCircle2, Layers } from 'lucide-react';

interface ScreenData {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  image: string;
  headline: string;
  description: string;
  features: string[];
  details: string[];
}

const SCREENS: ScreenData[] = [
  {
    id: 'tickets',
    name: 'My Tickets Vault',
    badge: 'Ticket Status',
    tagline: 'Active & Used passes in one list',
    image: '/portfolio/grin-mates-my-tickets-screen.jpg',
    headline: 'Event Ticket Vault with a Live Status on Every Pass',
    description: 'Android emulator capture from Android Studio (Running Devices - go_green_mates, Pixel 9 Pro API 36.0) showing the Events & Tickets screen with the My Tickets tab selected. Three ticket records are listed - Sustainability Workshop, Tree Planting Marathon and Climate Change Conference - each carrying its own date, venue, serial number and status badge.',
    features: [
      'Ticket records numbered TICKET-2025-001 through TICKET-2025-003',
      'Status badges separating two Active passes from one Used pass',
      'Date, time and venue lines per ticket (Online Event, Kampala Uganda, Nairobi Kenya)',
      'Upcoming and My Tickets tabs above five-tab bottom navigation: Home, Services, Go Green, Events and Wallet'
    ],
    details: ['Android Studio Emulator', 'Pixel 9 Pro API 36.0', 'go_green_mates']
  },
  {
    id: 'checkout',
    name: 'cUSD Checkout Sheet',
    badge: 'Ticket Purchase',
    tagline: '15.00 cUSD • +150 Eco Points',
    image: '/portfolio/grin-mates-event-cusd-checkout.jpg',
    headline: 'Event Detail Sheet with cUSD Pricing and Eco Point Rewards',
    description: 'The Global Climate Summit 2025 detail sheet opened over the Events & Tickets screen. Date and venue lines read Nov 15, 2025 09:00 and Nairobi, Kenya above a live "150 tickets available" count, followed by an About this event summary. A Ticket Price box shows 15.00 cUSD beside an Eco Points bounty of +150, with a full-width Purchase Ticket button beneath.',
    features: [
      'Event detail sheet for Global Climate Summit 2025 - Nov 15, 2025 09:00, Nairobi Kenya',
      'Live availability line reading 150 tickets available',
      'Ticket Price box pairing 15.00 cUSD with a +150 Eco Points reward',
      'Full-width Purchase Ticket action beneath the event summary'
    ],
    details: ['15.00 cUSD Pricing', 'Eco Points +150', 'Event Detail Sheet']
  }
];

export const MobileAppShowcase: React.FC = () => {
  const [activeScreenId, setActiveScreenId] = useState<string>('tickets');
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
            Grin Mates: Eco-Event Ticketing App on Android
          </h3>
          <p className="text-sm text-white/60 mt-1 max-w-2xl leading-relaxed">
            Emulator captures of the Grin Mates app (<code className="text-emerald-400 font-mono text-xs">go_green_mates</code> emulator) running on a Pixel 9 Pro (API 36.0) in Android Studio. The Events &amp; Tickets flow lists issued passes with live status, and booking runs through a 15.00 cUSD checkout sheet with a +150 Eco Points reward.
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
        {/* Left: Device Frame */}
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

            {/* Quick Screen Caption Overlay */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/90 border border-white/15 text-[11px] font-mono text-emerald-400 whitespace-nowrap shadow-xl">
              {activeScreen.tagline}
            </div>
          </div>
        </div>

        {/* Right: Capture Breakdown */}
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

            {/* Visible Details List */}
            <div className="mt-5 space-y-2.5">
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                Visible In The Capture:
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

          {/* Capture Details Badges */}
          <div className="pt-4 border-t border-white/[0.08]">
            <div className="text-[11px] font-mono text-white/50 mb-2">Capture Details:</div>
            <div className="flex flex-wrap gap-2">
              {activeScreen.details.map((detail) => (
                <span
                  key={detail}
                  className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300"
                >
                  {detail}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Verified Details of the Grin Mates App */}
      <div className="mt-12 pt-8 border-t border-white/[0.08] grid sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 hover:border-emerald-500/30 transition">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
            <Ticket size={18} />
          </div>
          <div className="text-sm font-bold text-white">Ticket Vault with Status</div>
          <div className="text-xs text-white/60 mt-1 leading-relaxed">
            Every pass carries its own serial, date, venue and an Active or Used status badge.
          </div>
        </div>

        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 hover:border-emerald-500/30 transition">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
            <CreditCard size={18} />
          </div>
          <div className="text-sm font-bold text-white">cUSD Ticket Pricing</div>
          <div className="text-xs text-white/60 mt-1 leading-relaxed">
            The checkout sheet prices the Global Climate Summit 2025 ticket at 15.00 cUSD.
          </div>
        </div>

        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 hover:border-emerald-500/30 transition">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
            <Sparkles size={18} />
          </div>
          <div className="text-sm font-bold text-white">Eco Points Rewards</div>
          <div className="text-xs text-white/60 mt-1 leading-relaxed">
            A +150 Eco Points bounty is shown beside the ticket price before purchase.
          </div>
        </div>

        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 hover:border-emerald-500/30 transition">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
            <Layers size={18} />
          </div>
          <div className="text-sm font-bold text-white">Five-Tab Navigation</div>
          <div className="text-xs text-white/60 mt-1 leading-relaxed">
            Home, Services, Go Green, Events and Wallet sit in the bottom navigation bar.
          </div>
        </div>
      </div>
    </div>
  );
};
