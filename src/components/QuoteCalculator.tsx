import React, { useState } from 'react';
import { Calculator, MessageCircle, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../data/projects';

export const QuoteCalculator: React.FC = () => {
  const [itemType, setItemType] = useState('Crewneck Cotton T-Shirts');
  const [quantity, setQuantity] = useState<number>(250);
  const [printMethod, setPrintMethod] = useState('Direct-to-Film (DTF) & Pneumatic Heat Press');
  const [printPositions, setPrintPositions] = useState('Chest + Back');
  const [targetDate, setTargetDate] = useState('Within 7-10 Days');
  const [orgName, setOrgName] = useState('');

  // Est calculation logic for preview
  const getEstimatedUnitCostUGX = () => {
    let base = 18000;
    if (itemType.includes('Vinyl Stickers')) base = 2500;
    if (itemType.includes('Hi-Vis')) base = 25000;
    if (itemType.includes('Polo')) base = 32000;
    if (itemType.includes('Hoodie')) base = 55000;
    if (itemType.includes('Marathon')) base = 22000;
    if (itemType.includes('Tote')) base = 12000;

    // Quantity discounts
    let factor = 1.0;
    if (quantity >= 500) factor = 0.85;
    if (quantity >= 1000) factor = 0.75;
    if (quantity >= 2500) factor = 0.68;

    return Math.round((base * factor) / 500) * 500;
  };

  const unitCost = getEstimatedUnitCostUGX();
  const totalEst = unitCost * quantity;

  const handleLaunchWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Wilberforce Mubiru (Rogue Ventures),\n\nI would like an official bulk order quotation for:\n` +
      `• Organization / Event: ${orgName.trim() || 'Institutional Client'}\n` +
      `• Item: ${itemType}\n` +
      `• Quantity: ${quantity} units\n` +
      `• Print Method: ${printMethod}\n` +
      `• Print Placements: ${printPositions}\n` +
      `• Target Delivery: ${targetDate}\n\n` +
      `Please confirm artwork requirements and timeline.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
  };

  return (
    <section id="calculator" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t border-white/[0.08]">
      <div className="rounded-3xl border border-white/10 bg-[#101010] p-6 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF4D00]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
          {/* Left Form Controls */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FF4D00]/10 border border-[#FF4D00]/20 px-3.5 py-1 text-xs font-semibold text-[#FF4D00] uppercase tracking-wider mb-4">
              <Calculator size={14} />
              <span>Instant Bulk Order Quote Builder</span>
            </div>

            <h2 className="font-serif-display text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              Calculate your <span className="text-[#FF4D00]">next production run</span>
            </h2>

            <p className="text-sm text-white/60 mt-2 max-w-lg">
              Configure your NGO field kits, marathon participant tees, or corporate merchandise to generate an immediate production specification for Rogue Ventures.
            </p>

            <div className="mt-8 space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 font-semibold mb-1.5">Garment / Item Type</label>
                  <select
                    value={itemType}
                    onChange={(e) => setItemType(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-white/[0.06] border border-white/10 text-white focus:outline-none focus:border-[#FF4D00] text-xs font-medium"
                  >
                    <option value="Crewneck Cotton T-Shirts">Crewneck Cotton T-Shirts (180-200 GSM)</option>
                    <option value="Precision Die-Cut Vinyl Stickers">Precision Die-Cut Vinyl Stickers (Outdoor UV Proof)</option>
                    <option value="Hi-Vis Safety Reflector Vests">Hi-Vis Safety Reflector Vests (3M Tape)</option>
                    <option value="Heavy Piqué Cotton Polo Shirts">Heavy Piqué Cotton Polo Shirts</option>
                    <option value="Marathon Runner Dry-Fit Singlets">Marathon Runner Dry-Fit Singlets</option>
                    <option value="Heavyweight Fleece Hoodies">Heavyweight Fleece Hoodies (360 GSM)</option>
                    <option value="Organic Canvas Reusable Tote Bags">Organic Canvas Reusable Tote Bags</option>
                    <option value="Structured 6-Panel Twill Caps">Structured 6-Panel Twill Caps</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1.5">Order Quantity: <span className="text-[#FF4D00] font-mono">{quantity} pcs</span></label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full h-11 px-3 rounded-xl bg-white/[0.06] border border-white/10 text-white focus:outline-none focus:border-[#FF4D00] text-xs font-medium"
                  >
                    <option value={100}>100 units (Starter Batch)</option>
                    <option value={250}>250 units (Recommended)</option>
                    <option value={500}>500 units (Volume Discount)</option>
                    <option value={1000}>1,000 units (NGO Regional Tier)</option>
                    <option value={2500}>2,500 units (Mass Marathon Tier)</option>
                    <option value={5000}>5,000+ units (National Campaign Tier)</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 font-semibold mb-1.5">Printing / Branding Technique</label>
                  <select
                    value={printMethod}
                    onChange={(e) => setPrintMethod(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-white/[0.06] border border-white/10 text-white focus:outline-none focus:border-[#FF4D00] text-xs font-medium"
                  >
                    <option value="Direct-to-Film (DTF) & Pneumatic Heat Press">Direct-to-Film (DTF) & Pneumatic Heat Press</option>
                    <option value="Precision Plotter-Cut Vinyl Stickers & Decals">Precision Plotter-Cut Vinyl Stickers & Decals</option>
                    <option value="Screen Printing (Multi-Station Carousel)">Screen Printing (Multi-Station Carousel)</option>
                    <option value="3M Scotchlite Retroreflective Heat-Weld">3M Scotchlite Retroreflective Heat-Weld</option>
                    <option value="Precision Machine Embroidery">Precision Machine Embroidery</option>
                    <option value="Eco Water-Based Zero-PVC Inks">Eco Water-Based Zero-PVC Inks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1.5">Print Placements</label>
                  <select
                    value={printPositions}
                    onChange={(e) => setPrintPositions(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-white/[0.06] border border-white/10 text-white focus:outline-none focus:border-[#FF4D00] text-xs font-medium"
                  >
                    <option value="Front Chest + Large Back">Front Chest + Large Back</option>
                    <option value="Left Chest Crest Only">Left Chest Crest Only</option>
                    <option value="Chest + Back + Left Sleeve">Chest + Back + Left Sleeve</option>
                    <option value="All-Over 360 Degree Print">All-Over 360 Degree Print</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/70 font-semibold mb-1.5">Organization / Event Name (Optional)</label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Plan International / Kampala Charity Run"
                  className="w-full h-11 px-3.5 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#FF4D00] text-xs"
                />
              </div>
            </div>
          </div>

          {/* Right Summary Card */}
          <div className="rounded-3xl bg-neutral-900 border border-white/10 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-[#FF4D00] font-bold">
                Production Summary
              </div>
              <div className="text-xl font-bold text-white mt-1">
                {quantity.toLocaleString()} × {itemType.split('(')[0]}
              </div>

              <div className="mt-6 space-y-3 text-xs border-y border-white/[0.08] py-4">
                <div className="flex justify-between text-white/70">
                  <span>Printing Method</span>
                  <span className="text-white font-medium">{printMethod.split('(')[0]}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Placements</span>
                  <span className="text-white font-medium">{printPositions}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Estimated Unit Rate</span>
                  <span className="text-[#FF4D00] font-mono font-bold">~UGX {unitCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Estimated Total (Batch)</span>
                  <span className="text-white font-mono font-bold text-sm">~UGX {totalEst.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-[11px] text-white/50">
                <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                <span>Includes color proofing, sample sign-off, and size sorting.</span>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handleLaunchWhatsApp}
                className="w-full h-12 rounded-full bg-[#FF4D00] hover:bg-[#ff611e] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,77,0,0.4)] transition-all hover:scale-[1.01]"
              >
                <MessageCircle size={16} />
                <span>Send Specification via WhatsApp</span>
              </button>
              <div className="text-center text-[10px] text-white/40 mt-2">
                Instant response from Wilberforce Mubiru • +256 755943973
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
