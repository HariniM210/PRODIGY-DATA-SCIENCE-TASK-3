import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Play, UserPlus, AlertCircle, ChevronRight } from 'lucide-react';
import Card from '../components/Card';
import { Customer } from '../types';
import PredictionResults from '../components/PredictionResults';

const DEFAULT_CUSTOMER: Partial<Customer> = {
  age: 42,
  job: 'management',
  marital: 'married',
  education: 'university.degree',
  default: 'no',
  balance: 2500,
  housing: 'yes',
  loan: 'no',
  contact: 'cellular',
  day: 15,
  month: 'may',
  duration: 240,
  campaign: 1,
  pdays: -1,
  previous: 0,
  poutcome: 'nonexistent'
};

const PredictionsView: React.FC = () => {
  const { decisionTree, makePrediction, predictions } = useAppContext();
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>(DEFAULT_CUSTOMER);
  
  const handleInputChange = (field: keyof Customer, value: string | number) => {
    setNewCustomer(prev => ({ ...prev, [field]: value }));
  };
  
  const handlePredict = () => {
    const customer = { 
      id: Date.now(), 
      ...newCustomer,
      subscribed: false // This value doesn't matter for prediction
    } as Customer;
    
    makePrediction(customer);
  };
  
  const resetForm = () => {
    setNewCustomer(DEFAULT_CUSTOMER);
  };
  
  if (!decisionTree) {
    return (
      <div className="h-[calc(100vh-12rem)] flex flex-col items-center justify-center text-gray-500">
        <AlertCircle className="h-12 w-12 mb-3 text-gray-600" />
        <p className="text-lg font-medium">No Model Trained</p>
        <p className="text-sm text-gray-600 mt-1 text-center max-w-md">
          Train a model first to make predictions
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          Make Predictions
        </h2>
        <p className="text-gray-400 mt-1">
          Use the trained model to predict if a customer will subscribe
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-4">
            <UserPlus className="h-5 w-5 text-gray-400" />
            <span>Customer Information</span>
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Age</label>
              <input
                type="number"
                value={newCustomer.age}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Job</label>
              <select
                value={newCustomer.job}
                onChange={(e) => handleInputChange('job', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                {['admin.', 'blue-collar', 'entrepreneur', 'housemaid', 'management', 'retired', 'self-employed', 'services', 'student', 'technician', 'unemployed', 'unknown'].map(job => (
                  <option key={job} value={job}>{job}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Marital Status</label>
              <select
                value={newCustomer.marital}
                onChange={(e) => handleInputChange('marital', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                {['divorced', 'married', 'single', 'unknown'].map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Education</label>
              <select
                value={newCustomer.education}
                onChange={(e) => handleInputChange('education', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                {['basic.4y', 'basic.6y', 'basic.9y', 'high.school', 'illiterate', 'professional.course', 'university.degree', 'unknown'].map(edu => (
                  <option key={edu} value={edu}>{edu}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Balance</label>
              <input
                type="number"
                value={newCustomer.balance}
                onChange={(e) => handleInputChange('balance', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Housing Loan</label>
              <select
                value={newCustomer.housing}
                onChange={(e) => handleInputChange('housing', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                {['yes', 'no', 'unknown'].map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Personal Loan</label>
              <select
                value={newCustomer.loan}
                onChange={(e) => handleInputChange('loan', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                {['yes', 'no', 'unknown'].map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Last Contact Duration (sec)</label>
              <input
                type="number"
                value={newCustomer.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="mt-6 flex gap-3">
            <button
              onClick={handlePredict}
              className="px-4 py-2 rounded-md font-medium flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-colors"
            >
              <Play className="h-4 w-4" />
              <span>Make Prediction</span>
            </button>
            
            <button
              onClick={resetForm}
              className="px-4 py-2 rounded-md font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              Reset
            </button>
          </div>
        </Card>
        
        <Card>
          <h3 className="text-lg font-medium text-white mb-4">Prediction Results</h3>
          <PredictionResults predictions={predictions} />
        </Card>
      </div>
    </div>
  );
};

export default PredictionsView;