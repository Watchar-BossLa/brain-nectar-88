
// Type definitions for the application

export interface ChartConfig {
  [key: string]: {
    label: string;
    theme: {
      light: string;
      dark: string;
    };
  };
}

// Financial statement types
export interface FinancialItem {
  id: string;
  name: string;
  amount: number;
  category: string;
  type: string;
}

export interface BalanceSheetTemplate {
  id: string;
  name: string;
  description: string;
}

export interface IncomeStatementTemplate {
  id: string;
  name: string;
  description: string;
}

export interface CashFlowTemplate {
  id: string;
  name: string;
  description: string;
}

export interface FinancialRatios {
  currentRatio: number;
  quickRatio: number;
  debtToEquity: number;
  returnOnAssets: number;
  returnOnEquity: number;
  profitMargin: number;
}
