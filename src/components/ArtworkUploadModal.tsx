import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  KeyRound,
  FileCheck
} from 'lucide-react';
import { ProjectItem, GraphicsCategory } from '../types';
import { 
  compressImage, 
  uploadCustomArtwork, 
  getSavedOwnerKey, 
  saveOwnerKey 
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

interface ArtworkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (item: ProjectItem) => void;
}

export const ArtworkUploadModal: React.FC<ArtworkUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess
}) => {
  const [ownerKey, setOwnerKey] = useState<string>('');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [rememberKey, setRememberKey] = useState<boolean>(true);

  // Form Fields
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
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

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const saved = getSavedOwnerKey();
      if (saved) {
        setOwnerKey(saved);
      } else {
        // Pre-fill default dev staging key for smooth testing
        setOwnerKey('rogue_admin_2025');
      }
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Please choose a valid image file (JPEG, PNG, WebP, or SVG).');
      return;
    }

    // Size check
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('File exceeds 15MB limit. Please choose a smaller image.');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setImageSizeWarning(`Image is ${(file.size / (1024 * 1024)).toFixed(1)}MB — will be auto-optimized for fast web delivery.`);
    } else {
      setImageSizeWarning(null);
    }

    setImageFile(file);
    setErrorMessage(null);

    // Instant local preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!ownerKey.trim()) {
      setErrorMessage('Owner passkey is required to publish live catalog proofs.');
      return;
    }

    if (!title.trim() || !client.trim()) {
      setErrorMessage('Title and Client name are required.');
      return;
    }

    if (!imageFile && !imagePreview) {
      setErrorMessage('Please upload an authentic proof image.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (rememberKey) {
        saveOwnerKey(ownerKey);
      }

      // Compress/optimize image for web delivery
      let compressedDataUrl = '';
      if (imageFile) {
        compressedDataUrl = await compressImage(imageFile, 1600, 0.85);
      }

      const itemPayload: Partial<ProjectItem> = {
        title: title.trim(),
        client: client.trim(),
        tag,
        catalog: 'graphics',
        year: year.trim() || new Date().getFullYear().toString(),
        technique: technique.trim() || `${tag} & Production Calibration`,
        materials: materials.trim() || 'Textile / Commercial Media & Wash-Fast Inks',
        volume: volume.trim() || 'Authentic Production Batch',
        location: location.trim() || 'Kampala, Uganda',
        caption: caption.trim() || `${title} for ${client}`,
        description: description.trim() || `Production proof for ${client} executed with calibrated ${tag} prepress.`
      };

      const newItem = await uploadCustomArtwork(itemPayload, compressedDataUrl, ownerKey);

      setSuccessMessage('Artwork successfully published to the live server catalog!');
      onUploadSuccess(newItem);

      setTimeout(() => {
        onClose();
        // Reset form
        setTitle('');
        setClient('');
        setCaption('');
        setDescription('');
        setTechnique('');
        setMaterials('');
        setVolume('');
        setImageFile(null);
        setImagePreview(null);
        setSuccessMessage(null);
      }, 1200);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setErrorMessage(err.message || 'Failed to upload artwork. Please verify your owner passkey and network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-[#0f1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-8 z-10">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF4D00]/15 border border-[#FF4D00]/30 flex items-center justify-center text-[#FF4D00]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                Artist & Owner Studio Portal
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Live Persistence
                </span>
              </h3>
              <p className="text-xs text-white/50">
                Publish authentic production proofs to the live catalog (backed by Netlify Blobs & server storage)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Owner Key Section */}
          <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-medium text-white/80 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-[#FF4D00]" />
                Owner Passkey (CATALOG_UPLOAD_KEY)
              </label>
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="text-xs text-white/40 hover:text-white/80 transition-colors"
              >
                {showKey ? 'Hide Passkey' : 'Show Passkey'}
              </button>
            </div>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={ownerKey}
                onChange={(e) => setOwnerKey(e.target.value)}
                placeholder="Enter secret owner passkey (e.g. rogue_admin_2025)"
                className="w-full bg-[#181b24] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#FF4D00] transition-colors"
                required
              />
              <KeyRound className="w-4 h-4 text-white/30 absolute right-3.5 top-3" />
            </div>
            <div className="flex items-center justify-between text-[11px] text-white/40">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberKey}
                  onChange={(e) => setRememberKey(e.target.checked)}
                  className="rounded border-white/20 bg-white/5 text-[#FF4D00] focus:ring-0"
                />
                Remember key on this browser
              </label>
              <span>Default Staging: <code className="text-[#FF4D00]">rogue_admin_2025</code></span>
            </div>
          </div>

          {/* Error / Success Feedback */}
          {errorMessage && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Image Upload Dropzone */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-medium text-white/80 block">
              Artwork Proof Imagery *
            </label>
            <div className="relative border-2 border-dashed border-white/15 hover:border-[#FF4D00]/50 rounded-xl p-5 text-center transition-colors bg-white/[0.01]">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {imagePreview ? (
                <div className="flex flex-col sm:flex-row items-center gap-4 text-left">
                  <div className="w-24 h-24 rounded-lg overflow-hidden border border-white/20 bg-black/40 shrink-0">
                    <img 
                      src={imagePreview} 
                      alt="Proof Preview" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-white font-medium text-sm">
                      <FileCheck className="w-4 h-4 text-emerald-400" />
                      <span>{imageFile?.name || 'Selected proof'}</span>
                    </div>
                    <p className="text-xs text-white/50">
                      {(imageFile ? (imageFile.size / 1024).toFixed(1) + ' KB' : 'Image loaded')} • Click or drop another image to replace
                    </p>
                    {imageSizeWarning && (
                      <p className="text-[11px] text-amber-400/90">{imageSizeWarning}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-2 py-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-white/60">
                    <Upload className="w-6 h-6 text-[#FF4D00]" />
                  </div>
                  <div className="text-sm text-white/80">
                    <span className="font-semibold text-[#FF4D00]">Click to choose proof image</span> or drag and drop
                  </div>
                  <p className="text-xs text-white/40">
                    Supports high-resolution JPEG, PNG, WebP, or SVG vector proofs (up to 15MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-white/70">Project / Proof Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Makindye Division High-Visibility Vests"
                className="w-full bg-[#181b24] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#FF4D00]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-white/70">Client / Institution *</label>
              <input
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="e.g. Plan International / Makindye Council"
                className="w-full bg-[#181b24] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#FF4D00]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-white/70">Production Tag / Category</label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value as GraphicsCategory)}
                className="w-full bg-[#181b24] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF4D00]"
              >
                {GRAPHICS_TAGS.map((t) => (
                  <option key={t} value={t} className="bg-[#181b24] text-white">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-white/70">Production Year</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2025"
                className="w-full bg-[#181b24] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#FF4D00]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-white/70">Production Technique</label>
              <input
                type="text"
                value={technique}
                onChange={(e) => setTechnique(e.target.value)}
                placeholder="e.g. Rotary Screen Printing & Flash Curing"
                className="w-full bg-[#181b24] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#FF4D00]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-white/70">Materials</label>
              <input
                type="text"
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
                placeholder="e.g. 100% Bio-Washed Cotton & Plastisol Inks"
                className="w-full bg-[#181b24] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#FF4D00]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-white/70">Production Volume</label>
              <input
                type="text"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                placeholder="e.g. 1,500 Units Delivered"
                className="w-full bg-[#181b24] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#FF4D00]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-white/70">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Kampala, Uganda"
                className="w-full bg-[#181b24] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#FF4D00]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-white/70">Caption / Subheading</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. High-density textile screen printing on rotary carousel"
              className="w-full bg-[#181b24] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#FF4D00]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-white/70">Technical Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the prepress separation, screen mesh counts, heat press pressure/temperature calibration, and finishing..."
              className="w-full bg-[#181b24] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#FF4D00] resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-[#FF4D00] hover:bg-[#ff5d1a] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-[#FF4D00]/25 transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing Proof...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Publish to Live Catalog</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
