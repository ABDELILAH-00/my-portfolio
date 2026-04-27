import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Bell, Menu } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

const TopBar = ({ onMenuClick }) => {
  const location = useLocation();

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats-topbar'],
    queryFn: async () => (await api.get('/admin/dashboard')).data,
    staleTime: 0,
    refetchInterval: 5000,
  });

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Tableau de bord';
    if (path.includes('projects')) return 'Projets';
    if (path.includes('skills')) return 'Compétences';
    if (path.includes('messages')) return 'Messages';
    if (path.includes('profile')) return 'Profil';
    return 'Admin';
  };

  const unreadCount = stats?.overview?.unread_messages || 0;

  return (
    <header className="h-16 px-6 flex items-center justify-between bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 transition-colors"
          aria-label="Toggle Menu"
        >
          <Menu size={20} />
        </button>
        
        <div className="flex items-center">
          <h2 className="text-[15px] font-bold text-slate-900 tracking-tight">
            {getPageTitle()}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/admin/messages"
          className="relative p-2 text-slate-500 hover:text-blue-600 transition-colors"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
              {unreadCount > 9 ? '!' : unreadCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};

export default TopBar;
