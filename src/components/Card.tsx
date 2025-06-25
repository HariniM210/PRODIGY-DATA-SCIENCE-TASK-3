import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-lg p-4 md:p-6 shadow-lg ${className}`}>
      {children}
    </div>
  );
};

export default Card;