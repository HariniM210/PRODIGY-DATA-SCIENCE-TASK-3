import React from 'react';
import { BrainCircuit } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <BrainCircuit className="h-7 w-7 text-cyan-400" />
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
              DecisionForest
            </span>
          </h1>
          <p className="text-xs text-gray-400">Customer Purchase Prediction</p>
        </div>
      </div>
      <div className="hidden md:flex items-center space-x-4">
        <button className="text-sm px-3 py-1.5 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors">
          Documentation
        </button>
        <button className="text-sm px-3 py-1.5 rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 transition-colors">
          Save Project
        </button>
      </div>
    </header>
  );
};

export default Header;