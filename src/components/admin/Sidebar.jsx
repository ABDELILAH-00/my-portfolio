import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Code2, MessageSquare, User, LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout, user } = useAuth();

  const links = [
    { to: '/admin', icon: <LayoutDashboard size={20} />, label: 'Tableau de bord', end: true },
    { to: '/admin/projects', icon: <FolderKanban size={20} />, label: 'Projets' },
    { to: '/admin/skills', icon: <Code2 size={20} />, label: 'Compétences' },
    { to: '/admin/messages', icon: <MessageSquare size={20} />, label: 'Messages' },
    { to: '/admin/profile', icon: <User size={20} />, label: 'Profil' },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Panneau Admin</span>
        </h1>
        <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-600 transition-colors">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 py-4 px-3 flex flex-col gap-1 focus:outline-none">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-md w-full transition-colors font-medium"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
