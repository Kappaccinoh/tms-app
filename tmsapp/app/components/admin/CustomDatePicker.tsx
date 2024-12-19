'use client';

import { useState, useEffect } from 'react';

interface CustomDatePickerProps {
  onApply: (startDate: Date, endDate: Date) => void;
  onClose: () => void;
}

const presets = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 14 days', days: 14 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
];

export default function CustomDatePicker({ onApply, onClose }: CustomDatePickerProps) {
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [error, setError] = useState<string>('');

  useEffect(() => {
    validateDates(startDate, endDate);
  }, [startDate, endDate]);

  const validateDates = (start: string, end: string) => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const now = new Date().getTime();

    if (startTime > endTime) {
      setError('Start date cannot be after end date');
    } else if (endTime > now) {
      setError('End date cannot be in the future');
    } else {
      setError('');
    }
  };

  const applyPreset = (days: number) => {
    const end = new Date();
    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  const handleApply = () => {
    if (!error) {
      onApply(new Date(startDate), new Date(endDate));
      onClose();
    }
  };

  return (
    <div className="absolute right-0 top-12 bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg z-50 w-80">
      <div className="space-y-4">
        {/* Presets */}
        <div className="grid grid-cols-2 gap-2">
          {presets.map(({ label, days }) => (
            <button
              key={days}
              onClick={() => applyPreset(days)}
              className="px-3 py-2 text-sm bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="border-t border-gray-700 pt-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-gray-900 text-gray-300 px-3 py-2 rounded-md text-sm border border-gray-700 focus:outline-none focus:border-blue-500 w-full"
            />
          </div>
          <div className="mt-3">
            <label className="block text-sm text-gray-400 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-gray-900 text-gray-300 px-3 py-2 rounded-md text-sm border border-gray-700 focus:outline-none focus:border-blue-500 w-full"
            />
          </div>
        </div>

        {error && (
          <div className="text-red-400 text-sm">{error}</div>
        )}

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm text-gray-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!!error}
            className={`px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 
              ${error ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
} 