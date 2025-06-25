import React from 'react';
import { Customer } from '../types';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

interface PredictionResultsProps {
  predictions: { customer: Customer; prediction: boolean }[];
}

const PredictionResults: React.FC<PredictionResultsProps> = ({ predictions }) => {
  if (predictions.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-gray-500">
        <AlertCircle className="h-10 w-10 mb-2 text-gray-600" />
        <p className="text-base font-medium">No Predictions Yet</p>
        <p className="text-sm text-gray-600 mt-1 text-center">
          Fill in customer information and make a prediction
        </p>
      </div>
    );
  }
  
  // We'll show the most recent prediction at the top
  const sortedPredictions = [...predictions].reverse();
  
  return (
    <div className="space-y-4">
      {sortedPredictions.map((item, index) => (
        <div 
          key={index} 
          className={`border rounded-lg p-4 transition-all ${
            item.prediction 
              ? 'bg-green-900 bg-opacity-20 border-green-800' 
              : 'bg-red-900 bg-opacity-20 border-red-800'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`mt-1 p-1 rounded-full ${item.prediction ? 'text-green-400' : 'text-red-400'}`}>
              {item.prediction ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            </div>
            
            <div className="flex-1">
              <h4 className={`text-lg font-medium ${item.prediction ? 'text-green-300' : 'text-red-300'}`}>
                {item.prediction ? 'Customer likely to subscribe' : 'Customer unlikely to subscribe'}
              </h4>
              
              <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="text-gray-500">Age:</span>
                  <span className="text-gray-300">{item.customer.age}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-500">Job:</span>
                  <span className="text-gray-300">{item.customer.job}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-500">Education:</span>
                  <span className="text-gray-300">{item.customer.education}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-500">Balance:</span>
                  <span className="text-gray-300">{item.customer.balance}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-500">Housing:</span>
                  <span className="text-gray-300">{item.customer.housing}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-500">Loan:</span>
                  <span className="text-gray-300">{item.customer.loan}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PredictionResults;