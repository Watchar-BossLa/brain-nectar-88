
import { QualificationLevel } from '../types';
import { cfaLevelOneTopics } from './cfaLevelOne';
import { cfaLevelTwoTopics } from './cfaLevelTwo';
import { cfaLevelThreeTopics } from './cfaLevelThree';

export * from './cfaLevelOne';
export * from './cfaLevelTwo';
export * from './cfaLevelThree';

export const cfaModules: QualificationLevel[] = [
  {
    level: 'Level I',
    modules: [
      { code: 'ETH', name: 'Ethics and Professional Standards', status: 'in-progress', topics: cfaLevelOneTopics['ETH'] },
      { code: 'QM', name: 'Quantitative Methods', status: 'not-started', topics: cfaLevelOneTopics['QM'] },
      { code: 'ECO', name: 'Economics', status: 'not-started', topics: cfaLevelOneTopics['ECO'] },
      { code: 'FRA', name: 'Financial Reporting and Analysis', status: 'not-started', topics: cfaLevelOneTopics['FRA'] },
      { code: 'CM', name: 'Corporate Finance', status: 'not-started', topics: cfaLevelOneTopics['CM'] },
      { code: 'EI', name: 'Equity Investments', status: 'not-started', topics: cfaLevelOneTopics['EI'] },
      { code: 'FI', name: 'Fixed Income', status: 'not-started', topics: cfaLevelOneTopics['FI'] },
      { code: 'DER', name: 'Derivatives', status: 'not-started', topics: cfaLevelOneTopics['DER'] },
      { code: 'AI', name: 'Alternative Investments', status: 'not-started', topics: cfaLevelOneTopics['AI'] },
      { code: 'PM', name: 'Portfolio Management', status: 'not-started', topics: cfaLevelOneTopics['PM'] }
    ]
  },
  {
    level: 'Level II',
    modules: [
      { code: 'ETH', name: 'Ethics and Professional Standards', status: 'not-started', topics: cfaLevelTwoTopics['ETH'] },
      { code: 'QM', name: 'Quantitative Methods', status: 'not-started', topics: cfaLevelTwoTopics['QM'] },
      { code: 'ECO', name: 'Economics', status: 'not-started', topics: cfaLevelTwoTopics['ECO'] },
      { code: 'FRA', name: 'Financial Reporting and Analysis', status: 'not-started', topics: cfaLevelTwoTopics['FRA'] },
      { code: 'CM', name: 'Corporate Finance', status: 'not-started', topics: cfaLevelTwoTopics['CM'] },
      { code: 'EI', name: 'Equity Investments', status: 'not-started', topics: cfaLevelTwoTopics['EI'] },
      { code: 'FI', name: 'Fixed Income', status: 'not-started', topics: cfaLevelTwoTopics['FI'] },
      { code: 'DER', name: 'Derivatives', status: 'not-started', topics: cfaLevelTwoTopics['DER'] },
      { code: 'AI', name: 'Alternative Investments', status: 'not-started', topics: cfaLevelTwoTopics['AI'] },
      { code: 'PM', name: 'Portfolio Management', status: 'not-started', topics: cfaLevelTwoTopics['PM'] }
    ]
  },
  {
    level: 'Level III',
    modules: [
      { code: 'ETH', name: 'Ethics and Professional Standards', status: 'not-started', topics: cfaLevelThreeTopics['ETH'] },
      { code: 'PFP', name: 'Private Wealth Management', status: 'not-started', topics: cfaLevelThreeTopics['PFP'] },
      { code: 'IPM', name: 'Institutional Portfolio Management', status: 'not-started', topics: cfaLevelThreeTopics['IPM'] },
      { code: 'ECO', name: 'Economics', status: 'not-started', topics: cfaLevelThreeTopics['ECO'] },
      { code: 'EI', name: 'Equity Investments', status: 'not-started', topics: cfaLevelThreeTopics['EI'] },
      { code: 'FI', name: 'Fixed Income', status: 'not-started', topics: cfaLevelThreeTopics['FI'] },
      { code: 'AI', name: 'Alternative Investments', status: 'not-started', topics: cfaLevelThreeTopics['AI'] },
      { code: 'TPPM', name: 'Trading, Performance, and Support', status: 'not-started', topics: cfaLevelThreeTopics['TPPM'] }
    ]
  }
];
