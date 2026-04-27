import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '../lib/api';
import { Send } from 'lucide-react';
import Toast from './ui/Toast';
import TypewriterText from './ui/TypewriterText';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'Demande Portfolio', message: '' });
  const [toast, setToast] = useState(null);

  const mutation = useMutation({
    mutationFn: (data) => api.post('/contact', data),
    onMutate: async (newData) => {
      // Save previous state for rollback
      const previousData = formData;
      // Optimistic feedback
      setToast({ message: 'Message envoyé avec succès !', type: 'success' });
      setFormData({ name: '', email: '', subject: 'Demande Portfolio', message: '' });
      return { previousData };
    },
    onError: (err, newData, context) => {
      // Revert optimistic update
      setFormData(context.previousData);
      setToast({ message: 'Erreur réseau. Veuillez réessayer plus tard.', type: 'error' });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <section id="contact" className="py-24 bg-[#F3F4F6] relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          <div className="lg:col-span-12 text-center mb-8">
            <h2 className="text-[#4093DB] text-4xl font-['Caveat',cursive] leading-none mb-3 -rotate-2 w-max mx-auto">
              <TypewriterText text="Me contacter" speed={100} />
            </h2>
            <h3 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-none mb-4">
              <TypewriterText text="Construisons quelque chose" speed={50} />
              <br />
              <TypewriterText text="d'extraordinaire." delay={1000} speed={50} />
            </h3>
          </div>

          <div className="lg:col-span-8 lg:col-start-3">
            <form onSubmit={handleSubmit} className="bg-white border border-black/5 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#4093DB] ml-1">Nom complet</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Votre nom"
                    className="w-full bg-slate-50 border border-black/5 rounded-2xl px-6 py-4 text-slate-900 outline-none focus:border-[#4093DB] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#4093DB] ml-1">Adresse e-mail</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nom@email.com"
                    className="w-full bg-slate-50 border border-black/5 rounded-2xl px-6 py-4 text-slate-900 outline-none focus:border-[#4093DB] transition-all"
                  />
                </div>
              </div>

                <input
                  type="text"
                  name="user_note_id"
                  value={formData.user_note_id || ''}
                  onChange={(e) => setFormData({ ...formData, user_note_id: e.target.value })}
                  style={{ display: 'none' }}
                  tabIndex="-1"
                  autoComplete="off"
                />

                <div className="space-y-2 mb-8">
                  <label className="text-[11px] font-extrabold uppercase tracking-widest text-[#4093DB] ml-1">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Décrivez votre projet..."
                    className="w-full bg-slate-50 border border-black/5 rounded-2xl px-6 py-4 text-slate-900 outline-none focus:border-[#4093DB] transition-all resize-none"
                  />
                </div>

              <div className="mt-6 flex items-center gap-4">
                <button
                  type="submit"
                  className="w-full md:w-max px-10 py-3 bg-[#4093DB] text-white rounded-lg font-bold text-xs uppercase tracking-widest transition-colors hover:bg-blue-600 flex items-center justify-center gap-2"
                >
                  Envoyer le message
                  <Send size={16} />
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
