import React from 'react';
import { Activity, BarChart4, Database, GitBranch } from 'lucide-react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import { AppProvider } from './context/AppContext';
import AppRouter from './router/AppRouter';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
        <Header />
        <div className="flex flex-col md:flex-row flex-1">
          <Navigation 
            items={[
              { name: 'Dataset', icon: <Database className="w-5 h-5" />, path: '/' },
              { name: 'Decision Tree', icon: <GitBranch className="w-5 h-5" />, path: '/decision-tree' },
              { name: 'Model Performance', icon: <Activity className="w-5 h-5" />, path: '/performance' },
              { name: 'Predictions', icon: <BarChart4 className="w-5 h-5" />, path: '/predictions' }
            ]} 
          />
          <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
            <AppRouter />
          </main>
        </div>
      </div>
    </AppProvider>
  );
}

export default App;