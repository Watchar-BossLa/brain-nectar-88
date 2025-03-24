
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { BalanceSheetItem } from '../types';

interface BalanceSheetFormProps {
  newBalanceItem: {
    name: string;
    amount: number;
    category: string;
    type: string;
  };
  setNewBalanceItem: React.Dispatch<React.SetStateAction<{
    name: string;
    amount: number;
    category: string;
    type: string;
  }>>;
  addBalanceSheetItem: () => void;
}

const BalanceSheetForm: React.FC<BalanceSheetFormProps> = ({ 
  newBalanceItem, 
  setNewBalanceItem, 
  addBalanceSheetItem 
}) => {
  return (
    <div className="mt-6">
      <h3 className="font-medium mb-2">Add New Item</h3>
      <div className="grid md:grid-cols-5 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="bs-name">Description</Label>
          <Input
            id="bs-name"
            value={newBalanceItem.name}
            onChange={(e) => setNewBalanceItem({...newBalanceItem, name: e.target.value})}
            placeholder="e.g., Cash, Equipment, Loan..."
          />
        </div>
        <div>
          <Label htmlFor="bs-category">Category</Label>
          <select
            id="bs-category"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={newBalanceItem.category}
            onChange={(e) => {
              const category = e.target.value;
              let type = newBalanceItem.type;
              
              // Update type based on selected category
              if (category === 'assets') {
                type = 'Current Assets';
              } else if (category === 'liabilities') {
                type = 'Current Liabilities';
              } else if (category === 'equity') {
                type = 'Equity';
              }
              
              setNewBalanceItem({...newBalanceItem, category, type});
            }}
          >
            <option value="assets">Asset</option>
            <option value="liabilities">Liability</option>
            <option value="equity">Equity</option>
          </select>
        </div>
        <div>
          <Label htmlFor="bs-type">Type</Label>
          <select
            id="bs-type"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={newBalanceItem.type}
            onChange={(e) => setNewBalanceItem({...newBalanceItem, type: e.target.value})}
          >
            {newBalanceItem.category === 'assets' && (
              <>
                <option value="Current Assets">Current Assets</option>
                <option value="Non-Current Assets">Non-Current Assets</option>
                <option value="Intangible Assets">Intangible Assets</option>
              </>
            )}
            {newBalanceItem.category === 'liabilities' && (
              <>
                <option value="Current Liabilities">Current Liabilities</option>
                <option value="Non-Current Liabilities">Non-Current Liabilities</option>
              </>
            )}
            {newBalanceItem.category === 'equity' && (
              <>
                <option value="Equity">Equity</option>
              </>
            )}
          </select>
        </div>
        <div>
          <Label htmlFor="bs-amount">Amount</Label>
          <div className="flex">
            <Input
              id="bs-amount"
              type="number"
              value={newBalanceItem.amount}
              onChange={(e) => setNewBalanceItem({...newBalanceItem, amount: parseFloat(e.target.value) || 0})}
              placeholder="Amount"
            />
            <Button className="ml-2" onClick={addBalanceSheetItem}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheetForm;
