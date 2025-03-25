
import { QualificationTopic } from '../types';

export const cimaStrategicTopics: Record<string, QualificationTopic[]> = {
  'E3': [
    { id: 'e3-1', name: 'Strategic Management', weight: 30 },
    { id: 'e3-2', name: 'Change Management', weight: 20 },
    { id: 'e3-3', name: 'Risk Management', weight: 25 },
    { id: 'e3-4', name: 'Digital Strategy Implementation', weight: 25 }
  ],
  'P3': [
    { id: 'p3-1', name: 'Strategic Management Accounting', weight: 35 },
    { id: 'p3-2', name: 'Risk and Control Strategy', weight: 30 },
    { id: 'p3-3', name: 'Performance Management', weight: 35 }
  ],
  'F3': [
    { id: 'f3-1', name: 'Financial Strategy', weight: 30 },
    { id: 'f3-2', name: 'Advanced Financial Reporting', weight: 30 },
    { id: 'f3-3', name: 'Business Restructuring', weight: 20 },
    { id: 'f3-4', name: 'Treasury and Risk Management', weight: 20 }
  ]
};
