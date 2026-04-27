import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const config = {
    success: {
      icon: <CheckCircle2 className="text-[#10B981]" size={18} />,
      bg: 'bg-white/80',
      border: 'border-emerald-100/50',
      shadow: 'shadow-[0_8px_30px_rgb(0,0,0,0.04)]',
      accent: 'bg-emerald-500'
    },
    error: {
      icon: <AlertCircle className="text-[#EF4444]" size={18} />,
      bg: 'bg-white/80',
      border: 'border-red-100/50',
      shadow: 'shadow-[0_8px_30px_rgb(239,68,68,0.05)]',
      accent: 'bg-red-500'
    }
  };

  const style = config[type] || config.success;

  return (
    <div className="fixed bottom-8 right-8 z-[100] animate-in fade-in slide-in-from-right-8 duration-500">
      <div className={`${style.bg} ${style.border} ${style.shadow} backdrop-blur-md border rounded-xl p-4 flex items-center gap-4 min-w-[300px] relative overflow-hidden group`}>
        {/* Top accent line */}
        <div className={`absolute top-0 left-0 w-full h-[2px] ${style.accent} opacity-20`} />
        
        <div className="flex-shrink-0">{style.icon}</div>
        
        <div className="flex-1">
          <p className="text-[13px] font-bold text-slate-900 tracking-tight leading-none mb-1">
            {type === 'success' ? 'Op\u00e9ration r\u00e9ussie' : 'Erreur'}
          </p>
          <p className="text-[11px] font-medium text-slate-500 leading-none">
            {message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
        >
          <X size={14} />
        </button>

        {/* Progress bar animation */}
        <div 
          className={`absolute bottom-0 left-0 h-[2px] ${style.accent} opacity-30 animate-toast-progress`} 
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>

      <style>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-toast-progress {
          animation-name: toast-progress;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
};

export default Toast;
