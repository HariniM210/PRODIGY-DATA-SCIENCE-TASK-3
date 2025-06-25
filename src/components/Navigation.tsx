import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationItem {
  name: string;
  icon: React.ReactNode;
  path: string;
}

interface NavigationProps {
  items: NavigationItem[];
}

const Navigation: React.FC<NavigationProps> = ({ items }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="bg-gray-900 border-r border-gray-800 w-full md:w-64 md:min-h-0">
      <div className="flex md:flex-col p-1 md:p-3 md:pt-6 gap-1 md:gap-2">
        {items.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`
              flex items-center gap-3 px-3 py-2 rounded-md text-left w-full
              transition-all duration-200
              ${location.pathname === item.path 
                ? 'bg-gray-800 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.1)]' 
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'}
            `}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span className="hidden md:inline text-sm font-medium">{item.name}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;