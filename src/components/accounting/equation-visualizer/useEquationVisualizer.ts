
import { useState, useEffect } from 'react';
import { VisualizerMode, TransactionType, AccountComponent, UpdateComponentFunction } from './types';
import { initialState } from './types/state';
import { transactionHandler } from './utils/transactions';
import { componentManager } from './utils/components';

export const useEquationVisualizer = () => {
  const [assets, setAssets] = useState(initialState.assets);
  const [liabilities, setLiabilities] = useState(initialState.liabilities);
  const [equity, setEquity] = useState(initialState.equity);
  const [isBalanced, setIsBalanced] = useState(initialState.isBalanced);
  const [mode, setMode] = useState<VisualizerMode>(initialState.mode);
  const [transactions, setTransactions] = useState<string[]>(initialState.transactions);

  // Advanced mode components
  const [assetComponents, setAssetComponents] = useState<AccountComponent[]>(initialState.assetComponents);
  const [liabilityComponents, setLiabilityComponents] = useState<AccountComponent[]>(initialState.liabilityComponents);
  const [equityComponents, setEquityComponents] = useState<AccountComponent[]>(initialState.equityComponents);

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
    const result = transactionHandler.applyTransaction(
      type, 
      assets, 
      liabilities, 
      equity, 
      transactions
    );
    
    setAssets(result.assets);
    setLiabilities(result.liabilities);
    setEquity(result.equity);
    setTransactions(result.transactions);
  };

  // Update component value for advanced mode
  const updateComponent: UpdateComponentFunction = (
    type, 
    id, 
    value, 
    name, 
    remove = false
  ) => {
    const result = componentManager.updateComponent(
      type,
      id,
      value,
      { assetComponents, liabilityComponents, equityComponents },
      name,
      remove
    );
    
    setAssetComponents(result.assetComponents);
    setLiabilityComponents(result.liabilityComponents);
    setEquityComponents(result.equityComponents);
  };

  // Reset all values to initial state
  const resetValues = () => {
    setAssetComponents(initialState.assetComponents);
    setLiabilityComponents(initialState.liabilityComponents);
    setEquityComponents(initialState.equityComponents);
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
