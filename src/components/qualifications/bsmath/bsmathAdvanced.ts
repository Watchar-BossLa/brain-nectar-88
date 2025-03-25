
import { QualificationTopic } from '../types';

export const bsmathAdvancedTopics: Record<string, QualificationTopic[]> = {
  'ANAL': [
    { id: 'anal-1', name: 'Real Analysis', weight: 30 },
    { id: 'anal-2', name: 'Complex Analysis', weight: 30 },
    { id: 'anal-3', name: 'Functional Analysis', weight: 20 },
    { id: 'anal-4', name: 'Measure Theory', weight: 20 }
  ],
  'STAT': [
    { id: 'stat-1', name: 'Probability Theory', weight: 25 },
    { id: 'stat-2', name: 'Mathematical Statistics', weight: 25 },
    { id: 'stat-3', name: 'Regression Analysis', weight: 25 },
    { id: 'stat-4', name: 'Statistical Computing', weight: 25 }
  ]
};
