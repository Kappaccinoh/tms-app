'use client';

import { useState } from 'react';
import { Ticket } from '@/app/types/ticket';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (ticket: Omit<Ticket, 'id' | 'created' | 'lastUpdated'>) => void;
}

export default function CreateTicketModal({ isOpen, onClose, onCreate }: CreateTicketModalProps) {
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    status: 'Open' as const,
    priority: 'Medium' as const,
    category: 'technical',
    submittedBy: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(newTicket);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-gray-800 rounded-lg w-full max-w-3xl p-6 shadow-xl z-10">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-semibold text-white">Create New Ticket</h2>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                  className="w-full bg-gray-900 text-gray-300 px-4 py-2 rounded-md border border-gray-700"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Description
                </label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  rows={4}
                  className="w-full bg-gray-900 text-gray-300 px-4 py-2 rounded-md border border-gray-700"
                  required
                />
              </div>

              {/* Priority and Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as any })}
                    className="w-full bg-gray-900 text-gray-300 px-3 py-2 rounded-md border border-gray-700"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Category
                  </label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                    className="w-full bg-gray-900 text-gray-300 px-3 py-2 rounded-md border border-gray-700"
                  >
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>
              </div>

              {/* Submitted By */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Submitted By
                </label>
                <input
                  type="text"
                  value={newTicket.submittedBy}
                  onChange={(e) => setNewTicket({ ...newTicket, submittedBy: e.target.value })}
                  className="w-full bg-gray-900 text-gray-300 px-4 py-2 rounded-md border border-gray-700"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 