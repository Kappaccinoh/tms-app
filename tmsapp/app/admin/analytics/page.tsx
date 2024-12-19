'use client';

import { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, LineChart, Line, Cell
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

const responseDistribution = [
  { range: '0-1h', count: 145, percentage: 35 },
  { range: '1-4h', count: 98, percentage: 24 },
  { range: '4-8h', count: 76, percentage: 18 },
  { range: '8-24h', count: 56, percentage: 14 },
  { range: '24h+', count: 37, percentage: 9 }
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
  { 
    name: 'Access & Authentication',
    total: 35,
    open: 12,
    inProgress: 15,
    resolved: 8,
    color: '#3B82F6'
  },
  { 
    name: 'Data & Reports',
    total: 25,
    open: 8,
    inProgress: 10,
    resolved: 7,
    color: '#10B981'
  },
  { 
    name: 'Performance Issues',
    total: 20,
    open: 5,
    inProgress: 8,
    resolved: 7,
    color: '#F59E0B'
  },
  { 
    name: 'Feature Requests',
    total: 12,
    open: 4,
    inProgress: 6,
    resolved: 2,
    color: '#6366F1'
  },
  { 
    name: 'User Training',
    total: 8,
    open: 2,
    inProgress: 3,
    resolved: 3,
    color: '#8B5CF6'
  }
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
  { 
    pattern: 'Session Authentication Failure',
    frequency: 'Daily',
    lastOccurrence: '1h ago',
    similarTickets: 12,
    potentialCause: 'Token Expiration'
  },
  { 
    pattern: 'Report Generation Delay',
    frequency: 'Weekly',
    lastOccurrence: '5h ago',
    similarTickets: 8,
    potentialCause: 'Large Dataset Processing'
  },
  { 
    pattern: 'API Rate Limiting',
    frequency: 'Daily',
    lastOccurrence: '30m ago',
    similarTickets: 10,
    potentialCause: 'Concurrent Requests'
  },
  { 
    pattern: 'Data Sync Conflict',
    frequency: 'Weekly',
    lastOccurrence: '4h ago',
    similarTickets: 6,
    potentialCause: 'Concurrent Updates'
  },
  { 
    pattern: 'Memory Usage Spike',
    frequency: 'Daily',
    lastOccurrence: '1h ago',
    similarTickets: 9,
    potentialCause: 'Resource Leak'
  },
  { 
    pattern: 'File Upload Failure',
    frequency: 'Daily',
    lastOccurrence: '45m ago',
    similarTickets: 7,
    potentialCause: 'Size Limit Exceeded'
  },
  { 
    pattern: 'Search Index Timeout',
    frequency: 'Weekly',
    lastOccurrence: '3h ago',
    similarTickets: 5,
    potentialCause: 'Index Fragmentation'
  },
  { 
    pattern: 'Cache Invalidation',
    frequency: 'Daily',
    lastOccurrence: '2h ago',
    similarTickets: 11,
    potentialCause: 'Configuration Mismatch'
  },
  { 
    pattern: 'SSL Certificate Warning',
    frequency: 'Monthly',
    lastOccurrence: '1d ago',
    similarTickets: 3,
    potentialCause: 'Approaching Expiry'
  },
  { 
    pattern: 'Payment Gateway Timeout',
    frequency: 'Weekly',
    lastOccurrence: '6h ago',
    similarTickets: 8,
    potentialCause: 'Network Latency'
  },
  { 
    pattern: 'Mobile App Crash',
    frequency: 'Daily',
    lastOccurrence: '1h ago',
    similarTickets: 14,
    potentialCause: 'Memory Management'
  }
];

const resolutionEfficiency = [
  { 
    complexity: 'Simple',
    avgResolutionTime: 1.2,
    volume: 145,
    firstResponseTime: 0.3,
    successRate: 98,
    percentage: 49,
    color: '#10B981'
  },
  { 
    complexity: 'Moderate',
    avgResolutionTime: 4.5,
    volume: 89,
    firstResponseTime: 0.8,
    successRate: 92,
    percentage: 30,
    color: '#3B82F6'
  },
  { 
    complexity: 'Complex',
    avgResolutionTime: 8.2,
    volume: 43,
    firstResponseTime: 1.1,
    successRate: 85,
    percentage: 15,
    color: '#F59E0B'
  },
  { 
    complexity: 'Critical',
    avgResolutionTime: 3.1,
    volume: 15,
    firstResponseTime: 0.2,
    successRate: 90,
    percentage: 6,
    color: '#EF4444'
  }
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<'24h' | '7d' | '30d' | '90d' | 'custom'>('30d');
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentIssuePage, setCurrentIssuePage] = useState(1);
  const issuesPerPage = 6; // Show 6 issues per page to match the height

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

  const totalIssuePages = Math.ceil(recurringIssues.length / issuesPerPage);
  const currentIssues = recurringIssues.slice(
    (currentIssuePage - 1) * issuesPerPage,
    currentIssuePage * issuesPerPage
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

      {/* Impact Metrics - Move to top */}
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

      {/* Main Charts Grid - 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* MTTR by Priority */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Mean Time to Resolution by Priority</h2>
          <div className="h-64">
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
          
          {/* Add Response Time Distribution */}
          <div className="mt-6">
            <h3 className="text-md font-semibold text-gray-300 mb-3">Response Time Distribution</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={responseDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis dataKey="range" stroke="#9CA3AF" />
                  <YAxis 
                    yAxisId="left"
                    stroke="#9CA3AF"
                    tickFormatter={(value) => `${value}%`}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="#9CA3AF"
                    tickFormatter={(value) => value}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                    }}
                  />
                  <Bar 
                    yAxisId="left"
                    dataKey="percentage" 
                    fill="#3B82F6" 
                    radius={[4, 4, 0, 0]}
                  >
                    {responseDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`}
                        fill={`rgba(59, 130, 246, ${0.4 + (index * 0.15)})`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-5 gap-2 text-xs text-gray-400">
              {responseDistribution.map((item) => (
                <div key={item.range} className="text-center">
                  <div>{item.count} tickets</div>
                  <div className="text-blue-400">{item.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Issue Distribution */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Issue Distribution by Category</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
                barGap={4}
                barSize={24}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                <XAxis type="number" stroke="#9CA3AF" />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke="#9CA3AF"
                  width={100}
                  tickLine={false}
                  tickMargin={8}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                  }}
                  cursor={{ fill: 'rgba(55, 65, 81, 0.4)' }}
                />
                <Legend />
                <Bar 
                  dataKey="open" 
                  name="Open" 
                  stackId="a" 
                  fill="#EF4444" 
                />
                <Bar 
                  dataKey="inProgress" 
                  name="In Progress" 
                  stackId="a" 
                  fill="#F59E0B" 
                />
                <Bar 
                  dataKey="resolved" 
                  name="Resolved" 
                  stackId="a" 
                  fill="#10B981" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Add a summary table below the chart */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Category</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Total</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Open</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">In Progress</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Resolved</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {categoryData.map((category) => (
                  <tr key={category.name} className="hover:bg-gray-700">
                    <td className="px-4 py-2 text-gray-300">{category.name}</td>
                    <td className="px-4 py-2 text-gray-300">{category.total}</td>
                    <td className="px-4 py-2">
                      <span className="text-red-400">{category.open}</span>
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-yellow-400">{category.inProgress}</span>
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-green-400">{category.resolved}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Two Charts in One Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resolution Efficiency Analysis */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Resolution Efficiency Matrix</h2>
          
          {/* Summary cards at the top */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {resolutionEfficiency.map((item) => (
              <div 
                key={item.complexity} 
                className="bg-gray-900 p-4 rounded-lg border border-gray-700"
              >
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-400">{item.complexity}</span>
                  <span className="text-xs px-2 py-1 rounded-full" style={{ 
                    backgroundColor: `${item.color}20`,
                    color: item.color 
                  }}>
                    {item.percentage}%
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-white">{item.volume}</div>
                  <div className="text-xs text-gray-500">tickets</div>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Avg Resolution</span>
                    <span className="text-white">{item.avgResolutionTime}h</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">First Response</span>
                    <span className="text-white">{item.firstResponseTime}h</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Success Rate</span>
                    <span className="text-white">{item.successRate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main visualization */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={resolutionEfficiency}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis 
                  dataKey="complexity" 
                  stroke="#9CA3AF"
                  axisLine={{ stroke: '#374151' }}
                  tickLine={false}
                />
                <YAxis 
                  yAxisId="time"
                  orientation="left"
                  stroke="#9CA3AF"
                  tickFormatter={(value) => `${value}h`}
                  axisLine={{ stroke: '#374151' }}
                  tickLine={false}
                />
                <YAxis 
                  yAxisId="percentage"
                  orientation="right"
                  stroke="#9CA3AF"
                  tickFormatter={(value) => `${value}%`}
                  axisLine={{ stroke: '#374151' }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '6px',
                    padding: '8px'
                  }}
                  cursor={{ fill: 'rgba(55, 65, 81, 0.1)' }}
                />
                <Legend />
                <Bar 
                  yAxisId="time"
                  dataKey="avgResolutionTime" 
                  name="Resolution Time (h)"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  yAxisId="time"
                  dataKey="firstResponseTime" 
                  name="Response Time (h)"
                  fill="#8B5CF6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  yAxisId="percentage"
                  dataKey="successRate" 
                  name="Success Rate"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Performance indicators */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-gray-900 p-3 rounded-lg">
              <div className="text-sm text-gray-400">Avg Resolution Time</div>
              <div className="mt-1 text-xl font-bold text-white">4.2h</div>
              <div className="text-xs text-blue-400">across all complexities</div>
            </div>
            <div className="bg-gray-900 p-3 rounded-lg">
              <div className="text-sm text-gray-400">First Response</div>
              <div className="mt-1 text-xl font-bold text-white">0.6h</div>
              <div className="text-xs text-purple-400">average response time</div>
            </div>
            <div className="bg-gray-900 p-3 rounded-lg">
              <div className="text-sm text-gray-400">Overall Success</div>
              <div className="mt-1 text-xl font-bold text-white">91.3%</div>
              <div className="text-xs text-green-400">resolution rate</div>
            </div>
          </div>
        </div>

        {/* Recurring Issues with Pagination */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recurring Issue Patterns</h2>
          <div>
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
                {currentIssues.map((issue, index) => (
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

            {/* Pagination Controls */}
            <div className="mt-4 flex items-center justify-between border-t border-gray-700 pt-4">
              <div className="text-sm text-gray-400">
                Showing {((currentIssuePage - 1) * issuesPerPage) + 1} to {Math.min(currentIssuePage * issuesPerPage, recurringIssues.length)} of {recurringIssues.length} issues
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentIssuePage(p => Math.max(1, p - 1))}
                  disabled={currentIssuePage === 1}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    currentIssuePage === 1
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  Previous
                </button>
                {Array.from({ length: totalIssuePages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentIssuePage(page)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      currentIssuePage === page
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentIssuePage(p => Math.min(totalIssuePages, p + 1))}
                  disabled={currentIssuePage === totalIssuePages}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    currentIssuePage === totalIssuePages
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

      {/* Keyword Analysis - Full Width */}
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