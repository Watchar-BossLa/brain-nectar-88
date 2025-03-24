
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowDownToLine, BarChart2 } from 'lucide-react';

type RatioResult = {
  name: string;
  value: number | string;
  interpretation: string;
  category: 'profitability' | 'liquidity' | 'solvency' | 'efficiency';
};

const RatioCalculatorTab: React.FC = () => {
  // Financial statement values
  const [values, setValues] = useState({
    // Balance Sheet
    currentAssets: 0,
    totalAssets: 0,
    currentLiabilities: 0,
    totalLiabilities: 0,
    totalEquity: 0,
    cash: 0,
    accountsReceivable: 0,
    inventory: 0,
    
    // Income Statement
    revenue: 0,
    netIncome: 0,
    operatingIncome: 0,
    costOfGoodsSold: 0,
    
    // Additional values
    averageInventory: 0,
    averageAccountsReceivable: 0,
    interestExpense: 0,
  });
  
  const [results, setResults] = useState<RatioResult[]>([]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: parseFloat(value) || 0
    });
  };
  
  const calculateRatios = () => {
    const newResults: RatioResult[] = [];
    
    // Profitability Ratios
    if (values.revenue > 0) {
      // Return on Assets (ROA)
      const roa = (values.netIncome / values.totalAssets) * 100;
      newResults.push({
        name: 'Return on Assets (ROA)',
        value: isFinite(roa) ? `${roa.toFixed(2)}%` : 'N/A',
        interpretation: roa > 5 ? 'Good' : 'Needs improvement',
        category: 'profitability'
      });
      
      // Net Profit Margin
      const netProfitMargin = (values.netIncome / values.revenue) * 100;
      newResults.push({
        name: 'Net Profit Margin',
        value: isFinite(netProfitMargin) ? `${netProfitMargin.toFixed(2)}%` : 'N/A',
        interpretation: netProfitMargin > 10 ? 'Good' : 'Needs improvement',
        category: 'profitability'
      });
      
      // Gross Profit Margin
      const grossProfitMargin = ((values.revenue - values.costOfGoodsSold) / values.revenue) * 100;
      newResults.push({
        name: 'Gross Profit Margin',
        value: isFinite(grossProfitMargin) ? `${grossProfitMargin.toFixed(2)}%` : 'N/A',
        interpretation: grossProfitMargin > 30 ? 'Good' : 'Needs improvement',
        category: 'profitability'
      });
    }
    
    // Liquidity Ratios
    if (values.currentLiabilities > 0) {
      // Current Ratio
      const currentRatio = values.currentAssets / values.currentLiabilities;
      newResults.push({
        name: 'Current Ratio',
        value: isFinite(currentRatio) ? currentRatio.toFixed(2) : 'N/A',
        interpretation: currentRatio > 1.5 ? 'Good' : 'Potential liquidity issue',
        category: 'liquidity'
      });
      
      // Quick Ratio
      const quickRatio = (values.currentAssets - values.inventory) / values.currentLiabilities;
      newResults.push({
        name: 'Quick Ratio',
        value: isFinite(quickRatio) ? quickRatio.toFixed(2) : 'N/A',
        interpretation: quickRatio > 1.0 ? 'Good' : 'Potential liquidity issue',
        category: 'liquidity'
      });
      
      // Cash Ratio
      const cashRatio = values.cash / values.currentLiabilities;
      newResults.push({
        name: 'Cash Ratio',
        value: isFinite(cashRatio) ? cashRatio.toFixed(2) : 'N/A',
        interpretation: cashRatio > 0.5 ? 'Strong cash position' : 'May need more cash reserves',
        category: 'liquidity'
      });
    }
    
    // Solvency Ratios
    if (values.totalAssets > 0 && values.totalLiabilities > 0) {
      // Debt Ratio
      const debtRatio = (values.totalLiabilities / values.totalAssets) * 100;
      newResults.push({
        name: 'Debt Ratio',
        value: isFinite(debtRatio) ? `${debtRatio.toFixed(2)}%` : 'N/A',
        interpretation: debtRatio < 50 ? 'Good' : 'High debt level',
        category: 'solvency'
      });
      
      // Debt to Equity Ratio
      const debtToEquity = values.totalLiabilities / values.totalEquity;
      newResults.push({
        name: 'Debt to Equity Ratio',
        value: isFinite(debtToEquity) ? debtToEquity.toFixed(2) : 'N/A',
        interpretation: debtToEquity < 1.5 ? 'Good' : 'High leverage',
        category: 'solvency'
      });
      
      // Interest Coverage Ratio
      if (values.interestExpense > 0) {
        const interestCoverage = values.operatingIncome / values.interestExpense;
        newResults.push({
          name: 'Interest Coverage Ratio',
          value: isFinite(interestCoverage) ? interestCoverage.toFixed(2) : 'N/A',
          interpretation: interestCoverage > 2 ? 'Good' : 'May have trouble paying interest',
          category: 'solvency'
        });
      }
    }
    
    // Efficiency Ratios
    if (values.revenue > 0) {
      // Inventory Turnover
      if (values.averageInventory > 0) {
        const inventoryTurnover = values.costOfGoodsSold / values.averageInventory;
        newResults.push({
          name: 'Inventory Turnover',
          value: isFinite(inventoryTurnover) ? inventoryTurnover.toFixed(2) : 'N/A',
          interpretation: inventoryTurnover > 5 ? 'Good' : 'Slow inventory movement',
          category: 'efficiency'
        });
      }
      
      // Accounts Receivable Turnover
      if (values.averageAccountsReceivable > 0) {
        const arTurnover = values.revenue / values.averageAccountsReceivable;
        newResults.push({
          name: 'Accounts Receivable Turnover',
          value: isFinite(arTurnover) ? arTurnover.toFixed(2) : 'N/A',
          interpretation: arTurnover > 4 ? 'Good' : 'Slow collection of receivables',
          category: 'efficiency'
        });
      }
      
      // Asset Turnover
      const assetTurnover = values.revenue / values.totalAssets;
      newResults.push({
        name: 'Asset Turnover',
        value: isFinite(assetTurnover) ? assetTurnover.toFixed(2) : 'N/A',
        interpretation: assetTurnover > 0.5 ? 'Good' : 'Inefficient asset use',
        category: 'efficiency'
      });
    }
    
    setResults(newResults);
  };
  
  const filteredResults = (category: 'profitability' | 'liquidity' | 'solvency' | 'efficiency') => {
    return results.filter(result => result.category === category);
  };
  
  const exportRatios = () => {
    if (results.length === 0) return;
    
    let csv = 'Ratio,Value,Interpretation\n';
    results.forEach(ratio => {
      csv += `"${ratio.name}","${ratio.value}","${ratio.interpretation}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'financial_ratios.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Financial Ratio Calculator</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={exportRatios}
          disabled={results.length === 0}
        >
          <ArrowDownToLine className="mr-2 h-4 w-4" />
          Export Ratios
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Financial Data Input */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Data Input</CardTitle>
            <CardDescription>
              Enter your financial statement data to calculate ratios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold mb-3">Balance Sheet Items</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentAssets">Current Assets</Label>
                        <Input 
                          id="currentAssets" 
                          name="currentAssets" 
                          type="number" 
                          placeholder="0" 
                          value={values.currentAssets || ''} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="totalAssets">Total Assets</Label>
                        <Input 
                          id="totalAssets" 
                          name="totalAssets" 
                          type="number" 
                          placeholder="0" 
                          value={values.totalAssets || ''} 
                          onChange={handleInputChange} 
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentLiabilities">Current Liabilities</Label>
                        <Input 
                          id="currentLiabilities" 
                          name="currentLiabilities" 
                          type="number" 
                          placeholder="0" 
                          value={values.currentLiabilities || ''} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="totalLiabilities">Total Liabilities</Label>
                        <Input 
                          id="totalLiabilities" 
                          name="totalLiabilities" 
                          type="number" 
                          placeholder="0" 
                          value={values.totalLiabilities || ''} 
                          onChange={handleInputChange} 
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="totalEquity">Total Equity</Label>
                        <Input 
                          id="totalEquity" 
                          name="totalEquity" 
                          type="number" 
                          placeholder="0" 
                          value={values.totalEquity || ''} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cash">Cash</Label>
                        <Input 
                          id="cash" 
                          name="cash" 
                          type="number" 
                          placeholder="0" 
                          value={values.cash || ''} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="inventory">Inventory</Label>
                        <Input 
                          id="inventory" 
                          name="inventory" 
                          type="number" 
                          placeholder="0" 
                          value={values.inventory || ''} 
                          onChange={handleInputChange} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold mb-3">Income Statement Items</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="revenue">Revenue</Label>
                        <Input 
                          id="revenue" 
                          name="revenue" 
                          type="number" 
                          placeholder="0" 
                          value={values.revenue || ''} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="netIncome">Net Income</Label>
                        <Input 
                          id="netIncome" 
                          name="netIncome" 
                          type="number" 
                          placeholder="0" 
                          value={values.netIncome || ''} 
                          onChange={handleInputChange} 
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="operatingIncome">Operating Income</Label>
                        <Input 
                          id="operatingIncome" 
                          name="operatingIncome" 
                          type="number" 
                          placeholder="0" 
                          value={values.operatingIncome || ''} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="costOfGoodsSold">Cost of Goods Sold</Label>
                        <Input 
                          id="costOfGoodsSold" 
                          name="costOfGoodsSold" 
                          type="number" 
                          placeholder="0" 
                          value={values.costOfGoodsSold || ''} 
                          onChange={handleInputChange} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold mb-3">Additional Data</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="averageInventory">Average Inventory</Label>
                        <Input 
                          id="averageInventory" 
                          name="averageInventory" 
                          type="number" 
                          placeholder="0" 
                          value={values.averageInventory || ''} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="averageAccountsReceivable">Avg. Accounts Receivable</Label>
                        <Input 
                          id="averageAccountsReceivable" 
                          name="averageAccountsReceivable" 
                          type="number" 
                          placeholder="0" 
                          value={values.averageAccountsReceivable || ''} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="interestExpense">Interest Expense</Label>
                        <Input 
                          id="interestExpense" 
                          name="interestExpense" 
                          type="number" 
                          placeholder="0" 
                          value={values.interestExpense || ''} 
                          onChange={handleInputChange} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={calculateRatios} 
                  className="w-full"
                  size="lg"
                >
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Calculate Ratios
                </Button>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        
        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Ratios</CardTitle>
            <CardDescription>
              Analysis and interpretation of your financial data
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results.length > 0 ? (
              <Tabs defaultValue="profitability">
                <TabsList className="w-full">
                  <TabsTrigger value="profitability">Profitability</TabsTrigger>
                  <TabsTrigger value="liquidity">Liquidity</TabsTrigger>
                  <TabsTrigger value="solvency">Solvency</TabsTrigger>
                  <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
                </TabsList>
                <div className="mt-4">
                  <TabsContent value="profitability">
                    <ScrollArea className="h-[430px]">
                      <div className="space-y-3">
                        {filteredResults('profitability').map((ratio, index) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium">{ratio.name}</h4>
                                <span className="font-bold">{ratio.value}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{ratio.interpretation}</p>
                            </CardContent>
                          </Card>
                        ))}
                        {filteredResults('profitability').length === 0 && (
                          <p className="text-center text-muted-foreground py-8">
                            No profitability ratios calculated.
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="liquidity">
                    <ScrollArea className="h-[430px]">
                      <div className="space-y-3">
                        {filteredResults('liquidity').map((ratio, index) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium">{ratio.name}</h4>
                                <span className="font-bold">{ratio.value}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{ratio.interpretation}</p>
                            </CardContent>
                          </Card>
                        ))}
                        {filteredResults('liquidity').length === 0 && (
                          <p className="text-center text-muted-foreground py-8">
                            No liquidity ratios calculated.
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="solvency">
                    <ScrollArea className="h-[430px]">
                      <div className="space-y-3">
                        {filteredResults('solvency').map((ratio, index) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium">{ratio.name}</h4>
                                <span className="font-bold">{ratio.value}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{ratio.interpretation}</p>
                            </CardContent>
                          </Card>
                        ))}
                        {filteredResults('solvency').length === 0 && (
                          <p className="text-center text-muted-foreground py-8">
                            No solvency ratios calculated.
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="efficiency">
                    <ScrollArea className="h-[430px]">
                      <div className="space-y-3">
                        {filteredResults('efficiency').map((ratio, index) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium">{ratio.name}</h4>
                                <span className="font-bold">{ratio.value}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{ratio.interpretation}</p>
                            </CardContent>
                          </Card>
                        ))}
                        {filteredResults('efficiency').length === 0 && (
                          <p className="text-center text-muted-foreground py-8">
                            No efficiency ratios calculated.
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </div>
              </Tabs>
            ) : (
              <div className="flex flex-col items-center justify-center h-[430px] text-center">
                <BarChart2 className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="font-medium mb-2">No Ratios Calculated Yet</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Enter your financial data on the left and click "Calculate Ratios" to see your financial analysis.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RatioCalculatorTab;
