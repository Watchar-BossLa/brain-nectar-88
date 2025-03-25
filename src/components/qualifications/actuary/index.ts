
import { QualificationLevel } from '../types';
import { actuaryExamsTopics } from './actuaryExams';
import { actuaryAdvancedTopics } from './actuaryAdvanced';

// Export the Actuary modules with proper structure
export const actuaryModules: QualificationLevel[] = [
  {
    level: 'Preliminary Exams',
    modules: [
      { code: 'P', name: 'Probability', status: 'not-started', topics: actuaryExamsTopics['P'] },
      { code: 'FM', name: 'Financial Mathematics', status: 'not-started', topics: actuaryExamsTopics['FM'] }
    ]
  },
  {
    level: 'Advanced Exams',
    modules: [
      { code: 'IFM', name: 'Investment and Financial Markets', status: 'not-started', topics: actuaryAdvancedTopics['IFM'] },
      { code: 'LTAM', name: 'Long-Term Actuarial Mathematics', status: 'not-started', topics: actuaryAdvancedTopics['LTAM'] }
    ]
  }
];

// Export the topic data
export { actuaryExamsTopics, actuaryAdvancedTopics };
