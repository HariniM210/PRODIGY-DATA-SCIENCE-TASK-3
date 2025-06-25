export interface Customer {
  id: number;
  age: number;
  job: string;
  marital: string;
  education: string;
  default: string;
  balance: number;
  housing: string;
  loan: string;
  contact: string;
  day: number;
  month: string;
  duration: number;
  campaign: number;
  pdays: number;
  previous: number;
  poutcome: string;
  subscribed: boolean;
}

export interface DecisionTreeNode {
  attribute?: string;
  threshold?: number;
  gain?: number;
  samples?: number;
  left?: DecisionTreeNode;
  right?: DecisionTreeNode;
  branches?: Record<string, DecisionTreeNode>;
  isLeaf?: boolean;
  prediction?: boolean;
  depth?: number;
  distribution?: [number, number];
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: {
    truePositives: number;
    falsePositives: number;
    trueNegatives: number;
    falseNegatives: number;
  };
}

export interface DataColumn {
  name: string;
  type: 'numeric' | 'categorical';
  isTarget?: boolean;
}

export interface TreeVisualizationNode {
  name: string;
  children?: TreeVisualizationNode[];
  value?: number;
  prediction?: boolean;
  samples?: number;
  depth?: number;
  attribute?: string;
  threshold?: number | string;
  distribution?: [number, number];
}