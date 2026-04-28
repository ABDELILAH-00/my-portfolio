import React, { useState, useEffect } from 'react';
import { getAssetUrl } from '../../lib/api';

// Using local SVG icons to avoid lucide-react version compatibility issues
const GitIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const ProjectCard = ({ project }) => {
  const [showAllTech, setShowAllTech] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  if (!project) return null;

  const displayTech = Array.isArray(project.tech_stack) ? project.tech_stack : [];
  const techToShow = showAllTech ? displayTech : displayTech.slice(0, 3);
  const extraTechCount = showAllTech ? 0 : Math.max(0, displayTech.length - 3);

  // Prioritize our smart helper to avoid incorrect server-generated URLs (like 127.0.0.1)
  const thumbnailUrl = getAssetUrl(project.thumbnail) || project.thumbnail_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop';

  return (
    <div className="flex flex-col h-full min-h-[320px] overflow-hidden rounded-xl border border-black/10 bg-white">
      {/* Thumbnail Container */}
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-slate-100">
        
        <img
          src={thumbnailUrl}
          alt={project.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />

        {/* Overlay Badges */}
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1 z-20">
          {techToShow.map((tech, i) => (
            <span
              key={i}
              className="rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-bold text-slate-800 border border-black/5"
            >
              {tech}
            </span>
          ))}
          {extraTechCount > 0 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowAllTech(true);
              }}
              className="rounded-full bg-[#4093DB] px-2 py-0.5 text-[9px] font-bold text-white shadow-sm"
            >
              +{extraTechCount}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#4093DB] mb-1.5 leading-none">
          {project.category || 'Développement'}
        </span>

        <h2 className="text-base font-black text-slate-900 mb-1.5 tracking-tight">
          {project.title}
        </h2>

        <p className="text-[13px] text-slate-500 font-medium leading-relaxed line-clamp-3 mb-3 flex-1">
          {project.description}
        </p>

        {/* Footer - Professional Links for SGG App and GitHub */}
        <div className="flex items-center gap-3 mt-auto pt-3 border-t border-slate-100">
          <a
            href={project.github_url || '#'}
            target={project.github_url ? "_blank" : "_self"}
            rel="noreferrer"
            className={`flex items-center gap-1.5 transition-colors ${project.github_url ? 'text-slate-400 hover:text-slate-900' : 'text-slate-200 cursor-not-allowed'}`}
            aria-label="Dépôt GitHub"
          >
            <GitIcon />
            <span className="text-[9px] font-extrabold uppercase tracking-widest">Code source</span>
          </a>
          
          <a
            href={project.live_url || '#'}
            target={project.live_url ? "_blank" : "_self"}
            rel="noreferrer"
            className={`flex items-center gap-1.5 transition-colors ${project.live_url ? 'text-slate-400 hover:text-[#4093DB]' : 'text-slate-200 cursor-not-allowed'}`}
            aria-label="Application SGG Congés"
          >
            <LinkIcon />
            <span className="text-[9px] font-extrabold uppercase tracking-widest">Voir en ligne</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProjectCard);
