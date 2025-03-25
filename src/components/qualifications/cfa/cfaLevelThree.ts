
import { QualificationTopic } from '../types';

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
