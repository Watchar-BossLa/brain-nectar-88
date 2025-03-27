
import { AccountComponent, TransactionType, VisualizerMode } from '../types';

export interface EquationVisualizerState {
  assets: number;
  liabilities: number;
  equity: number;
  isBalanced: boolean;
  mode: VisualizerMode;
  transactions: string[];
  assetComponents: AccountComponent[];
  liabilityComponents: AccountComponent[];
  equityComponents: AccountComponent[];
}

export const initialState: EquationVisualizerState = {
  assets: 1000,
  liabilities: 400,
  equity: 600,
  isBalanced: true,
  mode: 'basic',
  transactions: [],
  assetComponents: [
    { id: 'asset-1', name: 'Cash', value: 500 },
    { id: 'asset-2', name: 'Accounts Receivable', value: 300 },
    { id: 'asset-3', name: 'Inventory', value: 200 }
  ],
  liabilityComponents: [
    { id: 'liability-1', name: 'Accounts Payable', value: 250 },
    { id: 'liability-2', name: 'Notes Payable', value: 150 }
  ],
  equityComponents: [
    { id: 'equity-1', name: 'Common Stock', value: 400 },
    { id: 'equity-2', name: 'Retained Earnings', value: 200 }
  ]
};
