
import { QualificationTopic } from '../types';

export const cmaPartOneTopics: Record<string, QualificationTopic[]> = {
  'EA': [
    { id: 'ea-1', name: 'External Financial Reporting Decisions', weight: 15 },
    { id: 'ea-2', name: 'Planning, Budgeting, and Forecasting', weight: 20 },
    { id: 'ea-3', name: 'Performance Management', weight: 20 },
    { id: 'ea-4', name: 'Cost Management', weight: 15 }
  ],
  'ICR': [
    { id: 'icr-1', name: 'Internal Controls', weight: 15 },
    { id: 'icr-2', name: 'Technology and Analytics', weight: 15 }
  ]
};
