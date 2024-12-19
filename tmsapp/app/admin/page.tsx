'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';
import DateRangeSelector from '../components/admin/DateRangeSelector';
import CustomDatePicker from '../components/admin/CustomDatePicker';
import LoadingSpinner from '../components/admin/LoadingSpinner';

const ticketData = [
  { name: 'Mon', tickets: 40 },
  { name: 'Tue', tickets: 35 },
  { name: 'Wed', tickets: 50 },
  { name: 'Thu', tickets: 45 },
  { name: 'Fri', tickets: 60 },
  { name: 'Sat', tickets: 30 },
  { name: 'Sun', tickets: 25 },
];

const resolutionData = [
  { name: 'Critical', resolved: 85, pending: 15 },
  { name: 'High', resolved: 75, pending: 25 },
  { name: 'Medium', resolved: 90, pending: 10 },
  { name: 'Low', resolved: 95, pending: 5 },
];

// New data for pie chart
const categoryData = [
  { name: 'Technical', value: 45, color: '#3B82F6' },
  { name: 'Billing', value: 25, color: '#10B981' },
  { name: 'Account', value: 20, color: '#F59E0B' },
  { name: 'General', value: 10, color: '#6366F1' },
];

interface Ticket {
  id: string;
  title: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  created: string;
  category: string;
  submittedBy: string;
  lastUpdated: string;
}

const sampleTickets: Ticket[] = [
  {
    id: '#1234',
    title: 'System access issue with main database',
    status: 'In Progress',
    priority: 'High',
    created: '2h ago',
    category: 'Technical',
    submittedBy: 'John Smith',
    lastUpdated: '30m ago'
  },
  {
    id: '#1235',
    title: 'Billing discrepancy in monthly invoice',
    status: 'Open',
    priority: 'Medium',
    created: '4h ago',
    category: 'Billing',
    submittedBy: 'Sarah Johnson',
    lastUpdated: '2h ago'
  },
  {
    id: '#1236',
    title: 'Password reset request for admin portal',
    status: 'Resolved',
    priority: 'Low',
    created: '1d ago',
    category: 'Account',
    submittedBy: 'Mike Wilson',
    lastUpdated: '5h ago'
  },
  {
    id: '#1237',
    title: 'Critical service outage in production environment',
    status: 'Open',
    priority: 'Critical',
    created: '1h ago',
    category: 'Technical',
    submittedBy: 'Emma Davis',
    lastUpdated: '15m ago'
  },
  {
    id: '#1238',
    title: 'Feature request: Add export functionality',
    status: 'In Progress',
    priority: 'Medium',
    created: '3d ago',
    category: 'General',
    submittedBy: 'Alex Turner',
    lastUpdated: '1d ago'
  },
  {
    id: '#1239',
    title: 'API integration failing with timeout errors',
    status: 'Open',
    priority: 'High',
    created: '5h ago',
    category: 'Technical',
    submittedBy: 'David Chen',
    lastUpdated: '1h ago'
  },
  {
    id: '#1240',
    title: 'Security vulnerability report',
    status: 'Critical',
    priority: 'Critical',
    created: '30m ago',
    category: 'Security',
    submittedBy: 'Lisa Anderson',
    lastUpdated: '10m ago'
  },
  {
    id: '#1241',
    title: 'User permissions not updating correctly',
    status: 'In Progress',
    priority: 'High',
    created: '6h ago',
    category: 'Account',
    submittedBy: 'Robert Martinez',
    lastUpdated: '2h ago'
  },
  {
    id: '#1242',
    title: 'Data synchronization lag in reporting',
    status: 'Open',
    priority: 'Medium',
    created: '2d ago',
    category: 'Technical',
    submittedBy: 'Jennifer Wong',
    lastUpdated: '1d ago'
  },
  {
    id: '#1243',
    title: 'Mobile app crash report',
    status: 'Open',
    priority: 'High',
    created: '3h ago',
    category: 'Technical',
    submittedBy: 'Tom Bradley',
    lastUpdated: '45m ago'
  }
];

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

// First, let's update the chart colors and styles
const chartColors = {
  primary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  gray: '#4B5563',
  // Add opacity variants
  primaryLight: 'rgba(59, 130, 246, 0.1)',
  successLight: 'rgba(16, 185, 129, 0.1)',
  warningLight: 'rgba(245, 158, 11, 0.1)',
  dangerLight: 'rgba(239, 68, 68, 0.1)',
};

// First, add this constant at the top with other constants
const ITEMS_PER_PAGE_OPTIONS = [5, 10, 25, 50];

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState<'24h' | '7d' | '30d' | '90d' | 'custom'>('7d');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Ticket; direction: 'asc' | 'desc' } | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isChartLoading, setIsChartLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setIsChartLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
      setIsChartLoading(false);
    };

    loadData();
  }, [dateRange]); // Reload when date range changes

  // Sort and filter tickets
  const filteredTickets = useMemo(() => {
    let filtered = [...sampleTickets];

    // Apply filters
    if (filterPriority !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority.toLowerCase() === filterPriority);
    }
    if (filterStatus !== 'all') {
      filtered = filtered.filter(ticket => ticket.status.toLowerCase() === filterStatus);
    }
    if (searchQuery) {
      filtered = filtered.filter(ticket => 
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [sampleTickets, filterPriority, filterStatus, searchQuery, sortConfig]);

  const handleSort = (key: keyof Ticket) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Calculate pagination
  const pageCount = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCustomDateSelect = (start: Date, end: Date) => {
    console.log('Custom date range:', { start, end });
    // TODO: Implement date range filtering
    setShowCustomDatePicker(false);
  };

  const CustomTooltip = ({ active, payload, label }: ChartTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 p-3 rounded shadow-lg">
          <p className="text-gray-300 text-sm font-medium">{label}</p>
          {payload.map((item, index) => (
            <p key={index} className="text-sm" style={{ color: item.color }}>
              {item.name}: {item.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Date Range Selector with Custom Date Picker */}
      <div className="flex justify-between items-center relative">
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <div className="relative">
          <DateRangeSelector 
            selectedRange={dateRange} 
            onRangeChange={(range) => {
              if (range === 'custom') {
                setShowCustomDatePicker(true);
              } else {
                setDateRange(range);
                setShowCustomDatePicker(false);
              }
            }} 
          />
          {showCustomDatePicker && (
            <CustomDatePicker
              onApply={handleCustomDateSelect}
              onClose={() => setShowCustomDatePicker(false)}
            />
          )}
        </div>
      </div>

      {/* Quick Stats with corrected colors */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Open Tickets</p>
              <p className="text-2xl font-bold text-white mt-2">23</p>
              <p className="text-red-400 text-sm mt-2">↑ 12% from last week</p>
            </div>
            <span className="text-blue-400 text-2xl">🎫</span>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Users</p>
              <p className="text-2xl font-bold text-white mt-2">147</p>
              <p className="text-green-400 text-sm mt-2">↑ 8% from last week</p>
            </div>
            <span className="text-green-400 text-2xl">👥</span>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg Response Time</p>
              <p className="text-2xl font-bold text-white mt-2">2.4h</p>
              <p className="text-green-400 text-sm mt-2">↓ 5% from target</p>
            </div>
            <span className="text-purple-400 text-2xl">📊</span>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Resolution Rate</p>
              <p className="text-2xl font-bold text-white mt-2">94%</p>
              <p className="text-green-400 text-sm mt-2">↑ 2% from target</p>
            </div>
            <span className="text-gray-400 text-2xl">⚙️</span>
          </div>
        </div>
      </div>

      {/* Updated Charts Grid - now 3 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket Trend Chart */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Ticket Volume Trend</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ticketData}>
                <defs>
                  <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.1}/>
                    <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#374151"
                  vertical={false}
                />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF"
                  axisLine={{ stroke: '#374151' }}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  axisLine={{ stroke: '#374151' }}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ stroke: chartColors.primary, strokeWidth: 1 }}
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '4px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  labelStyle={{ color: '#F3F4F6', marginBottom: '4px' }}
                  itemStyle={{ color: '#D1D5DB', padding: '2px 0' }}
                />
                <Area
                  type="monotone"
                  dataKey="tickets"
                  stroke={chartColors.primary}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTickets)"
                  activeDot={{ 
                    r: 4, 
                    stroke: chartColors.primary,
                    strokeWidth: 2,
                    fill: '#1F2937'
                  }}
                  onMouseEnter={(data, index) => {
                    // Optional: Add hover effect logic here
                  }}
                  onMouseLeave={(data, index) => {
                    // Optional: Add hover effect logic here
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resolution Rate Chart */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Resolution Rate by Priority</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resolutionData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#374151" 
                  vertical={false}
                />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF"
                  axisLine={{ stroke: '#374151' }}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  axisLine={{ stroke: '#374151' }}
                  tickLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(55, 65, 81, 0.4)' }}
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '4px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  labelStyle={{ color: '#F3F4F6', marginBottom: '4px' }}
                  itemStyle={{ color: '#D1D5DB', padding: '2px 0' }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value) => (
                    <span style={{ color: '#9CA3AF' }}>{value}</span>
                  )}
                />
                <Bar 
                  dataKey="resolved" 
                  stackId="a" 
                  fill={chartColors.success}
                  radius={[4, 4, 0, 0]}
                  background={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                  onMouseEnter={(data, index) => {
                    // Optional: Add hover effect logic here
                  }}
                  onMouseLeave={(data, index) => {
                    // Optional: Add hover effect logic here
                  }}
                />
                <Bar 
                  dataKey="pending" 
                  stackId="a" 
                  fill={chartColors.danger}
                  radius={0}
                  onMouseEnter={(data, index) => {
                    // Optional: Add hover effect logic here
                  }}
                  onMouseLeave={(data, index) => {
                    // Optional: Add hover effect logic here
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* New Pie Chart */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Tickets by Category</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      style={{
                        transition: 'opacity 0.2s ease-in-out'
                      }}
                      onMouseEnter={() => {
                        // Optional: Add hover effect logic here
                      }}
                      onMouseLeave={() => {
                        // Optional: Add hover effect logic here
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '4px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  itemStyle={{ color: '#D1D5DB', padding: '2px 0' }}
                />
                <Legend
                  formatter={(value) => (
                    <span style={{ color: '#9CA3AF' }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Enhanced Tickets Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <h2 className="text-lg font-semibold text-white">Recent Tickets</h2>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Search tickets..."
                className="bg-gray-900 text-gray-300 px-3 py-1 rounded-md text-sm border border-gray-700 focus:outline-none focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                className="bg-gray-900 text-gray-300 px-3 py-1 rounded-md text-sm border border-gray-700"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              <select
                className="bg-gray-900 text-gray-300 px-3 py-1 rounded-md text-sm border border-gray-700"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>
        {/* Update table headers to be sortable */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                {[
                  { key: 'id', label: 'ID' },
                  { key: 'title', label: 'Title' },
                  { key: 'submittedBy', label: 'Submitted By' },
                  { key: 'status', label: 'Status' },
                  { key: 'priority', label: 'Priority' },
                  { key: 'created', label: 'Created' },
                  { key: 'lastUpdated', label: 'Last Updated' },
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key as keyof Ticket)}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                  >
                    {label}
                    {sortConfig?.key === key && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {paginatedTickets.map((ticket) => (
                <tr key={ticket.id} className="bg-gray-800 hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{ticket.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{ticket.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {ticket.submittedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium 
                      ${ticket.status === 'Open' 
                        ? 'text-yellow-400 bg-yellow-400/10' 
                        : ticket.status === 'In Progress'
                        ? 'text-blue-400 bg-blue-400/10'
                        : 'text-green-400 bg-green-400/10'}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium
                      ${ticket.priority === 'Critical'
                        ? 'text-red-400 bg-red-400/10'
                        : ticket.priority === 'High'
                        ? 'text-orange-400 bg-orange-400/10'
                        : ticket.priority === 'Medium'
                        ? 'text-blue-400 bg-blue-400/10'
                        : 'text-green-400 bg-green-400/10'}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{ticket.created}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{ticket.lastUpdated}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-400 hover:text-blue-300">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTickets.length)} of {filteredTickets.length} tickets
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1); // Reset to first page when changing items per page
                  }}
                  className="bg-gray-900 text-gray-300 px-2 py-1 rounded-md text-sm border border-gray-700 focus:outline-none focus:border-blue-500"
                >
                  {ITEMS_PER_PAGE_OPTIONS.map(value => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-gray-400">per page</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  currentPage === 1
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                Previous
              </button>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
                disabled={currentPage === pageCount}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  currentPage === pageCount
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 