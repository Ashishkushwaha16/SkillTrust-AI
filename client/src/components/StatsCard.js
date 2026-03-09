import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatsCard = ({ title, value, subtitle, icon: Icon, trend, trendValue }) => {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-400';
    if (trend === 'down') return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <div className="bg-dark-800 rounded-xl p-6 border border-dark-700 hover:border-primary-500/50 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-primary-500/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary-400" />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${getTrendColor()}`}>
            {getTrendIcon()}
            {trendValue && <span>{trendValue}</span>}
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-100 mb-1">{value}</h3>
      <p className="text-sm text-gray-400">{title}</p>
      {subtitle && (
        <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
      )}
    </div>
  );
};

export default StatsCard;
