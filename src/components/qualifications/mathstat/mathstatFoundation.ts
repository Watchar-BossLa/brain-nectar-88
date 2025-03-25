
import { QualificationTopic } from '../types';

export const mathstatFoundationTopics: Record<string, QualificationTopic[]> = {
  'PROB': [
    { id: 'prob-1', name: 'Probability Theory Foundations', weight: 25 },
    { id: 'prob-2', name: 'Random Variables', weight: 25 },
    { id: 'prob-3', name: 'Probability Distributions', weight: 25 },
    { id: 'prob-4', name: 'Limit Theorems', weight: 25 }
  ],
  'INF': [
    { id: 'inf-1', name: 'Statistical Inference', weight: 30 },
    { id: 'inf-2', name: 'Estimation Theory', weight: 40 },
    { id: 'inf-3', name: 'Hypothesis Testing', weight: 30 }
  ]
};
