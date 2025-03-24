
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDownToLine } from 'lucide-react';
import { CashFlowItem } from '../types';
import CashFlowTable from './CashFlowTable';
import CashFlowForm from './CashFlowForm';
import { exportToCSV } from '../utils/exportUtils';

const CashFlowTab: React.FC = () => {
  // Cash Flow State
  const [cashFlowItems, setCashFlowItems] = useState<CashFlowItem[]>([
    { id: '1', name: 'Net Income', amount: 7500, category: 'operating', type: 'Cash from Operations' },
    { id: '2', name: 'Depreciation', amount: 1000, category: 'operating', type: 'Cash from Operations' },
    { id: '3', name: 'Increase in Accounts Receivable', amount: -1500, category: 'operating', type: 'Cash from Operations' },
    { id: '4', name: 'Purchase of Equipment', amount: -5000, category: 'investing', type: 'Cash from Investing' },
    { id: '5', name: 'Sale of Investments', amount: 2000, category: 'investing', type: 'Cash from Investing' },
    { id: '6', name: 'Debt Repayment', amount: -2000, category: 'financing', type: 'Cash from Financing' },
    { id: '7', name: 'Issuance of Stock', amount: 5000, category: 'financing', type: 'Cash from Financing' },
  ]);
  
  const [newCashFlowItem, setNewCashFlowItem] = useState({
    name: '',
    amount: 0,
    category: 'operating',
    type: 'Cash from Operations'
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
    if (newCashFlowItem.name && newCashFlowItem.amount !== undefined) {
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
        type: 'Cash from Operations'
      });
    }
  };

  // Remove Cash Flow Item
  const removeCashFlowItem = (id: string) => {
    setCashFlowItems(cashFlowItems.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Cash Flow Statement</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => exportToCSV(cashFlowItems, 'cash_flow_statement')}
        >
          <ArrowDownToLine className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
      
      <div className={`p-3 rounded-md ${netCashFlow >= 0 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
        <p className="font-medium">
          {netCashFlow >= 0 
            ? `Net Cash Flow: $${netCashFlow.toLocaleString()}` 
            : `Net Cash Outflow: $${Math.abs(netCashFlow).toLocaleString()}`}
        </p>
        <div className="mt-1 text-sm grid grid-cols-1 md:grid-cols-3 gap-2">
          <p className={operatingCashFlow >= 0 ? 'text-green-700' : 'text-red-700'}>
            Operating Activities: ${operatingCashFlow.toLocaleString()}
          </p>
          <p className={investingCashFlow >= 0 ? 'text-green-700' : 'text-red-700'}>
            Investing Activities: ${investingCashFlow.toLocaleString()}
          </p>
          <p className={financingCashFlow >= 0 ? 'text-green-700' : 'text-red-700'}>
            Financing Activities: ${financingCashFlow.toLocaleString()}
          </p>
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
