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
  Upload, 
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
  Download,
  FileCode,
  Check,
  Database
} from 'lucide-react';
import { ProjectModal } from './ProjectModal';
import { 
  compressImage, 
  saveCustomUploads, 
  loadCustomUploads, 
  saveImageOverride, 
  loadImageOverrides 
} from '../utils/imageStorage';

const GRAPHICS_CATEGORIES: GraphicsCategory[] = [
  'All Graphics',
  'Logo Design & CorelDRAW',
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
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Load persisted custom uploads and image overrides from IndexedDB
  useEffect(() => {
    let isMounted = true;
    const initStorage = async () => {
      try {
        const [uploads, overrides] = await Promise.all([
          loadCustomUploads(),
          loadImageOverrides()
        ]);
        if (isMounted) {
          if (uploads && uploads.length > 0) setCustomUploads(uploads);
          if (overrides && Object.keys(overrides).length > 0) setImageOverrides(overrides);
        }
      } catch (err) {
        console.warn('Failed to load catalog storage', err);
      }
    };
    initStorage();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleImageOverride = async (projectId: string, file: File) => {
    try {
      // Auto-compress large photos to prevent exceeding browser storage limits
      const compressed = await compressImage(file, 1600, 0.84);
      setImageOverrides((prev) => ({ ...prev, [projectId]: compressed }));
      await saveImageOverride(projectId, compressed);
    } catch (err) {
      console.error('Failed to override image', err);
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
    return Array.from(projectMap.values()).map((p) => {
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
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  // Safe fallback image if original file path is still loading
  const getFallbackArtwork = (tag: string) => {
    if (tag.includes('Safety') || tag.includes('Heat Press') || tag.includes('Reflector')) {
      return '/portfolio/makindye-safety-vests.jpg';
    }
    if (tag.includes('DTF')) {
      return '/portfolio/ukaid-collection.jpg';
    }
    if (tag.includes('Screen Printing')) {
      return '/portfolio/tusimba-team-distribution.jpg';
    }
    if (tag.includes('CorelDRAW') || tag.includes('Logo')) {
      return '/portfolio/makindye-coreldraw-prepress.jpg';
    }
    if (tag.includes('Vinyl')) {
      return '/portfolio/grassland-guardian-uganda.jpg';
    }
    return '/portfolio/oxfam-ireland.jpg';
  };

  // New project upload form state
  const [targetCatalogForUpload, setTargetCatalogForUpload] = useState<CatalogDomain>('graphics');
  const [newTitle, setNewTitle] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newTag, setNewTag] = useState<string>('Logo Design & CorelDRAW');
  const [newCaption, setNewCaption] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTechnique, setNewTechnique] = useState('CorelDRAW Vector Logo Design & Prepress');
  const [newImagePreview, setNewImagePreview] = useState<string>('');

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

    if (cat === 'Logo Design & CorelDRAW') {
      return (
        p.tag === 'Logo Design & CorelDRAW' ||
        combined.includes('coreldraw') ||
        combined.includes('logo') ||
        combined.includes('vector') ||
        combined.includes('stole') ||
        combined.includes('heraldic') ||
        combined.includes('prepress') ||
        combined.includes('graphic artist')
      );
    }
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
      return combined.includes('oxfam') || combined.includes('ukaid') || combined.includes('plan') || combined.includes('ireland') || combined.includes('ngo');
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
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      try {
        const compressed = await compressImage(file, 1400, 0.82);
        setNewImagePreview(compressed);
      } catch (err) {
        console.error('Failed to compress image', err);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleAddNewProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newImagePreview) return;

    const newProject: ProjectItem = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      client: newClient.trim() || (targetCatalogForUpload === 'graphics' ? 'Rogue Ventures Client' : 'Grin Mates Mobile'),
      tag: newTag as any,
      catalog: targetCatalogForUpload,
      caption: newCaption.trim() || (targetCatalogForUpload === 'graphics' ? 'Custom DTF & Heat Press production' : 'Mobile application architecture'),
      description: newDescription.trim() || (targetCatalogForUpload === 'graphics' ? 'Custom production order executed at Rogue Ventures.' : 'Engineered mobile application feature.'),
      technique: newTechnique || (targetCatalogForUpload === 'graphics' ? 'Direct-to-Film (DTF) Transfer & Heat Press Machine' : 'Web & Mobile App Development'),
      img: newImagePreview,
      year: new Date().getFullYear().toString(),
      volume: targetCatalogForUpload === 'graphics' ? 'Custom Run' : 'Production Build',
      location: 'Kampala, Uganda'
    };

    const updated = [newProject, ...customUploads];
    setCustomUploads(updated);
    await saveCustomUploads(updated);

    // Reset form
    setNewTitle('');
    setNewClient('');
    setNewCaption('');
    setNewDescription('');
    setNewImagePreview('');
    setShowUploadModal(false);
  };

  const handleDownloadBackup = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      customUploadsCount: customUploads.length,
      customUploads,
      imageOverrides
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wilberforce-portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyCodeSnippet = () => {
    if (customUploads.length === 0) return;
    const tsCode = customUploads.map((p) => `  {
    id: ${JSON.stringify(p.id)},
    title: ${JSON.stringify(p.title)},
    client: ${JSON.stringify(p.client)},
    tag: ${JSON.stringify(p.tag)},
    catalog: ${JSON.stringify(p.catalog)},
    caption: ${JSON.stringify(p.caption)},
    description: ${JSON.stringify(p.description)},
    technique: ${JSON.stringify(p.technique)},
    img: "/portfolio/${p.id}.jpg", // Place original image in public/portfolio/
    year: ${JSON.stringify(p.year || '2025')},
    volume: ${JSON.stringify(p.volume || '1')},
    location: "Kampala, Uganda"
  }`).join(',\n');

    navigator.clipboard.writeText(`// Add these items to INITIAL_PROJECTS in src/data/projects.ts:\n${tsCode}`);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

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

          <div className="flex flex-wrap items-center gap-2">
            {customUploads.length > 0 && (
              <>
                <button
                  onClick={handleDownloadBackup}
                  title="Download a JSON backup of all your uploaded projects"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.05] hover:bg-white/10 px-3 py-2 text-xs font-semibold text-white/80 hover:text-white transition"
                >
                  <Download size={13} />
                  <span>Backup ({customUploads.length})</span>
                </button>
                <button
                  onClick={handleCopyCodeSnippet}
                  title="Copy TypeScript snippet to paste into src/data/projects.ts"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.05] hover:bg-white/10 px-3 py-2 text-xs font-semibold text-white/80 hover:text-white transition"
                >
                  {copiedCode ? <Check size={13} className="text-emerald-400" /> : <FileCode size={13} />}
                  <span>{copiedCode ? 'Code Copied!' : 'Copy Code for Git'}</span>
                </button>
              </>
            )}
            <button
              onClick={() => {
                setTargetCatalogForUpload(activeCatalog === 'web-mobile' ? 'web-mobile' : 'graphics');
                setShowUploadModal(true);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.05] hover:bg-white hover:text-black px-4 py-2 text-xs font-semibold text-white transition-all shadow-sm"
            >
              <Upload size={14} />
              <span>Upload to Catalog</span>
            </button>
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

              <div className="text-right shrink-0">
                <span className="text-xs font-mono text-white/50 block">Domain Volume</span>
                <span className="text-2xl font-bold font-mono text-[#FF4D00]">{filteredGraphicsProjects.length}</span>
                <span className="text-xs text-white/40 font-mono"> / {rawGraphicsProjects.length} Projects</span>
              </div>
            </div>

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

              {/* Main Artwork Preview */}
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[620px] bg-neutral-950 flex items-center justify-center overflow-hidden group">
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
                  className="w-full h-full object-contain sm:object-cover transition duration-700 group-hover:scale-[1.02]"
                />

                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedProject(currentGraphicsProject)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/80 backdrop-blur-md hover:bg-white hover:text-black text-white text-xs font-semibold border border-white/20 transition shadow-xl"
                  >
                    <Eye size={14} /> Full Artwork Zoom &amp; Specs
                  </button>
                </div>

                <button
                  onClick={() => setGraphicsSingleIndex((prev) => (prev - 1 + filteredGraphicsProjects.length) % filteredGraphicsProjects.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-70 hover:opacity-100 hover:bg-[#FF4D00] hover:border-[#FF4D00] transition shadow-lg"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setGraphicsSingleIndex((prev) => (prev + 1) % filteredGraphicsProjects.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-70 hover:opacity-100 hover:bg-[#FF4D00] hover:border-[#FF4D00] transition shadow-lg"
                >
                  <ChevronRight size={20} />
                </button>
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
                    className="inline-flex items-center gap-1.5 text-xs text-[#FF4D00] font-semibold hover:underline"
                  >
                    <span>View Specifications &amp; Override Image</span>
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

              {/* Main Mobile Screen Preview */}
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[620px] bg-[#0A0A0A] flex items-center justify-center overflow-hidden group p-4 sm:p-6">
                <img
                  key={currentWebMobileProject.id}
                  src={currentWebMobileProject.img}
                  alt={currentWebMobileProject.title}
                  className="w-auto h-full max-h-[580px] object-contain transition duration-700 group-hover:scale-[1.02] drop-shadow-2xl"
                />

                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedProject(currentWebMobileProject)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/80 backdrop-blur-md hover:bg-emerald-400 hover:text-black text-white text-xs font-semibold border border-emerald-500/30 transition shadow-xl"
                  >
                    <Eye size={14} /> Screen Architecture &amp; Code Specs
                  </button>
                </div>

                <button
                  onClick={() => setWebMobileSingleIndex((prev) => (prev - 1 + filteredWebMobileProjects.length) % filteredWebMobileProjects.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-70 hover:opacity-100 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition shadow-lg"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setWebMobileSingleIndex((prev) => (prev + 1) % filteredWebMobileProjects.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-70 hover:opacity-100 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition shadow-lg"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Caption & Metadata Bar */}
              <div className="p-6 bg-white/[0.02] border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-lg font-bold text-white tracking-tight">{currentWebMobileProject.title}</h4>
                  <p className="text-xs text-white/60 mt-1 max-w-2xl">{currentWebMobileProject.caption}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href="#experience"
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold hover:underline"
                  >
                    <span>Open Interactive Pixel 9 Simulator</span>
                    <ArrowRight size={13} />
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

      {/* ========================================================================= */}
      {/* UPLOAD PROJECT MODAL                                                      */}
      {/* ========================================================================= */}
      {showUploadModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowUploadModal(false)}
        >
          <div
            className="bg-[#141414] border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-white relative shadow-2xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold tracking-tight mb-1">Upload Work to Catalog</h3>
            <p className="text-xs text-white/60 mb-5">
              Choose the appropriate catalog to ensure your work is properly organized.
            </p>

            <form onSubmit={handleAddNewProject} className="space-y-4 text-xs">
              {/* Target Catalog Selector */}
              <div>
                <label className="block text-white/70 mb-1 font-medium">Target Catalog *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTargetCatalogForUpload('graphics');
                      setNewTag('Logo Design & CorelDRAW');
                      setNewTechnique('CorelDRAW Vector Logo Design & Prepress');
                    }}
                    className={`h-10 rounded-xl px-3 text-xs font-semibold border flex items-center justify-center gap-1.5 transition ${
                      targetCatalogForUpload === 'graphics'
                        ? 'bg-[#FF4D00] text-white border-[#FF4D00]'
                        : 'bg-white/[0.04] text-white/60 border-white/10 hover:text-white'
                    }`}
                  >
                    <PenTool size={13} />
                    <span>Graphics &amp; Print</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTargetCatalogForUpload('web-mobile');
                      setNewTag('Web3 & MetaMask Auth');
                      setNewTechnique('Web & Mobile App Development');
                    }}
                    className={`h-10 rounded-xl px-3 text-xs font-semibold border flex items-center justify-center gap-1.5 transition ${
                      targetCatalogForUpload === 'web-mobile'
                        ? 'bg-emerald-500 text-black border-emerald-500 font-bold'
                        : 'bg-white/[0.04] text-white/60 border-white/10 hover:text-white'
                    }`}
                  >
                    <Smartphone size={13} />
                    <span>Web &amp; Mobile App</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-medium">Project Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={
                    targetCatalogForUpload === 'graphics'
                      ? 'e.g. UKaid DTF Heat Press Tees'
                      : 'e.g. Grin Mates Web3 Wallet Flow'
                  }
                  className="w-full h-10 px-3 rounded-xl bg-white/[0.06] border border-white/10 text-white focus:outline-none focus:border-[#FF4D00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1 font-medium">Client / Org</label>
                  <input
                    type="text"
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    placeholder={targetCatalogForUpload === 'graphics' ? 'e.g. OXFAM / Plan Int.' : 'e.g. Grin Mates'}
                    className="w-full h-10 px-3 rounded-xl bg-white/[0.06] border border-white/10 text-white focus:outline-none focus:border-[#FF4D00]"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-medium">Category Tag</label>
                  <select
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="w-full h-10 px-2 rounded-xl bg-[#1C1C1E] border border-white/10 text-white focus:outline-none focus:border-[#FF4D00]"
                  >
                    {targetCatalogForUpload === 'graphics' ? (
                      GRAPHICS_CATEGORIES.filter((c) => c !== 'All Graphics').map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))
                    ) : (
                      WEB_MOBILE_CATEGORIES.filter((c) => c !== 'All Web & Mobile').map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-medium">Technique / Technologies</label>
                <input
                  type="text"
                  value={newTechnique}
                  onChange={(e) => setNewTechnique(e.target.value)}
                  placeholder={
                    targetCatalogForUpload === 'graphics'
                      ? 'e.g. Direct-to-Film (DTF) & Pneumatic Heat Press'
                      : 'e.g. Kotlin, MetaMask SDK & Celo Smart Contracts'
                  }
                  className="w-full h-10 px-3 rounded-xl bg-white/[0.06] border border-white/10 text-white focus:outline-none focus:border-[#FF4D00]"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-medium">Short Caption</label>
                <input
                  type="text"
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="Short one-line description of the work"
                  className="w-full h-10 px-3 rounded-xl bg-white/[0.06] border border-white/10 text-white focus:outline-none focus:border-[#FF4D00]"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-medium">Upload Image File *</label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  disabled={isCompressing}
                  onChange={handleFileChange}
                  className="w-full text-xs text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#FF4D00] file:text-white hover:file:bg-[#ff611e] cursor-pointer disabled:opacity-50"
                />
                {isCompressing && (
                  <p className="mt-1 text-[11px] text-amber-400 animate-pulse flex items-center gap-1.5">
                    <Database size={12} />
                    <span>Compressing &amp; preparing high-res artwork for persistent storage...</span>
                  </p>
                )}
                {newImagePreview && !isCompressing && (
                  <div className="mt-2 relative aspect-video rounded-xl overflow-hidden border border-white/20">
                    <img src={newImagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-emerald-400 text-[10px] font-mono flex items-center gap-1">
                      <Check size={10} /> Optimized for Permanent Storage
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 h-10 rounded-full border border-white/20 text-white/80 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 h-10 rounded-full font-bold text-white transition ${
                    targetCatalogForUpload === 'graphics'
                      ? 'bg-[#FF4D00] hover:bg-[#ff611e]'
                      : 'bg-emerald-500 text-black hover:bg-emerald-400'
                  }`}
                >
                  Save to {targetCatalogForUpload === 'graphics' ? 'Graphics' : 'Web & Mobile'} Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Case Study Modal with Original Image Replacement feature */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onImageOverride={handleImageOverride}
        />
      )}
    </section>
  );
};
