import React from 'react';
import { useAppContext } from '../context/AppContext';
import { AlertCircle, BarChart, PieChart } from 'lucide-react';
import Card from '../components/Card';
import MetricCard from '../components/MetricCard';
import ConfusionMatrix from '../components/ConfusionMatrix';

const PerformanceView: React.FC = () => {
  const { metrics, testDataset } = useAppContext();
  
  if (!metrics) {
    return (
      <div className="h-[calc(100vh-12rem)] flex flex-col items-center justify-center text-gray-500">
        <AlertCircle className="h-12 w-12 mb-3 text-gray-600" />
        <p className="text-lg font-medium">No Model Evaluated</p>
        <p className="text-sm text-gray-600 mt-1 text-center max-w-md">
          Train a model first to see performance metrics
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-cyan-400">
          Model Performance
        </h2>
        <p className="text-gray-400 mt-1">
          Evaluate model performance on the test dataset ({testDataset.length} records)
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard 
          title="Accuracy"
          value={(metrics.accuracy * 100).toFixed(1) + '%'}
          description="Overall correctness of predictions"
          icon={<BarChart className="h-5 w-5 text-cyan-400" />}
          color="cyan"
        />
        
        <MetricCard 
          title="Precision"
          value={(metrics.precision * 100).toFixed(1) + '%'}
          description="True positives / predicted positives"
          icon={<PieChart className="h-5 w-5 text-purple-400" />}
          color="purple"
        />
        
        <MetricCard 
          title="Recall"
          value={(metrics.recall * 100).toFixed(1) + '%'}
          description="True positives / actual positives"
          icon={<PieChart className="h-5 w-5 text-green-400" />}
          color="green"
        />
        
        <MetricCard 
          title="F1 Score"
          value={(metrics.f1Score * 100).toFixed(1) + '%'}
          description="Harmonic mean of precision and recall"
          icon={<BarChart className="h-5 w-5 text-blue-400" />}
          color="blue"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-medium text-white mb-4">Confusion Matrix</h3>
          <div className="flex items-center justify-center p-4">
            <ConfusionMatrix
              truePositives={metrics.confusionMatrix.truePositives}
              falsePositives={metrics.confusionMatrix.falsePositives}
              trueNegatives={metrics.confusionMatrix.trueNegatives}
              falseNegatives={metrics.confusionMatrix.falseNegatives}
            />
          </div>
        </Card>
        
        <Card>
          <h3 className="text-lg font-medium text-white mb-4">Interpretation</h3>
          
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="text-gray-300 font-medium">What does this mean?</h4>
              <p className="text-gray-400 mt-1">
                The model correctly predicts {(metrics.accuracy * 100).toFixed(1)}% of all cases.
              </p>
            </div>
            
            <div>
              <h4 className="text-gray-300 font-medium">Precision</h4>
              <p className="text-gray-400 mt-1">
                When the model predicts a customer will subscribe, it's right {(metrics.precision * 100).toFixed(1)}% of the time.
              </p>
            </div>
            
            <div>
              <h4 className="text-gray-300 font-medium">Recall</h4>
              <p className="text-gray-400 mt-1">
                The model correctly identifies {(metrics.recall * 100).toFixed(1)}% of all customers who actually subscribed.
              </p>
            </div>
            
            <div>
              <h4 className="text-gray-300 font-medium">F1 Score</h4>
              <p className="text-gray-400 mt-1">
                The F1 score of {(metrics.f1Score * 100).toFixed(1)}% is a balanced measure between precision and recall.
              </p>
            </div>
            
            <div className="pt-2">
              <h4 className="text-gray-300 font-medium">Business Impact</h4>
              <p className="text-gray-400 mt-1">
                This model can help identify potential subscribers, allowing for more targeted marketing campaigns and improved resource allocation.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceView;