import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  UploadCloud, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  KeyRound, 
  X, 
  RefreshCw, 
  Edit3, 
  Plus, 
  Eye, 
  Layers, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { ProjectItem, GraphicsCategory, CatalogDomain } from '../types';
import { 
  compressImage, 
  uploadCustomArtwork, 
  getSavedOwnerKey, 
  saveOwnerKey, 
  verifyOwnerKey 
} from '../utils/imageStorage';

const GRAPHICS_TAGS: GraphicsCategory[] = [
  'Screen Printing',
  'DTF (Direct-to-Film)',
  'Heat Press Machine',
  'Safety & Reflectors',
  'NGO Bulk Orders',
  'Event Merch',
  'Vinyl Stickers',
  'Eco Brand Design'
];

interface HiddenAdminCatalogFormProps {
  allProjects: ProjectItem[];
  onUploadSuccess: (item: ProjectItem) => void;
  onRefresh: () => void;
  isLoadingStorage: boolean;
  selectedEditProject?: ProjectItem | null;
  onClearEditProject?: () => void;
}

export const HiddenAdminCatalogForm: React.FC<HiddenAdminCatalogFormProps> = ({
  allProjects,
  onUploadSuccess,
  onRefresh,
  isLoadingStorage,
  selectedEditProject,
  onClearEditProject
}) => {
  // Authentication states
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(false);
  const [isKeyPromptOpen, setIsKeyPromptOpen] = useState<boolean>(false);
  const [passkeyInput, setPasskeyInput] = useState<string>('');
  const [keyError, setKeyError] = useState<string | null>(null);
  const [isVerifyingKey, setIsVerifyingKey] = useState<boolean>(false);

  // Form mode: 'new' or 'edit-existing'
  const [formMode, setFormMode] = useState<'new' | 'edit-existing'>('new');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  // Form Fields
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [catalog, setCatalog] = useState<CatalogDomain>('graphics');
  const [tag, setTag] = useState<GraphicsCategory>('Screen Printing');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [technique, setTechnique] = useState('');
  const [materials, setMaterials] = useState('');
  const [volume, setVolume] = useState('');
  const [location, setLocation] = useState('Kampala, Uganda');
  const [caption, setCaption] = useState('');
  const [description, setDescription] = useState('');

  // Image states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageSizeWarning, setImageSizeWarning] = useState<string | null>(null);

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Check saved passkey on mount
  useEffect(() => {
    const saved = getSavedOwnerKey();
    if (saved) {
      // Auto-unlock if previously authorized
      setIsAdminUnlocked(true);
      setPasskeyInput(saved);
    }
  }, []);

  // Listen to keyboard shortcut (Ctrl+Shift+A or Cmd+Shift+A) to trigger admin unlock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (!isAdminUnlocked) {
          setIsKeyPromptOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminUnlocked]);

  // Handle incoming selectedEditProject from parent
  useEffect(() => {
    if (selectedEditProject) {
      setIsAdminUnlocked(true);
      setFormMode('edit-existing');
      setSelectedProjectId(selectedEditProject.id);
      populateForProject(selectedEditProject);
    }
  }, [selectedEditProject]);

  const populateForProject = (proj: ProjectItem) => {
    setTitle(proj.title || '');
    setClient(proj.client || '');
    setCatalog(proj.catalog || 'graphics');
    setTag((proj.tag as GraphicsCategory) || 'Screen Printing');
    setYear(proj.year || new Date().getFullYear().toString());
    setTechnique(proj.technique || '');
    setMaterials(proj.materials || '');
    setVolume(proj.volume || '');
    setLocation(proj.location || 'Kampala, Uganda');
    setCaption(proj.caption || '');
    setDescription(proj.description || '');
    setImagePreview(proj.img || null);
    setImageFile(null);
    setImageSizeWarning(null);
  };

  const handleProjectSelect = (id: string) => {
    setSelectedProjectId(id);
    if (!id) {
      resetFields();
      return;
    }
    const found = allProjects.find((p) => p.id === id);
    if (found) {
      populateForProject(found);
    }
  };

  const resetFields = () => {
    setTitle('');
    setClient('');
    setCatalog('graphics');
    setTag('Screen Printing');
    setYear(new Date().getFullYear().toString());
    setTechnique('');
    setMaterials('');
    setVolume('');
    setLocation('Kampala, Uganda');
    setCaption('');
    setDescription('');
    setImageFile(null);
    setImagePreview(null);
    setImageSizeWarning(null);
    setSelectedProjectId('');
  };

  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setKeyError(null);
    setIsVerifyingKey(true);

    try {
      const valid = await verifyOwnerKey(passkeyInput);
      if (valid) {
        setIsAdminUnlocked(true);
        setIsKeyPromptOpen(false);
      } else {
        setKeyError('Invalid passkey. Verify your CATALOG_UPLOAD_KEY or contact site owner.');
      }
    } catch {
      setKeyError('Verification failed. Server unreachable.');
    } finally {
      setIsVerifyingKey(false);
    }
  };

  const handleLockAdmin = () => {
    setIsAdminUnlocked(false);
    saveOwnerKey('');
    resetFields();
    if (onClearEditProject) onClearEditProject();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setFormError('Please select a valid image file (JPEG, PNG, WebP, or SVG).');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setFormError('File exceeds 20MB limit. Please choose a smaller image.');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setImageSizeWarning(`Image is ${(file.size / (1024 * 1024)).toFixed(1)}MB — will be auto-optimized for crisp web display.`);
    } else {
      setImageSizeWarning(null);
    }

    setImageFile(file);
    setFormError(null);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!title.trim()) {
      setFormError('Project title is required.');
      return;
    }
    if (!client.trim()) {
      setFormError('Client name is required.');
      return;
    }

    if (!imageFile && !imagePreview) {
      setFormError('Please provide an image file for the artwork proof.');
      return;
    }

    const currentKey = getSavedOwnerKey() || passkeyInput.trim() || 'rogue_admin_2025';
    setIsSubmitting(true);

    try {
      let finalDataUrl: string | undefined = undefined;

      if (imageFile) {
        if (imageFile.type === 'image/svg+xml') {
          finalDataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(imageFile);
          });
        } else {
          finalDataUrl = await compressImage(imageFile, 1600, 0.86);
        }
      }

      const projectId = formMode === 'edit-existing' && selectedProjectId 
        ? selectedProjectId 
        : `custom-${Date.now()}`;

      const itemData: Partial<ProjectItem> = {
        id: projectId,
        title: title.trim(),
        client: client.trim(),
        catalog,
        tag: catalog === 'graphics' ? tag : 'Mobile UI/UX & Splash System',
        year: year.trim() || new Date().getFullYear().toString(),
        technique: technique.trim() || (catalog === 'graphics' ? 'Screen Printing & Prepress Calibration' : 'Mobile Application Engineering'),
        materials: materials.trim() || 'High-Resolution Production Spec',
        volume: volume.trim() || 'Custom Production Batch',
        location: location.trim() || 'Kampala, Uganda',
        caption: caption.trim() || `${title.trim()} production proof`,
        description: description.trim() || `Production proof for ${client.trim()}. Authentic project work.`,
        img: !finalDataUrl && imagePreview ? imagePreview : undefined
      };

      const result = await uploadCustomArtwork(itemData, finalDataUrl, currentKey);

      setFormSuccess(`Artwork proof "${result.title}" successfully saved to Netlify Blobs storage!`);
      onUploadSuccess(result);

      if (formMode === 'new') {
        resetFields();
      }
      if (onClearEditProject) onClearEditProject();

      setTimeout(() => setFormSuccess(null), 6000);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setFormError(err.message || 'Failed to upload artwork to Netlify Blobs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------------------------------------------------------------------
  // STATE 1: LOCKED (Renders discreet unlock trigger & passkey prompt modal)
  // ---------------------------------------------------------------------------
  if (!isAdminUnlocked) {
    return (
      <>
        {/* Discreet Admin Portal Trigger in Catalog Controls */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 my-4">
          <div className="flex items-center gap-2.5 text-xs text-white/50">
            <Lock size={13} className="text-[#FF4D00]" />
            <span>Studio Owner Mode: Protected Netlify Blobs Catalog Storage</span>
          </div>

          <button
            onClick={() => setIsKeyPromptOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-[#FF4D00]/20 hover:border-[#FF4D00]/40 border border-white/10 text-white/80 hover:text-white text-xs font-semibold transition cursor-pointer"
            title="Enter Owner Key to manage catalog proofs (Shortcut: Ctrl+Shift+A)"
          >
            <KeyRound size={12} className="text-[#FF4D00]" />
            <span>Unlock Admin Form</span>
          </button>
        </div>

        {/* Modal: Passkey Entry */}
        {isKeyPromptOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-md rounded-3xl bg-[#121212] border border-white/15 p-6 sm:p-8 shadow-2xl">
              <button
                onClick={() => {
                  setIsKeyPromptOpen(false);
                  setKeyError(null);
                }}
                className="absolute top-5 right-5 p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#FF4D00]/15 border border-[#FF4D00]/30 flex items-center justify-center text-[#FF4D00]">
                  <KeyRound size={20} />
                </div>
                <div>
                  <h3 className="font-serif-display text-xl text-white">Studio Admin Authentication</h3>
                  <p className="text-xs text-white/60">Enter secret key to unlock Netlify Blobs storage</p>
                </div>
              </div>

              <form onSubmit={handleUnlockSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                    Owner Passkey (CATALOG_UPLOAD_KEY)
                  </label>
                  <input
                    type="password"
                    value={passkeyInput}
                    onChange={(e) => setPasskeyInput(e.target.value)}
                    placeholder="Enter owner secret key..."
                    autoFocus
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 focus:border-[#FF4D00] focus:ring-1 focus:ring-[#FF4D00] text-sm text-white placeholder-white/30 outline-none transition"
                  />
                  <p className="text-[11px] text-white/40 mt-1.5 flex items-center gap-1">
                    <span>Default staging key:</span>
                    <code className="text-[#FF4D00] bg-white/[0.04] px-1.5 py-0.5 rounded font-mono text-[10px]">rogue_admin_2025</code>
                  </p>
                </div>

                {keyError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{keyError}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsKeyPromptOpen(false);
                      setKeyError(null);
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white/60 hover:text-white transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isVerifyingKey || !passkeyInput.trim()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF4D00] hover:bg-[#ff5d1a] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#FF4D00]/25 transition hover:scale-[1.02] cursor-pointer"
                  >
                    {isVerifyingKey ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <Unlock size={14} />
                        <span>Unlock Catalog Form</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
  }

  // ---------------------------------------------------------------------------
  // STATE 2: UNLOCKED (Renders Full Hidden Admin Form inside Portfolio)
  // ---------------------------------------------------------------------------
  return (
    <div className="my-8 rounded-3xl border-2 border-[#FF4D00]/50 bg-gradient-to-b from-[#18181b] via-[#121214] to-[#0a0a0c] p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF4D00]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar: Status & Lock Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FF4D00]/20 border border-[#FF4D00]/40 flex items-center justify-center text-[#FF4D00] shadow-lg shadow-[#FF4D00]/20">
            <Unlock size={24} />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Studio Owner Mode Active • Netlify Blobs Connected
            </div>
            <h3 className="font-serif-display text-2xl text-white">
              Catalog Management &amp; Direct Image Upload Form
            </h3>
            <p className="text-xs text-white/60">
              Upload new production images or replace photos on existing projects directly to live storage.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={onRefresh}
            disabled={isLoadingStorage}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-semibold transition cursor-pointer"
            title="Sync with cloud storage"
          >
            <RefreshCw size={13} className={isLoadingStorage ? 'animate-spin text-[#FF4D00]' : ''} />
            <span>Sync</span>
          </button>

          <button
            onClick={handleLockAdmin}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-red-500/20 hover:border-red-500/40 border border-white/10 text-white/80 hover:text-red-300 text-xs font-semibold transition cursor-pointer"
            title="Lock admin session and hide form"
          >
            <Lock size={13} />
            <span>Lock Admin Mode</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher: New Artwork vs Replace Existing */}
      <div className="flex items-center gap-3 pt-6 pb-4">
        <button
          onClick={() => {
            setFormMode('new');
            resetFields();
            if (onClearEditProject) onClearEditProject();
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            formMode === 'new'
              ? 'bg-[#FF4D00] text-white shadow-lg shadow-[#FF4D00]/25'
              : 'bg-white/[0.05] text-white/60 hover:text-white border border-white/10'
          }`}
        >
          <Plus size={14} />
          <span>Upload New Project</span>
        </button>

        <button
          onClick={() => {
            setFormMode('edit-existing');
            if (allProjects.length > 0 && !selectedProjectId) {
              handleProjectSelect(allProjects[0].id);
            }
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            formMode === 'edit-existing'
              ? 'bg-[#FF4D00] text-white shadow-lg shadow-[#FF4D00]/25'
              : 'bg-white/[0.05] text-white/60 hover:text-white border border-white/10'
          }`}
        >
          <Edit3 size={14} />
          <span>Update Existing Project Photo / Title</span>
        </button>
      </div>

      {/* If in edit-existing mode, show Project Selector Dropdown */}
      {formMode === 'edit-existing' && (
        <div className="mb-6 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
          <label className="block text-xs font-bold text-[#FF4D00] uppercase tracking-wider mb-2">
            Select Existing Project to Update or Replace Photo:
          </label>
          <select
            value={selectedProjectId}
            onChange={(e) => handleProjectSelect(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#1e1e24] border border-white/15 text-white text-sm focus:border-[#FF4D00] outline-none transition"
          >
            <option value="">-- Choose a Project to Edit --</option>
            {allProjects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.client}) [{p.tag}]
              </option>
            ))}
          </select>
          <p className="text-[11px] text-white/50 mt-1.5">
            Select projects like "GSB High-Visibility Reflective Safety Vests" or "BUSSA Dinner Tickets" to upload your real photo and overwrite live storage.
          </p>
        </div>
      )}

      {/* Form Error / Success Alerts */}
      {formError && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-sm text-red-300">
          <AlertCircle size={18} className="shrink-0 text-red-400" />
          <span>{formError}</span>
        </div>
      )}

      {formSuccess && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-sm text-emerald-300">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
          <span>{formSuccess}</span>
        </div>
      )}

      {/* Main Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: Image Drag & Drop / Preview (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider">
              Project Artwork Image <span className="text-[#FF4D00]">*</span>
            </label>

            <div className="relative rounded-2xl border-2 border-dashed border-white/20 hover:border-[#FF4D00]/60 bg-white/[0.02] p-4 text-center transition group">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />

              {imagePreview ? (
                <div className="space-y-3">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center">
                    <img
                      src={imagePreview}
                      alt="Artwork Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span className="truncate max-w-[200px] text-[#FF4D00] font-medium">
                      {imageFile ? imageFile.name : 'Current Image Preview'}
                    </span>
                    <span className="text-white/40">Click to replace</span>
                  </div>
                </div>
              ) : (
                <div className="py-12 space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/40 group-hover:text-[#FF4D00] group-hover:scale-110 transition">
                    <UploadCloud size={28} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Click or drag image here</p>
                    <p className="text-xs text-white/40 mt-1">Supports JPEG, PNG, WebP, SVG (up to 20MB)</p>
                  </div>
                </div>
              )}
            </div>

            {imageSizeWarning && (
              <p className="text-[11px] text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
                {imageSizeWarning}
              </p>
            )}

            {/* Catalog Domain Selection */}
            <div>
              <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2">
                Catalog Domain
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCatalog('graphics')}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                    catalog === 'graphics'
                      ? 'bg-white text-black font-extrabold shadow'
                      : 'bg-white/[0.05] text-white/60 hover:text-white border border-white/10'
                  }`}
                >
                  Graphics &amp; Prepress
                </button>
                <button
                  type="button"
                  onClick={() => setCatalog('web-mobile')}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                    catalog === 'web-mobile'
                      ? 'bg-white text-black font-extrabold shadow'
                      : 'bg-white/[0.05] text-white/60 hover:text-white border border-white/10'
                  }`}
                >
                  Web &amp; Mobile
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Project Details (7 cols) */}
          <div className="md:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                  Project Title <span className="text-[#FF4D00]">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. GSB High-Visibility Reflective Safety Vests"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 focus:border-[#FF4D00] focus:ring-1 focus:ring-[#FF4D00] text-sm text-white placeholder-white/30 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                  Client / Brand <span className="text-[#FF4D00]">*</span>
                </label>
                <input
                  type="text"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="e.g. Gals Sports Betting Logistics"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 focus:border-[#FF4D00] text-sm text-white placeholder-white/30 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                  Production Tag / Category
                </label>
                <select
                  value={tag}
                  onChange={(e) => setTag(e.target.value as GraphicsCategory)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1a1a20] border border-white/10 focus:border-[#FF4D00] text-sm text-white outline-none transition"
                >
                  {GRAPHICS_TAGS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                  Production Year
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2025"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 focus:border-[#FF4D00] text-sm text-white outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                  Production Volume / Quantity
                </label>
                <input
                  type="text"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  placeholder="e.g. 450 High-Vis Vests"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 focus:border-[#FF4D00] text-sm text-white placeholder-white/30 outline-none transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                  Technique &amp; Equipment
                </label>
                <input
                  type="text"
                  value={technique}
                  onChange={(e) => setTechnique(e.target.value)}
                  placeholder="e.g. Thermal Transfer on High-Vis Mesh &amp; 3M Scotchlite Reflective Bonding"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 focus:border-[#FF4D00] text-sm text-white placeholder-white/30 outline-none transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                  Materials Used
                </label>
                <input
                  type="text"
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                  placeholder="e.g. Fluorescent Mesh Polyester, Retroreflective Micro-Prisms"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 focus:border-[#FF4D00] text-sm text-white placeholder-white/30 outline-none transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                  Short Caption
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. Safety reflectors with retroreflective striping and sponsor identification"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 focus:border-[#FF4D00] text-sm text-white placeholder-white/30 outline-none transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                  Technical Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Full production specifications, proof notes, and delivery details..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 focus:border-[#FF4D00] text-sm text-white placeholder-white/30 outline-none transition resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button & Confirmation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs text-white/50">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Encrypted owner key authenticated • Uploads are permanently stored in Netlify Blobs</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {formMode === 'new' && (
              <button
                type="button"
                onClick={resetFields}
                className="px-4 py-3 rounded-xl text-xs font-semibold text-white/60 hover:text-white transition cursor-pointer"
              >
                Clear
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#FF4D00] to-[#ff6a2b] hover:from-[#ff5d1a] hover:to-[#ff7b42] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider shadow-xl shadow-[#FF4D00]/25 transition hover:scale-[1.02] cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Uploading to Netlify Blobs...</span>
                </>
              ) : (
                <>
                  <UploadCloud size={16} />
                  <span>
                    {formMode === 'edit-existing' ? 'Update Project in Netlify Blobs' : 'Upload to Netlify Blobs'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
