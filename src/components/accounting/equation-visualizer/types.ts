
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

// Define type for updateComponent function
export type UpdateComponentFunction = (
  type: 'assets' | 'liabilities' | 'equity',
  id: string,
  value: number,
  name?: string,
  remove?: boolean
) => void;
