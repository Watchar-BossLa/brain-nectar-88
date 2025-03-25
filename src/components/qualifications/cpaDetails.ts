
import { QualificationLevel } from './types';

export const cpaModules: QualificationLevel[] = [
  {
    level: 'Core Exams',
    modules: [
      { code: 'AUD', name: 'Auditing and Attestation', status: 'scheduled' },
      { code: 'BEC', name: 'Business Environment and Concepts', status: 'in-progress' },
      { code: 'FAR', name: 'Financial Accounting and Reporting', status: 'passed' },
      { code: 'REG', name: 'Regulation', status: 'not-started' }
    ]
  }
];
