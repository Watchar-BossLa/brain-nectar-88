
export type VisualizerMode = 'basic' | 'interactive' | 'advanced';

export type TransactionType = 'purchase-cash' | 'loan' | 'revenue' | 'expense' | 'pay-debt';

export interface AccountComponent {
  id: string;
  name: string;
  value: number;
}
