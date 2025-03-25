
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
  'ECO': [
    { id: 'eco3-1', name: 'Market Expectations and Asset Allocation', weight: 35 },
    { id: 'eco3-2', name: 'Global Investment Performance Standards', weight: 30 },
    { id: 'eco3-3', name: 'Economics for Investment Decision Making', weight: 35 }
  ],
  'EI': [
    { id: 'ei3-1', name: 'Advanced Equity Analysis', weight: 25 },
    { id: 'ei3-2', name: 'Equity Portfolio Strategies', weight: 25 },
    { id: 'ei3-3', name: 'Equity Market Valuation', weight: 30 },
    { id: 'ei3-4', name: 'Equity Investment Process Integration', weight: 20 }
  ],
  'FI': [
    { id: 'fi3-1', name: 'Fixed Income Portfolio Management', weight: 30 },
    { id: 'fi3-2', name: 'Liability-Driven Strategies', weight: 35 },
    { id: 'fi3-3', name: 'Fixed Income Active Management', weight: 35 }
  ],
  'AI': [
    { id: 'ai3-1', name: 'Alternative Investments Portfolio Management', weight: 35 },
    { id: 'ai3-2', name: 'Risk Management of Alternative Investments', weight: 30 },
    { id: 'ai3-3', name: 'Due Diligence in Alternative Investments', weight: 35 }
  ],
  'TPPM': [
    { id: 'tppm-1', name: 'Portfolio Trading Strategies', weight: 25 },
    { id: 'tppm-2', name: 'Performance Attribution', weight: 25 },
    { id: 'tppm-3', name: 'Investment Manager Selection', weight: 25 },
    { id: 'tppm-4', name: 'Portfolio Risk Management Techniques', weight: 25 }
  ]
};

// FRM detailed topics
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

export const frmPartTwoTopics: Record<string, QualificationTopic[]> = {
  'MR': [
    { id: 'mr-1', name: 'Market Risk Measurement', weight: 25 },
    { id: 'mr-2', name: 'VaR and Expected Shortfall', weight: 25 },
    { id: 'mr-3', name: 'Stress Testing', weight: 25 },
    { id: 'mr-4', name: 'Risk Monitoring', weight: 25 }
  ],
  'CR': [
    { id: 'cr-1', name: 'Credit Risk Measurement', weight: 30 },
    { id: 'cr-2', name: 'Credit VaR', weight: 20 },
    { id: 'cr-3', name: 'Counterparty Risk', weight: 30 },
    { id: 'cr-4', name: 'Credit Derivatives', weight: 20 }
  ],
  'OR': [
    { id: 'or-1', name: 'Operational Risk Framework', weight: 30 },
    { id: 'or-2', name: 'Operational Risk Measurement', weight: 40 },
    { id: 'or-3', name: 'Operational Risk Management', weight: 30 }
  ],
  'RM': [
    { id: 'rm-1', name: 'Enterprise Risk Management', weight: 25 },
    { id: 'rm-2', name: 'Liquidity Risk', weight: 25 },
    { id: 'rm-3', name: 'Economic Capital', weight: 25 },
    { id: 'rm-4', name: 'Regulatory Framework and Basel Accords', weight: 25 }
  ],
  'PI': [
    { id: 'pi-1', name: 'Risk Management for Investment Funds', weight: 35 },
    { id: 'pi-2', name: 'Risk-Return Analysis', weight: 30 },
    { id: 'pi-3', name: 'Portfolio Construction and Risk Budgeting', weight: 35 }
  ]
};
