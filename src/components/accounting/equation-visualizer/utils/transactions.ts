
import { TransactionType } from '../types';

export interface TransactionHandler {
  applyTransaction: (
    type: TransactionType, 
    assets: number, 
    liabilities: number, 
    equity: number, 
    transactions: string[]
  ) => {
    assets: number;
    liabilities: number;
    equity: number;
    transactions: string[];
  };
}

export const transactionHandler: TransactionHandler = {
  applyTransaction: (type, assets, liabilities, equity, transactions) => {
    let newAssets = assets;
    let newLiabilities = liabilities;
    let newEquity = equity;
    let transaction = '';
    
    switch (type) {
      case 'purchase-cash':
        newAssets = assets - 100;
        transaction = 'Purchased equipment for $100 cash';
        break;
      case 'loan':
        newAssets = assets + 500;
        newLiabilities = liabilities + 500;
        transaction = 'Took a loan of $500';
        break;
      case 'revenue':
        newAssets = assets + 200;
        newEquity = equity + 200;
        transaction = 'Earned revenue of $200';
        break;
      case 'expense':
        newAssets = assets - 150;
        newEquity = equity - 150;
        transaction = 'Paid expense of $150';
        break;
      case 'pay-debt':
        newAssets = assets - 100;
        newLiabilities = liabilities - 100;
        transaction = 'Paid off debt of $100';
        break;
      default:
        break;
    }
    
    const newTransactions = [transaction, ...transactions.slice(0, 9)];
    
    return {
      assets: newAssets,
      liabilities: newLiabilities,
      equity: newEquity,
      transactions: newTransactions
    };
  }
};
