
import { QualificationTopic } from '../types';

export const actuaryExamsTopics: Record<string, QualificationTopic[]> = {
  'P': [
    { id: 'p-1', name: 'Probability', weight: 30 },
    { id: 'p-2', name: 'Random Variables', weight: 30 },
    { id: 'p-3', name: 'Multivariate Distributions', weight: 20 },
    { id: 'p-4', name: 'Risk Management Concepts', weight: 20 }
  ],
  'FM': [
    { id: 'fm-1', name: 'Time Value of Money', weight: 20 },
    { id: 'fm-2', name: 'Annuities', weight: 20 },
    { id: 'fm-3', name: 'Loans', weight: 20 },
    { id: 'fm-4', name: 'Bonds', weight: 20 },
    { id: 'fm-5', name: 'Portfolio Theory', weight: 20 }
  ]
};
