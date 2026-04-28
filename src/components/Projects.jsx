import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { projectsData } from '../data/master_data';
import ProjectCard from './ui/ProjectCard';

const fetchProjects = async () => {
  const { data } = await api.get('/projects');
  // Laravel returns the array directly or inside a data property depending on your resource collection
  return Array.isArray(data) ? data : data.data;
};

const fetchSkills = async () => {
  const { data } = await api.get('/skills');
  return Array.isArray(data) ? data : data.data;
};

// Local SVG icons to avoid lucide-react version issues
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="12" />
  </svg>
);

const EmptyIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    <path d="M8 10h4" /><path d="M10 8v4" />
  </svg>
);

const CATEGORIES = ['Tous', 'Full Stack', 'Frontend', 'Backend', 'Mobile'];

const Projects = () => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tous');
  const gridRef = useRef(null);

  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query to prevent constant re-rendering while typing
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: projects = projectsData, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 1000,
    initialData: projectsData,
    refetchInterval: 3000, // CHECK EVERY 3 SECONDS (REAL-TIME)
  });

  const displayProjects = projects || [];

  const filteredProjects = useMemo(() => {
    const normalizedQuery = debouncedQuery.trim().toLowerCase();
    
    return displayProjects.filter((p) => {
      if (!p) return false;
      // Search query filter
      const matchesQuery = !normalizedQuery || [
        p.title,
        p.description,
        Array.isArray(p.tech_stack) ? p.tech_stack.join(' ') : ''
      ].some(field => (field || '').toLowerCase().includes(normalizedQuery));

      // Category filter
      const matchesCategory = activeCategory === 'Tous' ||
        (p.category || '').toLowerCase() === activeCategory.toLowerCase();

      return matchesQuery && matchesCategory;
    });
  }, [displayProjects, debouncedQuery, activeCategory]);

  return (
    <section id="projects" className="py-24 bg-[#F3F4F6]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-[#4093DB] text-3xl sm:text-4xl md:text-5xl font-['Caveat',cursive] leading-none mb-2 -rotate-2 w-max">
            Sélection
          </h2>
          <h3 className="text-5xl sm:text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-none mb-10">
            Projets
          </h3>

          <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full lg:max-w-md group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <SearchIcon />
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un projet..."
                className="w-full bg-white border border-black/10 rounded-xl pl-12 pr-10 py-2.5 text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#4093DB] transition-all font-medium shadow-sm"
              />
              {query.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 bg-slate-100 rounded-full p-1 transition-colors"
                >
                  <CloseIcon />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`
                      whitespace-nowrap px-6 py-2 rounded-xl text-sm font-bold transition-all border meme-btn group
                      ${isActive
                        ? 'bg-[#4093DB] text-white border-[#4093DB]'
                        : 'bg-transparent border-[#4093DB] text-[#4093DB]'
                      }
                    `}
                  >
                    <span className="relative z-10">{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-slate-50 border border-black/5 rounded-2xl h-[400px]" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredProjects.length === 0 && (
          <div className="bg-white border border-black/5 border-dashed rounded-[2rem] py-20 text-center flex flex-col items-center justify-center shadow-sm">
            <div className="w-16 h-16 bg-blue-50 text-blue-400 rounded-2xl flex items-center justify-center mb-4">
              <EmptyIcon />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Aucun projet trouvé</h3>
            <p className="text-slate-500 mt-2 text-[15px] font-medium">Veuillez réessayer avec un autre filtre ou revenir plus tard.</p>
          </div>
        )}

        {/* Grid - Instant Visibility Perpetual Rendering */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {displayProjects.map((project) => {
            if (!project) return null;
            
            // Search query filter logic
            const normalizedQuery = debouncedQuery.trim().toLowerCase();
            const matchesQuery = !normalizedQuery || [
              project.title,
              project.description,
              Array.isArray(project.tech_stack) ? project.tech_stack.join(' ') : ''
            ].some(field => (field || '').toLowerCase().includes(normalizedQuery));

            // Category filter logic
            const matchesCategory = activeCategory === 'Tous' ||
              (project.category || '').toLowerCase() === activeCategory.toLowerCase();

            const isVisible = matchesQuery && matchesCategory;

            return (
              <div key={project.id} className={isVisible ? 'block' : 'hidden'}>
                <ProjectCard project={project} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;
