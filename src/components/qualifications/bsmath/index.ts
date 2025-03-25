
import { QualificationLevel } from '../types';
import { bsmathCoreTopics } from './bsmathCore';
import { bsmathAdvancedTopics } from './bsmathAdvanced';

// Export the BSMath modules with proper structure
export const bsmathModules: QualificationLevel[] = [
  {
    level: 'Core Courses',
    modules: [
      { code: 'CALC', name: 'Calculus and Differential Equations', status: 'not-started', topics: bsmathCoreTopics['CALC'] },
      { code: 'ALG', name: 'Algebra and Discrete Mathematics', status: 'not-started', topics: bsmathCoreTopics['ALG'] }
    ]
  },
  {
    level: 'Advanced Courses',
    modules: [
      { code: 'ANAL', name: 'Analysis', status: 'not-started', topics: bsmathAdvancedTopics['ANAL'] },
      { code: 'STAT', name: 'Statistics and Probability', status: 'not-started', topics: bsmathAdvancedTopics['STAT'] }
    ]
  }
];

// Export the topic data
export { bsmathCoreTopics, bsmathAdvancedTopics };
