import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { FolderKanban, MessageSquare, ArrowRight } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats-main'],
    queryFn: async () => (await api.get('/admin/dashboard')).data,
    staleTime: 0,
    refetchInterval: 5000,
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500">Chargement du tableau de bord...</div>
    );
  }

  const recentMessages = stats?.recent?.messages || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {getGreeting()}, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-sm text-slate-500 mt-1">Vue d'ensemble</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/admin/projects" className="bg-white border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors flex items-center justify-between group shadow-sm">
          <div className="flex items-center gap-4">
            <FolderKanban size={24} className="text-slate-400 group-hover:text-[#4093DB] transition-colors" />
            <p className="text-sm font-semibold text-slate-600">Total Projets</p>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.overview?.projects || 0}</p>
        </Link>

        <Link to="/admin/messages" className="bg-white border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors flex items-center justify-between group shadow-sm">
          <div className="flex items-center gap-4">
            <MessageSquare size={24} className="text-slate-400 group-hover:text-[#4093DB] transition-colors" />
            <p className="text-sm font-semibold text-slate-600">Messages non lus</p>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.overview?.unread_messages || 0}</p>
        </Link>

        <Link to="/admin/messages" className="bg-white border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors flex items-center justify-between group shadow-sm">
          <div className="flex items-center gap-4">
            <MessageSquare size={24} className="text-slate-400 group-hover:text-[#4093DB] transition-colors" />
            <p className="text-sm font-semibold text-slate-600">Total Messages</p>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.overview?.total_messages || 0}</p>
        </Link>
      </div>

      {/* Recent Activity/Messages */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">Demandes récentes</h3>
          </div>
          <Link to="/admin/messages" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
            Voir tout
          </Link>
        </div>
        {recentMessages.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {recentMessages.slice(0, 5).map((msg) => (
              <div key={msg.id} className="px-6 py-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-slate-900 truncate">{msg.name}</p>
                    {!msg.read && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                  </div>
                  <p className="text-xs text-slate-500 truncate">
                    {msg.message}
                  </p>
                </div>
                <span className="text-xs text-slate-400 shrink-0">
                   {new Date(msg.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center text-slate-500">
            Aucune demande active
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
