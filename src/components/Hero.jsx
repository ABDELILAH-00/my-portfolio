import React from 'react';
import { Mail, Download, ArrowRight } from 'lucide-react';
import { GitHubIcon, LinkedInIcon } from './ui/Icons';
import TypewriterText from './ui/TypewriterText';

const Hero = () => {
  const [currentText, setCurrentText] = React.useState("");
  const fullText = "Développeur Full Stack";

  const socials = [
    {
      icon: <LinkedInIcon size={20} />,
      href: "https://www.linkedin.com/in/abdelilah-amalas-085364339/",
      label: "LinkedIn",
      hoverClass: "hover:bg-[#0A66C2] hover:text-white"
    },
    {
      icon: <GitHubIcon size={20} />,
      href: "https://github.com/ABDELILAH-00",
      label: "GitHub",
      hoverClass: "hover:bg-black hover:text-white"
    },
    {
      icon: <Mail size={20} />,
      href: "mailto:abdelillahamalas@gmail.com",
      label: "Email",
      hoverClass: "hover:bg-[#EA4335] hover:text-white"
    },
  ];

  React.useEffect(() => {
    if (currentText.length < fullText.length) {
      const timer = setTimeout(() => {
        setCurrentText(fullText.slice(0, currentText.length + 1));
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [currentText]);

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pt-20 bg-[#F3F4F6] z-0">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 md:gap-16 px-6 md:grid-cols-12 relative z-10 pointer-events-none">

        {/* Left Typography */}
        <div className="order-2 flex flex-col items-center text-center md:items-start md:text-left md:order-1 md:col-span-8 pointer-events-auto">

          <h1 className="mb-3 text-2xl font-black tracking-tight sm:text-3xl md:text-5xl leading-[1.1] flex flex-wrap items-center justify-center md:justify-start min-h-[1.1em]">
            <span className="text-[#4093DB]">Je suis </span>
            <span className="text-[#000000] ml-2 flex items-center">
              {currentText}
              <span className="inline-block w-[3px] h-[0.8em] bg-[#4093DB] ml-1 animate-pulse" />
            </span>
          </h1>

          <p className="mb-12 max-w-2xl text-base leading-relaxed text-slate-500 md:text-lg font-medium">
            Spécialisé en React, JavaScript, TypeScript, PHP et Laravel, je transforme des idées en solutions digitales professionnelles.
          </p>

          <div className="mb-16 flex flex-wrap items-center justify-center md:justify-start gap-6">
            <a
              href="#projects"
              className="text-[11px] font-extrabold uppercase tracking-widest text-slate-900/80 hover:text-[#4093DB] transition-all relative group flex items-center gap-2 cursor-pointer"
            >
              <ArrowRight size={14} strokeWidth={2.5} />
              <span>Voir les projets</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-[#4093DB]"></span>
            </a>
            <button
              onClick={async () => {
                window.open('/cv.pdf', '_blank');
              }}
              className="text-[11px] font-extrabold uppercase tracking-widest text-slate-900/80 hover:text-[#4093DB] transition-all relative group flex items-center gap-2 cursor-pointer"
            >
              <Download size={14} strokeWidth={2.5} />
              <span>Télécharger le CV</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-[#4093DB]"></span>
            </button>
          </div>

          <div className="flex items-center gap-6 mt-2">
            {socials.map((social, i) => (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-[#4093DB] transition-colors duration-300"
                aria-label={social.label}
              >
                {React.cloneElement(social.icon, { size: 22 })}
              </a>
            ))}
          </div>
        </div>

        {/* Right Headshot - COMPLETELY STATIC AS REQUESTED */}
        <div className="order-1 mt-6 flex flex-col items-center justify-center md:order-2 md:col-span-4 md:mt-0 pointer-events-auto">
          <div className="h-64 w-64 md:h-80 md:w-80 rounded-full border-4 border-slate-100 overflow-hidden bg-slate-50">
            <img
              src="/profile.jpeg"
              alt="Profile"
              className="h-full w-full object-cover"
              decoding="async"
              fetchPriority="high"
            />
          </div>
        </div>

      </div>

      {/* Scroll Down Button - Positioned over photo on Mobile, centered on Desktop */}
      <div className="absolute top-[280px] right-8 md:top-auto md:bottom-10 md:left-1/2 md:-translate-x-1/2 flex justify-center z-20">
        <button
          onClick={() => {
            const target = document.documentElement.scrollHeight;
            const start = window.scrollY;
            const duration = 6000;
            let startTime = null;

            const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

            const step = (time) => {
              if (!startTime) startTime = time;
              const progress = Math.min((time - startTime) / duration, 1);
              window.scrollTo(0, start + (target - start) * ease(progress));
              if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          }}
          className="w-11 h-11 rounded-full bg-transparent border border-[#4093DB]/40 flex items-center justify-center text-[#4093DB] hover:bg-[#4093DB] hover:text-white transition-all cursor-pointer animate-float"
          aria-label="Scroll down to services"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
      `}</style>
    </section >
  );
};

export default Hero;
