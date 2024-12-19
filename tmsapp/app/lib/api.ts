const API_BASE_URL = 'http://localhost:8000/api';

// Helper function for common fetch options
const fetchWithOptions = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Ticket APIs
export const ticketApi = {
  getAll: () => fetchWithOptions('/tickets/'),
  get: (id: string) => fetchWithOptions(`/tickets/${id}/`),
  create: (data: any) => fetchWithOptions('/tickets/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => fetchWithOptions(`/tickets/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchWithOptions(`/tickets/${id}/`, {
    method: 'DELETE',
  }),
  addComment: (id: string, data: any) => fetchWithOptions(`/tickets/${id}/add_comment/`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  uploadAttachment: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetch(`${API_BASE_URL}/tickets/${id}/upload_attachment/`, {
      method: 'POST',
      body: formData,
    }).then(res => res.json());
  },
  resolve: (id: string) => fetchWithOptions(`/tickets/${id}/resolve/`, {
    method: 'POST',
  }),
};

// Analytics APIs
export const analyticsApi = {
  getDashboardMetrics: () => fetchWithOptions('/analytics/dashboard_metrics/'),
  getAnalyticsData: () => fetchWithOptions('/analytics/'),
  getTicketVolume: () => fetchWithOptions('/analytics/ticket_volume/'),
  getResolutionMetrics: () => fetchWithOptions('/analytics/resolution_metrics/'),
  getCategoryDistribution: () => fetchWithOptions('/analytics/category_distribution/'),
};

// Report APIs
export const reportApi = {
  getAll: () => fetchWithOptions('/reports/'),
  generate: (id: string) => fetchWithOptions(`/reports/${id}/generate/`, {
    method: 'POST',
  }),
}; 