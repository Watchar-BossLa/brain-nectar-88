
import { QualificationTopic } from '../types';

export const actuaryAdvancedTopics: Record<string, QualificationTopic[]> = {
  'IFM': [
    { id: 'ifm-1', name: 'Investment and Financial Markets', weight: 30 },
    { id: 'ifm-2', name: 'Corporate Finance', weight: 30 },
    { id: 'ifm-3', name: 'Derivatives', weight: 20 },
    { id: 'ifm-4', name: 'Portfolio Management', weight: 20 }
  ],
  'LTAM': [
    { id: 'ltam-1', name: 'Survival Models', weight: 25 },
    { id: 'ltam-2', name: 'Life Insurance', weight: 25 },
    { id: 'ltam-3', name: 'Life Annuities', weight: 25 },
    { id: 'ltam-4', name: 'Premium Calculation', weight: 25 }
  ]
};
