'use client';

import { useState } from 'react';
import { ArrowDownTrayIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface Report {
  id: string;
  name: string;
  description: string;
  lastGenerated: string;
  status: 'Ready' | 'Generating' | 'Failed';
  format: 'PDF' | 'CSV' | 'Excel';
  frequency: 'On-Demand' | 'Daily' | 'Weekly' | 'Monthly';
}

const reportTemplates: Report[] = [
  {
    id: '1',
    name: 'Monthly Performance Summary',
    description: 'Overview of ticket volumes, resolution times, and SLA compliance',
    lastGenerated: '2024-03-15 09:00 AM',
    status: 'Ready',
    format: 'PDF',
    frequency: 'Monthly'
  },
  {
    id: '2',
    name: 'Team Productivity Report',
    description: 'Detailed analysis of team performance and workload distribution',
    lastGenerated: '2024-03-14 11:30 AM',
    status: 'Ready',
    format: 'Excel',
    frequency: 'Weekly'
  },
  {
    id: '3',
    name: 'SLA Compliance Report',
    description: 'Detailed breakdown of SLA metrics and breaches',
    lastGenerated: '2024-03-15 08:00 AM',
    status: 'Generating',
    format: 'PDF',
    frequency: 'Daily'
  },
  {
    id: '4',
    name: 'Ticket Category Analysis',
    description: 'Distribution of tickets across different categories and priorities',
    lastGenerated: '2024-03-15 07:00 AM',
    status: 'Ready',
    format: 'CSV',
    frequency: 'Weekly'
  }
];

export default function ReportsPage() {
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [selectedFrequency, setSelectedFrequency] = useState<string>('all');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Reports</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Create Custom Report
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Format</label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="bg-gray-900 text-gray-300 px-3 py-2 rounded-md text-sm border border-gray-700 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Formats</option>
              <option value="PDF">PDF</option>
              <option value="CSV">CSV</option>
              <option value="Excel">Excel</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Frequency</label>
            <select
              value={selectedFrequency}
              onChange={(e) => setSelectedFrequency(e.target.value)}
              className="bg-gray-900 text-gray-300 px-3 py-2 rounded-md text-sm border border-gray-700 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Frequencies</option>
              <option value="On-Demand">On-Demand</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Report Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportTemplates.map((report) => (
          <div key={report.id} className="bg-gray-800 rounded-lg border border-gray-700 p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-medium text-white">{report.name}</h3>
                <p className="text-sm text-gray-400">{report.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                report.status === 'Ready' ? 'bg-green-400/10 text-green-400' :
                report.status === 'Generating' ? 'bg-blue-400/10 text-blue-400' :
                'bg-red-400/10 text-red-400'
              }`}>
                {report.status}
              </span>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex space-x-4 text-sm text-gray-400">
                <span>Format: {report.format}</span>
                <span>Frequency: {report.frequency}</span>
                <span>Last Generated: {report.lastGenerated}</span>
              </div>
              <div className="flex space-x-2">
                <button 
                  className="p-2 text-gray-400 hover:text-white"
                  title="Regenerate Report"
                >
                  <ArrowPathIcon className="h-5 w-5" />
                </button>
                <button 
                  className="p-2 text-gray-400 hover:text-white"
                  title="Download Report"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Reports */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recently Generated Reports</h2>
        <table className="w-full">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Report Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Generated</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Format</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {reportTemplates.map((report) => (
              <tr key={report.id} className="hover:bg-gray-700">
                <td className="px-6 py-4 text-sm text-gray-300">{report.name}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{report.lastGenerated}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{report.format}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    report.status === 'Ready' ? 'bg-green-400/10 text-green-400' :
                    report.status === 'Generating' ? 'bg-blue-400/10 text-blue-400' :
                    'bg-red-400/10 text-red-400'
                  }`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex space-x-2">
                    <button className="text-blue-400 hover:text-blue-300">Download</button>
                    <button className="text-gray-400 hover:text-white">View</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 