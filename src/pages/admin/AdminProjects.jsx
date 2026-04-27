import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { getAssetUrl } from '../../lib/api';
import Toast from '../../components/ui/Toast';
import ConfirmModal from '../../components/ui/ConfirmModal';

const AdminProjects = () => {
  const queryClient = useQueryClient();
  const rowsRef = useRef([]);
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, projectId: null, projectName: '' });

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => (await api.get('/admin/projects')).data,
    staleTime: 0,
    refetchOnMount: true,
  });

  // Removed GSAP animations

  const deleteMutation = useMutation({
    mutationFn: async (id) => await api.delete(`/admin/projects/${id}`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['admin-projects'] });
      await queryClient.cancelQueries({ queryKey: ['projects'] });

      const prevAdmin = queryClient.getQueryData(['admin-projects']);
      const prevPublic = queryClient.getQueryData(['projects']);

      queryClient.setQueryData(['admin-projects'], old => old ? old.filter(p => p.id !== id) : []);
      queryClient.setQueryData(['projects'], old => old ? old.filter(p => p.id !== id) : []);

      setDeleteModal({ isOpen: false, projectId: null, projectName: '' });
      return { prevAdmin, prevPublic };
    },
    onSuccess: () => {
      setToast({ message: 'Supprimé avec succès', type: 'success' });
    },
    onError: (err, id, context) => {
      setToast({ message: 'Erreur lors de la suppression du projet', type: 'error' });
      if (context?.prevAdmin) queryClient.setQueryData(['admin-projects'], context.prevAdmin);
      if (context?.prevPublic) queryClient.setQueryData(['projects'], context.prevPublic);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats-main'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats-topbar'] });
    }
  });

  return (
    <div className="space-y-6 relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projets</h1>
          <p className="text-sm text-slate-500 mt-1">Gérez vos projets portfolio</p>
        </div>
        <Link
          to="/admin/projects/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Ajouter un projet
        </Link>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-slate-500 flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-blue-600" size={24} />
          <span className="text-sm font-medium">Chargement des projets...</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
          <p className="text-sm text-slate-500 font-medium">Aucun projet trouvé. Commencez par ajouter votre premier chef-d'œuvre !</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Mobile/Tablet Card Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                    {project.thumbnail ? (
                      <img src={project.thumbnail_url || (typeof getAssetUrl === 'function' ? getAssetUrl(project.thumbnail) : project.thumbnail)} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400 font-bold">PDF</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{project.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium italic">{project.category || 'Non catégorisé'}</p>
                    <div className="mt-2">
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                        project.published ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {project.published ? 'Public' : 'Privé'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors" title="View Live">
                        <ExternalLink size={18} />
                      </a>
                    )}
                    <Link to={`/admin/projects/${project.id}`} className="text-slate-400 hover:text-blue-600 transition-colors" title="Edit">
                      <Edit2 size={18} />
                    </Link>
                  </div>
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, projectId: project.id, projectName: project.title })}
                    className="text-slate-400 hover:text-red-600 transition-colors flex items-center gap-1.5 text-xs font-bold"
                  >
                    <Trash2 size={18} />
                    <span className="hidden sm:inline">Supprimer</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden lg:block bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Détails du projet</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Catégorie</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Visibilité</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-sm">
                          {project.thumbnail ? (
                            <img src={project.thumbnail_url || (typeof getAssetUrl === 'function' ? getAssetUrl(project.thumbnail) : project.thumbnail)} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">IMG</div>
                          )}
                        </div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{project.title}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-500">{project.category || 'Sans titre'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${
                        project.published ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {project.published ? 'Publié' : 'Masqué'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        {project.live_url && (
                          <a href={project.live_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-600 p-1.5 hover:bg-blue-50 rounded-lg transition-all" title="View Live">
                            <ExternalLink size={17} />
                          </a>
                        )}
                        <Link to={`/admin/projects/${project.id}`} className="text-slate-400 hover:text-blue-600 p-1.5 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                          <Edit2 size={17} />
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, projectId: project.id, projectName: project.title })}
                          className="text-slate-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Supprimer le projet"
        message={`Êtes-vous sûr de vouloir supprimer "${deleteModal.projectName}" ? Cette action est irréversible.`}
        onConfirm={() => deleteMutation.mutate(deleteModal.projectId)}
        onCancel={() => setDeleteModal({ isOpen: false, projectId: null, projectName: '' })}
      />
    </div>
  );
};

export default AdminProjects;
