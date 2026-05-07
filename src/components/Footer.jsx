import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer id="footer" className="py-12 bg-transparent border-t border-black/5">
      <div className="max-w-7xl mx-auto px-6">

        {/* Scroll to top arrow */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => {
              const start = window.scrollY;
              const duration = 5000; // 5 seconds for a professional, smooth tour
              let startTime = null;

              // Sine easing: much smoother velocity curve than cubic, prevents middle-scroll lag
              const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

              const step = (time) => {
                if (!startTime) startTime = time;
                const progress = Math.min((time - startTime) / duration, 1);
                
                // Use scroll without causing layout thrashing
                window.scroll(0, start * (1 - easeInOutSine(progress)));
                
                if (progress < 1) {
                  requestAnimationFrame(step);
                }
              };
              requestAnimationFrame(step);
            }}
            className="w-11 h-11 rounded-full bg-transparent border border-[#4093DB]/40 flex items-center justify-center text-[#4093DB] hover:bg-[#4093DB] hover:text-white transition-all cursor-pointer animate-float"
            aria-label="Scroll to top"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">

          <div className="flex flex-col gap-2">
            <a href="#home" className="text-3xl font-['Caveat',cursive] text-slate-900">
              A<span className="text-[#4093DB]">.</span>
            </a>
            <p className="text-sm text-slate-500 font-medium">
              &copy; {year} Abdelilah Amalas. Tous droits réservés.
            </p>
          </div>


          <div className="flex items-center gap-8">
            <a href="#home" className="text-[11px] font-extrabold uppercase tracking-widest text-slate-900/80 hover:text-[#4093DB] transition-all relative group">
              Accueil
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-[#4093DB]"></span>
            </a>
            <a href="#projects" className="text-[11px] font-extrabold uppercase tracking-widest text-slate-900/80 hover:text-[#4093DB] transition-all relative group">
              Projets
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-[#4093DB]"></span>
            </a>
            <a href="#skills" className="text-[11px] font-extrabold uppercase tracking-widest text-slate-900/80 hover:text-[#4093DB] transition-all relative group">
              Compétences
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-[#4093DB]"></span>
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
