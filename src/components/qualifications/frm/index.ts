
import { QualificationLevel } from '../types';
import { frmPartOneTopics } from './frmPartOne';
import { frmPartTwoTopics } from './frmPartTwo';

export * from './frmPartOne';
export * from './frmPartTwo';

export const frmModules: QualificationLevel[] = [
  {
    level: 'Part I',
    modules: [
      { code: 'FR', name: 'Foundations of Risk Management', status: 'not-started', topics: frmPartOneTopics['FR'] },
      { code: 'QA', name: 'Quantitative Analysis', status: 'not-started', topics: frmPartOneTopics['QA'] },
      { code: 'FM', name: 'Financial Markets and Products', status: 'not-started', topics: frmPartOneTopics['FM'] },
      { code: 'VR', name: 'Valuation and Risk Models', status: 'not-started', topics: frmPartOneTopics['VR'] }
    ]
  },
  {
    level: 'Part II',
    modules: [
      { code: 'MR', name: 'Market Risk Measurement and Management', status: 'not-started', topics: frmPartTwoTopics['MR'] },
      { code: 'CR', name: 'Credit Risk Measurement and Management', status: 'not-started', topics: frmPartTwoTopics['CR'] },
      { code: 'OR', name: 'Operational Risk and Resiliency', status: 'not-started', topics: frmPartTwoTopics['OR'] },
      { code: 'RM', name: 'Risk Management and Investment Management', status: 'not-started', topics: frmPartTwoTopics['RM'] },
      { code: 'PI', name: 'Current Issues in Financial Markets', status: 'not-started', topics: frmPartTwoTopics['PI'] }
    ]
  }
];
