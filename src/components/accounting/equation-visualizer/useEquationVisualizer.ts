
import { useState, useEffect } from 'react';
import { VisualizerMode } from './types';

export const useEquationVisualizer = () => {
  const [assets, setAssets] = useState(1000);
  const [liabilities, setLiabilities] = useState(400);
  const [equity, setEquity] = useState(600);
  const [isBalanced, setIsBalanced] = useState(true);
  const [mode, setMode] = useState<VisualizerMode>('basic');
  const [transactions, setTransactions] = useState<string[]>([]);

  // Recalculate balance when any value changes
  useEffect(() => {
    // Check if the accounting equation balances (A = L + E)
    const calculatedEquity = assets - liabilities;
    if (mode === 'basic') {
      setEquity(calculatedEquity);
      setIsBalanced(true);
    } else {
      setIsBalanced(Math.abs(assets - (liabilities + equity)) < 0.01);
    }
  }, [assets, liabilities, equity, mode]);

  // Handle asset change
  const handleAssetChange = (value: number) => {
    setAssets(value);
    if (mode === 'interactive') {
      const transaction = `Assets changed to ${value.toFixed(2)}`;
      setTransactions(prev => [transaction, ...prev.slice(0, 9)]);
    }
  };

  // Handle liability change
  const handleLiabilityChange = (value: number) => {
    setLiabilities(value);
    if (mode === 'interactive') {
      const transaction = `Liabilities changed to ${value.toFixed(2)}`;
      setTransactions(prev => [transaction, ...prev.slice(0, 9)]);
    }
  };

  // Handle equity change
  const handleEquityChange = (value: number) => {
    if (mode === 'interactive') {
      setEquity(value);
      const transaction = `Equity changed to ${value.toFixed(2)}`;
      setTransactions(prev => [transaction, ...prev.slice(0, 9)]);
    }
  };

  // Predefined transactions
  const applyTransaction = (type: string) => {
    switch (type) {
      case 'purchase-cash':
        setAssets(prev => prev - 100);
        const transaction1 = 'Purchased equipment for $100 cash';
        setTransactions(prev => [transaction1, ...prev.slice(0, 9)]);
        break;
      case 'loan':
        setAssets(prev => prev + 500);
        setLiabilities(prev => prev + 500);
        const transaction2 = 'Took a loan of $500';
        setTransactions(prev => [transaction2, ...prev.slice(0, 9)]);
        break;
      case 'revenue':
        setAssets(prev => prev + 200);
        setEquity(prev => prev + 200);
        const transaction3 = 'Earned revenue of $200';
        setTransactions(prev => [transaction3, ...prev.slice(0, 9)]);
        break;
      case 'expense':
        setAssets(prev => prev - 150);
        setEquity(prev => prev - 150);
        const transaction4 = 'Paid expense of $150';
        setTransactions(prev => [transaction4, ...prev.slice(0, 9)]);
        break;
      case 'pay-debt':
        setAssets(prev => prev - 100);
        setLiabilities(prev => prev - 100);
        const transaction5 = 'Paid off debt of $100';
        setTransactions(prev => [transaction5, ...prev.slice(0, 9)]);
        break;
      default:
        break;
    }
  };

  return {
    assets,
    liabilities,
    equity,
    isBalanced,
    mode,
    transactions,
    setMode,
    handleAssetChange,
    handleLiabilityChange,
    handleEquityChange,
    applyTransaction
  };
};
