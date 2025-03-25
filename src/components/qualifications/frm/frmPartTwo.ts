
import { QualificationTopic } from '../types';

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
