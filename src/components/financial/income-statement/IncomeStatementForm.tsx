
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

interface IncomeStatementFormProps {
  newIncomeItem: {
    name: string;
    amount: number;
    category: string;
    type: string;
  };
  setNewIncomeItem: React.Dispatch<React.SetStateAction<{
    name: string;
    amount: number;
    category: string;
    type: string;
  }>>;
  addIncomeItem: () => void;
}

const IncomeStatementForm: React.FC<IncomeStatementFormProps> = ({
  newIncomeItem,
  setNewIncomeItem,
  addIncomeItem
}) => {
  return (
    <div className="mt-6">
      <h3 className="font-medium mb-2">Add New Item</h3>
      <div className="grid md:grid-cols-5 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="is-name">Description</Label>
          <Input
            id="is-name"
            value={newIncomeItem.name}
            onChange={(e) => setNewIncomeItem({...newIncomeItem, name: e.target.value})}
            placeholder="e.g., Sales Revenue, Rent Expense..."
          />
        </div>
        <div>
          <Label htmlFor="is-category">Category</Label>
          <select
            id="is-category"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={newIncomeItem.category}
            onChange={(e) => {
              const category = e.target.value as 'revenue' | 'expense';
              let type = newIncomeItem.type;
              
              // Update type based on selected category
              if (category === 'revenue') {
                type = 'Revenue';
              } else if (category === 'expense') {
                type = 'Operating Expenses';
              }
              
              setNewIncomeItem({...newIncomeItem, category, type});
            }}
          >
            <option value="revenue">Revenue</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div>
          <Label htmlFor="is-type">Type</Label>
          <select
            id="is-type"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={newIncomeItem.type}
            onChange={(e) => setNewIncomeItem({...newIncomeItem, type: e.target.value})}
          >
            {newIncomeItem.category === 'revenue' && (
              <>
                <option value="Revenue">Revenue</option>
                <option value="Other Income">Other Income</option>
              </>
            )}
            {newIncomeItem.category === 'expense' && (
              <>
                <option value="Cost of Sales">Cost of Sales</option>
                <option value="Operating Expenses">Operating Expenses</option>
                <option value="Non-Operating Expenses">Non-Operating Expenses</option>
              </>
            )}
          </select>
        </div>
        <div>
          <Label htmlFor="is-amount">Amount</Label>
          <div className="flex">
            <Input
              id="is-amount"
              type="number"
              value={newIncomeItem.amount}
              onChange={(e) => setNewIncomeItem({...newIncomeItem, amount: parseFloat(e.target.value) || 0})}
              placeholder="Amount"
            />
            <Button className="ml-2" onClick={addIncomeItem}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeStatementForm;
