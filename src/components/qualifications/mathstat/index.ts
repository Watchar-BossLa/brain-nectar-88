
import { QualificationLevel } from '../types';
import { mathstatFoundationTopics } from './mathstatFoundation';
import { mathstatAdvancedTopics } from './mathstatAdvanced';

// Export the MathStat modules with proper structure
export const mathstatModules: QualificationLevel[] = [
  {
    level: 'Foundation',
    modules: [
      { code: 'PROB', name: 'Probability Theory', status: 'not-started', topics: mathstatFoundationTopics['PROB'] },
      { code: 'INF', name: 'Statistical Inference', status: 'not-started', topics: mathstatFoundationTopics['INF'] }
    ]
  },
  {
    level: 'Advanced',
    modules: [
      { code: 'MOD', name: 'Statistical Modeling', status: 'not-started', topics: mathstatAdvancedTopics['MOD'] },
      { code: 'COMP', name: 'Computational Methods', status: 'not-started', topics: mathstatAdvancedTopics['COMP'] }
    ]
  }
];

// Export the topic data
export { mathstatFoundationTopics, mathstatAdvancedTopics };
