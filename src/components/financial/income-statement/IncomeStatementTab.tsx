
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDownToLine } from 'lucide-react';
import { IncomeStatementItem } from '../types';
import IncomeStatementTable from './IncomeStatementTable';
import IncomeStatementForm from './IncomeStatementForm';
import { exportToCSV } from '../utils/exportUtils';

const IncomeStatementTab: React.FC = () => {
  // Income Statement State
  const [incomeItems, setIncomeItems] = useState<IncomeStatementItem[]>([
    { id: '1', name: 'Sales Revenue', amount: 20000, category: 'revenue', type: 'Revenue' },
    { id: '2', name: 'Service Revenue', amount: 5000, category: 'revenue', type: 'Revenue' },
    { id: '3', name: 'Cost of Goods Sold', amount: 8000, category: 'expense', type: 'Cost of Sales' },
    { id: '4', name: 'Salaries Expense', amount: 6000, category: 'expense', type: 'Operating Expenses' },
    { id: '5', name: 'Rent Expense', amount: 2000, category: 'expense', type: 'Operating Expenses' },
    { id: '6', name: 'Utilities Expense', amount: 1000, category: 'expense', type: 'Operating Expenses' },
    { id: '7', name: 'Interest Expense', amount: 500, category: 'expense', type: 'Non-Operating Expenses' },
  ]);
  
  const [newIncomeItem, setNewIncomeItem] = useState({
    name: '',
    amount: 0,
    category: 'revenue',
    type: 'Revenue'
  });

  // Income Statement Calculations
  const totalRevenue = incomeItems
    .filter(item => item.category === 'revenue')
    .reduce((sum, item) => sum + item.amount, 0);
    
  const totalExpenses = incomeItems
    .filter(item => item.category === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);
    
  const netIncome = totalRevenue - totalExpenses;

  // Add Income Statement Item
  const addIncomeItem = () => {
    if (newIncomeItem.name && newIncomeItem.amount) {
      const newItem: IncomeStatementItem = {
        id: Date.now().toString(),
        name: newIncomeItem.name,
        amount: newIncomeItem.amount,
        category: newIncomeItem.category as 'revenue' | 'expense',
        type: newIncomeItem.type
      };
      
      setIncomeItems([...incomeItems, newItem]);
      setNewIncomeItem({
        name: '',
        amount: 0,
        category: 'revenue',
        type: 'Revenue'
      });
    }
  };

  // Remove Income Statement Item
  const removeIncomeItem = (id: string) => {
    setIncomeItems(incomeItems.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Income Statement</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => exportToCSV(incomeItems, 'income_statement')}
        >
          <ArrowDownToLine className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
      
      <div className={`p-3 rounded-md ${netIncome >= 0 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
        <p className="font-medium">
          {netIncome >= 0 
            ? `Net Income: $${netIncome.toLocaleString()}` 
            : `Net Loss: $${Math.abs(netIncome).toLocaleString()}`}
        </p>
        <div className="mt-1 text-sm">
          <p>Total Revenue: ${totalRevenue.toLocaleString()}</p>
          <p>Total Expenses: ${totalExpenses.toLocaleString()}</p>
          <p className="mt-1 font-medium">
            Profit Margin: {Math.round((netIncome / totalRevenue) * 100) || 0}%
          </p>
        </div>
      </div>
      
      <IncomeStatementTable 
        incomeItems={incomeItems}
        removeIncomeItem={removeIncomeItem}
        totalRevenue={totalRevenue}
        totalExpenses={totalExpenses}
        netIncome={netIncome}
      />
      
      <IncomeStatementForm 
        newIncomeItem={newIncomeItem}
        setNewIncomeItem={setNewIncomeItem}
        addIncomeItem={addIncomeItem}
      />
    </div>
  );
};

export default IncomeStatementTab;
