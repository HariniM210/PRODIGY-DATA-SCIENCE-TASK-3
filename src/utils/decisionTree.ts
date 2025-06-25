import { Customer, DecisionTreeNode, ModelMetrics } from '../types';

interface AttributeInfo {
  name: string;
  type: 'numeric' | 'categorical';
}

// Helper function to calculate entropy
const calculateEntropy = (data: Customer[], targetAttribute: string): number => {
  if (data.length === 0) return 0;
  
  const counts: Record<string, number> = {};
  
  data.forEach((customer) => {
    const value = customer[targetAttribute as keyof Customer].toString();
    counts[value] = (counts[value] || 0) + 1;
  });
  
  let entropy = 0;
  Object.values(counts).forEach((count) => {
    const probability = count / data.length;
    entropy -= probability * Math.log2(probability);
  });
  
  return entropy;
};

// Calculate information gain for a specific attribute
const calculateInformationGain = (
  data: Customer[], 
  attribute: string, 
  targetAttribute: string,
  attributeType: 'numeric' | 'categorical',
  threshold?: number
): { gain: number; threshold?: number } => {
  const entropy = calculateEntropy(data, targetAttribute);
  
  if (attributeType === 'numeric' && threshold === undefined) {
    // Find the best threshold for numeric attributes
    const values = data.map(customer => customer[attribute as keyof Customer] as number).sort((a, b) => a - b);
    const uniqueValues = [...new Set(values)];
    
    if (uniqueValues.length <= 1) {
      return { gain: 0 };
    }
    
    // Try different thresholds and pick the one with highest gain
    const thresholds = [];
    for (let i = 0; i < uniqueValues.length - 1; i++) {
      thresholds.push((uniqueValues[i] + uniqueValues[i + 1]) / 2);
    }
    
    let bestGain = -Infinity;
    let bestThreshold = 0;
    
    thresholds.forEach((threshold) => {
      const { gain } = calculateInformationGain(data, attribute, targetAttribute, 'numeric', threshold);
      if (gain > bestGain) {
        bestGain = gain;
        bestThreshold = threshold;
      }
    });
    
    return { gain: bestGain, threshold: bestThreshold };
  }
  
  if (attributeType === 'numeric' && threshold !== undefined) {
    // Split data based on threshold
    const leftSubset = data.filter(customer => (customer[attribute as keyof Customer] as number) <= threshold);
    const rightSubset = data.filter(customer => (customer[attribute as keyof Customer] as number) > threshold);
    
    const leftEntropy = calculateEntropy(leftSubset, targetAttribute);
    const rightEntropy = calculateEntropy(rightSubset, targetAttribute);
    
    const leftWeight = leftSubset.length / data.length;
    const rightWeight = rightSubset.length / data.length;
    
    const weightedEntropy = leftWeight * leftEntropy + rightWeight * rightEntropy;
    return { gain: entropy - weightedEntropy, threshold };
  } else {
    // Handle categorical attributes
    const attributeValues = [...new Set(data.map(customer => customer[attribute as keyof Customer]))];
    
    let weightedEntropy = 0;
    attributeValues.forEach((value) => {
      const subset = data.filter(customer => customer[attribute as keyof Customer] === value);
      const subsetEntropy = calculateEntropy(subset, targetAttribute);
      const weight = subset.length / data.length;
      weightedEntropy += weight * subsetEntropy;
    });
    
    return { gain: entropy - weightedEntropy };
  }
};

// Find the attribute with the highest information gain
const findBestAttribute = (
  data: Customer[], 
  attributes: AttributeInfo[], 
  targetAttribute: string
): { attribute: string; gain: number; threshold?: number; type: 'numeric' | 'categorical' } => {
  let bestAttribute = '';
  let bestGain = -Infinity;
  let bestThreshold: number | undefined;
  let bestType: 'numeric' | 'categorical' = 'categorical';
  
  attributes.forEach((attributeInfo) => {
    const { name, type } = attributeInfo;
    const { gain, threshold } = calculateInformationGain(data, name, targetAttribute, type);
    
    if (gain > bestGain) {
      bestAttribute = name;
      bestGain = gain;
      bestThreshold = threshold;
      bestType = type;
    }
  });
  
  return { attribute: bestAttribute, gain: bestGain, threshold: bestThreshold, type: bestType };
};

// Get the majority class from the data
const getMajorityClass = (data: Customer[], targetAttribute: string): boolean => {
  const counts: Record<string, number> = {};
  
  data.forEach((customer) => {
    const value = customer[targetAttribute as keyof Customer].toString();
    counts[value] = (counts[value] || 0) + 1;
  });
  
  const entries = Object.entries(counts);
  if (entries.length === 0) return false;
  
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0] === 'true';
};

// Count distribution of target values
const getDistribution = (data: Customer[], targetAttribute: string): [number, number] => {
  let falseCount = 0;
  let trueCount = 0;
  
  data.forEach((customer) => {
    if (customer[targetAttribute as keyof Customer]) {
      trueCount++;
    } else {
      falseCount++;
    }
  });
  
  return [falseCount, trueCount];
};

// Build the decision tree recursively
const buildDecisionTree = (
  data: Customer[], 
  attributes: AttributeInfo[], 
  targetAttribute: string,
  depth = 0,
  maxDepth = 5
): DecisionTreeNode => {
  // Base cases
  if (data.length === 0) {
    return { isLeaf: true, prediction: false, depth, distribution: [1, 0] };
  }
  
  const allSameClass = data.every(customer => 
    customer[targetAttribute as keyof Customer] === data[0][targetAttribute as keyof Customer]
  );
  
  if (allSameClass || attributes.length === 0 || depth >= maxDepth) {
    const prediction = getMajorityClass(data, targetAttribute);
    return { 
      isLeaf: true, 
      prediction, 
      samples: data.length,
      depth,
      distribution: getDistribution(data, targetAttribute)
    };
  }
  
  // Find the best attribute to split on
  const { attribute, gain, threshold, type } = findBestAttribute(data, attributes, targetAttribute);
  
  if (gain <= 0) {
    const prediction = getMajorityClass(data, targetAttribute);
    return { 
      isLeaf: true, 
      prediction, 
      samples: data.length,
      depth,
      distribution: getDistribution(data, targetAttribute)
    };
  }
  
  // Create a decision node
  const node: DecisionTreeNode = {
    attribute,
    gain,
    samples: data.length,
    depth,
    distribution: getDistribution(data, targetAttribute)
  };
  
  if (type === 'numeric') {
    node.threshold = threshold;
    
    const leftSubset = data.filter(customer => 
      (customer[attribute as keyof Customer] as number) <= (threshold as number)
    );
    const rightSubset = data.filter(customer => 
      (customer[attribute as keyof Customer] as number) > (threshold as number)
    );
    
    node.left = buildDecisionTree(leftSubset, attributes, targetAttribute, depth + 1, maxDepth);
    node.right = buildDecisionTree(rightSubset, attributes, targetAttribute, depth + 1, maxDepth);
  } else {
    const attributeValues = [...new Set(data.map(customer => customer[attribute as keyof Customer]))];
    node.branches = {};
    
    attributeValues.forEach((value) => {
      const subset = data.filter(customer => customer[attribute as keyof Customer] === value);
      if (subset.length > 0) {
        const remainingAttributes = attributes.filter(attr => attr.name !== attribute);
        node.branches![value as string] = buildDecisionTree(
          subset, 
          remainingAttributes, 
          targetAttribute,
          depth + 1,
          maxDepth
        );
      }
    });
  }
  
  return node;
};

// Evaluate model performance
const evaluateModel = (
  decisionTree: DecisionTreeNode, 
  testData: Customer[], 
  targetAttribute: string
): ModelMetrics => {
  let truePositives = 0;
  let falsePositives = 0;
  let trueNegatives = 0;
  let falseNegatives = 0;
  
  testData.forEach((customer) => {
    const actualValue = customer[targetAttribute as keyof Customer] as boolean;
    const predictedValue = predict(decisionTree, customer);
    
    if (actualValue === true && predictedValue === true) {
      truePositives++;
    } else if (actualValue === false && predictedValue === true) {
      falsePositives++;
    } else if (actualValue === false && predictedValue === false) {
      trueNegatives++;
    } else if (actualValue === true && predictedValue === false) {
      falseNegatives++;
    }
  });
  
  const accuracy = (truePositives + trueNegatives) / testData.length;
  const precision = truePositives / (truePositives + falsePositives) || 0;
  const recall = truePositives / (truePositives + falseNegatives) || 0;
  const f1Score = 2 * (precision * recall) / (precision + recall) || 0;
  
  return {
    accuracy,
    precision,
    recall,
    f1Score,
    confusionMatrix: {
      truePositives,
      falsePositives,
      trueNegatives,
      falseNegatives
    }
  };
};

// Make prediction for a single customer
const predict = (tree: DecisionTreeNode, customer: Customer): boolean => {
  if (tree.isLeaf) {
    return tree.prediction || false;
  }
  
  if (!tree.attribute) {
    return false;
  }
  
  const attributeValue = customer[tree.attribute as keyof Customer];
  
  if (typeof attributeValue === 'number' && tree.threshold !== undefined) {
    if (attributeValue <= tree.threshold) {
      return tree.left ? predict(tree.left, customer) : false;
    } else {
      return tree.right ? predict(tree.right, customer) : false;
    }
  } else if (typeof attributeValue === 'string' && tree.branches) {
    const branch = tree.branches[attributeValue];
    return branch ? predict(branch, customer) : false;
  }
  
  return false;
};

// Define attributes to consider for the decision tree
const getAttributes = (): AttributeInfo[] => {
  return [
    { name: 'age', type: 'numeric' },
    { name: 'job', type: 'categorical' },
    { name: 'marital', type: 'categorical' },
    { name: 'education', type: 'categorical' },
    { name: 'default', type: 'categorical' },
    { name: 'balance', type: 'numeric' },
    { name: 'housing', type: 'categorical' },
    { name: 'loan', type: 'categorical' },
    { name: 'contact', type: 'categorical' },
    { name: 'day', type: 'numeric' },
    { name: 'month', type: 'categorical' },
    { name: 'duration', type: 'numeric' },
    { name: 'campaign', type: 'numeric' },
    { name: 'pdays', type: 'numeric' },
    { name: 'previous', type: 'numeric' },
    { name: 'poutcome', type: 'categorical' }
  ];
};

// Main function to train the decision tree
export const trainDecisionTree = (
  trainingData: Customer[], 
  testData: Customer[], 
  targetAttribute: string
): { tree: DecisionTreeNode; metrics: ModelMetrics } => {
  const attributes = getAttributes();
  const tree = buildDecisionTree(trainingData, attributes, targetAttribute, 0, 5);
  const metrics = evaluateModel(tree, testData, targetAttribute);
  
  return { tree, metrics };
};