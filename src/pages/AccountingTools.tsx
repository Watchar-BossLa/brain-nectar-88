
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, FileText } from 'lucide-react';

// Import tools components
import EquationVisualizer from '@/components/accounting/EquationVisualizer';
import FinancialStatementGenerator from '@/components/financial/FinancialStatementGenerator';

const AccountingTools = () => {
  const [activeTab, setActiveTab] = useState('equation-visualizer');

  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold">Accounting Tools</h1>
          <p className="text-muted-foreground mt-1">
            Interactive tools to practice and visualize accounting concepts
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="equation-visualizer" className="flex items-center">
              <Calculator className="mr-2 h-4 w-4" />
              <span>Accounting Equation</span>
            </TabsTrigger>
            <TabsTrigger value="financial-statement" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              <span>Financial Statements</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="equation-visualizer">
            <Card>
              <CardHeader>
                <CardTitle>Accounting Equation Visualizer</CardTitle>
                <CardDescription>
                  Interact with the fundamental accounting equation: Assets = Liabilities + Equity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EquationVisualizer />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="financial-statement">
            <FinancialStatementGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AccountingTools;
