export interface DashboardMetrics {
  open_tickets: number;
  open_tickets_trend: string;
  active_users: number;
  active_users_trend: string;
  resolution_time: string;
  resolution_time_trend: string;
  satisfaction_rate: string;
  satisfaction_rate_trend: string;
}

export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
} 