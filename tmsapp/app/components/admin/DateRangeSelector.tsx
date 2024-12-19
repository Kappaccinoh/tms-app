'use client';

type DateRange = '24h' | '7d' | '30d' | '90d' | 'custom';

interface DateRangeSelectorProps {
  selectedRange: DateRange;
  onRangeChange: (range: DateRange) => void;
}

export default function DateRangeSelector({ selectedRange, onRangeChange }: DateRangeSelectorProps) {
  return (
    <div className="flex space-x-2 bg-gray-900 rounded-lg p-1">
      {[
        { label: '24h', value: '24h' },
        { label: '7d', value: '7d' },
        { label: '30d', value: '30d' },
        { label: '90d', value: '90d' },
        { label: 'Custom', value: 'custom' },
      ].map(({ label, value }) => (
        <button
          key={value}
          onClick={() => onRangeChange(value as DateRange)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors
            ${selectedRange === value 
              ? 'bg-blue-500 text-white' 
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
} 