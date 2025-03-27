
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDownToLine } from 'lucide-react';
import { CashFlowItem } from '../types';
import CashFlowTable from './CashFlowTable';
import CashFlowForm from './CashFlowForm';
import { exportToCSV } from '../utils/exportUtils';

const CashFlowTab: React.FC = () => {
  // Cash Flow Statement State
  const [cashFlowItems, setCashFlowItems] = useState<CashFlowItem[]>([
    { id: '1', name: 'Net Income', amount: 12000, category: 'operating', type: 'Operating Activities' },
    { id: '2', name: 'Depreciation and Amortization', amount: 3000, category: 'operating', type: 'Operating Activities' },
    { id: '3', name: 'Increase in Accounts Receivable', amount: -2000, category: 'operating', type: 'Operating Activities' },
    { id: '4', name: 'Decrease in Inventory', amount: 1500, category: 'operating', type: 'Operating Activities' },
    { id: '5', name: 'Purchase of Equipment', amount: -8000, category: 'investing', type: 'Investing Activities' },
    { id: '6', name: 'Sale of Investments', amount: 3000, category: 'investing', type: 'Investing Activities' },
    { id: '7', name: 'Proceeds from Long-term Debt', amount: 10000, category: 'financing', type: 'Financing Activities' },
    { id: '8', name: 'Dividend Payments', amount: -4000, category: 'financing', type: 'Financing Activities' },
  ]);
  
  const [newCashFlowItem, setNewCashFlowItem] = useState({
    name: '',
    amount: 0,
    category: 'operating',
    type: 'Operating Activities'
  });

  // Cash Flow Calculations
  const operatingCashFlow = cashFlowItems
    .filter(item => item.category === 'operating')
    .reduce((sum, item) => sum + item.amount, 0);
    
  const investingCashFlow = cashFlowItems
    .filter(item => item.category === 'investing')
    .reduce((sum, item) => sum + item.amount, 0);
    
  const financingCashFlow = cashFlowItems
    .filter(item => item.category === 'financing')
    .reduce((sum, item) => sum + item.amount, 0);
    
  const netCashFlow = operatingCashFlow + investingCashFlow + financingCashFlow;

  // Add Cash Flow Item
  const addCashFlowItem = () => {
    if (newCashFlowItem.name && newCashFlowItem.amount) {
      const newItem: CashFlowItem = {
        id: Date.now().toString(),
        name: newCashFlowItem.name,
        amount: newCashFlowItem.amount,
        category: newCashFlowItem.category as 'operating' | 'investing' | 'financing',
        type: newCashFlowItem.type
      };
      
      setCashFlowItems([...cashFlowItems, newItem]);
      setNewCashFlowItem({
        name: '',
        amount: 0,
        category: 'operating',
        type: 'Operating Activities'
      });
    }
  };

  // Remove Cash Flow Item
  const removeCashFlowItem = (id: string) => {
    setCashFlowItems(cashFlowItems.filter(item => item.id !== id));
  };

  // Handle export to CSV
  const handleExportToCsv = () => {
    exportToCSV(cashFlowItems, 'cash_flow_statement.csv');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Cash Flow Statement</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleExportToCsv}
        >
          <ArrowDownToLine className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
      
      <div className={`p-3 rounded-md ${netCashFlow >= 0 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
        <p className="font-medium">
          Net Cash Flow: ${netCashFlow.toLocaleString()}
        </p>
        <div className="mt-1 text-sm">
          <p>Operating Activities: ${operatingCashFlow.toLocaleString()}</p>
          <p>Investing Activities: ${investingCashFlow.toLocaleString()}</p>
          <p>Financing Activities: ${financingCashFlow.toLocaleString()}</p>
        </div>
      </div>
      
      <CashFlowTable 
        cashFlowItems={cashFlowItems}
        removeCashFlowItem={removeCashFlowItem}
        operatingCashFlow={operatingCashFlow}
        investingCashFlow={investingCashFlow}
        financingCashFlow={financingCashFlow}
        netCashFlow={netCashFlow}
      />
      
      <CashFlowForm 
        newCashFlowItem={newCashFlowItem}
        setNewCashFlowItem={setNewCashFlowItem}
        addCashFlowItem={addCashFlowItem}
      />
    </div>
  );
};

export default CashFlowTab;
