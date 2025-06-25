import React, { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, description }) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-start gap-4">
      <div className="bg-gray-800 rounded-md p-2 flex-shrink-0">
        {icon}
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <div className="text-2xl font-bold text-white mt-0.5">{value}</div>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
    </div>
  );
};

export default StatsCard;