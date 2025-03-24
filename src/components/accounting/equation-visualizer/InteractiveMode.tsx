
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  ArrowRightLeft, 
  Plus, 
  Minus, 
  DollarSign,
  Info
} from 'lucide-react';
import { Transaction } from './types';

interface InteractiveModeProps {
  assets: number;
  liabilities: number;
  equity: number;
  isBalanced: boolean;
  transactions: string[];
  handleAssetChange: (value: number) => void;
  handleLiabilityChange: (value: number) => void;
  handleEquityChange: (value: number) => void;
  applyTransaction: (type: string) => void;
}

const InteractiveMode: React.FC<InteractiveModeProps> = ({
  assets,
  liabilities,
  equity,
  isBalanced,
  transactions,
  handleAssetChange,
  handleLiabilityChange,
  handleEquityChange,
  applyTransaction,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-center gap-2 md:gap-4 text-center">
        <div className="flex-1">
          <Label htmlFor="assets-interactive" className="text-lg font-medium mb-2 block">Assets</Label>
          <Input
            id="assets-interactive"
            type="number"
            value={assets}
            onChange={(e) => handleAssetChange(parseFloat(e.target.value) || 0)}
            className="text-center text-xl"
          />
        </div>
        <div className="flex items-center justify-center py-2">
          <span className="text-2xl font-bold">=</span>
        </div>
        <div className="flex-1">
          <Label htmlFor="liabilities-interactive" className="text-lg font-medium mb-2 block">Liabilities</Label>
          <Input
            id="liabilities-interactive"
            type="number"
            value={liabilities}
            onChange={(e) => handleLiabilityChange(parseFloat(e.target.value) || 0)}
            className="text-center text-xl"
          />
        </div>
        <div className="flex items-center justify-center py-2">
          <span className="text-2xl font-bold">+</span>
        </div>
        <div className="flex-1">
          <Label htmlFor="equity-interactive" className="text-lg font-medium mb-2 block">Equity</Label>
          <Input
            id="equity-interactive"
            type="number"
            value={equity}
            onChange={(e) => handleEquityChange(parseFloat(e.target.value) || 0)}
            className={`text-center text-xl ${!isBalanced ? 'border-red-500' : ''}`}
          />
        </div>
      </div>
      
      {!isBalanced && (
        <div className="p-3 border border-red-200 bg-red-50 rounded-md text-red-700 text-sm flex items-start gap-2">
          <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Equation Unbalanced</p>
            <p>The accounting equation is not balanced. Assets should equal Liabilities plus Equity.</p>
          </div>
        </div>
      )}
      
      <div className="mt-6">
        <h3 className="font-medium mb-3">Apply Common Transactions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          <Button variant="outline" onClick={() => applyTransaction('purchase-cash')}>
            <Minus className="mr-2 h-4 w-4" />
            Purchase Equipment (Cash)
          </Button>
          <Button variant="outline" onClick={() => applyTransaction('loan')}>
            <Plus className="mr-2 h-4 w-4" />
            Take a Loan
          </Button>
          <Button variant="outline" onClick={() => applyTransaction('revenue')}>
            <DollarSign className="mr-2 h-4 w-4" />
            Earn Revenue
          </Button>
          <Button variant="outline" onClick={() => applyTransaction('expense')}>
            <Minus className="mr-2 h-4 w-4" />
            Pay Expense
          </Button>
          <Button variant="outline" onClick={() => applyTransaction('pay-debt')}>
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            Pay Off Debt
          </Button>
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="font-medium mb-2">Transaction History</h3>
        <div className="border rounded-md p-3 max-h-40 overflow-y-auto bg-muted/20">
          {transactions.length > 0 ? (
            <ul className="space-y-1">
              {transactions.map((transaction, index) => (
                <li key={index} className="text-sm flex gap-2 items-center">
                  <span className="text-xs bg-primary/20 px-1.5 py-0.5 rounded">#{index + 1}</span>
                  {transaction}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-2">
              No transactions yet. Modify values or use the transaction buttons above.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveMode;
