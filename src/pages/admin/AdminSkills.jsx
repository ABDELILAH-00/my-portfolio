import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { Trash2, Plus, GripVertical, Loader2 } from 'lucide-react';
import Toast from '../../components/ui/Toast';
import ConfirmModal from '../../components/ui/ConfirmModal';

const AdminSkills = () => {
  const queryClient = useQueryClient();
  const [newSkill, setNewSkill] = useState({ name: '', icon_path: '', category: 'Main Tech' });
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, skillId: null, skillName: '' });

  const { data: skills = [], isLoading } = useQuery({
    queryKey: ['admin-skills'],
    queryFn: async () => (await api.get('/admin/skills')).data,
    staleTime: 0,
    refetchOnMount: true,
  });

  const addMutation = useMutation({
    mutationFn: async (data) => await api.post('/admin/skills', data),
    onMutate: async (newSkillData) => {
      await queryClient.cancelQueries({ queryKey: ['admin-skills'] });
      await queryClient.cancelQueries({ queryKey: ['skills-public'] });
      
      const prevAdmin = queryClient.getQueryData(['admin-skills']);
      const prevPublic = queryClient.getQueryData(['skills-public']);
      
      const optimisticId = `temp-${Date.now()}`;
      const optimisticSkill = { id: optimisticId, ...newSkillData };
      
      queryClient.setQueryData(['admin-skills'], old => old ? [...old, optimisticSkill] : [optimisticSkill]);
      queryClient.setQueryData(['skills-public'], old => old ? [...old, optimisticSkill] : [optimisticSkill]);
      
      setNewSkill({ name: '', icon_path: '', category: 'Main Tech' });
      
      return { prevAdmin, prevPublic, optimisticId };
    },
    onSuccess: (result, variables, context) => {
      const realSkill = result.data;
      if (context?.optimisticId) {
        queryClient.setQueryData(['admin-skills'], old => old ? old.map(s => s.id === context.optimisticId ? realSkill : s) : []);
        queryClient.setQueryData(['skills-public'], old => old ? old.map(s => s.id === context.optimisticId ? realSkill : s) : []);
      }

      queryClient.invalidateQueries({ queryKey: ['dashboard-stats-main'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats-topbar'] });
      setToast({ message: 'Succès', type: 'success' });
    },
    onError: (err, newSkillData, context) => {
      setToast({ message: err.response?.data?.message || 'Erreur', type: 'error' });
      if (context?.prevAdmin) queryClient.setQueryData(['admin-skills'], context.prevAdmin);
      if (context?.prevPublic) queryClient.setQueryData(['skills-public'], context.prevPublic);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
      queryClient.invalidateQueries({ queryKey: ['skills-public'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await api.delete(`/admin/skills/${id}`),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ['admin-skills'] });
      await queryClient.cancelQueries({ queryKey: ['skills-public'] });
      
      const prevAdmin = queryClient.getQueryData(['admin-skills']);
      const prevPublic = queryClient.getQueryData(['skills-public']);
      
      queryClient.setQueryData(['admin-skills'], old => old ? old.filter(s => s.id !== deletedId) : []);
      queryClient.setQueryData(['skills-public'], old => old ? old.filter(s => s.id !== deletedId) : []);
      
      setDeleteModal({ isOpen: false, skillId: null, skillName: '' });
      return { prevAdmin, prevPublic };
    },
    onSuccess: () => {
      setToast({ message: 'Supprimé', type: 'success' });
    },
    onError: (err, id, context) => {
      setToast({ message: 'Erreur lors de la suppression de la compétence', type: 'error' });
      if (context?.prevAdmin) queryClient.setQueryData(['admin-skills'], context.prevAdmin);
      if (context?.prevPublic) queryClient.setQueryData(['skills-public'], context.prevPublic);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
      queryClient.invalidateQueries({ queryKey: ['skills-public'] });
    }
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newSkill.name || !newSkill.icon_path || !newSkill.category) {
      setToast({ message: 'Champs requis', type: 'error' });
      return;
    }
    addMutation.mutate(newSkill);
  };

  return (
    <div className="space-y-6 relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Arsenal Technique</h1>
          <p className="text-sm text-slate-500 mt-1">Gérez et catégorisez vos compétences clés</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Form */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm h-fit">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-900">Ajouter une compétence</h3>
            <a 
              href="https://devicon.dev/" 
              target="_blank" 
              rel="noreferrer" 
              className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
            >
              DevIcon Atlas
            </a>
          </div>
          
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Nom de la compétence</label>
              <input
                type="text"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                placeholder="ex. React"
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Chemin DevIcon</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newSkill.icon_path}
                  onChange={(e) => setNewSkill({ ...newSkill, icon_path: e.target.value })}
                  placeholder="ex. react/react-original.svg"
                  className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                  required
                />
                <div className="w-10 h-10 border border-slate-200 rounded-md flex items-center justify-center shrink-0 bg-slate-50">
                  {newSkill.icon_path ? (
                    <img
                      key={newSkill.icon_path}
                      src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${newSkill.icon_path}`}
                      alt="Preview"
                      className="w-6 h-6 object-contain p-0.5 group-hover:scale-110 transition-transform"
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                  ) : (
                    <Plus size={16} className="text-slate-400" />
                  )}
                </div>
              </div>
            </div>
            <div className="pt-4">
              <button
                type="submit"
                disabled={addMutation.isPending}
                className="w-full bg-blue-600 text-white text-sm font-medium py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {addMutation.isPending ? (
                   <>
                     <Loader2 size={16} className="animate-spin" />
                     <span>Enregistrement...</span>
                   </>
                ) : (
                   <>
                     <Plus size={16} />
                     <span>Ajouter la compétence</span>
                   </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Skills List */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">Inventaire des compétences</h3>
            </div>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-slate-500">Chargement des compétences...</div>
          ) : skills.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center gap-4">
               <p className="text-sm text-slate-500">Aucune compétence enregistrée</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {skills.map((skill) => (
                <div key={skill.id || skill.name} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <GripVertical size={16} className="text-slate-300 cursor-grab" />
                    <div className="w-8 h-8 flex items-center justify-center">
                      <img
                        src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${skill.icon_path}`}
                        alt={skill.name}
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-900">{skill.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, skillId: skill.id, skillName: skill.name })}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Supprimer la compétence"
        message={`Êtes-vous sûr de vouloir supprimer "${deleteModal.skillName}" ?`}
        onConfirm={() => deleteMutation.mutate(deleteModal.skillId)}
        onCancel={() => setDeleteModal({ isOpen: false, skillId: null, skillName: '' })}
      />
    </div>
  );
};

export default AdminSkills;
