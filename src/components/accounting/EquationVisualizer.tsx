
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  ArrowRightLeft, 
  Calculator, 
  Plus, 
  Minus, 
  DollarSign,
  Info
} from 'lucide-react';
import { renderLatexContent } from '../flashcards/utils/latex-renderer';

const EquationVisualizer = () => {
  const [assets, setAssets] = useState(1000);
  const [liabilities, setLiabilities] = useState(400);
  const [equity, setEquity] = useState(600);
  const [isBalanced, setIsBalanced] = useState(true);
  const [mode, setMode] = useState<'basic' | 'interactive'>('basic');
  const [transactions, setTransactions] = useState<string[]>([]);

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
  const applyTransaction = (type: string) => {
    switch (type) {
      case 'purchase-cash':
        setAssets(prev => prev - 100);
        const transaction1 = 'Purchased equipment for $100 cash';
        setTransactions(prev => [transaction1, ...prev.slice(0, 9)]);
        break;
      case 'loan':
        setAssets(prev => prev + 500);
        setLiabilities(prev => prev + 500);
        const transaction2 = 'Took a loan of $500';
        setTransactions(prev => [transaction2, ...prev.slice(0, 9)]);
        break;
      case 'revenue':
        setAssets(prev => prev + 200);
        setEquity(prev => prev + 200);
        const transaction3 = 'Earned revenue of $200';
        setTransactions(prev => [transaction3, ...prev.slice(0, 9)]);
        break;
      case 'expense':
        setAssets(prev => prev - 150);
        setEquity(prev => prev - 150);
        const transaction4 = 'Paid expense of $150';
        setTransactions(prev => [transaction4, ...prev.slice(0, 9)]);
        break;
      case 'pay-debt':
        setAssets(prev => prev - 100);
        setLiabilities(prev => prev - 100);
        const transaction5 = 'Paid off debt of $100';
        setTransactions(prev => [transaction5, ...prev.slice(0, 9)]);
        break;
      default:
        break;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Accounting Equation Visualizer
        </CardTitle>
        <CardDescription>
          Interact with the fundamental accounting equation: Assets = Liabilities + Equity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" onValueChange={(value) => setMode(value as 'basic' | 'interactive')}>
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Basic Mode</TabsTrigger>
            <TabsTrigger value="interactive">Interactive Mode</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-center gap-2 md:gap-4 text-center">
                <div className="flex-1">
                  <Label htmlFor="assets" className="text-lg font-medium mb-2 block">Assets</Label>
                  <Input
                    id="assets"
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
                  <Label htmlFor="liabilities" className="text-lg font-medium mb-2 block">Liabilities</Label>
                  <Input
                    id="liabilities"
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
                  <Label htmlFor="equity" className="text-lg font-medium mb-2 block">Equity</Label>
                  <Input
                    id="equity"
                    type="number"
                    value={equity}
                    readOnly
                    className="text-center text-xl bg-gray-100"
                  />
                </div>
              </div>
              
              <div className="p-4 rounded-md bg-primary/10 mt-6">
                <h3 className="font-medium mb-2">Formula Explanation</h3>
                <div className="mb-3">
                  {renderLatexContent('$$Assets = Liabilities + Equity$$', true)}
                </div>
                <p className="text-sm text-muted-foreground">
                  In Basic Mode, the Equity value is automatically calculated as Assets minus Liabilities, 
                  ensuring the equation always balances.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="interactive">
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
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground">
          <strong>Tip:</strong> The accounting equation is the foundation of double-entry bookkeeping.
        </div>
      </CardFooter>
    </Card>
  );
};

export default EquationVisualizer;
