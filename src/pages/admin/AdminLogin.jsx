import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Toast from '../../components/ui/Toast';

const AdminLogin = () => {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRecoverPassword, setShowRecoverPassword] = useState(false);
  const [formData, setFormData] = useState({
    recoverEmail: '',
    matricule: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [status, setStatus] = useState(null); // { message, type }
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setStatus({ 
        message: err.response?.data?.message || 'Clé d\'accès invalide ou erreur réseau', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecover = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return setStatus({ message: 'Les mots de passe ne correspondent pas.', type: 'error' });
    }
    setLoading(true);
    setStatus(null);
    try {
      await api.post('/recover-password', {
        email: formData.recoverEmail,
        matricule: formData.matricule,
        password: formData.newPassword,
        password_confirmation: formData.confirmPassword,
      });
      setStatus({ message: 'Succès', type: 'success' });
      setTimeout(() => {
        setMode('login');
        setStatus(null);
        setFormData({ recoverEmail: '', matricule: '', newPassword: '', confirmPassword: '' });
      }, 2000);
    } catch (err) {
      setStatus({ message: err.response?.data?.message || 'Échec de la récupération.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 font-sans">
      {status && <Toast message={status.message} type={status.type} onClose={() => setStatus(null)} />}
      <div className="w-full max-w-sm">
        {mode === 'login' ? (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-slate-900">Connexion Admin</h1>
              <p className="text-sm text-slate-500 mt-1">Entrez votre clé d'accès</p>
            </div>

            <form onSubmit={handleLogin} className="bg-white border border-slate-200 rounded-lg p-6 space-y-5 shadow-sm">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Clé d'accès</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrer la clé..."
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-blue-600 text-white text-sm font-medium py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Vérification...</span>
                    </>
                  ) : 'Connexion'}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode('recover')}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Accès perdu ? Récupérer le compte
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="mb-8 text-center">
              <button
                onClick={() => { 
                  setMode('login'); 
                  setStatus(null);
                  setEmail('');
                  setPassword('');
                  setFormData({ recoverEmail: '', matricule: '', newPassword: '', confirmPassword: '' });
                }}
                className="text-xs text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2 mx-auto mb-4 font-medium"
              >
                <ArrowLeft size={16} /> Retour à la connexion
              </button>
              <h1 className="text-2xl font-bold text-slate-900">Récupération d'accès</h1>
              <p className="text-sm text-slate-500 mt-1">Validez vos identifiants pour réinitialiser le compte</p>
            </div>

            <form onSubmit={handleRecover} className="bg-white border border-slate-200 rounded-lg p-6 space-y-5 shadow-sm">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Adresse e-mail</label>
                <input
                  type="email"
                  required
                  value={formData.recoverEmail}
                  onChange={(e) => setFormData({ ...formData, recoverEmail: e.target.value })}
                  placeholder="admin@example.com"
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Matricule</label>
                <input
                  type="text"
                  required
                  value={formData.matricule}
                  onChange={(e) => setFormData({ ...formData, matricule: e.target.value })}
                  placeholder="ID REFERENCE"
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                />
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Nouveau mot de passe</label>
                  <div className="relative">
                    <input
                      type={showRecoverPassword ? 'text' : 'password'}
                      required
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      placeholder="8+ caractères"
                      className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRecoverPassword(!showRecoverPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showRecoverPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Confirmer le mot de passe</label>
                  <div className="relative">
                    <input
                      type={showRecoverPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Répéter le mot de passe"
                      className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRecoverPassword(!showRecoverPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showRecoverPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-blue-600 text-white text-sm font-medium py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Mise à jour...</span>
                    </>
                  ) : 'Mettre à jour le mot de passe'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
