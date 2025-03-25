
import { QualificationLevel } from '../types';
import { caiaLevelOneTopics } from './caiaLevelOne';
import { caiaLevelTwoTopics } from './caiaLevelTwo';

// Export the CAIA modules with proper structure
export const caiaModules: QualificationLevel[] = [
  {
    level: 'Level I',
    modules: [
      { code: 'PF', name: 'Professional Standards and Fundamentals', status: 'not-started', topics: caiaLevelOneTopics['PF'] },
      { code: 'PE', name: 'Private Equity and Debt', status: 'not-started', topics: caiaLevelOneTopics['PE'] },
      { code: 'HF', name: 'Hedge Funds and Managed Futures', status: 'not-started', topics: caiaLevelOneTopics['HF'] },
      { code: 'SR', name: 'Structured Products and Risk Management', status: 'not-started', topics: caiaLevelOneTopics['SR'] }
    ]
  },
  {
    level: 'Level II',
    modules: [
      { code: 'AA', name: 'Asset Allocation and Institutional Investors', status: 'not-started', topics: caiaLevelTwoTopics['AA'] },
      { code: 'AP', name: 'Advanced Portfolio Management', status: 'not-started', topics: caiaLevelTwoTopics['AP'] },
      { code: 'DS', name: 'Due Diligence and Current Issues', status: 'not-started', topics: caiaLevelTwoTopics['DS'] }
    ]
  }
];

// Export the topic data
export { caiaLevelOneTopics, caiaLevelTwoTopics };
