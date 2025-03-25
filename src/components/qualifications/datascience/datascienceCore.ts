
import { QualificationTopic } from '../types';

export const datascienceCoreTopics: Record<string, QualificationTopic[]> = {
  'STAT': [
    { id: 'dstat-1', name: 'Statistical Methods', weight: 25 },
    { id: 'dstat-2', name: 'Experimental Design', weight: 25 },
    { id: 'dstat-3', name: 'Probability Theory', weight: 25 },
    { id: 'dstat-4', name: 'Exploratory Data Analysis', weight: 25 }
  ],
  'ML': [
    { id: 'ml-1', name: 'Supervised Learning', weight: 25 },
    { id: 'ml-2', name: 'Unsupervised Learning', weight: 25 },
    { id: 'ml-3', name: 'Model Evaluation', weight: 25 },
    { id: 'ml-4', name: 'Ensemble Methods', weight: 25 }
  ]
};
