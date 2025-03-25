
import { QualificationLevel } from './types';

export const frmModules: QualificationLevel[] = [
  {
    level: 'Part I',
    modules: [
      { code: 'FR', name: 'Foundations of Risk Management', status: 'not-started' },
      { code: 'QA', name: 'Quantitative Analysis', status: 'not-started' },
      { code: 'FM', name: 'Financial Markets and Products', status: 'not-started' },
      { code: 'VR', name: 'Valuation and Risk Models', status: 'not-started' }
    ]
  },
  {
    level: 'Part II',
    modules: [
      { code: 'MR', name: 'Market Risk Measurement and Management', status: 'not-started' },
      { code: 'CR', name: 'Credit Risk Measurement and Management', status: 'not-started' },
      { code: 'OR', name: 'Operational Risk and Resiliency', status: 'not-started' },
      { code: 'RM', name: 'Risk Management and Investment Management', status: 'not-started' },
      { code: 'PI', name: 'Current Issues in Financial Markets', status: 'not-started' }
    ]
  }
];
