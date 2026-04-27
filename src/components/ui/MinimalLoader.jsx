import React from 'react';

const MinimalLoader = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 border-2 border-slate-100 rounded-full" />
        <div className="absolute inset-0 border-2 border-t-[#4093DB] rounded-full animate-spin" />
        <span className="text-xl font-['Caveat',cursive] font-black text-slate-800">A.</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Initialloading</p>
        <div className="w-24 h-[1px] bg-slate-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#4093DB] animate-loading-bar" />
        </div>
      </div>
      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-bar {
          animation: loading-bar 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default MinimalLoader;
