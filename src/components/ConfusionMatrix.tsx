import React from 'react';

interface ConfusionMatrixProps {
  truePositives: number;
  falsePositives: number;
  trueNegatives: number;
  falseNegatives: number;
}

const ConfusionMatrix: React.FC<ConfusionMatrixProps> = ({
  truePositives,
  falsePositives,
  trueNegatives,
  falseNegatives
}) => {
  const total = truePositives + falsePositives + trueNegatives + falseNegatives;
  
  return (
    <div className="relative">
      <div className="grid grid-cols-2 grid-rows-2 gap-1 w-64 h-64 mx-auto">
        <div 
          className="bg-green-900 bg-opacity-40 border border-green-700 rounded-md flex flex-col items-center justify-center p-2"
          style={{ backgroundImage: 'radial-gradient(circle at center, rgba(34, 197, 94, 0.2), transparent)' }}
        >
          <span className="text-2xl font-bold text-green-400">{truePositives}</span>
          <span className="text-xs text-green-300 mt-1">True Positives</span>
          <span className="text-xs text-green-500 mt-1">{((truePositives / total) * 100).toFixed(1)}%</span>
        </div>
        
        <div 
          className="bg-red-900 bg-opacity-40 border border-red-800 rounded-md flex flex-col items-center justify-center p-2"
          style={{ backgroundImage: 'radial-gradient(circle at center, rgba(239, 68, 68, 0.2), transparent)' }}
        >
          <span className="text-2xl font-bold text-red-400">{falsePositives}</span>
          <span className="text-xs text-red-300 mt-1">False Positives</span>
          <span className="text-xs text-red-500 mt-1">{((falsePositives / total) * 100).toFixed(1)}%</span>
        </div>
        
        <div 
          className="bg-red-900 bg-opacity-40 border border-red-800 rounded-md flex flex-col items-center justify-center p-2"
          style={{ backgroundImage: 'radial-gradient(circle at center, rgba(239, 68, 68, 0.2), transparent)' }}
        >
          <span className="text-2xl font-bold text-red-400">{falseNegatives}</span>
          <span className="text-xs text-red-300 mt-1">False Negatives</span>
          <span className="text-xs text-red-500 mt-1">{((falseNegatives / total) * 100).toFixed(1)}%</span>
        </div>
        
        <div 
          className="bg-green-900 bg-opacity-40 border border-green-700 rounded-md flex flex-col items-center justify-center p-2"
          style={{ backgroundImage: 'radial-gradient(circle at center, rgba(34, 197, 94, 0.2), transparent)' }}
        >
          <span className="text-2xl font-bold text-green-400">{trueNegatives}</span>
          <span className="text-xs text-green-300 mt-1">True Negatives</span>
          <span className="text-xs text-green-500 mt-1">{((trueNegatives / total) * 100).toFixed(1)}%</span>
        </div>
      </div>
      
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-6 text-xs font-medium text-gray-400 rotate-90">
        Actual Class
      </div>
      
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6 text-xs font-medium text-gray-400">
        Predicted Class
      </div>
      
      <div className="absolute bottom-[-30px] left-[25%] transform -translate-x-1/2 text-xs text-green-400">
        Subscribed
      </div>
      
      <div className="absolute bottom-[-30px] left-[75%] transform -translate-x-1/2 text-xs text-red-400">
        Not Subscribed
      </div>
      
      <div className="absolute top-[25%] left-[-30px] transform -translate-y-1/2 text-xs text-green-400 rotate-90">
        Subscribed
      </div>
      
      <div className="absolute top-[75%] left-[-30px] transform -translate-y-1/2 text-xs text-red-400 rotate-90">
        Not Subscribed
      </div>
    </div>
  );
};

export default ConfusionMatrix;