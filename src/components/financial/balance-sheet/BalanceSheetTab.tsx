import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDownToLine } from 'lucide-react';
import { BalanceSheetItem } from '../types';
import BalanceSheetTable from './BalanceSheetTable';
import BalanceSheetForm from './BalanceSheetForm';
import { exportToCSV, formatCurrency } from '../utils/exportUtils';

const BalanceSheetTab: React.FC = () => {
  // Balance Sheet State
  const [balanceSheetItems, setBalanceSheetItems] = useState<BalanceSheetItem[]>([
    { id: '1', name: 'Cash', amount: 5000, category: 'assets', type: 'Current Assets' },
    { id: '2', name: 'Accounts Receivable', amount: 3000, category: 'assets', type: 'Current Assets' },
    { id: '3', name: 'Equipment', amount: 10000, category: 'assets', type: 'Non-Current Assets' },
    { id: '4', name: 'Accounts Payable', amount: 2000, category: 'liabilities', type: 'Current Liabilities' },
    { id: '5', name: 'Long-term Debt', amount: 8000, category: 'liabilities', type: 'Non-Current Liabilities' },
    { id: '6', name: 'Common Stock', amount: 5000, category: 'equity', type: 'Equity' },
    { id: '7', name: 'Retained Earnings', amount: 3000, category: 'equity', type: 'Equity' },
  ]);
  
  const [newBalanceItem, setNewBalanceItem] = useState({
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
    
  const isBalanceSheetBalanced = totalAssets === (totalLiabilities + totalEquity);

  // Add Balance Sheet Item
  const addBalanceSheetItem = () => {
    if (newBalanceItem.name && newBalanceItem.amount) {
      const newItem: BalanceSheetItem = {
        id: Date.now().toString(),
        name: newBalanceItem.name,
        amount: newBalanceItem.amount,
        category: newBalanceItem.category as 'assets' | 'liabilities' | 'equity',
        type: newBalanceItem.type
      };
      
      setBalanceSheetItems([...balanceSheetItems, newItem]);
      setNewBalanceItem({
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
      
      <div className={`p-3 rounded-md ${isBalanceSheetBalanced ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
        <p className="font-medium">
          {isBalanceSheetBalanced 
            ? 'Balance Sheet is balanced!' 
            : 'Balance Sheet is not balanced. Assets should equal Liabilities + Equity.'}
        </p>
        <div className="mt-1 text-sm">
          <p>Total Assets: ${totalAssets.toLocaleString()}</p>
          <p>Total Liabilities + Equity: ${(totalLiabilities + totalEquity).toLocaleString()}</p>
          {!isBalanceSheetBalanced && (
            <p className="mt-1">
              Difference: ${Math.abs(totalAssets - (totalLiabilities + totalEquity)).toLocaleString()}
            </p>
          )}
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
        newBalanceItem={newBalanceItem}
        setNewBalanceItem={setNewBalanceItem}
        addBalanceSheetItem={addBalanceSheetItem}
      />
    </div>
  );
};

export default BalanceSheetTab;
