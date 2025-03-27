
export type VisualizerMode = 'basic' | 'interactive' | 'advanced';

export type TransactionType = 'purchase-cash' | 'loan' | 'revenue' | 'expense' | 'pay-debt';

export interface AccountComponent {
  id: string;
  name: string;
  value: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: Date;
  affectedAccounts: {
    increases: string[];
    decreases: string[];
  };
}
