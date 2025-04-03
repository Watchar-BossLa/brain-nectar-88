
import { AccountComponent } from '../../components/accounting/equation-visualizer/types';

/**
 * Accounting component prop types
 */

export interface AdvancedModeProps {
  className?: string;
  assetComponents: AccountComponent[];
  liabilityComponents: AccountComponent[];
  equityComponents: AccountComponent[];
  updateComponent: (type: string, id: string, value: number, name?: string, remove?: boolean) => void;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  isBalanced: boolean;
  resetValues: () => void;
}

export interface BasicModeProps {
  className?: string;
  assets: number;
  liabilities: number;
  equity: number;
  handleAssetChange: (value: number) => void;
  handleLiabilityChange: (value: number) => void;
}

export interface InteractiveModeProps {
  assets: number;
  liabilities: number;
  equity: number;
  isBalanced: boolean;
  transactions: string[];
  handleAssetChange: (value: number) => void;
  handleLiabilityChange: (value: number) => void;
  handleEquityChange: (value: number) => void;
  applyTransaction: (type: string) => void;
}

export interface AccountSectionProps {
  title: string;
  accounts?: any[];
  type?: string;
  onChange?: (accounts: any[]) => void;
  components: AccountComponent[];
  updateComponent: (type: string, id: string, value: number, name?: string, remove?: boolean) => void;
  componentType: string;
  totalValue: number;
}

export interface EquationStatusProps {
  isBalanced: boolean;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
}
