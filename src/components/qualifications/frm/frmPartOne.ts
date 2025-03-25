
import { QualificationTopic } from '../types';

export const frmPartOneTopics: Record<string, QualificationTopic[]> = {
  'FR': [
    { id: 'fr-1', name: 'Foundations of Risk Management', weight: 20 },
    { id: 'fr-2', name: 'Risk Management Framework', weight: 30 },
    { id: 'fr-3', name: 'Corporate Governance', weight: 30 },
    { id: 'fr-4', name: 'Risk Governance', weight: 20 }
  ],
  'QA': [
    { id: 'qa-1', name: 'Probability Distributions', weight: 25 },
    { id: 'qa-2', name: 'Hypothesis Testing', weight: 20 },
    { id: 'qa-3', name: 'Linear Regression', weight: 30 },
    { id: 'qa-4', name: 'Time Series Analysis', weight: 25 }
  ],
  'FM': [
    { id: 'fm-1', name: 'Valuation and Risk Models', weight: 20 },
    { id: 'fm-2', name: 'Financial Markets', weight: 20 },
    { id: 'fm-3', name: 'Fixed Income', weight: 30 },
    { id: 'fm-4', name: 'Derivatives', weight: 30 }
  ],
  'VR': [
    { id: 'vr-1', name: 'Risk Models', weight: 35 },
    { id: 'vr-2', name: 'Option Valuation', weight: 35 },
    { id: 'vr-3', name: 'Fixed Income Valuation', weight: 30 }
  ]
};
