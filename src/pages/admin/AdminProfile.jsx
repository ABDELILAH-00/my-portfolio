import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { Save, Loader2, Eye, EyeOff } from 'lucide-react';
import Toast from '../../components/ui/Toast';

const AdminProfile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [toast, setToast] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setToast(null);
    try {
      await api.patch('/admin/profile', profileData);
      setToast({ type: 'success', message: 'Profil mis à jour' });
    } catch (err) {
      const msg = err.response?.data?.errors 
        ? Object.values(err.response.data.errors).flat().join(' ') 
        : (err.response?.data?.message || 'Échec de la mise à jour du profil');
      setToast({ type: 'error', message: msg });
    }
    setProfileLoading(false);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setToast(null);
    try {
      const res = await api.patch('/admin/password', passwordData);
      setToast({ type: 'success', message: 'Mot de passe mis à jour' });
      
      // Update the local session if the backend returns a new token
      if (res.data?.token) {
        localStorage.setItem('admin_token', res.data.token);
      }
      
      setPasswordData({ current_password: '', password: '', password_confirmation: '' });
    } catch (err) {
      const msg = err.response?.data?.errors 
        ? Object.values(err.response.data.errors).flat().join(' ') 
        : (err.response?.data?.message || 'Échec de la mise à jour du mot de passe');
      setToast({ type: 'error', message: msg });
    }
    setPasswordLoading(false);
  };

  return (
    <div className="space-y-6 max-w-2xl relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Paramètres du compte</h1>
          <p className="text-sm text-slate-500 mt-1">Gérez votre identité et votre sécurité</p>
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-6">Informations du profil</h3>
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Nom complet</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Adresse e-mail</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                required
              />
            </div>
          </div>
          <div className="flex items-center justify-end pt-4">
            <button
              disabled={profileLoading}
              type="submit"
              className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {profileLoading ? (
                 <>
                   <Loader2 size={16} className="animate-spin" />
                   <span>Enregistrement...</span>
                 </>
              ) : (
                 <>
                   <Save size={16} />
                   <span>Enregistrer</span>
                 </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 shadow-sm mt-6">
        <h3 className="font-semibold text-slate-900 mb-6">Sécurité du mot de passe</h3>
        <form onSubmit={handlePasswordUpdate} className="space-y-6">
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Mot de passe actuel</label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords((p) => ({ ...p, current: !p.current }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Nouveau mot de passe</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.password}
                    onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                    placeholder="8+ caractères"
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords((p) => ({ ...p, new: !p.new }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Confirmer le mot de passe</label>
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordData.password_confirmation}
                  onChange={(e) => setPasswordData({ ...passwordData, password_confirmation: e.target.value })}
                  placeholder="Répéter le mot de passe"
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end pt-4">
            <button
              disabled={passwordLoading}
              type="submit"
              className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
               {passwordLoading ? (
                 <>
                   <Loader2 size={16} className="animate-spin" />
                   <span>Mise à jour...</span>
                 </>
              ) : (
                 <>
                   <Save size={16} />
                   <span>Mettre à jour le mot de passe</span>
                 </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
