import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api, { getAssetUrl } from '../../lib/api';
import { ArrowLeft, Loader2, Save, Upload, Image as ImageIcon } from 'lucide-react';
import Toast from '../../components/ui/Toast';

const AdminProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = Boolean(id);
  const [status, setStatus] = useState(null); // { message, type }
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Full Stack',
    description: '',
    tech_stack: '',
    github_url: '',
    live_url: '',
    thumbnail: '',
    published: true,
  });

  const { data: projectData, isLoading: isFetching } = useQuery({
    queryKey: ['admin-project', id],
    queryFn: async () => {
      const resp = await api.get(`/admin/projects/${id}`);
      return resp.data.project || resp.data;
    },
    enabled: isEditing,
    staleTime: 0,
  });

  useEffect(() => {
    if (projectData && isEditing) {
      setFormData({
        title: projectData.title || '',
        category: projectData.category || 'Full Stack',
        description: projectData.description || '',
        tech_stack: Array.isArray(projectData.tech_stack) ? projectData.tech_stack.join(', ') : (projectData.tech_stack || ''),
        github_url: projectData.github_url || '',
        live_url: projectData.live_url || '',
        thumbnail: projectData.thumbnail || '',
        published: Boolean(projectData.published),
      });
    } else if (!isEditing) {
      setFormData({
        title: '',
        category: 'Full Stack',
        description: '',
        tech_stack: '',
        github_url: '',
        live_url: '',
        thumbnail: '',
        published: true,
      });
    }
  }, [projectData, isEditing]);

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const data = {
        ...payload,
        tech_stack: payload.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
      };

      setIsUploading(true);
      setUploadProgress(0);

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) { clearInterval(progressInterval); return 90; }
          return prev + Math.random() * 15;
        });
      }, 200);

      try {
        let result;
        if (isEditing) {
          result = await api.put(`/admin/projects/${id}`, data);
        } else {
          result = await api.post('/admin/projects', data);
        }
        clearInterval(progressInterval);
        setUploadProgress(100);
        return result;
      } catch (err) {
        clearInterval(progressInterval);
        setUploadProgress(0);
        setIsUploading(false);
        throw err;
      }
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ['admin-projects'] });
      await queryClient.cancelQueries({ queryKey: ['projects'] });

      const prevAdmin = queryClient.getQueryData(['admin-projects']);
      const prevPublic = queryClient.getQueryData(['projects']);

      const optimisticId = isEditing ? parseInt(id) : `temp-${Date.now()}`;
      const optimisticProject = {
        id: optimisticId,
        ...payload,
        tech_stack: payload.tech_stack && typeof payload.tech_stack === 'string' 
            ? payload.tech_stack.split(',').map(s => s.trim()).filter(Boolean) 
            : (payload.tech_stack || [])
      };

      queryClient.setQueryData(['admin-projects'], old => {
        if (!old) return [optimisticProject];
        return isEditing 
          ? old.map(p => p.id === optimisticProject.id ? { ...p, ...optimisticProject } : p)
          : [optimisticProject, ...old];
      });

      if (payload.published) {
        queryClient.setQueryData(['projects'], old => {
          if (!old) return [optimisticProject];
          return isEditing 
            ? old.map(p => p.id === optimisticProject.id ? { ...p, ...optimisticProject } : p)
            : [optimisticProject, ...old];
        });
      } else if (isEditing) {
        queryClient.setQueryData(['projects'], old => old ? old.filter(p => p.id !== optimisticProject.id) : []);
      }

      return { prevAdmin, prevPublic, optimisticId };
    },
    onSuccess: (result, variables, context) => {
      const realProject = result.data;
      if (context?.optimisticId) {
        queryClient.setQueryData(['admin-projects'], old => old ? old.map(p => p.id === context.optimisticId ? realProject : p) : []);
        
        if (variables.published) {
          queryClient.setQueryData(['projects'], old => old ? old.map(p => p.id === context.optimisticId ? realProject : p) : []);
        } else if (isEditing) {
          queryClient.setQueryData(['projects'], old => old ? old.filter(p => p.id !== context.optimisticId && p.id !== realProject.id) : []);
        }
      }
      
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats-main'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats-topbar'] });
      setStatus({ message: isEditing ? 'Mis à jour' : 'Succès', type: 'success' });
      setIsUploading(false);
      setUploadProgress(0);
      setTimeout(() => navigate('/admin/projects'), 1500);
    },
    onError: (err, newProject, context) => {
      setIsUploading(false);
      setUploadProgress(0);
      setStatus({ message: err.response?.data?.message || 'Erreur', type: 'error' });
      setTimeout(() => setStatus(null), 3000);
      if (context?.prevAdmin) queryClient.setQueryData(['admin-projects'], context.prevAdmin);
      if (context?.prevPublic) queryClient.setQueryData(['projects'], context.prevPublic);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      const MAX_WIDTH = 1200;
      const MAX_HEIGHT = 1200;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
      } else {
        if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const compressedString = canvas.toDataURL('image/webp', 0.85);
      setFormData(prev => ({ ...prev, thumbnail: compressedString }));
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isFetching && isEditing) {
    return (
      <div className="p-8 text-center text-slate-500">
        Chargement des détails du projet...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {status && <Toast message={status.message} type={status.type} onClose={() => setStatus(null)} />}

      {/* Removed fixed top progress bar */}

      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/projects')} className="p-2 text-slate-500 hover:text-slate-700 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{isEditing ? 'Modifier le projet' : 'Nouveau projet'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-6 space-y-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Titre du projet</label>
            <input
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="ex. Portfolio v2"
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Catégorie</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors bg-white cursor-pointer"
            >
              <option value="Full Stack">Full Stack</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Mobile">Mobile</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Description</label>
          <textarea
            name="description"
            required
            rows="5"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors resize-y"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Technologies (séparées par des virgules)</label>
          <input
            name="tech_stack"
            value={formData.tech_stack}
            onChange={handleChange}
            placeholder="React, Laravel, MySQL"
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">URL GitHub (Optionnel)</label>
            <input
              name="github_url"
              type="url"
              value={formData.github_url}
              onChange={handleChange}
              placeholder="https://github.com/..."
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">URL en ligne (Optionnel)</label>
            <input
              name="live_url"
              type="url"
              value={formData.live_url}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Image du projet</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-4">
              <input
                name="thumbnail"
                type="text"
                value={formData.thumbnail.startsWith('data:') ? 'Image téléchargée' : formData.thumbnail}
                onChange={handleChange}
                placeholder="URL de l'image ou télécharger un fichier"
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors disabled:bg-slate-100 disabled:text-slate-500"
                disabled={formData.thumbnail.startsWith('data:')}
              />
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-md p-4 text-sm font-medium text-slate-600 hover:border-blue-500 hover:text-blue-600 cursor-pointer transition-colors">
                <Upload size={16} />
                <span>Télécharger une image</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
            <div className="w-full sm:w-48 h-32 bg-slate-100 rounded-md border border-slate-200 flex items-center justify-center overflow-hidden">
              {formData.thumbnail ? (
                <img 
                  src={formData.thumbnail.startsWith('data:') ? formData.thumbnail : getAssetUrl(formData.thumbnail)} 
                  alt="Preview" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="text-slate-400 flex flex-col items-center gap-1">
                  <ImageIcon size={24} />
                  <span className="text-xs">Aucune image</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            id="published"
            name="published"
            type="checkbox"
            checked={formData.published}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="published" className="text-sm font-medium text-slate-700 select-none cursor-pointer">
            Publié (Visible par le public)
          </label>
        </div>

        <div className="pt-6 border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/projects')}
            className="px-4 py-2 rounded-md border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Annuler
          </button>
          <button
            disabled={mutation.isPending || isUploading}
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 relative overflow-hidden"
          >
            {mutation.isPending || isUploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>{uploadProgress < 100 ? `${Math.round(uploadProgress)}%` : 'Enregistrement...'}</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Enregistrer le projet</span>
              </>
            )}
            
            {/* Simple Clean Blue Progress Line at the bottom of the button */}
            {isUploading && (
              <div className="absolute bottom-0 left-0 h-1 bg-white/30 transition-all duration-300 ease-out" style={{ width: `${uploadProgress}%` }} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProjectForm;
