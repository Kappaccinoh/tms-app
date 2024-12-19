export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  submittedBy: string;
  created: string;
  lastUpdated: string;
  category: string;
  attachments?: Array<{
    url: string;
    filename: string;
    uploadedAt: string;
  }>;
} 