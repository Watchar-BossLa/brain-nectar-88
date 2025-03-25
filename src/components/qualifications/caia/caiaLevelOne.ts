
import { QualificationTopic } from '../types';

export const caiaLevelOneTopics: Record<string, QualificationTopic[]> = {
  'PF': [
    { id: 'pf-1', name: 'Professional Standards and Ethics', weight: 15 },
    { id: 'pf-2', name: 'Introduction to Alternative Investments', weight: 20 },
    { id: 'pf-3', name: 'Real Assets', weight: 20 }
  ],
  'PE': [
    { id: 'pe-1', name: 'Private Equity', weight: 20 },
    { id: 'pe-2', name: 'Private Debt', weight: 10 }
  ],
  'HF': [
    { id: 'hf-1', name: 'Hedge Funds and Managed Futures', weight: 20 },
    { id: 'hf-2', name: 'Commodities', weight: 10 }
  ],
  'SR': [
    { id: 'sr-1', name: 'Structured Products', weight: 15 },
    { id: 'sr-2', name: 'Risk and Portfolio Management', weight: 15 }
  ]
};
