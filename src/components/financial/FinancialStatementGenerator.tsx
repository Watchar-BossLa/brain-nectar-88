
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calculator, 
  FileText, 
  ArrowDownToLine, 
  Plus, 
  Trash2,
  BookOpen
} from 'lucide-react';

type BalanceSheetItem = {
  id: string;
  name: string;
  amount: number;
  category: 'assets' | 'liabilities' | 'equity';
  type: string;
};

type IncomeStatementItem = {
  id: string;
  name: string;
  amount: number;
  category: 'revenue' | 'expense';
  type: string;
};

type CashFlowItem = {
  id: string;
  name: string;
  amount: number;
  category: 'operating' | 'investing' | 'financing';
  type: string;
};

const FinancialStatementGenerator = () => {
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

  // Income Statement Calculations
  const totalRevenue = incomeItems
    .filter(item => item.category === 'revenue')
    .reduce((sum, item) => sum + item.amount, 0);
    
  const totalExpenses = incomeItems
    .filter(item => item.category === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);
    
  const netIncome = totalRevenue - totalExpenses;

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

  // Export to CSV function
  const exportToCSV = (items: any[], filename: string) => {
    // Create CSV string
    const headers = Object.keys(items[0]).filter(key => key !== 'id');
    const csvRows = [
      headers.join(','),
      ...items.map(item => headers.map(header => item[header]).join(','))
    ];
    const csvString = csvRows.join('\n');
    
    // Create download link
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Financial Statement Generator
        </CardTitle>
        <CardDescription>
          Create and analyze balance sheets, income statements, and cash flow statements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="balanceSheet">
          <TabsList className="mb-4">
            <TabsTrigger value="balanceSheet">Balance Sheet</TabsTrigger>
            <TabsTrigger value="incomeStatement">Income Statement</TabsTrigger>
            <TabsTrigger value="cashFlow">Cash Flow</TabsTrigger>
          </TabsList>
          
          {/* Balance Sheet Tab */}
          <TabsContent value="balanceSheet">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Balance Sheet</h3>
                <Button variant="outline" size="sm" onClick={() => exportToCSV(balanceSheetItems, 'balance_sheet')}>
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
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Assets</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {balanceSheetItems
                        .filter(item => item.category === 'assets')
                        .map(item => (
                          <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.type}</TableCell>
                            <TableCell className="text-right">${item.amount.toLocaleString()}</TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeBalanceSheetItem(item.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      <TableRow>
                        <TableCell colSpan={2} className="font-medium">Total Assets</TableCell>
                        <TableCell className="text-right font-medium">${totalAssets.toLocaleString()}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Liabilities & Equity</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {balanceSheetItems
                        .filter(item => item.category === 'liabilities')
                        .map(item => (
                          <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.type}</TableCell>
                            <TableCell className="text-right">${item.amount.toLocaleString()}</TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeBalanceSheetItem(item.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      <TableRow>
                        <TableCell colSpan={2} className="font-medium">Total Liabilities</TableCell>
                        <TableCell className="text-right font-medium">${totalLiabilities.toLocaleString()}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      
                      {balanceSheetItems
                        .filter(item => item.category === 'equity')
                        .map(item => (
                          <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.type}</TableCell>
                            <TableCell className="text-right">${item.amount.toLocaleString()}</TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeBalanceSheetItem(item.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      <TableRow>
                        <TableCell colSpan={2} className="font-medium">Total Equity</TableCell>
                        <TableCell className="text-right font-medium">${totalEquity.toLocaleString()}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      
                      <TableRow>
                        <TableCell colSpan={2} className="font-medium">Total Liabilities & Equity</TableCell>
                        <TableCell className="text-right font-medium">${(totalLiabilities + totalEquity).toLocaleString()}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
              
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
                        const category = e.target.value as 'assets' | 'liabilities' | 'equity';
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
            </div>
          </TabsContent>
          
          {/* Income Statement Tab */}
          <TabsContent value="incomeStatement">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Income Statement</h3>
                <Button variant="outline" size="sm" onClick={() => exportToCSV(incomeItems, 'income_statement')}>
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
              
              <div className="mt-4">
                <h3 className="font-medium mb-2">Revenue & Expenses</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Revenue Section */}
                    <TableRow className="bg-muted/20">
                      <TableCell colSpan={5} className="font-medium">Revenue</TableCell>
                    </TableRow>
                    {incomeItems
                      .filter(item => item.category === 'revenue')
                      .map(item => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>Revenue</TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell className="text-right">${item.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeIncomeItem(item.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    <TableRow>
                      <TableCell colSpan={3} className="font-medium">Total Revenue</TableCell>
                      <TableCell className="text-right font-medium">${totalRevenue.toLocaleString()}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    
                    {/* Expenses Section */}
                    <TableRow className="bg-muted/20">
                      <TableCell colSpan={5} className="font-medium">Expenses</TableCell>
                    </TableRow>
                    {incomeItems
                      .filter(item => item.category === 'expense')
                      .map(item => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>Expense</TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell className="text-right">${item.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeIncomeItem(item.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    <TableRow>
                      <TableCell colSpan={3} className="font-medium">Total Expenses</TableCell>
                      <TableCell className="text-right font-medium">${totalExpenses.toLocaleString()}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    
                    {/* Net Income */}
                    <TableRow className="font-medium">
                      <TableCell colSpan={3} className="text-base">Net Income</TableCell>
                      <TableCell className={`text-right text-base ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${netIncome.toLocaleString()}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
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
            </div>
          </TabsContent>
          
          {/* Cash Flow Statement Tab */}
          <TabsContent value="cashFlow">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Cash Flow Statement</h3>
                <Button variant="outline" size="sm" onClick={() => exportToCSV(cashFlowItems, 'cash_flow_statement')}>
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
              
              <div className="mt-4">
                <h3 className="font-medium mb-2">Cash Flow Activities</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Operating Activities */}
                    <TableRow className="bg-muted/20">
                      <TableCell colSpan={5} className="font-medium">Operating Activities</TableCell>
                    </TableRow>
                    {cashFlowItems
                      .filter(item => item.category === 'operating')
                      .map(item => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>Operating</TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell className={`text-right ${item.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${item.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeCashFlowItem(item.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    <TableRow>
                      <TableCell colSpan={3} className="font-medium">Net Cash from Operating Activities</TableCell>
                      <TableCell className={`text-right font-medium ${operatingCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${operatingCashFlow.toLocaleString()}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    
                    {/* Investing Activities */}
                    <TableRow className="bg-muted/20">
                      <TableCell colSpan={5} className="font-medium">Investing Activities</TableCell>
                    </TableRow>
                    {cashFlowItems
                      .filter(item => item.category === 'investing')
                      .map(item => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>Investing</TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell className={`text-right ${item.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${item.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeCashFlowItem(item.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    <TableRow>
                      <TableCell colSpan={3} className="font-medium">Net Cash from Investing Activities</TableCell>
                      <TableCell className={`text-right font-medium ${investingCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${investingCashFlow.toLocaleString()}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    
                    {/* Financing Activities */}
                    <TableRow className="bg-muted/20">
                      <TableCell colSpan={5} className="font-medium">Financing Activities</TableCell>
                    </TableRow>
                    {cashFlowItems
                      .filter(item => item.category === 'financing')
                      .map(item => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>Financing</TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell className={`text-right ${item.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${item.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeCashFlowItem(item.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    <TableRow>
                      <TableCell colSpan={3} className="font-medium">Net Cash from Financing Activities</TableCell>
                      <TableCell className={`text-right font-medium ${financingCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${financingCashFlow.toLocaleString()}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    
                    {/* Net Cash Flow */}
                    <TableRow className="font-medium">
                      <TableCell colSpan={3} className="text-base">Net Increase/Decrease in Cash</TableCell>
                      <TableCell className={`text-right text-base ${netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${netCashFlow.toLocaleString()}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
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
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FinancialStatementGenerator;
