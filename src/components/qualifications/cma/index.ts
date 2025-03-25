
import { QualificationLevel } from '../types';
import { cmaPartOneTopics } from './cmaPartOne';
import { cmaPartTwoTopics } from './cmaPartTwo';

// Export the CMA modules with proper structure
export const cmaModules: QualificationLevel[] = [
  {
    level: 'Part 1',
    modules: [
      { code: 'EA', name: 'External Financial Reporting and Planning', status: 'not-started', topics: cmaPartOneTopics['EA'] },
      { code: 'ICR', name: 'Internal Controls and Technology', status: 'not-started', topics: cmaPartOneTopics['ICR'] }
    ]
  },
  {
    level: 'Part 2',
    modules: [
      { code: 'FDM', name: 'Financial Decision Making', status: 'not-started', topics: cmaPartTwoTopics['FDM'] },
      { code: 'IP', name: 'Investment and Professional Ethics', status: 'not-started', topics: cmaPartTwoTopics['IP'] }
    ]
  }
];

// Export the topic data
export { cmaPartOneTopics, cmaPartTwoTopics };
