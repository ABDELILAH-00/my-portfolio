import React from 'react'import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, type = 'danger' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300"
        onClick={onCancel}
      />

      {/* Modal Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full max-w-md relative z-10 animate-in zoom-in-95 fade-in duration-300 overflow-hidden">
        {/* Header Ribbon */}
        <div className={`h-1.5 w-full ${type === 'danger' ? 'bg-red-500' : 'bg-blue-500'}`} />

        <div className="p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
              <AlertTriangle size={20} />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight mb-2">
                {title}
              </h3>
              <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                {message}
              </p>
            </div>

            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 mt-8">
            <button
              onClick={onCancel}
              className="px-6 py-2.5 rounded-xl text-[12px] font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              className={`px-6 py-2.5 rounded-xl text-[12px] font-bold text-white shadow-lg transition-all active:scale-95 ${type === 'danger'
                  ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                  : 'bg-[#4093DB] hover:bg-blue-600 shadow-blue-500/20'
                }`}
            >
              {type === 'danger' ? 'Supprimer' : 'Confirmer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
