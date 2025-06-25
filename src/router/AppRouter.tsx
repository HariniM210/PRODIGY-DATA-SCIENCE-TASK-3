import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DatasetView from '../views/DatasetView';
import DecisionTreeView from '../views/DecisionTreeView';
import PerformanceView from '../views/PerformanceView';
import PredictionsView from '../views/PredictionsView';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DatasetView />} />
      <Route path="/decision-tree" element={<DecisionTreeView />} />
      <Route path="/performance" element={<PerformanceView />} />
      <Route path="/predictions" element={<PredictionsView />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;