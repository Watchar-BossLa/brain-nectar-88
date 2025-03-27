
import { useState, useEffect } from 'react';
import { VisualizerMode, TransactionType, AccountComponent } from './types';

export const useEquationVisualizer = () => {
  const [assets, setAssets] = useState(1000);
  const [liabilities, setLiabilities] = useState(400);
  const [equity, setEquity] = useState(600);
  const [isBalanced, setIsBalanced] = useState(true);
  const [mode, setMode] = useState<VisualizerMode>('basic');
  const [transactions, setTransactions] = useState<string[]>([]);

  // Advanced mode components
  const [assetComponents, setAssetComponents] = useState<AccountComponent[]>([
    { id: 'asset-1', name: 'Cash', value: 500 },
    { id: 'asset-2', name: 'Accounts Receivable', value: 300 },
    { id: 'asset-3', name: 'Inventory', value: 200 }
  ]);
  
  const [liabilityComponents, setLiabilityComponents] = useState<AccountComponent[]>([
    { id: 'liability-1', name: 'Accounts Payable', value: 250 },
    { id: 'liability-2', name: 'Notes Payable', value: 150 }
  ]);
  
  const [equityComponents, setEquityComponents] = useState<AccountComponent[]>([
    { id: 'equity-1', name: 'Common Stock', value: 400 },
    { id: 'equity-2', name: 'Retained Earnings', value: 200 }
  ]);

  // Calculate totals from components for advanced mode
  useEffect(() => {
    if (mode === 'advanced') {
      const totalAssets = assetComponents.reduce((sum, item) => sum + item.value, 0);
      const totalLiabilities = liabilityComponents.reduce((sum, item) => sum + item.value, 0);
      const totalEquity = equityComponents.reduce((sum, item) => sum + item.value, 0);
      
      setAssets(totalAssets);
      setLiabilities(totalLiabilities);
      setEquity(totalEquity);
    }
  }, [assetComponents, liabilityComponents, equityComponents, mode]);

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
  const applyTransaction = (type: TransactionType) => {
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

  // Update component value for advanced mode
  const updateComponent = (
    type: 'assets' | 'liabilities' | 'equity', 
    id: string, 
    value: number, 
    name?: string,
    remove: boolean = false
  ) => {
    if (type === 'assets') {
      if (remove) {
        setAssetComponents(prev => prev.filter(comp => comp.id !== id));
      } else if (name !== undefined) {
        setAssetComponents(prev => 
          prev.map(comp => comp.id === id ? { ...comp, value, name } : comp)
        );
      } else {
        const exists = assetComponents.some(comp => comp.id === id);
        if (exists) {
          setAssetComponents(prev => 
            prev.map(comp => comp.id === id ? { ...comp, value } : comp)
          );
        } else {
          setAssetComponents(prev => 
            [...prev, { id, name: `Asset ${prev.length + 1}`, value }]
          );
        }
      }
    } else if (type === 'liabilities') {
      if (remove) {
        setLiabilityComponents(prev => prev.filter(comp => comp.id !== id));
      } else if (name !== undefined) {
        setLiabilityComponents(prev => 
          prev.map(comp => comp.id === id ? { ...comp, value, name } : comp)
        );
      } else {
        const exists = liabilityComponents.some(comp => comp.id === id);
        if (exists) {
          setLiabilityComponents(prev => 
            prev.map(comp => comp.id === id ? { ...comp, value } : comp)
          );
        } else {
          setLiabilityComponents(prev => 
            [...prev, { id, name: `Liability ${prev.length + 1}`, value }]
          );
        }
      }
    } else { // equity
      if (remove) {
        setEquityComponents(prev => prev.filter(comp => comp.id !== id));
      } else if (name !== undefined) {
        setEquityComponents(prev => 
          prev.map(comp => comp.id === id ? { ...comp, value, name } : comp)
        );
      } else {
        const exists = equityComponents.some(comp => comp.id === id);
        if (exists) {
          setEquityComponents(prev => 
            prev.map(comp => comp.id === id ? { ...comp, value } : comp)
          );
        } else {
          setEquityComponents(prev => 
            [...prev, { id, name: `Equity ${prev.length + 1}`, value }]
          );
        }
      }
    }
  };

  // Reset all values to initial state
  const resetValues = () => {
    setAssetComponents([
      { id: 'asset-1', name: 'Cash', value: 500 },
      { id: 'asset-2', name: 'Accounts Receivable', value: 300 },
      { id: 'asset-3', name: 'Inventory', value: 200 }
    ]);
    
    setLiabilityComponents([
      { id: 'liability-1', name: 'Accounts Payable', value: 250 },
      { id: 'liability-2', name: 'Notes Payable', value: 150 }
    ]);
    
    setEquityComponents([
      { id: 'equity-1', name: 'Common Stock', value: 400 },
      { id: 'equity-2', name: 'Retained Earnings', value: 200 }
    ]);
    
    setTransactions([]);
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
    applyTransaction,
    // Advanced mode
    assetComponents,
    liabilityComponents,
    equityComponents,
    updateComponent,
    resetValues
  };
};
