'use client';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  submittedBy: string;
  created: string;
  lastUpdated: string;
  category: string;
  attachments?: { url: string }[];
}

interface TicketDetailModalProps {
  ticket: Ticket;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedTicket: Ticket) => void;
}

export default function TicketDetailModal({ ticket, isOpen, onClose, onUpdate }: TicketDetailModalProps) {
  if (!isOpen) return null;

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
              <h2 className="text-xl font-semibold text-white">Ticket Details</h2>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Ticket ID and Status */}
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  Ticket ID: <span className="text-white">{ticket.id}</span>
                </div>
                <select
                  value={ticket.status}
                  onChange={(e) => onUpdate({ ...ticket, status: e.target.value as any })}
                  className="bg-gray-900 text-gray-300 px-3 py-1 rounded-md border border-gray-700 text-sm"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={ticket.title}
                  onChange={(e) => onUpdate({ ...ticket, title: e.target.value })}
                  className="w-full bg-gray-900 text-gray-300 px-4 py-2 rounded-md border border-gray-700"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Description
                </label>
                <textarea
                  value={ticket.description}
                  onChange={(e) => onUpdate({ ...ticket, description: e.target.value })}
                  rows={4}
                  className="w-full bg-gray-900 text-gray-300 px-4 py-2 rounded-md border border-gray-700"
                />
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Attachments
                </label>
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-4">
                  <div className="space-y-2">
                    {/* Existing Images Preview or No Images Message */}
                    {ticket.attachments?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {ticket.attachments.map((image, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={image.url} 
                              alt={`Attachment ${index + 1}`}
                              className="h-20 w-20 object-cover rounded-md"
                            />
                            <button
                              onClick={() => {/* TODO: Handle image removal */}}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 
                                         opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 text-center py-2">
                        No images attached to this ticket
                      </div>
                    )}

                    {/* Upload Area */}
                    <div className="flex items-center justify-center">
                      <label className="w-full cursor-pointer">
                        <div className="flex flex-col items-center justify-center py-6 px-4">
                          <svg 
                            className="w-8 h-8 text-gray-400 mb-2" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          <p className="text-sm text-gray-400">
                            <span className="text-blue-400">Upload images</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG up to 10MB
                          </p>
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            // TODO: Handle file upload
                            console.log('Files:', e.target.files);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Priority and Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Priority
                  </label>
                  <select
                    value={ticket.priority}
                    onChange={(e) => onUpdate({ ...ticket, priority: e.target.value as any })}
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
                    value={ticket.category}
                    onChange={(e) => onUpdate({ ...ticket, category: e.target.value })}
                    className="w-full bg-gray-900 text-gray-300 px-3 py-2 rounded-md border border-gray-700"
                  >
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                <div>Submitted by: <span className="text-white">{ticket.submittedBy}</span></div>
                <div>Created: <span className="text-white">{ticket.created}</span></div>
                <div>Last Updated: <span className="text-white">{ticket.lastUpdated}</span></div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between space-x-3 pt-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
                      // TODO: Handle ticket deletion
                      console.log('Deleting ticket:', ticket.id);
                      onClose();
                    }
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Delete Ticket
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 