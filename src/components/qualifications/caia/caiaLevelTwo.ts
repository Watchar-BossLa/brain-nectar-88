
import { QualificationTopic } from '../types';

export const caiaLevelTwoTopics: Record<string, QualificationTopic[]> = {
  'AA': [
    { id: 'aa-1', name: 'Asset Allocation and Institutional Investors', weight: 20 },
    { id: 'aa-2', name: 'Models', weight: 10 }
  ],
  'AP': [
    { id: 'ap-1', name: 'Alternative Investment Strategies', weight: 25 },
    { id: 'ap-2', name: 'Advanced Risk Management', weight: 15 }
  ],
  'DS': [
    { id: 'ds-1', name: 'Due Diligence and Manager Selection', weight: 15 },
    { id: 'ds-2', name: 'Current Issues in Alternative Investments', weight: 15 }
  ]
};
