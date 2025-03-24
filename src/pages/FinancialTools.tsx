import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BalanceSheetTab from '@/components/financial/balance-sheet/BalanceSheetTab';
import IncomeStatementTab from '@/components/financial/income-statement/IncomeStatementTab';
import CashFlowTab from '@/components/financial/cash-flow/CashFlowTab';
import RatioCalculatorTab from '@/components/financial/ratio-calculator/RatioCalculatorTab';
import { BarChart3, Coins, FileText, TrendingUp } from 'lucide-react';

const FinancialTools = () => {
  const [activeTab, setActiveTab] = useState('balance-sheet');

  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold">Financial Tools</h1>
          <p className="text-muted-foreground mt-1">
            Create and analyze financial statements for accounting practice
          </p>
        </div>
        
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Financial Statement Generator</CardTitle>
            <CardDescription>
              Build and analyze financial statements to practice accounting concepts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
                <TabsTrigger value="balance-sheet" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Balance Sheet</span>
                </TabsTrigger>
                <TabsTrigger value="income-statement" className="flex items-center">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  <span>Income Statement</span>
                </TabsTrigger>
                <TabsTrigger value="cash-flow" className="flex items-center">
                  <Coins className="mr-2 h-4 w-4" />
                  <span>Cash Flow</span>
                </TabsTrigger>
                <TabsTrigger value="ratio-calculator" className="flex items-center">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  <span>Ratio Calculator</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="balance-sheet">
                <BalanceSheetTab />
              </TabsContent>
              
              <TabsContent value="income-statement">
                <IncomeStatementTab />
              </TabsContent>
              
              <TabsContent value="cash-flow">
                <CashFlowTab />
              </TabsContent>
              
              <TabsContent value="ratio-calculator">
                <RatioCalculatorTab />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default FinancialTools;
