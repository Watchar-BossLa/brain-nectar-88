
import { QualificationTopic } from './types';

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

// CIMA Case Study
export const cimaGateways: Record<string, QualificationTopic[]> = {
  'OCS': [
    { id: 'ocs-1', name: 'Operational Case Study', weight: 100 }
  ],
  'MCS': [
    { id: 'mcs-1', name: 'Management Case Study', weight: 100 }
  ],
  'SCS': [
    { id: 'scs-1', name: 'Strategic Case Study', weight: 100 }
  ]
};
