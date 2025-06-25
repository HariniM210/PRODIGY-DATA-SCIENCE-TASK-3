import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Customer, DecisionTreeNode, ModelMetrics } from '../types';
import { generateMockDataset } from '../utils/dataGenerator';
import { trainDecisionTree } from '../utils/decisionTree';

interface AppContextType {
  dataset: Customer[];
  testDataset: Customer[];
  decisionTree: DecisionTreeNode | null;
  metrics: ModelMetrics | null;
  predictions: { customer: Customer; prediction: boolean }[];
  regenerateDataset: (count: number) => void;
  trainModel: (trainingRatio: number, targetVariable: string) => void;
  makePrediction: (customer: Customer) => boolean;
  resetModel: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dataset, setDataset] = useState<Customer[]>(generateMockDataset(1000));
  const [testDataset, setTestDataset] = useState<Customer[]>([]);
  const [decisionTree, setDecisionTree] = useState<DecisionTreeNode | null>(null);
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [predictions, setPredictions] = useState<{ customer: Customer; prediction: boolean }[]>([]);

  const regenerateDataset = (count: number) => {
    const newDataset = generateMockDataset(count);
    setDataset(newDataset);
    resetModel();
  };

  const trainModel = (trainingRatio: number, targetVariable: string) => {
    // Split dataset into training and test sets
    const trainingCount = Math.floor(dataset.length * trainingRatio);
    const shuffled = [...dataset].sort(() => 0.5 - Math.random());
    const trainingSet = shuffled.slice(0, trainingCount);
    const testSet = shuffled.slice(trainingCount);
    
    setTestDataset(testSet);

    // Train the model
    const { tree, metrics: modelMetrics } = trainDecisionTree(trainingSet, testSet, targetVariable);
    
    setDecisionTree(tree);
    setMetrics(modelMetrics);
    setPredictions([]);
  };

  const makePrediction = (customer: Customer): boolean => {
    if (!decisionTree) return false;
    
    // Logic to traverse the decision tree and make a prediction
    const prediction = traverseTree(decisionTree, customer);
    setPredictions([...predictions, { customer, prediction }]);
    
    return prediction;
  };

  const traverseTree = (node: DecisionTreeNode, customer: Customer): boolean => {
    if (node.isLeaf) {
      return node.prediction || false;
    }

    if (!node.attribute || node.attribute === '') {
      return false;
    }

    const attributeValue = customer[node.attribute as keyof Customer];
    
    if (typeof attributeValue === 'number') {
      if (attributeValue <= (node.threshold || 0)) {
        return traverseTree(node.left!, customer);
      } else {
        return traverseTree(node.right!, customer);
      }
    } else if (typeof attributeValue === 'string') {
      const branch = node.branches?.[attributeValue];
      return branch ? traverseTree(branch, customer) : false;
    } else {
      return false;
    }
  };

  const resetModel = () => {
    setDecisionTree(null);
    setMetrics(null);
    setPredictions([]);
    setTestDataset([]);
  };

  return (
    <AppContext.Provider
      value={{
        dataset,
        testDataset,
        decisionTree,
        metrics,
        predictions,
        regenerateDataset,
        trainModel,
        makePrediction,
        resetModel
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};