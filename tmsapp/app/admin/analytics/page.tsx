'use client';

import { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, LineChart, Line
} from 'recharts';
import DateRangeSelector from '../../components/admin/DateRangeSelector';
import CustomDatePicker from '../../components/admin/CustomDatePicker';
import LoadingSpinner from '../../components/admin/LoadingSpinner';

// Sample data for the analytics
const responseTimeData = [
  { date: '2024-01', critical: 1.2, high: 2.4, medium: 4.8, low: 8.4 },
  { date: '2024-02', critical: 1.1, high: 2.2, medium: 4.5, low: 8.0 },
  { date: '2024-03', critical: 1.3, high: 2.6, medium: 5.0, low: 8.8 },
];

const keywordTrends = [
  { keyword: 'Database Connection', count: 45, trend: '+12%', severity: 'High', avgResolutionTime: '2.4h' },
  { keyword: 'API Timeout', count: 38, trend: '+5%', severity: 'High', avgResolutionTime: '1.8h' },
  { keyword: 'Authentication Failed', count: 32, trend: '-8%', severity: 'Critical', avgResolutionTime: '1.2h' },
  { keyword: 'Data Sync', count: 28, trend: '+15%', severity: 'Medium', avgResolutionTime: '3.5h' },
  { keyword: '404 Error', count: 25, trend: '-3%', severity: 'Low', avgResolutionTime: '0.5h' },
  { keyword: 'Performance Issue', count: 22, trend: '+7%', severity: 'Medium', avgResolutionTime: '4.2h' },
  { keyword: 'Network Error', count: 20, trend: '-5%', severity: 'High', avgResolutionTime: '1.6h' },
  { keyword: 'UI Bug', count: 18, trend: '+2%', severity: 'Low', avgResolutionTime: '5.0h' },
  { keyword: 'Permission Denied', count: 17, trend: '+9%', severity: 'High', avgResolutionTime: '1.1h' },
  { keyword: 'Data Export Failed', count: 15, trend: '+4%', severity: 'Medium', avgResolutionTime: '2.8h' },
  { keyword: 'Report Generation', count: 14, trend: '-2%', severity: 'Medium', avgResolutionTime: '2.2h' },
  { keyword: 'Session Expired', count: 12, trend: '-6%', severity: 'Low', avgResolutionTime: '0.3h' },
  { keyword: 'Loading Timeout', count: 11, trend: '+8%', severity: 'Medium', avgResolutionTime: '1.9h' },
  { keyword: 'Data Validation', count: 10, trend: '+1%', severity: 'Medium', avgResolutionTime: '2.7h' },
  { keyword: 'Browser Compatibility', count: 9, trend: '-4%', severity: 'Low', avgResolutionTime: '3.8h' }
];

const categoryData = [
  { name: 'Access & Authentication', value: 35, color: '#3B82F6' },
  { name: 'Data & Reports', value: 25, color: '#10B981' },
  { name: 'Performance Issues', value: 20, color: '#F59E0B' },
  { name: 'Feature Requests', value: 12, color: '#6366F1' },
  { name: 'User Training', value: 8, color: '#8B5CF6' },
];

const impactMetrics = [
  { metric: 'User Impact', affected: 2500, trend: '+5%', status: 'Warning' },
  { metric: 'System Downtime', value: '45m', trend: '-12%', status: 'Good' },
  { metric: 'SLA Breaches', value: 3, trend: '+2', status: 'Critical' },
  { metric: 'First Response Time', value: '8m', trend: '-25%', status: 'Good' }
];

const peakHoursData = [
  { hour: '00:00', tickets: 12 },
  { hour: '04:00', tickets: 8 },
  { hour: '08:00', tickets: 45 },
  { hour: '12:00', tickets: 65 },
  { hour: '16:00', tickets: 52 },
  { hour: '20:00', tickets: 25 }
];

const recurringIssues = [
  { 
    pattern: 'Database Timeout',
    frequency: 'Daily',
    lastOccurrence: '2h ago',
    similarTickets: 15,
    potentialCause: 'Peak Load Hours'
  },
  // ... more patterns
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<'24h' | '7d' | '30d' | '90d' | 'custom'>('30d');
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    };

    loadData();
  }, [dateRange]);

  const filteredKeywords = keywordTrends.filter(k => 
    k.keyword.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Date Range Selector */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Technical Analytics</h1>
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
              onApply={(start, end) => {
                console.log('Custom date range:', { start, end });
                setShowCustomDatePicker(false);
              }}
              onClose={() => setShowCustomDatePicker(false)}
            />
          )}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* MTTR by Priority */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Mean Time to Resolution by Priority</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="critical" stroke="#EF4444" />
                <Line type="monotone" dataKey="high" stroke="#F59E0B" />
                <Line type="monotone" dataKey="medium" stroke="#3B82F6" />
                <Line type="monotone" dataKey="low" stroke="#10B981" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Issue Distribution */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Issue Distribution by Category</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                  }}
                />
                <Legend />
                <Bar dataKey="value" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Impact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {impactMetrics.map((metric, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm text-gray-400">{metric.metric}</span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                metric.status === 'Good' ? 'bg-green-400/10 text-green-400' :
                metric.status === 'Warning' ? 'bg-orange-400/10 text-orange-400' :
                'bg-red-400/10 text-red-400'
              }`}>
                {metric.status}
              </span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-white">{metric.value || metric.affected}</span>
              <span className={`text-sm ${
                metric.trend.startsWith('-') ? 'text-green-400' : 'text-red-400'
              }`}>
                {metric.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Peak Hours Analysis */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Ticket Volume by Hour</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={peakHoursData}>
              <defs>
                <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.02}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis dataKey="hour" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                }}
              />
              <Area
                type="monotone"
                dataKey="tickets"
                stroke="#3B82F6"
                fill="url(#colorTickets)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recurring Issues */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recurring Issue Patterns</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Pattern</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Frequency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Last Occurred</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Similar Tickets</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Potential Cause</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {recurringIssues.map((issue, index) => (
                <tr key={index} className="hover:bg-gray-700">
                  <td className="px-6 py-4 text-sm text-gray-300">{issue.pattern}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{issue.frequency}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{issue.lastOccurrence}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{issue.similarTickets}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{issue.potentialCause}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Keyword Analysis */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-white">Common Issue Keywords</h2>
          <input
            type="text"
            placeholder="Search keywords..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="bg-gray-900 text-gray-300 px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Keyword</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Occurrences</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Trend</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Avg Resolution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredKeywords.map((item, index) => (
                <tr key={index} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.keyword}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`${
                      item.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {item.trend}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      item.severity === 'Critical' ? 'bg-red-400/10 text-red-400' :
                      item.severity === 'High' ? 'bg-orange-400/10 text-orange-400' :
                      item.severity === 'Medium' ? 'bg-blue-400/10 text-blue-400' :
                      'bg-green-400/10 text-green-400'
                    }`}>
                      {item.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.avgResolutionTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 