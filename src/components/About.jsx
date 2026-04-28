import React, { useRef, useEffect, useMemo } from 'react';
import { Briefcase, Award, Users, Cpu } from 'lucide-react';
import { gsap } from '../lib/gsap';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import TypewriterText from './ui/TypewriterText';
import { skillsData, projectsData } from '../data/master_data';

const About = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  // INSTANT DATA: Using baked-in data for 0ms load time
  const { data: projects = projectsData } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data } = await api.get('/projects');
      return Array.isArray(data) ? data : data.data;
    },
    staleTime: 1000,
    initialData: projectsData,
    refetchInterval: 3000
  });

  const { data: skills = skillsData } = useQuery({
    queryKey: ['skills-public'],
    queryFn: async () => {
      const { data } = await api.get('/skills');
      return Array.isArray(data) ? data : data.data;
    },
    staleTime: 1000,
    initialData: skillsData,
    refetchInterval: 3000
  });

  const dynamicStats = useMemo(() => {
    return [
      {
        label: 'Formation',
        value: '2ème année — OFPPT',
        icon: <Briefcase size={24} />,
        description: 'Développement Digital, Option Full Stack.'
      },
      {
        label: 'Expérience',
        value: 'Stage professionnel',
        icon: <Award size={24} />,
        description: 'Secrétariat Général du Gouvernement — Royaume du Maroc. Du 01/03/2026 au 31/03/2026. Développement d’un système de gestion des congés (SGG Congés) avec React, Laravel et MySQL.'
      },
      {
        label: 'Compétences',
        value: 'Technologies clés',
        icon: <Cpu size={24} />,
        description: 'React, JavaScript, TypeScript, PHP, Laravel, MySQL, MongoDB, Git / GitHub.'
      },
      {
        label: 'Objectif',
        value: 'Vision professionnelle',
        icon: <Users size={24} />,
        description: 'Créer des applications web professionnelles, performantes et utiles, avec une architecture propre et une excellente expérience utilisateur.'
      },
    ];
  }, []);

  // Counter Component for Numbers
  const StatValue = ({ target, suffix }) => {
    const [count, setCount] = React.useState(0);
    const countRef = useRef(null);

    useEffect(() => {
      const ctx = gsap.context(() => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 2, // Perfected speed
          ease: 'power2.out',
          scrollTrigger: {
            trigger: countRef.current,
            start: 'top 95%',
            toggleActions: 'play none none none'
          },
          onUpdate: function () {
            setCount(Math.floor(this.targets()[0].val));
          }
        });
      }, countRef);
      return () => ctx.revert();
    }, [target]);

    return (
      <span ref={countRef}>
        {count}{suffix}
      </span>
    );
  };

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
            trigger: sectionRef.current,
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [dynamicStats]);

  return (
    <section id="about" ref={sectionRef} className="py-24 bg-[#F3F4F6] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-[#4093DB] text-4xl font-['Caveat',cursive] leading-none mb-3 -rotate-2">
            <TypewriterText text="À propos" speed={100} />
          </h2>
          <h3 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-8">
            <TypewriterText text="Développer l'avenir," speed={40} />
            <br />
            <TypewriterText text="ligne par ligne." delay={1000} speed={40} />
          </h3>

          <div className="max-w-2xl space-y-6 text-slate-600 text-lg leading-relaxed mb-12">
            <p>
              Je suis un Développeur Full Stack dévoué, avec un œil attentif pour le design minimaliste et un engagement total envers l'écriture d'un code propre et maintenable.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {dynamicStats.map((stat, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className="about-card group relative h-full flex flex-col rounded-[2rem] border border-black/[0.06] p-8 bg-white cursor-pointer overflow-hidden"
            >
              {/* Inclined diagonal fill */}
              <div className="about-card-bg" />

              {/* Content */}
              <div className="relative z-10 flex flex-col flex-1">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 shrink-0 bg-[#8BBDE0]/10 border border-[#8BBDE0]/15 transition-all duration-700 group-hover:bg-white/20 group-hover:border-white/25">
                  <div className="text-[#8BBDE0] transition-colors duration-700 group-hover:text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-xl font-black text-slate-900 mb-0.5 transition-colors duration-700 group-hover:text-white">
                  {stat.value}
                </div>
                <div className="text-[10px] font-bold text-[#8BBDE0] uppercase tracking-[0.2em] mb-3 transition-colors duration-700 group-hover:text-white/70">
                  {stat.label}
                </div>
                <p className="text-slate-500 text-[13px] leading-relaxed flex-1 transition-colors duration-700 group-hover:text-white/80">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .about-card-bg {
          position: absolute;
          inset: 0;
          background: #81B2D4;
          border-radius: 2rem;
          transform: translateY(160%) skewY(-8deg);
          transform-origin: bottom left;
          transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
          z-index: 1;
        }
        .about-card:hover .about-card-bg {
          transform: translateY(0%) skewY(0deg);
        }
      `}</style>
    </section>
  );
};

export default About;
