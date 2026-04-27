import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { Trash2, Check, Inbox, User } from 'lucide-react';
import Toast from '../../components/ui/Toast';
import ConfirmModal from '../../components/ui/ConfirmModal';

const AdminMessages = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, msgId: null, msgSender: '' });

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: async () => (await api.get('/admin/contacts')).data,
    staleTime: 0,
    refetchInterval: 5000,
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  const invalidateStats = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-stats-main'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-stats-topbar'] });
  };

  const markAsReadMutation = useMutation({
    mutationFn: async (id) => await api.patch(`/admin/contacts/${id}/read`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['admin-messages'] });
      const previousMessages = queryClient.getQueryData(['admin-messages']);
      
      queryClient.setQueryData(['admin-messages'], (old) => 
        old ? old.map(m => m.id === id ? { ...m, read: true } : m) : []
      );
      
      return { previousMessages };
    },
    onError: (err, id, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(['admin-messages'], context.previousMessages);
      }
      setToast({ message: 'Échec de la mise à jour du message', type: 'error' });
    },
    onSettled: () => {
      invalidateStats();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await api.delete(`/admin/contacts/${id}`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['admin-messages'] });
      const previousMessages = queryClient.getQueryData(['admin-messages']);
      
      queryClient.setQueryData(['admin-messages'], (old) => 
        old ? old.filter(m => m.id !== id) : []
      );
      
      setDeleteModal({ isOpen: false, msgId: null, msgSender: '' });
      return { previousMessages };
    },
    onSuccess: () => {
      setToast({ message: 'Supprimé', type: 'success' });
    },
    onError: (err, id, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(['admin-messages'], context.previousMessages);
      }
      setToast({ message: 'Erreur lors de la suppression du message', type: 'error' });
    },
    onSettled: () => {
      invalidateStats();
    }
  });

  return (
    <div className="space-y-6 max-w-4xl relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Messages & Demandes</h1>
          <p className="text-sm text-slate-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} message(s) non lu(s)` : 'Aucun message non lu'}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-slate-500">Chargement des messages...</div>
      ) : messages.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center shadow-sm">
          <p className="text-sm text-slate-500">Boîte de réception vide</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors relative"
            >
              {!msg.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#4093DB]" />}
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${!msg.read ? 'bg-blue-50 text-[#4093DB]' : 'bg-slate-50 text-slate-400'}`}>
                         <User size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">
                          {msg.name}
                        </h3>
                        <p className="text-xs text-slate-500">{msg.email}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-3 text-[13px] text-slate-600 whitespace-pre-wrap leading-relaxed">
                    {msg.message}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!msg.read && (
                    <button
                      onClick={() => markAsReadMutation.mutate(msg.id)}
                      className="p-2 text-[#4093DB] hover:bg-blue-50 rounded-md transition-colors"
                      title="Marquer comme lu"
                    >
                      <Check size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, msgId: msg.id, msgSender: msg.name })}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Supprimer le message"
        message={`Êtes-vous sûr de vouloir supprimer ce message de ${deleteModal.msgSender} ?`}
        onConfirm={() => deleteMutation.mutate(deleteModal.msgId)}
        onCancel={() => setDeleteModal({ isOpen: false, msgId: null, msgSender: '' })}
      />
    </div>
  );
};

export default AdminMessages;
