import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ProjectItem, 
  CatalogDomain, 
  GraphicsCategory, 
  WebMobileCategory 
} from '../types';
import { INITIAL_PROJECTS } from '../data/projects';
import { 
  Search, 
  Sparkles, 
  LayoutGrid, 
  Eye, 
  PenTool, 
  Smartphone, 
  Layers,
  ArrowRight,
  CheckCircle2,
  Plus,
  RefreshCw,
  AlertTriangle,
  Edit3
} from 'lucide-react';
import { ProjectModal } from './ProjectModal';
import { ArtworkUploadModal } from './ArtworkUploadModal';
import { HiddenAdminCatalogForm } from './HiddenAdminCatalogForm';
import { 
  loadCustomUploads, 
  loadImageOverrides,
  deleteCustomArtwork,
  getSavedOwnerKey
} from '../utils/imageStorage';

const GRAPHICS_CATEGORIES: GraphicsCategory[] = [
  'All Graphics',
  'Screen Printing',
  'DTF (Direct-to-Film)',
  'Heat Press Machine',
  'Safety & Reflectors',
  'NGO Bulk Orders',
  'Event Merch',
  'Vinyl Stickers',
  'Eco Brand Design'
];

const WEB_MOBILE_CATEGORIES: WebMobileCategory[] = [
  'All Web & Mobile',
  'Event Ticketing & Blockchain',
  'In-App cUSD Checkout'
];

export const Portfolio: React.FC = () => {
  const [customUploads, setCustomUploads] = useState<ProjectItem[]>([]);
  const [imageOverrides, setImageOverrides] = useState<Record<string, string>>({});
  const [isLoadingStorage, setIsLoadingStorage] = useState<boolean>(true);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const adminFormRef = useRef<HTMLDivElement>(null);

  // Sync storage from server-side store (Netlify Blobs / API)
  const refreshCatalogStorage = async () => {
    setIsLoadingStorage(true);
    setStorageError(null);
    try {
      const [uploads, overrides] = await Promise.all([
        loadCustomUploads(),
        loadImageOverrides()
      ]);
      if (uploads && uploads.length > 0) setCustomUploads(uploads);
      if (overrides && Object.keys(overrides).length > 0) setImageOverrides(overrides);
    } catch (err: any) {
      console.warn('Failed to load catalog storage', err);
      setStorageError('Remote catalog sync unreachable. Showing cached proofs.');
    } finally {
      setIsLoadingStorage(false);
    }
  };

  useEffect(() => {
    refreshCatalogStorage();
  }, []);

  const handleUploadSuccess = (item: ProjectItem) => {
    setCustomUploads((prev) => [item, ...prev.filter((p) => p.id !== item.id)]);
    setToastMessage(`Artwork proof "${item.title}" successfully saved to live storage!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDeleteCustom = async (id: string) => {
    const ownerKey = getSavedOwnerKey() || 'rogue_admin_2025';
    try {
      await deleteCustomArtwork(id, ownerKey);
      setCustomUploads((prev) => prev.filter((p) => p.id !== id));
      setToastMessage('Artwork proof removed from catalog.');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err: any) {
      console.error('Delete error:', err);
      setToastMessage(err.message || 'Failed to delete artwork. Please check passkey.');
      setTimeout(() => setToastMessage(null), 5000);
    }
  };

  // Merge INITIAL_PROJECTS with custom uploads (deduplicating by id and prioritizing user uploads)
  const allProjects = useMemo(() => {
    const projectMap = new Map<string, ProjectItem>();
    // Register standard projects
    for (const p of INITIAL_PROJECTS) {
      projectMap.set(p.id, p);
    }
    // Overlay user uploads (with latest local edits or uploaded images)
    for (const p of customUploads) {
      projectMap.set(p.id, p);
    }
    // Apply standalone image overrides
    return Array.from(projectMap.values())
      .filter((p) => {
        const lowerClient = (p.client || '').toLowerCase();
        const lowerTitle = (p.title || '').toLowerCase();
        if (
          lowerClient.includes('luba') || 
          lowerClient.includes('charles') || 
          lowerTitle.includes('luba')
        ) {
          return false;
        }
        return true;
      })
      .map((p) => {
        if (imageOverrides[p.id]) {
          return { ...p, img: imageOverrides[p.id] };
        }
        return p;
      });
  }, [customUploads, imageOverrides]);

  // Master Catalog Separation: 'graphics' vs 'web-mobile' vs 'both'
  const [activeCatalog, setActiveCatalog] = useState<CatalogDomain | 'both'>('graphics');

  // Separate subcategory states
  const [activeGraphicsCategory, setActiveGraphicsCategory] = useState<GraphicsCategory>('All Graphics');
  const [activeWebMobileCategory, setActiveWebMobileCategory] = useState<WebMobileCategory>('All Web & Mobile');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Safe fallback image if original file path is still loading
  const getFallbackArtwork = (tag: string) => {
    if (tag.includes('Safety') || tag.includes('Heat Press') || tag.includes('Reflector')) {
      return '/portfolio/makindye-safety-vests.jpg';
    }
    if (tag.includes('DTF')) {
      return '/portfolio/god-is-my-pillar-collection.jpg';
    }
    if (tag.includes('Screen Printing')) {
      return '/portfolio/kigorobya-run-2023.jpg';
    }
    if (tag.includes('Vinyl')) {
      return '/portfolio/uganda-institutions-branding.jpg';
    }
    return '/portfolio/makindye-safety-vests.jpg';
  };

  // Handle hash navigation to directly open the chosen catalog
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#graphics-catalog') {
        setActiveCatalog('graphics');
      } else if (hash === '#web-mobile-catalog' || hash === '#app-catalog') {
        setActiveCatalog('web-mobile');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Strict domain filter: Graphics vs Web & Mobile
  const isGraphicsProject = (p: ProjectItem) => {
    return p.catalog !== 'web-mobile' && p.tag !== 'Web & Mobile App Development' && !p.id.startsWith('proj-app-');
  };

  const isWebMobileProject = (p: ProjectItem) => {
    return (
      p.catalog === 'web-mobile' ||
      p.tag === 'Web & Mobile App Development' ||
      p.id.startsWith('proj-app-') ||
      p.tag === 'Web3 & MetaMask Auth' ||
      p.tag === 'Event Ticketing & Blockchain' ||
      p.tag === 'QR Passes & Gate Verification' ||
      p.tag === 'In-App cUSD Checkout' ||
      p.tag === 'Mobile UI/UX & Splash System'
    );
  };

  // Base domain collections
  const rawGraphicsProjects = useMemo(() => allProjects.filter(isGraphicsProject), [allProjects]);
  const rawWebMobileProjects = useMemo(() => allProjects.filter(isWebMobileProject), [allProjects]);

  // Matching functions
  const matchesGraphicsTag = (p: ProjectItem, cat: GraphicsCategory) => {
    if (cat === 'All Graphics') return true;
    if (p.tag === cat) return true;
    const lowerTech = (p.technique || '').toLowerCase();
    const lowerDesc = (p.description || '').toLowerCase();
    const lowerCaption = (p.caption || '').toLowerCase();
    const combined = `${p.title.toLowerCase()} ${lowerTech} ${lowerDesc} ${lowerCaption} ${p.client.toLowerCase()}`;

    if (cat === 'Screen Printing') {
      return (
        p.tag === 'Screen Printing' ||
        combined.includes('screen printing') ||
        combined.includes('silkscreen') ||
        combined.includes('carousel') ||
        combined.includes('plastisol') ||
        combined.includes('singlet') ||
        combined.includes('kigorobya') ||
        combined.includes('tusimba')
      );
    }
    if (cat === 'DTF (Direct-to-Film)') {
      return p.tag === 'DTF (Direct-to-Film)' || combined.includes('dtf') || combined.includes('direct-to-film');
    }
    if (cat === 'Heat Press Machine') {
      return p.tag === 'Heat Press Machine' || combined.includes('heat press') || combined.includes('heat weld') || combined.includes('heat transfer');
    }
    if (cat === 'Vinyl Stickers') {
      return (
        (p.tag === 'Vinyl Stickers' || combined.includes('vinyl') || combined.includes('sticker') || combined.includes('decal') || combined.includes('plotter')) &&
        !combined.includes('screen printing') &&
        !combined.includes('singlet')
      );
    }
    if (cat === 'NGO Bulk Orders') {
      return combined.includes('oxfam') || combined.includes('plan') || combined.includes('belgium') || combined.includes('ireland') || combined.includes('ngo');
    }
    if (cat === 'Event Merch') {
      return combined.includes('run') || combined.includes('marathon') || combined.includes('event') || combined.includes('fundraising') || combined.includes('faith');
    }
    if (cat === 'Safety & Reflectors') {
      return combined.includes('reflector') || combined.includes('safety') || combined.includes('hi-vis') || combined.includes('scotchlite');
    }
    if (cat === 'Eco Brand Design') {
      return combined.includes('eco') || combined.includes('conservation') || combined.includes('organic') || combined.includes('green');
    }
    return false;
  };

  const matchesWebMobileTag = (p: ProjectItem, cat: WebMobileCategory) => {
    if (cat === 'All Web & Mobile') return true;
    if (p.tag === cat) return true;
    const combined = `${p.title.toLowerCase()} ${(p.caption || '').toLowerCase()} ${(p.description || '').toLowerCase()}`;
    if (cat === 'Web3 & MetaMask Auth') {
      return combined.includes('metamask') || combined.includes('wallet') || combined.includes('onboarding');
    }
    if (cat === 'Event Ticketing & Blockchain') {
      return combined.includes('ticketing') || combined.includes('events') || combined.includes('marketplace') || combined.includes('summit');
    }
    if (cat === 'QR Passes & Gate Verification') {
      return combined.includes('qr') || combined.includes('passes') || combined.includes('gate') || combined.includes('ticket-');
    }
    if (cat === 'In-App cUSD Checkout') {
      return combined.includes('checkout') || combined.includes('cusd') || combined.includes('purchase');
    }
    if (cat === 'Mobile UI/UX & Splash System') {
      return combined.includes('splash') || combined.includes('brand identity') || combined.includes('typography');
    }
    return false;
  };

  // Filtered lists
  const filteredGraphicsProjects = useMemo(() => {
    return rawGraphicsProjects.filter((p) => {
      const matchesCategory = matchesGraphicsTag(p, activeGraphicsCategory);
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        p.title.toLowerCase().includes(query) ||
        p.client.toLowerCase().includes(query) ||
        p.caption.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        (p.technique && p.technique.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [rawGraphicsProjects, activeGraphicsCategory, searchQuery]);

  const filteredWebMobileProjects = useMemo(() => {
    return rawWebMobileProjects.filter((p) => {
      const matchesCategory = matchesWebMobileTag(p, activeWebMobileCategory);
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        p.title.toLowerCase().includes(query) ||
        p.client.toLowerCase().includes(query) ||
        p.caption.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        (p.technique && p.technique.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [rawWebMobileProjects, activeWebMobileCategory, searchQuery]);

  // Live grid counters for the catalog toolbar
  const visibleWorkCount =
    activeCatalog === 'graphics'
      ? filteredGraphicsProjects.length
      : activeCatalog === 'web-mobile'
        ? filteredWebMobileProjects.length
        : filteredGraphicsProjects.length + filteredWebMobileProjects.length;

  const totalWorkCount =
    activeCatalog === 'graphics'
      ? rawGraphicsProjects.length
      : activeCatalog === 'web-mobile'
        ? rawWebMobileProjects.length
        : rawGraphicsProjects.length + rawWebMobileProjects.length;

  return (
    <section id="work" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t border-white/[0.08]">
      
      {/* ========================================================================= */}
      {/* MASTER SEPARATION SWITCHER: 2 DISTINCT PROFESSIONAL CATALOGS              */}
      {/* ========================================================================= */}
      <div className="mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#FF4D00] font-semibold flex items-center gap-1.5">
              <Sparkles size={14} />
              <span>Independent Production Archives</span>
            </div>
            <h2 className="font-serif-display text-2xl sm:text-4xl text-white mt-1">
              Select Professional Catalog
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-white/70">
              <span className="text-white font-bold">{rawGraphicsProjects.length + rawWebMobileProjects.length}</span> Verified Production Works
            </span>
          </div>
        </div>

        {/* Big Dual-Tab Switcher with distinct color identities */}
        <div className="p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-2 shadow-2xl">
          {/* TAB 1: Graphics Design & Artist Catalog */}
          <button
            id="graphics-catalog"
            onClick={() => setActiveCatalog('graphics')}
            className={`p-4 rounded-xl text-left transition-all duration-300 relative group flex items-start justify-between ${
              activeCatalog === 'graphics'
                ? 'bg-gradient-to-r from-[#FF4D00] to-[#E64600] text-white shadow-xl shadow-[#FF4D00]/20'
                : 'hover:bg-white/[0.04] text-white/70 hover:text-white'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  activeCatalog === 'graphics'
                    ? 'bg-black/20 text-white'
                    : 'bg-[#FF4D00]/10 text-[#FF4D00] border border-[#FF4D00]/20'
                }`}
              >
                <PenTool size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-bold tracking-tight">
                    Graphics Design &amp; Artist Catalog
                  </span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${
                      activeCatalog === 'graphics'
                        ? 'bg-black/30 text-white font-bold'
                        : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {rawGraphicsProjects.length} Works
                  </span>
                </div>
                <p
                  className={`text-xs mt-1 leading-relaxed line-clamp-1 sm:line-clamp-none ${
                    activeCatalog === 'graphics' ? 'text-white/90' : 'text-white/50'
                  }`}
                >
                  Rogue Ventures Studio: CorelDRAW Vectors, DTF Transfers, Screen Printing, Heat Press &amp; Vinyl
                </p>
              </div>
            </div>

            <div className="hidden sm:block shrink-0 mt-1">
              <span
                className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md ${
                  activeCatalog === 'graphics' ? 'bg-black/30 text-white' : 'text-white/40'
                }`}
              >
                {activeCatalog === 'graphics' ? 'Active Catalog' : 'View →'}
              </span>
            </div>
          </button>

          {/* TAB 2: Web & Mobile Application Development Catalog */}
          <button
            id="web-mobile-catalog"
            onClick={() => setActiveCatalog('web-mobile')}
            className={`p-4 rounded-xl text-left transition-all duration-300 relative group flex items-start justify-between ${
              activeCatalog === 'web-mobile'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-500/20'
                : 'hover:bg-white/[0.04] text-white/70 hover:text-white'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  activeCatalog === 'web-mobile'
                    ? 'bg-black/20 text-white'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}
              >
                <Smartphone size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-bold tracking-tight">
                    Web &amp; Mobile App Development Catalog
                  </span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${
                      activeCatalog === 'web-mobile'
                        ? 'bg-black/30 text-white font-bold'
                        : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {rawWebMobileProjects.length} Software
                  </span>
                </div>
                <p
                  className={`text-xs mt-1 leading-relaxed line-clamp-1 sm:line-clamp-none ${
                    activeCatalog === 'web-mobile' ? 'text-white/90' : 'text-white/50'
                  }`}
                >
                  Grin Mates (go_green_mates) Android screens, cUSD ticket checkout, responsive web builds &amp; desktop forms
                </p>
              </div>
            </div>

            <div className="hidden sm:block shrink-0 mt-1">
              <span
                className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md ${
                  activeCatalog === 'web-mobile' ? 'bg-black/30 text-white' : 'text-white/40'
                }`}
              >
                {activeCatalog === 'web-mobile' ? 'Active Catalog' : 'View →'}
              </span>
            </div>
          </button>
        </div>

        {/* Auxiliary switcher to compare or view both */}
        <div className="mt-3 flex items-center justify-end">
          <button
            onClick={() => setActiveCatalog(activeCatalog === 'both' ? 'graphics' : 'both')}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 ${
              activeCatalog === 'both'
                ? 'bg-white/10 text-white border-white/30'
                : 'text-white/40 hover:text-white border-transparent hover:border-white/10'
            }`}
          >
            <Layers size={13} />
            <span>{activeCatalog === 'both' ? 'Switch to Single Catalog Mode' : 'View Both Catalogs (Stacked Separated View)'}</span>
          </button>
        </div>
      </div>

      {/* Catalog Toolbar: Search & Live Grid Count */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeCatalog === 'web-mobile'
                ? 'Search builds (e.g. Grin Mates, cUSD, Dashboard, Android, Web)...'
                : activeCatalog === 'both'
                  ? 'Search both catalogs (e.g. DTF, Reflectors, cUSD, Android)...'
                  : 'Search graphics (e.g. CorelDRAW, DTF, UKaid, Heat Press, Vinyl)...'
            }
            className="w-full h-11 pl-10 pr-4 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#FF4D00] focus:ring-1 focus:ring-[#FF4D00] transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Live catalog counter */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 self-start sm:self-auto">
          <LayoutGrid size={14} className="text-[#FF4D00] shrink-0" />
          <span className="text-xs text-white/50">
            Showing <span className="text-white font-bold font-mono">{visibleWorkCount}</span> of{' '}
            <span className="text-white/80 font-mono">{totalWorkCount}</span> works
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HIDDEN STUDIO OWNER ADMIN FORM (UNLOCKED ONLY WITH SPECIFIC PASSKEY)       */}
      {/* ========================================================================= */}
      <div ref={adminFormRef} id="studio-admin-portal" className="scroll-mt-24">
        <HiddenAdminCatalogForm
          allProjects={allProjects}
          onUploadSuccess={handleUploadSuccess}
          onRefresh={refreshCatalogStorage}
          isLoadingStorage={isLoadingStorage}
          selectedEditProject={editingProject}
          onClearEditProject={() => setEditingProject(null)}
        />
      </div>

      {/* ========================================================================= */}
      {/* CATALOG 1: GRAPHICS DESIGN & ARTIST CATALOG                               */}
      {/* ========================================================================= */}
      {(activeCatalog === 'graphics' || activeCatalog === 'both') && (
        <div className="space-y-6 mb-16">
          {/* Header Banner for Graphics Catalog */}
          <div className="p-6 sm:p-8 rounded-3xl border border-[#FF4D00]/30 bg-gradient-to-br from-[#FF4D00]/[0.08] via-[#121212] to-[#0D0D0D] relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4D00]/10 border border-[#FF4D00]/30 text-xs font-bold text-[#FF4D00] uppercase tracking-wider">
                  <PenTool size={13} /> Rogue Ventures Studio • Kampala
                </div>
                <h3 className="font-serif-display text-2xl sm:text-4xl text-white tracking-tight mt-2">
                  Graphics Design, Prepress &amp; Apparel Production Catalog
                </h3>
                <p className="text-xs sm:text-sm text-white/70 mt-1 max-w-2xl leading-relaxed">
                  Authentic production proofs: CorelDRAW vector heraldry, DTF heat press transfers, pneumatic heat press machinery, weather-tested vinyl stickers, ceremonial stoles, and humanitarian NGO branding.
                </p>
              </div>

              <div className="text-right shrink-0 flex flex-col md:items-end gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      adminFormRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FF4D00] hover:bg-[#ff5d1a] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#FF4D00]/25 transition hover:scale-[1.02] cursor-pointer"
                    title="Upload new project images & titles to Netlify Blobs storage"
                  >
                    <Plus size={15} />
                    <span>Upload Proof (Admin)</span>
                  </button>

                  <button
                    onClick={refreshCatalogStorage}
                    disabled={isLoadingStorage}
                    className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition disabled:opacity-50 cursor-pointer"
                    title="Sync with cloud storage (Netlify Blobs / API)"
                  >
                    <RefreshCw size={15} className={isLoadingStorage ? 'animate-spin text-[#FF4D00]' : ''} />
                  </button>
                </div>

                <div>
                  <div className="flex items-center md:justify-end gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono text-white/50">Domain Volume</span>
                  </div>
                  <span className="text-2xl font-bold font-mono text-[#FF4D00]">{filteredGraphicsProjects.length}</span>
                  <span className="text-xs text-white/40 font-mono"> / {rawGraphicsProjects.length} Projects</span>
                </div>
              </div>
            </div>

            {storageError && (
              <div className="mt-4 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <AlertTriangle size={14} className="shrink-0" />
                  {storageError}
                </span>
                <button
                  onClick={refreshCatalogStorage}
                  className="underline hover:text-white text-xs ml-3 cursor-pointer"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Subcategory Pills for Graphics */}
            <div className="mt-6 pt-5 border-t border-white/[0.08] flex items-center gap-2 overflow-x-auto scrollbar-none">
              {GRAPHICS_CATEGORIES.map((cat) => {
                const count = cat === 'All Graphics' 
                  ? rawGraphicsProjects.length 
                  : rawGraphicsProjects.filter((p) => matchesGraphicsTag(p, cat)).length;
                const isActive = activeGraphicsCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveGraphicsCategory(cat)}
                    className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#FF4D00] text-white shadow-md shadow-[#FF4D00]/30 font-bold'
                        : 'bg-white/[0.04] text-white/70 hover:bg-white/[0.08] hover:text-white border border-white/10'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive ? 'bg-black/30 text-white' : 'bg-white/10 text-white/50'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Graphics Catalog Content - E-commerce Style Product Grid */}
          {filteredGraphicsProjects.length === 0 ? (
            <div className="text-center py-16 rounded-3xl bg-white/[0.02] border border-white/[0.06]">
              <p className="text-sm text-white/50">No graphics design projects match your search.</p>
              <button
                onClick={() => {
                  setActiveGraphicsCategory('All Graphics');
                  setSearchQuery('');
                }}
                className="mt-3 text-xs text-[#FF4D00] hover:underline"
              >
                Reset Graphics Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-5">
              {filteredGraphicsProjects.map((project) => (
                <article
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="group relative flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-[#121212] hover:border-[#FF4D00]/60 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#FF4D00]/10 transition-all duration-300 cursor-pointer"
                >
                  {/* Product Tile */}
                  <div className="relative aspect-square bg-[#0B0B0B] overflow-hidden">
                    <img
                      src={project.img}
                      alt={project.title}
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        const fallback = getFallbackArtwork(project.tag);
                        if (target.src !== fallback) {
                          target.src = fallback;
                        }
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.07]"
                    />

                    {/* Hover scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    {/* Category ribbon */}
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-[#FF4D00] text-[10px] font-bold uppercase tracking-wider border border-white/10">
                      {project.tag}
                    </span>

                    {/* Admin quick-edit shortcut */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingProject(project);
                        adminFormRef.current?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 text-white/70 hover:text-white hover:bg-[#FF4D00] hover:border-[#FF4D00] flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                      title="Replace photo or update title in Admin Form"
                    >
                      <Edit3 size={13} />
                    </button>

                    {/* Quick view action */}
                    <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#FF4D00] text-white text-[10px] font-bold uppercase tracking-wider shadow-lg">
                        <Eye size={13} /> Quick View
                      </span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-3.5 sm:p-4 flex flex-col flex-1">
                    <div className="flex items-center justify-between gap-2 text-[10px] uppercase font-semibold tracking-wider text-white/40">
                      <span className="truncate">{project.client}</span>
                      <span className="font-mono text-white/30 shrink-0">{project.year || '2024'}</span>
                    </div>

                    <h4 className="text-sm sm:text-[15px] font-bold text-white tracking-tight mt-1.5 leading-snug line-clamp-2 group-hover:text-[#FF4D00] transition">
                      {project.title}
                    </h4>

                    <p className="text-[11px] text-white/55 mt-1.5 leading-relaxed line-clamp-2 flex-1">
                      {project.caption}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono text-[#FF4D00]/90 truncate">
                        {project.technique || 'DTF & Heat Press'}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white/50 group-hover:text-white transition shrink-0">
                        Details <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* CATALOG 2: WEB & MOBILE APPLICATION DEVELOPMENT CATALOG                    */}
      {/* ========================================================================= */}
      {(activeCatalog === 'web-mobile' || activeCatalog === 'both') && (
        <div className="space-y-6">
          {/* Header Banner for Web & Mobile Catalog */}
          <div className="p-6 sm:p-8 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 via-[#121212] to-[#0A0A0A] relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <Smartphone size={13} /> Mobile Architecture &amp; Web3 Systems
                </div>
                <h3 className="font-serif-display text-2xl sm:text-4xl text-white tracking-tight mt-2">
                  Web &amp; Mobile Application Development Catalog
                </h3>
                <p className="text-xs sm:text-sm text-white/70 mt-1 max-w-2xl leading-relaxed">
                  Software builds from Android emulator runs to deployed web pages: native ticket vaults and cUSD checkout captured on a Google Pixel 9 Pro (<code className="text-emerald-400 font-mono text-xs">go_green_mates</code>), alongside responsive web layouts, desktop forms and business intelligence reports.
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-mono text-white/50 block">Domain Volume</span>
                <span className="text-2xl font-bold font-mono text-emerald-400">{filteredWebMobileProjects.length}</span>
                <span className="text-xs text-white/40 font-mono"> / {rawWebMobileProjects.length} Software Builds</span>
              </div>
            </div>

            {/* Subcategory Pills for Web & Mobile */}
            <div className="mt-6 pt-5 border-t border-white/[0.08] flex items-center gap-2 overflow-x-auto scrollbar-none">
              {WEB_MOBILE_CATEGORIES.map((cat) => {
                const count = cat === 'All Web & Mobile' 
                  ? rawWebMobileProjects.length 
                  : rawWebMobileProjects.filter((p) => matchesWebMobileTag(p, cat)).length;
                const isActive = activeWebMobileCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveWebMobileCategory(cat)}
                    className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30 font-bold'
                        : 'bg-white/[0.04] text-white/70 hover:bg-white/[0.08] hover:text-white border border-white/10'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive ? 'bg-black/30 text-white' : 'bg-white/10 text-white/50'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Web & Mobile Catalog Content - E-commerce Style Product Grid */}
          {filteredWebMobileProjects.length === 0 ? (
            <div className="text-center py-16 rounded-3xl bg-white/[0.02] border border-white/[0.06]">
              <p className="text-sm text-white/50">No software projects match your search.</p>
              <button
                onClick={() => {
                  setActiveWebMobileCategory('All Web & Mobile');
                  setSearchQuery('');
                }}
                className="mt-3 text-xs text-emerald-400 hover:underline"
              >
                Reset Software Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-5">
              {filteredWebMobileProjects.map((project) => (
                <article
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="group relative flex flex-col rounded-2xl overflow-hidden border border-emerald-500/20 bg-[#121212] hover:border-emerald-400/60 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 cursor-pointer"
                >
                  {/* Product Tile - screens stay uncropped */}
                  <div className="relative aspect-[4/5] bg-gradient-to-b from-emerald-950/25 via-[#0C0C0C] to-[#0A0A0A] overflow-hidden flex items-center justify-center p-3">
                    <img
                      src={project.img}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-[1.06]"
                    />

                    {/* Hover scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    {/* Category ribbon */}
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                      {project.tag}
                    </span>

                    {/* Admin quick-edit shortcut */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingProject(project);
                        adminFormRef.current?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 text-white/70 hover:text-black hover:bg-emerald-500 hover:border-emerald-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                      title="Replace photo or update title in Admin Form"
                    >
                      <Edit3 size={13} />
                    </button>

                    {/* Quick view action */}
                    <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 text-black text-[10px] font-bold uppercase tracking-wider shadow-lg">
                        <Eye size={13} /> Quick View
                      </span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-3.5 sm:p-4 flex flex-col flex-1">
                    <div className="flex items-center justify-between gap-2 text-[10px] uppercase font-semibold tracking-wider text-white/40">
                      <span className="truncate">{project.client}</span>
                      <span className="font-mono text-white/30 shrink-0">{project.year || '2025'}</span>
                    </div>

                    <h4 className="text-sm sm:text-[15px] font-bold text-white tracking-tight mt-1.5 leading-snug line-clamp-2 group-hover:text-emerald-400 transition">
                      {project.title}
                    </h4>

                    <p className="text-[11px] text-white/55 mt-1.5 leading-relaxed line-clamp-2 flex-1">
                      {project.caption}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono text-emerald-400/90 truncate">
                        {project.technique || 'Web & Mobile Dev'}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white/50 group-hover:text-white transition shrink-0">
                        Details <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Floating Status Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-black/90 border border-[#FF4D00]/50 text-white shadow-2xl flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Case Study Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          isCustomUpload={customUploads.some((u) => u.id === selectedProject.id) || selectedProject.id.startsWith('custom-')}
          onDelete={handleDeleteCustom}
          onEdit={(proj) => {
            setSelectedProject(null);
            setEditingProject(proj);
            adminFormRef.current?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {/* Artist & Owner Upload Modal */}
      <ArtworkUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </section>
  );
};
