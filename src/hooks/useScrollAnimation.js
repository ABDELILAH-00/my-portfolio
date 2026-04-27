import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';

const useScrollAnimation = () => {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const elements = document.querySelectorAll('[data-animate="fade-up"]');
    
    let ctx = gsap.context(() => {
      elements.forEach((el) => {
        gsap.fromTo(el, 
          { opacity: 0, y: 40 },
          {
            opacity: 1, 
            y: 0, 
            duration: 2, 
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
            }
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);
};

export default useScrollAnimation;
