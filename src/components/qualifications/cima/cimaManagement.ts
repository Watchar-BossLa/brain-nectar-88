
import { QualificationTopic } from '../types';

export const cimaManagementTopics: Record<string, QualificationTopic[]> = {
  'E2': [
    { id: 'e2-1', name: 'Managing Performance', weight: 25 },
    { id: 'e2-2', name: 'Marketing', weight: 25 },
    { id: 'e2-3', name: 'Digital Strategy', weight: 25 },
    { id: 'e2-4', name: 'Project and Relationship Management', weight: 25 }
  ],
  'P2': [
    { id: 'p2-1', name: 'Advanced Management Accounting', weight: 30 },
    { id: 'p2-2', name: 'Managing Projects and Programmes', weight: 20 },
    { id: 'p2-3', name: 'Advanced Financial Reporting', weight: 30 },
    { id: 'p2-4', name: 'Financial Decision Making', weight: 20 }
  ],
  'F2': [
    { id: 'f2-1', name: 'Advanced Financial Reporting', weight: 30 },
    { id: 'f2-2', name: 'Financial Analysis', weight: 25 },
    { id: 'f2-3', name: 'Financial Decisions', weight: 25 },
    { id: 'f2-4', name: 'Risk Management', weight: 20 }
  ]
};
