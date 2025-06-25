import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Play, Settings, AlertCircle } from 'lucide-react';
import Card from '../components/Card';
import TreeVisualization from '../components/TreeVisualization';

const DecisionTreeView: React.FC = () => {
  const { dataset, decisionTree, trainModel } = useAppContext();
  const [trainingRatio, setTrainingRatio] = useState<number>(0.7);
  const [targetVariable] = useState<string>('subscribed');
  const [loading, setLoading] = useState<boolean>(false);
  
  const handleTrainModel = () => {
    setLoading(true);
    // Small timeout to allow UI to update
    setTimeout(() => {
      trainModel(trainingRatio, targetVariable);
      setLoading(false);
    }, 500);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Decision Tree Model
        </h2>
        <p className="text-gray-400 mt-1">
          Train and visualize a decision tree model to predict customer subscription
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-4">
            <Settings className="h-5 w-5 text-gray-400" />
            <span>Model Configuration</span>
          </h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="trainingRatio" className="block text-sm font-medium text-gray-400 mb-1">
                Training/Test Split Ratio: {(trainingRatio * 100).toFixed(0)}%
              </label>
              <input
                id="trainingRatio"
                type="range"
                min="0.5"
                max="0.9"
                step="0.05"
                value={trainingRatio}
                onChange={(e) => setTrainingRatio(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>50/50</span>
                <span>90/10</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Target Variable
              </label>
              <div className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300">
                subscribed (boolean)
              </div>
            </div>
            
            <div className="pt-4">
              <button
                onClick={handleTrainModel}
                disabled={loading}
                className={`w-full px-4 py-2 rounded-md font-medium flex items-center justify-center gap-2 transition-colors ${
                  loading 
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white'
                }`}
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Training Model...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Train Model</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="text-sm text-gray-400 mt-2">
              <p>Dataset size: {dataset.length} records</p>
              <p>Training set: {Math.floor(dataset.length * trainingRatio)} records</p>
              <p>Test set: {dataset.length - Math.floor(dataset.length * trainingRatio)} records</p>
            </div>
          </div>
        </Card>
        
        <Card className="lg:col-span-2 min-h-[500px] flex flex-col">
          {decisionTree ? (
            <TreeVisualization tree={decisionTree} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <AlertCircle className="h-12 w-12 mb-3 text-gray-600" />
              <p className="text-lg font-medium">No Model Trained</p>
              <p className="text-sm text-gray-600 mt-1 text-center max-w-md">
                Configure the parameters and train a model to visualize the decision tree
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DecisionTreeView;