
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDownToLine } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { exportToCSV } from '../utils/exportUtils';

const RatioCalculatorTab: React.FC = () => {
  // Connect to balance sheet and income statement data
  const [balanceSheetItems, setBalanceSheetItems] = useState([]);
  const [incomeItems, setIncomeItems] = useState([]);
  
  // State to store calculated ratios
  const [ratios, setRatios] = useState({
    liquidityRatios: {
      currentRatio: 0,
      quickRatio: 0,
      cashRatio: 0
    },
    profitabilityRatios: {
      grossProfitMargin: 0,
      operatingProfitMargin: 0,
      netProfitMargin: 0,
      returnOnAssets: 0,
      returnOnEquity: 0
    },
    solvencyRatios: {
      debtToEquity: 0,
      debtRatio: 0,
      interestCoverageRatio: 0
    },
    efficiencyRatios: {
      assetTurnover: 0,
      inventoryTurnover: 0,
      receivablesTurnover: 0
    }
  });
  
  // Placeholder calculation logic - in a real app, this would use actual data from balance sheet and income statement
  const calculateRatios = () => {
    // Sample values for demonstration purposes
    const totalAssets = 100000;
    const currentAssets = 40000;
    const cash = 15000;
    const inventory = 15000;
    const currentLiabilities = 25000;
    const totalLiabilities = 40000;
    const totalEquity = 60000;
    const revenue = 120000;
    const costOfGoodsSold = 70000;
    const grossProfit = 50000;
    const operatingIncome = 30000;
    const netIncome = 20000;
    const interestExpense = 3000;
    
    // Calculate ratios
    setRatios({
      liquidityRatios: {
        currentRatio: currentAssets / currentLiabilities,
        quickRatio: (currentAssets - inventory) / currentLiabilities,
        cashRatio: cash / currentLiabilities
      },
      profitabilityRatios: {
        grossProfitMargin: grossProfit / revenue,
        operatingProfitMargin: operatingIncome / revenue,
        netProfitMargin: netIncome / revenue,
        returnOnAssets: netIncome / totalAssets,
        returnOnEquity: netIncome / totalEquity
      },
      solvencyRatios: {
        debtToEquity: totalLiabilities / totalEquity,
        debtRatio: totalLiabilities / totalAssets,
        interestCoverageRatio: operatingIncome / interestExpense
      },
      efficiencyRatios: {
        assetTurnover: revenue / totalAssets,
        inventoryTurnover: costOfGoodsSold / inventory,
        receivablesTurnover: revenue / (currentAssets - cash - inventory)
      }
    });
  };
  
  // Calculate ratios on component mount
  useEffect(() => {
    calculateRatios();
  }, []);
  
  // Format ratio for display
  const formatRatio = (value: number, isPercent: boolean = false): string => {
    if (isPercent) {
      return `${(value * 100).toFixed(2)}%`;
    }
    return value.toFixed(2);
  };
  
  // Prepare chart data
  const chartData = [
    { name: 'Current Ratio', value: ratios.liquidityRatios.currentRatio, fill: '#8884d8' },
    { name: 'Quick Ratio', value: ratios.liquidityRatios.quickRatio, fill: '#83a6ed' },
    { name: 'Debt-to-Equity', value: ratios.solvencyRatios.debtToEquity, fill: '#8dd1e1' },
    { name: 'ROE', value: ratios.profitabilityRatios.returnOnEquity, fill: '#82ca9d' },
    { name: 'Net Profit %', value: ratios.profitabilityRatios.netProfitMargin, fill: '#a4de6c' }
  ];
  
  // Handle export to CSV
  const handleExportToCsv = () => {
    const ratioData = [
      { name: 'Current Ratio', value: ratios.liquidityRatios.currentRatio },
      { name: 'Quick Ratio', value: ratios.liquidityRatios.quickRatio },
      { name: 'Cash Ratio', value: ratios.liquidityRatios.cashRatio },
      { name: 'Gross Profit Margin', value: ratios.profitabilityRatios.grossProfitMargin },
      { name: 'Operating Profit Margin', value: ratios.profitabilityRatios.operatingProfitMargin },
      { name: 'Net Profit Margin', value: ratios.profitabilityRatios.netProfitMargin },
      { name: 'Return on Assets', value: ratios.profitabilityRatios.returnOnAssets },
      { name: 'Return on Equity', value: ratios.profitabilityRatios.returnOnEquity },
      { name: 'Debt-to-Equity', value: ratios.solvencyRatios.debtToEquity },
      { name: 'Debt Ratio', value: ratios.solvencyRatios.debtRatio },
      { name: 'Interest Coverage Ratio', value: ratios.solvencyRatios.interestCoverageRatio },
      { name: 'Asset Turnover', value: ratios.efficiencyRatios.assetTurnover },
      { name: 'Inventory Turnover', value: ratios.efficiencyRatios.inventoryTurnover },
      { name: 'Receivables Turnover', value: ratios.efficiencyRatios.receivablesTurnover }
    ];
    
    exportToCSV(ratioData, 'financial_ratios.csv');
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Financial Ratio Calculator</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleExportToCsv}
        >
          <ArrowDownToLine className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
      
      <Alert className="bg-blue-50 text-blue-700 border border-blue-200">
        <AlertDescription>
          Financial ratios are calculated based on data from your Balance Sheet and Income Statement.
          For accurate results, make sure your financial statements are up to date.
        </AlertDescription>
      </Alert>
      
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-medium mb-3">Key Financial Ratios</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [Number(value).toFixed(2), 'Value']}
                  />
                  <Legend />
                  <Bar dataKey="value" name="Ratio Value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-medium mb-3">Liquidity Ratios</h4>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Current Ratio</TableCell>
                    <TableCell className="text-right font-medium">{formatRatio(ratios.liquidityRatios.currentRatio)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Quick Ratio</TableCell>
                    <TableCell className="text-right font-medium">{formatRatio(ratios.liquidityRatios.quickRatio)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Cash Ratio</TableCell>
                    <TableCell className="text-right font-medium">{formatRatio(ratios.liquidityRatios.cashRatio)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-medium mb-3">Profitability Ratios</h4>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Gross Profit Margin</TableCell>
                    <TableCell className="text-right font-medium">{formatRatio(ratios.profitabilityRatios.grossProfitMargin, true)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Net Profit Margin</TableCell>
                    <TableCell className="text-right font-medium">{formatRatio(ratios.profitabilityRatios.netProfitMargin, true)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Return on Equity (ROE)</TableCell>
                    <TableCell className="text-right font-medium">{formatRatio(ratios.profitabilityRatios.returnOnEquity, true)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <h4 className="font-medium mb-3">All Financial Ratios</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ratio</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Current Ratio</TableCell>
                <TableCell>{formatRatio(ratios.liquidityRatios.currentRatio)}</TableCell>
                <TableCell className="text-muted-foreground">Measures ability to pay short-term obligations</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Quick Ratio</TableCell>
                <TableCell>{formatRatio(ratios.liquidityRatios.quickRatio)}</TableCell>
                <TableCell className="text-muted-foreground">Measures ability to pay short-term obligations without selling inventory</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Debt-to-Equity</TableCell>
                <TableCell>{formatRatio(ratios.solvencyRatios.debtToEquity)}</TableCell>
                <TableCell className="text-muted-foreground">Measures financial leverage</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Return on Equity</TableCell>
                <TableCell>{formatRatio(ratios.profitabilityRatios.returnOnEquity, true)}</TableCell>
                <TableCell className="text-muted-foreground">Measures profitability relative to shareholders' equity</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Net Profit Margin</TableCell>
                <TableCell>{formatRatio(ratios.profitabilityRatios.netProfitMargin, true)}</TableCell>
                <TableCell className="text-muted-foreground">Measures net profit per dollar of revenue</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RatioCalculatorTab;
