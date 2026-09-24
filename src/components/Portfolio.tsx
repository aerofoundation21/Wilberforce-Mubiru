import React, { useState, useMemo, useEffect } from 'react';
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
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  LayoutGrid, 
  Eye, 
  PenTool, 
  Smartphone, 
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  UploadCloud,
  Plus,
  RefreshCw,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { ProjectModal } from './ProjectModal';
import { ArtworkUploadModal } from './ArtworkUploadModal';
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
  'Web3 & MetaMask Auth',
  'Event Ticketing & Blockchain',
  'QR Passes & Gate Verification',
  'In-App cUSD Checkout',
  'Mobile UI/UX & Splash System'
];

export const Portfolio: React.FC = () => {
  const [customUploads, setCustomUploads] = useState<ProjectItem[]>([]);
  const [imageOverrides, setImageOverrides] = useState<Record<string, string>>({});
  const [isLoadingStorage, setIsLoadingStorage] = useState<boolean>(true);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
    // Apply standalone image overrides and filter out any AI-generated entries
    return Array.from(projectMap.values())
      .filter((p) => {
        const lowerClient = (p.client || '').toLowerCase();
        const lowerTitle = (p.title || '').toLowerCase();
        // Discard AI-generated Luba Charles entries
        if (
          lowerClient.includes('luba') || 
          lowerClient.includes('charles') || 
          lowerTitle.includes('luba') || 
          p.id === 'custom-1790054332860' ||
          p.id === 'custom-1790054219338' ||
          p.id === 'custom-1790054153736'
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

  // Search and view mode states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [viewMode, setViewMode] = useState<'single' | 'cards'>('single');
  const [graphicsSingleIndex, setGraphicsSingleIndex] = useState<number>(0);
  const [webMobileSingleIndex, setWebMobileSingleIndex] = useState<number>(0);

  // Safe fallback image if original file path is still loading
  const getFallbackArtwork = (tag: string) => {
    if (tag.includes('Safety') || tag.includes('Heat Press') || tag.includes('Reflector')) {
      return '/portfolio/oxfam-ireland.jpg';
    }
    if (tag.includes('DTF')) {
      return '/portfolio/belgium-plan-international.jpg';
    }
    if (tag.includes('Screen Printing')) {
      return '/portfolio/tusimba-team-distribution.jpg';
    }
    if (tag.includes('Vinyl')) {
      return '/portfolio/grassland-guardian-uganda.jpg';
    }
    return '/portfolio/oxfam-ireland.jpg';
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

  // Reset indices
  useEffect(() => {
    setGraphicsSingleIndex(0);
  }, [activeGraphicsCategory, searchQuery]);

  useEffect(() => {
    setWebMobileSingleIndex(0);
  }, [activeWebMobileCategory, searchQuery]);

  // Keyboard navigation for active single image view
  useEffect(() => {
    if (viewMode !== 'single') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeCatalog === 'graphics' && filteredGraphicsProjects.length > 0) {
        if (e.key === 'ArrowRight') {
          setGraphicsSingleIndex((prev) => (prev + 1) % filteredGraphicsProjects.length);
        } else if (e.key === 'ArrowLeft') {
          setGraphicsSingleIndex((prev) => (prev - 1 + filteredGraphicsProjects.length) % filteredGraphicsProjects.length);
        }
      } else if (activeCatalog === 'web-mobile' && filteredWebMobileProjects.length > 0) {
        if (e.key === 'ArrowRight') {
          setWebMobileSingleIndex((prev) => (prev + 1) % filteredWebMobileProjects.length);
        } else if (e.key === 'ArrowLeft') {
          setWebMobileSingleIndex((prev) => (prev - 1 + filteredWebMobileProjects.length) % filteredWebMobileProjects.length);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, activeCatalog, filteredGraphicsProjects.length, filteredWebMobileProjects.length]);

  const currentGraphicsProject = filteredGraphicsProjects[graphicsSingleIndex] || filteredGraphicsProjects[0];
  const currentWebMobileProject = filteredWebMobileProjects[webMobileSingleIndex] || filteredWebMobileProjects[0];

  // Handle local image file upload with automatic compression
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
                  Grin Mates (go_green_mates): Pixel 9 Pro Android App, MetaMask Web3, Celo cUSD &amp; QR Passes
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

      {/* Global Controls: Search & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeCatalog === 'web-mobile'
                ? 'Search software (e.g. MetaMask, cUSD, QR passes, Pixel 9, Tickets)...'
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

        {/* View Mode Toggle: Single Image View vs Individual Cards */}
        <div className="inline-flex items-center p-1 rounded-2xl bg-white/[0.04] border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('single')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              viewMode === 'single'
                ? 'bg-white text-black shadow-sm font-bold'
                : 'text-white/60 hover:text-white'
            }`}
            title="View catalog as a single high-resolution image at a time"
          >
            <Maximize2 size={13} />
            <span>Single Showcase View</span>
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              viewMode === 'cards'
                ? 'bg-white text-black shadow-sm font-bold'
                : 'text-white/60 hover:text-white'
            }`}
            title="View all project cards in a feed"
          >
            <LayoutGrid size={13} />
            <span>Individual Cards View</span>
          </button>
        </div>
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
                    onClick={() => setIsUploadModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FF4D00] hover:bg-[#ff5d1a] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#FF4D00]/25 transition hover:scale-[1.02] cursor-pointer"
                    title="Add new authentic production proof to live catalog"
                  >
                    <Plus size={15} />
                    <span>Upload Proof</span>
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

          {/* Graphics Catalog Content */}
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
          ) : viewMode === 'single' && currentGraphicsProject ? (
            /* Single Image Showcase for Graphics */
            <div className="rounded-3xl border border-white/10 bg-[#121212] overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-white/[0.08] bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase font-bold tracking-wider text-[#FF4D00] bg-[#FF4D00]/10 px-2.5 py-1 rounded-full border border-[#FF4D00]/20">
                    {currentGraphicsProject.tag}
                  </span>
                  <span className="text-xs text-white/60 font-medium">
                    {currentGraphicsProject.client}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-white/60">
                    <span className="text-white font-bold">{graphicsSingleIndex + 1}</span> / {filteredGraphicsProjects.length}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setGraphicsSingleIndex((prev) => (prev - 1 + filteredGraphicsProjects.length) % filteredGraphicsProjects.length)}
                      className="w-8 h-8 rounded-full border border-white/10 bg-white/[0.05] hover:bg-white hover:text-black flex items-center justify-center text-white transition focus:outline-none"
                      title="Previous"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setGraphicsSingleIndex((prev) => (prev + 1) % filteredGraphicsProjects.length)}
                      className="w-8 h-8 rounded-full border border-white/10 bg-white/[0.05] hover:bg-white hover:text-black flex items-center justify-center text-white transition focus:outline-none"
                      title="Next"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Artwork Showcase - Spacious, uncropped, 100% visible */}
              <div 
                onClick={() => setSelectedProject(currentGraphicsProject)}
                className="relative w-full min-h-[460px] sm:min-h-[560px] md:min-h-[660px] max-h-[800px] bg-[#080808] flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-hidden group cursor-pointer"
                title="Click to view detailed case study"
              >
                <div className="absolute inset-0 bg-radial from-white/[0.03] to-transparent pointer-events-none" />

                <img
                  key={currentGraphicsProject.id}
                  src={currentGraphicsProject.img}
                  alt={currentGraphicsProject.title}
                  onError={(e) => {
                    const target = e.currentTarget;
                    const fallback = getFallbackArtwork(currentGraphicsProject.tag);
                    if (target.src !== fallback) {
                      target.src = fallback;
                    }
                  }}
                  className="w-auto h-auto max-w-full max-h-[520px] sm:max-h-[620px] md:max-h-[700px] object-contain transition duration-500 group-hover:scale-[1.01] drop-shadow-[0_25px_50px_rgba(0,0,0,0.9)]"
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setGraphicsSingleIndex((prev) => (prev - 1 + filteredGraphicsProjects.length) % filteredGraphicsProjects.length);
                  }}
                  className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-70 hover:opacity-100 hover:bg-[#FF4D00] hover:border-[#FF4D00] transition shadow-lg z-10"
                  aria-label="Previous artwork"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setGraphicsSingleIndex((prev) => (prev + 1) % filteredGraphicsProjects.length);
                  }}
                  className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-70 hover:opacity-100 hover:bg-[#FF4D00] hover:border-[#FF4D00] transition shadow-lg z-10"
                  aria-label="Next artwork"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Quick horizontal thumbnail filmstrip */}
              <div className="flex items-center gap-2 overflow-x-auto py-3 px-4 sm:px-6 bg-black/60 border-t border-white/[0.06] scrollbar-thin">
                {filteredGraphicsProjects.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setGraphicsSingleIndex(idx)}
                    className={`shrink-0 rounded-xl overflow-hidden border transition-all duration-200 ${
                      idx === graphicsSingleIndex
                        ? 'border-[#FF4D00] scale-105 ring-2 ring-[#FF4D00]/40 opacity-100'
                        : 'border-white/10 opacity-50 hover:opacity-90 hover:border-white/30'
                    } w-14 h-14 sm:w-16 sm:h-16 bg-neutral-900 flex items-center justify-center p-0.5`}
                    title={`${p.title} (${p.client})`}
                  >
                    <img
                      src={p.img}
                      alt={p.title}
                      onError={(e) => {
                        const target = e.currentTarget;
                        const fallback = getFallbackArtwork(p.tag);
                        if (target.src !== fallback) target.src = fallback;
                      }}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </button>
                ))}
              </div>

              {/* Caption & Metadata Bar */}
              <div className="p-6 bg-white/[0.02] border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-lg font-bold text-white tracking-tight">{currentGraphicsProject.title}</h4>
                  <p className="text-xs text-white/60 mt-1 max-w-2xl">{currentGraphicsProject.caption}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setSelectedProject(currentGraphicsProject)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/20 bg-white/[0.05] hover:bg-[#FF4D00] hover:text-white hover:border-[#FF4D00] text-xs font-semibold text-white transition shadow-sm"
                  >
                    <span>View Case Study &amp; Technical Notes</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Cards Grid for Graphics */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGraphicsProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="group rounded-2xl overflow-hidden border border-white/10 bg-[#121212] hover:border-[#FF4D00]/50 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-lg"
                >
                  <div className="relative aspect-[4/3] bg-neutral-950 overflow-hidden">
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
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-[#FF4D00] text-[10px] font-bold uppercase tracking-wider border border-white/10">
                        {project.tag}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-white/40 uppercase font-semibold tracking-wider">
                        <span>{project.client}</span>
                        <span className="font-mono text-white/30">{project.year || '2024'}</span>
                      </div>
                      <h4 className="text-base font-bold text-white tracking-tight mt-1 leading-snug group-hover:text-[#FF4D00] transition">
                        {project.title}
                      </h4>
                      <p className="text-xs text-white/60 mt-1.5 leading-relaxed line-clamp-2">
                        {project.caption}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
                      <span className="text-[#FF4D00] font-medium truncate max-w-[200px]">
                        {project.technique || 'DTF & Heat Press'}
                      </span>
                      <span className="text-white/40 group-hover:text-white transition">Details →</span>
                    </div>
                  </div>
                </div>
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
                  Full-stack software engineering tested on Google Pixel 9 Pro (<code className="text-emerald-400 font-mono text-xs">go_green_mates</code>). Features MetaMask Web3 wallet authentication, Celo cUSD smart contract ticketing, and cryptographic QR check-in passes.
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

          {/* Web & Mobile Catalog Content */}
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
          ) : viewMode === 'single' && currentWebMobileProject ? (
            /* Single Image Showcase for Web & Mobile */
            <div className="rounded-3xl border border-emerald-500/20 bg-[#121212] overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-white/[0.08] bg-emerald-950/20">
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    {currentWebMobileProject.tag}
                  </span>
                  <span className="text-xs text-white/60 font-medium">
                    {currentWebMobileProject.client}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-white/60">
                    <span className="text-white font-bold">{webMobileSingleIndex + 1}</span> / {filteredWebMobileProjects.length}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setWebMobileSingleIndex((prev) => (prev - 1 + filteredWebMobileProjects.length) % filteredWebMobileProjects.length)}
                      className="w-8 h-8 rounded-full border border-white/10 bg-white/[0.05] hover:bg-white hover:text-black flex items-center justify-center text-white transition focus:outline-none"
                      title="Previous"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setWebMobileSingleIndex((prev) => (prev + 1) % filteredWebMobileProjects.length)}
                      className="w-8 h-8 rounded-full border border-white/10 bg-white/[0.05] hover:bg-white hover:text-black flex items-center justify-center text-white transition focus:outline-none"
                      title="Next"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Mobile Screen Showcase - Spacious, uncropped, 100% visible */}
              <div 
                onClick={() => setSelectedProject(currentWebMobileProject)}
                className="relative w-full min-h-[460px] sm:min-h-[560px] md:min-h-[660px] max-h-[800px] bg-[#080808] flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-hidden group cursor-pointer"
                title="Click to view software architecture & case study"
              >
                <div className="absolute inset-0 bg-radial from-emerald-500/[0.04] to-transparent pointer-events-none" />

                <img
                  key={currentWebMobileProject.id}
                  src={currentWebMobileProject.img}
                  alt={currentWebMobileProject.title}
                  className="w-auto h-auto max-w-full max-h-[520px] sm:max-h-[620px] md:max-h-[700px] object-contain transition duration-500 group-hover:scale-[1.01] drop-shadow-[0_25px_50px_rgba(0,0,0,0.9)]"
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setWebMobileSingleIndex((prev) => (prev - 1 + filteredWebMobileProjects.length) % filteredWebMobileProjects.length);
                  }}
                  className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-70 hover:opacity-100 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition shadow-lg z-10"
                  aria-label="Previous screen"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setWebMobileSingleIndex((prev) => (prev + 1) % filteredWebMobileProjects.length);
                  }}
                  className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-70 hover:opacity-100 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition shadow-lg z-10"
                  aria-label="Next screen"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Quick horizontal thumbnail filmstrip */}
              <div className="flex items-center gap-2 overflow-x-auto py-3 px-4 sm:px-6 bg-black/60 border-t border-white/[0.06] scrollbar-thin">
                {filteredWebMobileProjects.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setWebMobileSingleIndex(idx)}
                    className={`shrink-0 rounded-xl overflow-hidden border transition-all duration-200 ${
                      idx === webMobileSingleIndex
                        ? 'border-emerald-400 scale-105 ring-2 ring-emerald-400/40 opacity-100'
                        : 'border-white/10 opacity-50 hover:opacity-90 hover:border-white/30'
                    } w-14 h-14 sm:w-16 sm:h-16 bg-neutral-900 flex items-center justify-center p-1`}
                    title={`${p.title} (${p.client})`}
                  >
                    <img src={p.img} alt={p.title} className="w-full h-full object-contain rounded-lg" />
                  </button>
                ))}
              </div>

              {/* Caption & Metadata Bar */}
              <div className="p-6 bg-white/[0.02] border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-lg font-bold text-white tracking-tight">{currentWebMobileProject.title}</h4>
                  <p className="text-xs text-white/60 mt-1 max-w-2xl">{currentWebMobileProject.caption}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setSelectedProject(currentWebMobileProject)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500 hover:text-black text-xs font-semibold text-emerald-400 transition shadow-sm"
                  >
                    <span>View Screen Specs &amp; Architecture</span>
                    <ArrowRight size={13} />
                  </button>
                  <a
                    href="#experience"
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold hover:underline"
                  >
                    <span>Simulator</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            /* Cards Grid for Web & Mobile */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWebMobileProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="group rounded-2xl overflow-hidden border border-emerald-500/20 bg-[#121212] hover:border-emerald-400/50 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-lg"
                >
                  <div className="relative aspect-[4/3] bg-[#0A0A0A] overflow-hidden flex items-center justify-center p-3">
                    <img
                      src={project.img}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-lg"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                        {project.tag}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-white/40 uppercase font-semibold tracking-wider">
                        <span>{project.client}</span>
                        <span className="font-mono text-white/30">{project.year || '2025'}</span>
                      </div>
                      <h4 className="text-base font-bold text-white tracking-tight mt-1 leading-snug group-hover:text-emerald-400 transition">
                        {project.title}
                      </h4>
                      <p className="text-xs text-white/60 mt-1.5 leading-relaxed line-clamp-2">
                        {project.caption}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
                      <span className="text-emerald-400 font-medium truncate max-w-[200px]">
                        {project.technique || 'Web & Mobile Dev'}
                      </span>
                      <span className="text-white/40 group-hover:text-white transition">Details →</span>
                    </div>
                  </div>
                </div>
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
