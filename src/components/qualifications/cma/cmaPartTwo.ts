
import { QualificationTopic } from '../types';

export const cmaPartTwoTopics: Record<string, QualificationTopic[]> = {
  'FDM': [
    { id: 'fdm-1', name: 'Financial Statement Analysis', weight: 20 },
    { id: 'fdm-2', name: 'Corporate Finance', weight: 20 },
    { id: 'fdm-3', name: 'Decision Analysis', weight: 20 },
    { id: 'fdm-4', name: 'Risk Management', weight: 10 }
  ],
  'IP': [
    { id: 'ip-1', name: 'Investment Decisions', weight: 10 },
    { id: 'ip-2', name: 'Professional Ethics', weight: 20 }
  ]
};
