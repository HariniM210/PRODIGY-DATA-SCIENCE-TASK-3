import { Customer } from '../types';

// Generate a random number between min and max (inclusive)
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a random element from an array
const randomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Probability-based random boolean
const randomBool = (trueProbability: number): boolean => {
  return Math.random() < trueProbability;
};

export const generateMockDataset = (count: number): Customer[] => {
  const jobs = ['admin.', 'blue-collar', 'entrepreneur', 'housemaid', 'management', 'retired', 'self-employed', 'services', 'student', 'technician', 'unemployed', 'unknown'];
  const maritalStatuses = ['divorced', 'married', 'single', 'unknown'];
  const educationLevels = ['basic.4y', 'basic.6y', 'basic.9y', 'high.school', 'illiterate', 'professional.course', 'university.degree', 'unknown'];
  const defaultOptions = ['no', 'yes', 'unknown'];
  const housingOptions = ['no', 'yes', 'unknown'];
  const loanOptions = ['no', 'yes', 'unknown'];
  const contactMethods = ['cellular', 'telephone', 'unknown'];
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const outcomes = ['failure', 'nonexistent', 'success', 'unknown'];
  
  const dataset: Customer[] = [];
  
  for (let i = 0; i < count; i++) {
    // Generate a new customer with random attributes
    const age = randomInt(18, 95);
    const job = randomElement(jobs);
    const marital = randomElement(maritalStatuses);
    const education = randomElement(educationLevels);
    const defaultStatus = randomElement(defaultOptions);
    const balance = randomInt(-2000, 100000);
    const housing = randomElement(housingOptions);
    const loan = randomElement(loanOptions);
    const contact = randomElement(contactMethods);
    const day = randomInt(1, 31);
    const month = randomElement(months);
    const duration = randomInt(0, 5000);
    const campaign = randomInt(1, 50);
    const pdays = randomInt(-1, 999);
    const previous = randomInt(0, 7);
    const poutcome = randomElement(outcomes);
    
    // Create a bias towards certain features to make the classifier more interesting
    let subscriptionProbability = 0.3; // Base probability
    
    // Age factor: older people might be more likely to subscribe
    if (age > 60) subscriptionProbability += 0.1;
    else if (age < 25) subscriptionProbability -= 0.05;
    
    // Education factor: higher education might increase subscription rate
    if (education === 'university.degree') subscriptionProbability += 0.15;
    
    // Balance factor: higher balance might increase subscription rate
    if (balance > 50000) subscriptionProbability += 0.2;
    else if (balance < 0) subscriptionProbability -= 0.1;
    
    // Previous contact factor
    if (previous > 0 && poutcome === 'success') subscriptionProbability += 0.25;
    
    // Duration factor: longer calls might indicate more interest
    if (duration > 300) subscriptionProbability += 0.15;
    
    // Create some noise to prevent a perfect classifier
    subscriptionProbability += (Math.random() - 0.5) * 0.2;
    
    // Clamp probability between 0 and 1
    subscriptionProbability = Math.max(0, Math.min(1, subscriptionProbability));
    
    // Determine if the customer subscribed based on the probability
    const subscribed = randomBool(subscriptionProbability);
    
    dataset.push({
      id: i + 1,
      age,
      job,
      marital,
      education,
      default: defaultStatus,
      balance,
      housing,
      loan,
      contact,
      day,
      month,
      duration,
      campaign,
      pdays,
      previous,
      poutcome,
      subscribed
    });
  }
  
  return dataset;
};