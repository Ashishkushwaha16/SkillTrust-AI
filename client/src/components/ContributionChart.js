import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const ContributionChart = ({ data = [] }) => {
  // Use provided data or show empty chart
  const chartData = data.length > 0 ? data : [];

  if (chartData.length === 0) {
    return (
      <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">GitHub Activity</h3>
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-gray-500">No contribution data available. Sync your GitHub account to see activity.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
      <h3 className="text-lg font-semibold text-gray-100 mb-4">GitHub Activity</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="month" 
            stroke="#9CA3AF" 
            tick={{ fill: '#9CA3AF' }}
          />
          <YAxis 
            stroke="#9CA3AF" 
            tick={{ fill: '#9CA3AF' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e293b', 
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#f1f5f9'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="commits" 
            stroke="#0ea5e9" 
            fillOpacity={1} 
            fill="url(#colorCommits)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ContributionChart;
