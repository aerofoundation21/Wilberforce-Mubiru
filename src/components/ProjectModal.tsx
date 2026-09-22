import React from 'react';
import { X, MessageCircle, Calendar, MapPin, Layers, Printer, Package, Shield, ExternalLink, Upload } from 'lucide-react';
import { ProjectItem } from '../types';
import { WHATSAPP_NUMBER } from '../data/projects';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onImageOverride?: (projectId: string, file: File) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onImageOverride }) => {
  if (!project) return null;

  // Pre-fill message for WhatsApp
  const whatsappText = encodeURIComponent(
    `Hello Wilberforce, I saw your project "${project.title}" (${project.tag} for ${project.client}) on your Rogue Ventures portfolio. I would like to inquire about a similar bulk order for my organization.`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="max-w-4xl w-full rounded-3xl overflow-hidden border border-white/15 bg-[#101010] shadow-2xl my-auto text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Image Preview Banner */}
        <div className="relative bg-black flex items-center justify-center max-h-[58vh] overflow-hidden border-b border-white/10 group">
          <img
            src={project.img}
            alt={project.title}
            className="w-full h-auto max-h-[58vh] object-contain mx-auto"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/70 hover:bg-white hover:text-black text-white border border-white/20 grid place-items-center font-bold text-sm transition-all"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
          
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#FF4D00] text-black text-xs font-bold uppercase tracking-wider shadow-lg">
              {project.tag}
            </span>
            {onImageOverride && (
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 hover:bg-white hover:text-black text-white/90 text-xs font-semibold border border-white/20 backdrop-blur-md transition shadow-lg">
                <Upload size={13} />
                <span>Upload Original Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onImageOverride(project.id, file);
                    }
                  }}
                />
              </label>
            )}
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase font-semibold tracking-wider text-white/50">
                Client: {project.client}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
                {project.title}
              </h2>
              <p className="text-sm text-[#FF4D00] font-medium mt-1">
                {project.caption}
              </p>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF4D00] text-white px-6 h-11 text-xs font-bold hover:bg-[#ff611e] transition-all shrink-0 shadow-[0_0_20px_rgba(255,77,0,0.3)]"
            >
              <MessageCircle size={16} />
              <span>Inquire via WhatsApp</span>
            </a>
          </div>

          {/* Deep case study description */}
          <div className="mt-6 pt-6 border-t border-white/[0.08]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
              Project Case Study & Production Notes
            </h4>
            <p className="text-sm sm:text-base leading-relaxed text-white/80">
              {project.description}
            </p>
          </div>

          {/* Technical Specifications Grid */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {project.materials && (
              <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-3.5">
                <div className="flex items-center gap-1.5 text-xs text-[#FF4D00] font-semibold mb-1">
                  <Layers size={14} />
                  <span>Materials</span>
                </div>
                <div className="text-xs text-white/80 font-medium leading-snug">
                  {project.materials}
                </div>
              </div>
            )}

            {project.technique && (
              <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-3.5">
                <div className="flex items-center gap-1.5 text-xs text-[#FF4D00] font-semibold mb-1">
                  <Printer size={14} />
                  <span>Technique</span>
                </div>
                <div className="text-xs text-white/80 font-medium leading-snug">
                  {project.technique}
                </div>
              </div>
            )}

            {project.volume && (
              <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-3.5">
                <div className="flex items-center gap-1.5 text-xs text-[#FF4D00] font-semibold mb-1">
                  <Package size={14} />
                  <span>Volume Run</span>
                </div>
                <div className="text-xs text-white/80 font-medium leading-snug">
                  {project.volume}
                </div>
              </div>
            )}

            {project.location && (
              <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-3.5">
                <div className="flex items-center gap-1.5 text-xs text-[#FF4D00] font-semibold mb-1">
                  <MapPin size={14} />
                  <span>Deployment</span>
                </div>
                <div className="text-xs text-white/80 font-medium leading-snug">
                  {project.location}
                </div>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/40">
            <span>Rogue Ventures • Production Archive</span>
            <button
              onClick={onClose}
              className="text-white hover:text-[#FF4D00] transition underline"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
