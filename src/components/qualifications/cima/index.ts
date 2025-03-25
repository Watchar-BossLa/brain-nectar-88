
import { QualificationLevel } from '../types';
import { cimaOperationalTopics } from './cimaOperational';
import { cimaManagementTopics } from './cimaManagement';
import { cimaStrategicTopics } from './cimaStrategic';
import { cimaGateways } from './cimaGateways';

export * from './cimaOperational';
export * from './cimaManagement';
export * from './cimaStrategic';
export * from './cimaGateways';

export const cimaModules: QualificationLevel[] = [
  {
    level: 'Operational Level',
    modules: [
      { code: 'E1', name: 'Managing Finance in a Digital World', status: 'not-started', topics: cimaOperationalTopics['E1'] },
      { code: 'P1', name: 'Management Accounting', status: 'not-started', topics: cimaOperationalTopics['P1'] },
      { code: 'F1', name: 'Financial Reporting', status: 'not-started', topics: cimaOperationalTopics['F1'] }
    ]
  },
  {
    level: 'Management Level',
    modules: [
      { code: 'E2', name: 'Managing Performance', status: 'not-started', topics: cimaManagementTopics['E2'] },
      { code: 'P2', name: 'Advanced Management Accounting', status: 'not-started', topics: cimaManagementTopics['P2'] },
      { code: 'F2', name: 'Advanced Financial Reporting', status: 'not-started', topics: cimaManagementTopics['F2'] }
    ]
  },
  {
    level: 'Strategic Level',
    modules: [
      { code: 'E3', name: 'Strategic Management', status: 'not-started', topics: cimaStrategicTopics['E3'] },
      { code: 'P3', name: 'Risk Management', status: 'not-started', topics: cimaStrategicTopics['P3'] },
      { code: 'F3', name: 'Financial Strategy', status: 'not-started', topics: cimaStrategicTopics['F3'] }
    ]
  },
  {
    level: 'Professional Competence',
    modules: [
      { code: 'OCS', name: 'Operational Case Study', status: 'not-started', topics: cimaGateways['OCS'] },
      { code: 'MCS', name: 'Management Case Study', status: 'not-started', topics: cimaGateways['MCS'] },
      { code: 'SCS', name: 'Strategic Case Study', status: 'not-started', topics: cimaGateways['SCS'] }
    ]
  }
];
