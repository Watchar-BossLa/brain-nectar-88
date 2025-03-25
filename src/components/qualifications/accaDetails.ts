
import { QualificationLevel } from './types';

export const accaModules: QualificationLevel[] = [
  {
    level: 'Knowledge',
    modules: [
      { code: 'BT', name: 'Business and Technology', status: 'passed' },
      { code: 'MA', name: 'Management Accounting', status: 'passed' },
      { code: 'FA', name: 'Financial Accounting', status: 'in-progress' }
    ]
  },
  {
    level: 'Skills',
    modules: [
      { code: 'LW', name: 'Corporate and Business Law', status: 'passed' },
      { code: 'PM', name: 'Performance Management', status: 'passed' },
      { code: 'TX', name: 'Taxation', status: 'passed' },
      { code: 'FR', name: 'Financial Reporting', status: 'scheduled' },
      { code: 'AA', name: 'Audit and Assurance', status: 'not-started' },
      { code: 'FM', name: 'Financial Management', status: 'not-started' }
    ]
  },
  {
    level: 'Professional',
    modules: [
      { code: 'SBL', name: 'Strategic Business Leader', status: 'not-started' },
      { code: 'SBR', name: 'Strategic Business Reporting', status: 'not-started' },
      { code: 'Advanced Options (2 out of 4)', name: 'Specialized papers', status: 'not-started' }
    ]
  }
];
