import React from 'react';

type FilterProps = {
  onSearch: (val: string) => void;
  onStatusChange: (status: string) => void;
  onDateChange: (range: string) => void;
};

export const DocumentFilters = ({
  onSearch,
  onStatusChange,
  onDateChange,
}: FilterProps) => {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex gap-2 border rounded px-2 py-1">
        <input
          placeholder="Search documents..."
          onChange={(e) => onSearch(e.target.value)}
          className="outline-none"
        />
        <button className="bg-blue-500 text-white px-3 py-1 rounded">
          Search
        </button>
      </div>

      <div className="flex gap-2">
        {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
          <button
            key={status}
            onClick={() => onStatusChange(status)}
            className="px-4 py-1 border rounded hover:bg-gray-100"
          >
            {status}
          </button>
        ))}
      </div>

      <select
        onChange={(e) => onDateChange(e.target.value)}
        className="border rounded p-1"
      >
        <option value="all">All Time</option>
        <option value="1m">Last 1 Month</option>
        <option value="3m">Last 3 Months</option>
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
      </select>
    </div>
  );
};
