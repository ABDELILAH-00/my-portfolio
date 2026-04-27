import React, { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';

const BackgroundEffect = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const blobs = containerRef.current.querySelectorAll('.blob');
    
    blobs.forEach((blob, i) => {
      gsap.to(blob, {
        x: 'random(-100, 100)%',
        y: 'random(-100, 100)%',
        duration: `random(10, 20)`,
        repeat: -1,
        yoyo: true,
        ease: 'none',
        delay: i * -2
      });

      gsap.to(blob, {
        scale: 'random(0.8, 1.5)',
        duration: `random(5, 10)`,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    });
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 -z-10 overflow-hidden pointer-events-none opacity-40">
      {/* Soft Blobs */}
      <div className="blob absolute top-[10%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-blue-400/20 blur-[100px]" />
      <div className="blob absolute top-[50%] left-[60%] w-[35vw] h-[35vw] rounded-full bg-cyan-400/20 blur-[100px]" />
      <div className="blob absolute bottom-[10%] left-[10%] w-[45vw] h-[45vw] rounded-full bg-indigo-400/20 blur-[100px]" />
      <div className="blob absolute top-[20%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-sky-400/20 blur-[100px]" />

      {/* Noise overlay for premium feel */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
    </div>
  );
};

export default BackgroundEffect;
