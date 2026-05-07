import React, { useEffect, useRef } from 'react';

const GlowBackground = () => {
  const containerRef = useRef(null);
  const cursorOrbRef = useRef(null);
  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);
  const dot1Ref = useRef(null);
  const dot2Ref = useRef(null);

  useEffect(() => {
    // Disable heavy animations on mobile devices to prevent lag
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    let animationFrameId;
    let time = 0;

    // Smooth cursor tracking variables
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY + window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      time += 0.005;

      // 1. Smoothly move the center orb towards the mouse
      currentX += (mouseX - currentX) * 0.05;
      currentY += (mouseY - currentY) * 0.05;

      if (cursorOrbRef.current) {
        cursorOrbRef.current.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
      }

      // 2. Gently float the top right blob
      if (blob1Ref.current) {
        const x = Math.sin(time * 0.5) * 100;
        const y = Math.cos(time * 0.4) * 80;
        blob1Ref.current.style.transform = `translate(${x}px, ${y}px)`;
      }

      // 3. Gently float the bottom left blob (inverse)
      if (blob2Ref.current) {
        const x = Math.sin(time * 0.6 + Math.PI) * 90;
        const y = Math.cos(time * 0.3 + Math.PI) * 110;
        blob2Ref.current.style.transform = `translate(${x}px, ${y}px)`;
      }

      // 4. Float the tiny solid dots
      if (dot1Ref.current) {
        const dot1Y = Math.sin(time * 1.2) * 15;
        dot1Ref.current.style.transform = `translateY(${dot1Y}px)`;
      }
      
      if (dot2Ref.current) {
        const dot2Y = Math.cos(time * 1.5) * 15;
        dot2Ref.current.style.transform = `translateY(${dot2Y}px)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 w-[100vw] h-[100vh] pointer-events-none overflow-hidden" 
      style={{ zIndex: 0 }}
    >
      {/* 
        The ambient aesthetic matching the provided image: 
        Soft, ultra-blurred orbs in the background. 
      */}

      {/* Center Interactive Orb (Warm Pink/Peach) */}
      <div 
        ref={cursorOrbRef}
        className="absolute top-0 left-0 rounded-full md:mix-blend-multiply opacity-30 md:opacity-50 blur-[30px] md:blur-[80px]"
        style={{ 
          width: '600px', 
          height: '600px', 
          background: 'radial-gradient(circle, rgba(255,182,193,0.8) 0%, rgba(255,182,193,0) 70%)',
          willChange: 'transform'
        }}
      />

      {/* Top Right Static/Floating Orb (Soft Lavender/Purple) */}
      <div 
        className="absolute top-[-10%] right-[-5%] rounded-full md:mix-blend-multiply opacity-30 md:opacity-60 blur-[30px] md:blur-[90px]"
        style={{ 
          width: '700px', 
          height: '700px', 
          background: 'radial-gradient(circle, rgba(216,180,254,0.6) 0%, rgba(216,180,254,0) 70%)',
        }}
      >
        <div ref={blob1Ref} className="w-full h-full" />
      </div>

      {/* Bottom Left Static/Floating Orb (Soft Teal/Cyan) */}
      <div 
        className="absolute bottom-[-10%] left-[-10%] rounded-full md:mix-blend-multiply opacity-30 md:opacity-50 blur-[30px] md:blur-[90px]"
        style={{ 
          width: '600px', 
          height: '600px', 
          background: 'radial-gradient(circle, rgba(153,246,228,0.6) 0%, rgba(153,246,228,0) 70%)',
        }}
      >
        <div ref={blob2Ref} className="w-full h-full" />
      </div>

      {/* Tiny Solid Dots from the design benchmark */}
      <div 
        ref={dot1Ref}
        className="absolute top-[15%] left-[5%] w-3 h-3 bg-[#8fb6f5] rounded-full opacity-80 shadow-sm"
      />
      <div 
        ref={dot2Ref}
        className="absolute bottom-[20%] left-[8%] w-2 h-2 bg-[#81e6d9] rounded-full opacity-80 shadow-sm"
      />
    </div>
  );
};

export default React.memo(GlowBackground);
