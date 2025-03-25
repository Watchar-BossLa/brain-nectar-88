
import { QualificationTopic } from '../types';

export const cfaLevelTwoTopics: Record<string, QualificationTopic[]> = {
  'ETH': [
    { id: 'eth2-1', name: 'Application of Code and Standards', weight: 40 },
    { id: 'eth2-2', name: 'Asset Manager Code of Conduct', weight: 30 },
    { id: 'eth2-3', name: 'Research Objectivity Standards', weight: 30 }
  ],
  'QM': [
    { id: 'qm2-1', name: 'Correlation and Regression', weight: 25 },
    { id: 'qm2-2', name: 'Multiple Regression', weight: 30 },
    { id: 'qm2-3', name: 'Time-Series Analysis', weight: 25 },
    { id: 'qm2-4', name: 'Probability Concepts', weight: 20 }
  ],
  'ECO': [
    { id: 'eco2-1', name: 'Currency Exchange Rates', weight: 20 },
    { id: 'eco2-2', name: 'Economic Growth and Development', weight: 25 },
    { id: 'eco2-3', name: 'Effects of Government Regulation', weight: 25 },
    { id: 'eco2-4', name: 'Economic Analysis and Setting Capital Market Expectations', weight: 30 }
  ],
  'FRA': [
    { id: 'fra2-1', name: 'Intercorporate Investments', weight: 20 },
    { id: 'fra2-2', name: 'Employee Compensation: Post-Employment and Share-Based', weight: 15 },
    { id: 'fra2-3', name: 'Multinational Operations', weight: 20 },
    { id: 'fra2-4', name: 'Analysis of Financial Institutions', weight: 20 },
    { id: 'fra2-5', name: 'Evaluating Quality of Financial Reporting', weight: 25 }
  ],
  'CM': [
    { id: 'cm2-1', name: 'Capital Structure Concepts', weight: 30 },
    { id: 'cm2-2', name: 'Business and Financial Risk', weight: 25 },
    { id: 'cm2-3', name: 'Dividend Policy', weight: 20 },
    { id: 'cm2-4', name: 'Mergers and Acquisitions', weight: 25 }
  ],
  'EI': [
    { id: 'ei2-1', name: 'Industry and Company Analysis', weight: 25 },
    { id: 'ei2-2', name: 'Discounted Dividend Valuation', weight: 25 },
    { id: 'ei2-3', name: 'Free Cash Flow Valuation', weight: 30 },
    { id: 'ei2-4', name: 'Residual Income Valuation', weight: 20 }
  ],
  'FI': [
    { id: 'fi2-1', name: 'Credit Analysis Models', weight: 25 },
    { id: 'fi2-2', name: 'Credit Default Swaps', weight: 15 },
    { id: 'fi2-3', name: 'Valuation of Bonds with Embedded Options', weight: 30 },
    { id: 'fi2-4', name: 'Structured Products', weight: 30 }
  ],
  'DER': [
    { id: 'der2-1', name: 'Pricing and Valuation of Forward Commitments', weight: 30 },
    { id: 'der2-2', name: 'Pricing and Valuation of Options', weight: 30 },
    { id: 'der2-3', name: 'Risk Management Applications of Option Strategies', weight: 40 }
  ],
  'AI': [
    { id: 'ai2-1', name: 'Private Equity Valuation', weight: 35 },
    { id: 'ai2-2', name: 'Real Estate Investment Analysis', weight: 35 },
    { id: 'ai2-3', name: 'Alternative Investment Portfolio Management', weight: 30 }
  ],
  'PM': [
    { id: 'pm2-1', name: 'Risk Management', weight: 25 },
    { id: 'pm2-2', name: 'Factor Models', weight: 25 },
    { id: 'pm2-3', name: 'Measuring and Managing Market Risk', weight: 25 },
    { id: 'pm2-4', name: 'Performance Evaluation', weight: 25 }
  ]
};
