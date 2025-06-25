import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { FileSpreadsheet, RefreshCcw, Search } from 'lucide-react';
import DataTable from '../components/DataTable';
import Card from '../components/Card';
import StatsCard from '../components/StatsCard';

const DatasetView: React.FC = () => {
  const { dataset, regenerateDataset } = useAppContext();
  const [dataCount, setDataCount] = useState<number>(1000);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const filteredData = useMemo(() => {
    if (!searchTerm) return dataset;
    
    const lowerCaseSearch = searchTerm.toLowerCase();
    return dataset.filter(customer => 
      Object.values(customer).some(value => 
        String(value).toLowerCase().includes(lowerCaseSearch)
      )
    );
  }, [dataset, searchTerm]);
  
  // Calculate some statistics
  const stats = useMemo(() => {
    const subscribedCount = dataset.filter(c => c.subscribed).length;
    const averageAge = dataset.reduce((sum, c) => sum + c.age, 0) / dataset.length;
    const averageBalance = dataset.reduce((sum, c) => sum + c.balance, 0) / dataset.length;
    
    return {
      total: dataset.length,
      subscribed: subscribedCount,
      notSubscribed: dataset.length - subscribedCount,
      subscribedPercentage: (subscribedCount / dataset.length) * 100,
      averageAge,
      averageBalance
    };
  }, [dataset]);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
          Customer Dataset
        </h2>
        <p className="text-gray-400 mt-1">
          Explore and manage the dataset used for training the decision tree model
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard 
          title="Total Records"
          value={stats.total}
          icon={<FileSpreadsheet className="h-5 w-5 text-cyan-400" />}
          description="Total number of customer records"
        />
        
        <StatsCard 
          title="Subscribed"
          value={`${stats.subscribedPercentage.toFixed(1)}%`}
          icon={<div className="h-5 w-5 rounded-full bg-green-400 flex items-center justify-center text-xs font-bold text-green-900">Y</div>}
          description={`${stats.subscribed} customers subscribed`}
        />
        
        <StatsCard 
          title="Not Subscribed"
          value={`${(100 - stats.subscribedPercentage).toFixed(1)}%`}
          icon={<div className="h-5 w-5 rounded-full bg-red-400 flex items-center justify-center text-xs font-bold text-red-900">N</div>}
          description={`${stats.notSubscribed} customers did not subscribe`}
        />
      </div>
      
      <Card>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search dataset..."
              className="pl-10 pr-4 py-2 w-full bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 items-center w-full md:w-auto">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <label htmlFor="dataCount" className="text-sm text-gray-400">
                Sample Size:
              </label>
              <input
                id="dataCount"
                type="number"
                min="100"
                max="10000"
                step="100"
                className="w-24 bg-gray-800 border border-gray-700 rounded-md p-2 text-sm text-gray-200"
                value={dataCount}
                onChange={(e) => setDataCount(Math.max(100, Math.min(10000, parseInt(e.target.value) || 1000)))}
              />
            </div>
            
            <button
              onClick={() => regenerateDataset(dataCount)}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-md bg-gray-800 text-cyan-400 border border-gray-700 hover:bg-gray-700 flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCcw className="h-4 w-4" />
              <span>Regenerate Dataset</span>
            </button>
          </div>
        </div>
        
        <DataTable data={filteredData} />
      </Card>
    </div>
  );
};

export default DatasetView;