
import { QualificationTopic } from '../types';

export const cimaOperationalTopics: Record<string, QualificationTopic[]> = {
  'E1': [
    { id: 'e1-1', name: 'The Economics of Organisations', weight: 25 },
    { id: 'e1-2', name: 'Managing Finance in a Digital World', weight: 25 },
    { id: 'e1-3', name: 'Principles of Business Taxation', weight: 25 },
    { id: 'e1-4', name: 'Ethics and Corporate Governance', weight: 25 }
  ],
  'P1': [
    { id: 'p1-1', name: 'Cost Accounting Systems', weight: 30 },
    { id: 'p1-2', name: 'Budgeting and Budgetary Control', weight: 25 },
    { id: 'p1-3', name: 'Short-term Commercial Decision Making', weight: 25 },
    { id: 'p1-4', name: 'Dealing with Risk and Uncertainty', weight: 20 }
  ],
  'F1': [
    { id: 'f1-1', name: 'Financial Statements and Reporting', weight: 30 },
    { id: 'f1-2', name: 'Managing Working Capital', weight: 20 },
    { id: 'f1-3', name: 'Business Funding', weight: 25 },
    { id: 'f1-4', name: 'Business Valuation', weight: 25 }
  ]
};
