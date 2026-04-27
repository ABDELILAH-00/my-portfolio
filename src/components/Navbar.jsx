import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { gsap } from '../lib/gsap';

const navLinks = [
  { name: 'Accueil', href: '#home' },
  { name: 'Services', href: '#services' },
  { name: 'Projets', href: '#projects' },
  { name: 'Compétences', href: '#skills' },
  { name: 'À propos', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const linksRef = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(linksRef.current, { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(linksRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
    );
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      gsap.to(mobileMenuRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.4, ease: 'power2.out' });
      gsap.fromTo(mobileMenuRef.current.querySelectorAll('a'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power3.out', delay: 0.1 }
      );
    } else {
      gsap.to(mobileMenuRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.3, ease: 'power2.in' });
    }
  }, [mobileMenuOpen]);

  const scrollToSection = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      window.scrollTo({
        top: Math.max(0, target.offsetTop - 80),
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <header
        ref={navRef}
        className="bg-[#ffffff] fixed top-0 w-full z-[100] transition-all duration-300 ease-in-out backdrop-blur-md shadow-sm border-b border-black/5"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center">
          {/* Logo - Flex 1 to push menu to center */}
          <div className="flex-1">
            <a href="#home" onClick={(e) => scrollToSection(e, '#home')} className="text-4xl font-['Caveat',cursive] tracking-tighter transition-colors text-slate-900">
              A<span className="text-[#4093DB]">.</span>
            </a>
          </div>

          {/* Centered Menu */}
          <div className="hidden md:flex items-center gap-8 justify-center ">
            {navLinks.map((link, i) => (
              <a
                key={link.name}
                href={link.href}
                ref={el => linksRef.current[i] = el}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-[11px] font-extrabold transition-all relative group text-slate-900/80 hover:text-[#4093DB] uppercase tracking-widest"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-[#4093DB]"></span>
              </a>
            ))}
          </div>

          {/* Right Section - Flex 1 to balance the center menu */}
          <div className="flex-1 flex justify-end items-center gap-4">
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, '#contact')}
              className="hidden md:flex px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest bg-[#4093DB] text-white hover:bg-blue-600 shadow-sm transition-colors duration-200"
            >
              Me contacter
            </a>

            <button
              className="md:hidden focus:outline-none text-slate-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <div
        ref={mobileMenuRef}
        className="fixed inset-0 z-[90] w-full min-h-[100vh] bg-white/95 backdrop-blur-2xl md:hidden flex flex-col justify-center items-center opacity-0 pointer-events-none"
      >
        <div className="flex flex-col items-center gap-6 text-center -mt-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="text-lg font-extrabold text-slate-800 tracking-[0.2em] hover:text-[#4093DB] transition-colors uppercase w-max relative group"
            >
              {link.name}
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-[#4093DB]"></span>
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;
