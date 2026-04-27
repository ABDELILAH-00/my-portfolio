import React, { useRef, useEffect } from 'react';
import { Monitor, Smartphone, Palette, Code, Zap, GitBranch } from 'lucide-react';
import { gsap } from '../lib/gsap';
import TypewriterText from './ui/TypewriterText';

const services = [
  {
    title: 'Développement Frontend',
    description: 'Interfaces modernes, rapides et responsives. Spécialités : React, JavaScript, TypeScript, Tailwind CSS, Bootstrap, UI/UX responsive.',
    icon: <Monitor size={24} />,
  },
  {
    title: 'Développement Backend',
    description: 'Conception d’API robustes, sécurisées et évolutives. Technologies : PHP, Laravel, MySQL, MongoDB, REST API, Architecture backend.',
    icon: <Code size={24} />,
  },
  {
    title: 'Développement Mobile',
    description: 'Applications mobiles modernes multiplateformes. Spécialités : React Native, Performance mobile, Responsive UX, Cross-platform.',
    icon: <Smartphone size={24} />,
  },
  {
    title: 'Clean Architecture',
    description: 'Code maintenable, scalable et propre. Principes : SOLID, Services Layer, Validation, Sécurité, Optimisation.',
    icon: <GitBranch size={24} />,
  },
  {
    title: 'Vibe Coding',
    description: 'Capacité à transformer rapidement une idée en produit concret avec vision produit, créativité technique et exécution rapide.',
    icon: <Zap size={24} />,
  },
];

const Services = () => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardsRef.current,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          stagger: 0.04,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
          },
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={containerRef} className="py-24 bg-[#F3F4F6] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-[#4093DB] text-4xl font-['Caveat',cursive] leading-none mb-3 -rotate-2 w-max mx-auto">
            <TypewriterText text="Ce que je fais" speed={100} />
          </h2>
          <h3 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-none mb-4">
            <TypewriterText text="Services & Expertise" speed={50} />
          </h3>
          <p className="text-slate-500 max-w-2xl mx-auto text-base">
            Des solutions complètes pour transformer vos idées en expériences digitales exceptionnelles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {services.map((service, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className="service-card group relative h-full flex flex-col rounded-[2rem] border border-black/[0.06] p-8 bg-white cursor-pointer overflow-hidden"
            >
              {/* Inclined diagonal fill */}
              <div className="service-card-bg" />

              {/* Content */}
              <div className="relative z-10 flex flex-col flex-1">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 shrink-0 bg-[#8BBDE0]/10 border border-[#8BBDE0]/15 transition-all duration-700 group-hover:bg-white/20 group-hover:border-white/25">
                  <div className="text-[#8BBDE0] transition-colors duration-700 group-hover:text-white">
                    {service.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 transition-colors duration-700 group-hover:text-white">
                  {service.title}
                </h3>
                <p className="text-slate-500 text-[14px] leading-relaxed flex-1 transition-colors duration-700 group-hover:text-white/80">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .service-card-bg {
          position: absolute;
          inset: 0;
          background: #81B2D4;
          border-radius: 2rem;
          transform: translateY(160%) skewY(-8deg);
          transform-origin: bottom left;
          transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
          z-index: 1;
        }
        .service-card:hover .service-card-bg {
          transform: translateY(0%) skewY(0deg);
        }
      `}</style>
    </section>
  );
};

export default Services;
