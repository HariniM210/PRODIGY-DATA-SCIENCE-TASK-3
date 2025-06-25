import React, { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  color: 'blue' | 'green' | 'purple' | 'cyan' | 'pink';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description, icon, color }) => {
  const getGradient = () => {
    switch (color) {
      case 'blue': return 'from-blue-600 to-blue-800';
      case 'green': return 'from-green-600 to-green-800';
      case 'purple': return 'from-purple-600 to-purple-800';
      case 'cyan': return 'from-cyan-600 to-cyan-800';
      case 'pink': return 'from-pink-600 to-pink-800';
      default: return 'from-blue-600 to-blue-800';
    }
  };

  const getTextColor = () => {
    switch (color) {
      case 'blue': return 'text-blue-400';
      case 'green': return 'text-green-400';
      case 'purple': return 'text-purple-400';
      case 'cyan': return 'text-cyan-400';
      case 'pink': return 'text-pink-400';
      default: return 'text-blue-400';
    }
  };
  
  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-hidden relative`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} opacity-10`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-400">{title}</h3>
          <div className={getTextColor()}>{icon}</div>
        </div>
        
        <div className={`text-2xl font-bold ${getTextColor()}`}>
          {value}
        </div>
        
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
    </div>
  );
};

export default MetricCard;