
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, FileText, BookOpen } from 'lucide-react';

// Import extracted components
import BalanceSheetTab from './balance-sheet/BalanceSheetTab';
import IncomeStatementTab from './income-statement/IncomeStatementTab';
import CashFlowTab from './cash-flow/CashFlowTab';

const FinancialStatementGenerator = () => {
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
            <BalanceSheetTab />
          </TabsContent>
          
          {/* Income Statement Tab */}
          <TabsContent value="incomeStatement">
            <IncomeStatementTab />
          </TabsContent>
          
          {/* Cash Flow Statement Tab */}
          <TabsContent value="cashFlow">
            <CashFlowTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FinancialStatementGenerator;
