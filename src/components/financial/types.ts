
export type BalanceSheetItem = {
  id: string;
  name: string;
  amount: number;
  category: 'assets' | 'liabilities' | 'equity';
  type: string;
};

export type IncomeStatementItem = {
  id: string;
  name: string;
  amount: number;
  category: 'revenue' | 'expense';
  type: string;
};

export type CashFlowItem = {
  id: string;
  name: string;
  amount: number;
  category: 'operating' | 'investing' | 'financing';
  type: string;
};
