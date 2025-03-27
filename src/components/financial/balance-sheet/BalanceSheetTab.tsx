
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDownToLine } from 'lucide-react';
import { BalanceSheetItem } from '../types';
import BalanceSheetTable from './BalanceSheetTable';
import BalanceSheetForm from './BalanceSheetForm';
import { exportToCSV } from '../utils/exportUtils';

const BalanceSheetTab: React.FC = () => {
  // Balance Sheet State
  const [balanceSheetItems, setBalanceSheetItems] = useState<BalanceSheetItem[]>([
    { id: '1', name: 'Cash', amount: 10000, category: 'assets', type: 'Current Assets' },
    { id: '2', name: 'Accounts Receivable', amount: 5000, category: 'assets', type: 'Current Assets' },
    { id: '3', name: 'Inventory', amount: 15000, category: 'assets', type: 'Current Assets' },
    { id: '4', name: 'Property, Plant & Equipment', amount: 50000, category: 'assets', type: 'Non-Current Assets' },
    { id: '5', name: 'Accounts Payable', amount: 8000, category: 'liabilities', type: 'Current Liabilities' },
    { id: '6', name: 'Short-term Loans', amount: 2000, category: 'liabilities', type: 'Current Liabilities' },
    { id: '7', name: 'Long-term Debt', amount: 35000, category: 'liabilities', type: 'Non-Current Liabilities' },
    { id: '8', name: 'Common Stock', amount: 20000, category: 'equity', type: 'Contributed Capital' },
    { id: '9', name: 'Retained Earnings', amount: 15000, category: 'equity', type: 'Retained Earnings' },
  ]);
  
  const [newBalanceSheetItem, setNewBalanceSheetItem] = useState({
    name: '',
    amount: 0,
    category: 'assets',
    type: 'Current Assets'
  });

  // Balance Sheet Calculations
  const totalAssets = balanceSheetItems
    .filter(item => item.category === 'assets')
    .reduce((sum, item) => sum + item.amount, 0);
    
  const totalLiabilities = balanceSheetItems
    .filter(item => item.category === 'liabilities')
    .reduce((sum, item) => sum + item.amount, 0);
    
  const totalEquity = balanceSheetItems
    .filter(item => item.category === 'equity')
    .reduce((sum, item) => sum + item.amount, 0);
    
  const isBalanced = Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01;

  // Add Balance Sheet Item
  const addBalanceSheetItem = () => {
    if (newBalanceSheetItem.name && newBalanceSheetItem.amount) {
      const newItem: BalanceSheetItem = {
        id: Date.now().toString(),
        name: newBalanceSheetItem.name,
        amount: newBalanceSheetItem.amount,
        category: newBalanceSheetItem.category as 'assets' | 'liabilities' | 'equity',
        type: newBalanceSheetItem.type
      };
      
      setBalanceSheetItems([...balanceSheetItems, newItem]);
      setNewBalanceSheetItem({
        name: '',
        amount: 0,
        category: 'assets',
        type: 'Current Assets'
      });
    }
  };

  // Remove Balance Sheet Item
  const removeBalanceSheetItem = (id: string) => {
    setBalanceSheetItems(balanceSheetItems.filter(item => item.id !== id));
  };

  // Handle export to CSV
  const handleExportToCsv = () => {
    exportToCSV(balanceSheetItems, 'balance_sheet.csv');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Balance Sheet</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleExportToCsv}
        >
          <ArrowDownToLine className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
      
      <div className={`p-3 rounded-md ${isBalanced ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
        <p className="font-medium">
          {isBalanced 
            ? 'Balance Sheet is balanced' 
            : 'Balance Sheet is not balanced'}
        </p>
        <div className="mt-1 text-sm">
          <p>Total Assets: ${totalAssets.toLocaleString()}</p>
          <p>Total Liabilities: ${totalLiabilities.toLocaleString()}</p>
          <p>Total Equity: ${totalEquity.toLocaleString()}</p>
        </div>
      </div>
      
      <BalanceSheetTable 
        balanceSheetItems={balanceSheetItems}
        removeBalanceSheetItem={removeBalanceSheetItem}
        totalAssets={totalAssets}
        totalLiabilities={totalLiabilities}
        totalEquity={totalEquity}
      />
      
      <BalanceSheetForm 
        newBalanceSheetItem={newBalanceSheetItem}
        setNewBalanceSheetItem={setNewBalanceSheetItem}
        addBalanceSheetItem={addBalanceSheetItem}
      />
    </div>
  );
};

export default BalanceSheetTab;
