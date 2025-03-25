
import { QualificationTopic } from './types';

export const cfaLevelOneTopics: Record<string, QualificationTopic[]> = {
  'ETH': [
    { id: 'eth-1', name: 'Professional Standards of Practice', weight: 15 },
    { id: 'eth-2', name: 'Ethical Practices', weight: 20 },
    { id: 'eth-3', name: 'GIPS Standards', weight: 10 }
  ],
  'QM': [
    { id: 'qm-1', name: 'Time Value of Money', weight: 12 },
    { id: 'qm-2', name: 'Probability Distributions', weight: 15 },
    { id: 'qm-3', name: 'Sampling and Estimation', weight: 10 },
    { id: 'qm-4', name: 'Hypothesis Testing', weight: 13 }
  ],
  'ECO': [
    { id: 'eco-1', name: 'Market Forces of Supply and Demand', weight: 10 },
    { id: 'eco-2', name: 'The Firm and Industry Organization', weight: 15 },
    { id: 'eco-3', name: 'Macroeconomic Analysis', weight: 20 },
    { id: 'eco-4', name: 'Economics of International Trade', weight: 10 }
  ],
  'FRA': [
    { id: 'fra-1', name: 'Financial Reporting System', weight: 8 },
    { id: 'fra-2', name: 'Principal Financial Statements', weight: 20 },
    { id: 'fra-3', name: 'Financial Reporting Quality', weight: 12 },
    { id: 'fra-4', name: 'Analysis of Inventories', weight: 10 },
    { id: 'fra-5', name: 'Analysis of Long-Lived Assets', weight: 15 },
    { id: 'fra-6', name: 'Analysis of Taxes', weight: 12 }
  ],
  'CM': [
    { id: 'cm-1', name: 'Capital Budgeting', weight: 22 },
    { id: 'cm-2', name: 'Cost of Capital', weight: 20 },
    { id: 'cm-3', name: 'Leverage', weight: 15 },
    { id: 'cm-4', name: 'Working Capital Management', weight: 18 }
  ],
  'EI': [
    { id: 'ei-1', name: 'Market Organization', weight: 10 },
    { id: 'ei-2', name: 'Security Market Indexes', weight: 12 },
    { id: 'ei-3', name: 'Market Efficiency', weight: 15 },
    { id: 'ei-4', name: 'Equity Valuation', weight: 30 }
  ],
  'FI': [
    { id: 'fi-1', name: 'Fixed Income Securities', weight: 15 },
    { id: 'fi-2', name: 'Term Structure of Interest Rates', weight: 20 },
    { id: 'fi-3', name: 'Analysis of Risk', weight: 25 }
  ],
  'DER': [
    { id: 'der-1', name: 'Derivative Markets and Instruments', weight: 15 },
    { id: 'der-2', name: 'Forward Markets and Contracts', weight: 20 },
    { id: 'der-3', name: 'Option Markets and Contracts', weight: 25 },
    { id: 'der-4', name: 'Swap Markets and Contracts', weight: 15 }
  ],
  'AI': [
    { id: 'ai-1', name: 'Real Estate', weight: 25 },
    { id: 'ai-2', name: 'Private Equity', weight: 25 },
    { id: 'ai-3', name: 'Commodities', weight: 20 },
    { id: 'ai-4', name: 'Hedge Funds', weight: 30 }
  ],
  'PM': [
    { id: 'pm-1', name: 'Portfolio Management Concepts', weight: 15 },
    { id: 'pm-2', name: 'Portfolio Risk and Return', weight: 20 },
    { id: 'pm-3', name: 'Basics of Portfolio Planning', weight: 20 },
    { id: 'pm-4', name: 'Investment Policy Statement', weight: 15 }
  ]
};

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
  // Add other Level II topics as needed
};

export const cfaLevelThreeTopics: Record<string, QualificationTopic[]> = {
  'ETH': [
    { id: 'eth3-1', name: 'Professional Guidance', weight: 35 },
    { id: 'eth3-2', name: 'Soft Dollar Standards', weight: 30 },
    { id: 'eth3-3', name: 'Referral Fee Standards', weight: 35 }
  ],
  'PFP': [
    { id: 'pfp-1', name: 'Investor Characteristics', weight: 15 },
    { id: 'pfp-2', name: 'Tax Considerations', weight: 15 },
    { id: 'pfp-3', name: 'Estate Planning', weight: 20 },
    { id: 'pfp-4', name: 'Portfolio Construction', weight: 25 },
    { id: 'pfp-5', name: 'Risk Management', weight: 25 }
  ],
  'IPM': [
    { id: 'ipm-1', name: 'Plan Governance', weight: 15 },
    { id: 'ipm-2', name: 'Risk Management', weight: 20 },
    { id: 'ipm-3', name: 'Portfolio Construction', weight: 25 },
    { id: 'ipm-4', name: 'Investment Manager Selection', weight: 20 },
    { id: 'ipm-5', name: 'Performance Evaluation', weight: 20 }
  ],
  // Add other Level III topics as needed
};
