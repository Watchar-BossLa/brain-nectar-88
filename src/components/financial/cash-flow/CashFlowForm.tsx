
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

interface CashFlowFormProps {
  newCashFlowItem: {
    name: string;
    amount: number;
    category: string;
    type: string;
  };
  setNewCashFlowItem: React.Dispatch<React.SetStateAction<{
    name: string;
    amount: number;
    category: string;
    type: string;
  }>>;
  addCashFlowItem: () => void;
}

const CashFlowForm: React.FC<CashFlowFormProps> = ({
  newCashFlowItem,
  setNewCashFlowItem,
  addCashFlowItem
}) => {
  return (
    <div className="mt-6">
      <h3 className="font-medium mb-2">Add New Item</h3>
      <div className="grid md:grid-cols-5 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="cf-name">Description</Label>
          <Input
            id="cf-name"
            value={newCashFlowItem.name}
            onChange={(e) => setNewCashFlowItem({...newCashFlowItem, name: e.target.value})}
            placeholder="e.g., Net Income, Purchase of Equipment..."
          />
        </div>
        <div>
          <Label htmlFor="cf-category">Category</Label>
          <select
            id="cf-category"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={newCashFlowItem.category}
            onChange={(e) => setNewCashFlowItem({
              ...newCashFlowItem, 
              category: e.target.value as 'operating' | 'investing' | 'financing',
              type: e.target.value === 'operating' 
                ? 'Cash from Operations' 
                : e.target.value === 'investing'
                  ? 'Cash from Investing'
                  : 'Cash from Financing'
            })}
          >
            <option value="operating">Operating</option>
            <option value="investing">Investing</option>
            <option value="financing">Financing</option>
          </select>
        </div>
        <div>
          <Label htmlFor="cf-type">Type</Label>
          <Input
            id="cf-type"
            value={newCashFlowItem.type}
            readOnly
            className="bg-muted"
          />
        </div>
        <div>
          <Label htmlFor="cf-amount">Amount (+ inflow, - outflow)</Label>
          <div className="flex">
            <Input
              id="cf-amount"
              type="number"
              value={newCashFlowItem.amount}
              onChange={(e) => setNewCashFlowItem({...newCashFlowItem, amount: parseFloat(e.target.value) || 0})}
              placeholder="Amount"
            />
            <Button className="ml-2" onClick={addCashFlowItem}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashFlowForm;
