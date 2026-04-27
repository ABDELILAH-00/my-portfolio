import { useEffect } from 'react';
import { gsap } from '../lib/gsap';

const useTypewriter = (textRef, delay = 0) => {
  useEffect(() => {
    if (!textRef.current) return;
    
    const words = textRef.current.innerText.split(' ');
    textRef.current.innerHTML = '';
    
    words.forEach(word => {
      const span = document.createElement('span');
      span.innerText = word;
      span.style.opacity = 0;
      span.style.display = 'inline-block';
      span.style.transform = 'translateY(20px)';
      textRef.current.appendChild(span);
      // add space
      const space = document.createTextNode(' ');
      textRef.current.appendChild(space);
    });

    const spans = textRef.current.querySelectorAll('span');
    
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(spans, { opacity: 1, y: 0 });
      return;
    }

    let ctx = gsap.context(() => {
      gsap.to(spans, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.15,
        delay: delay,
        ease: "power2.out"
      });
    });

    return () => ctx.revert();
  }, [textRef, delay]);
};

export default useTypewriter;
