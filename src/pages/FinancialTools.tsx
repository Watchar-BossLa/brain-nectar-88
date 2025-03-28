
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, TrendingUp, Coins, BarChart3, Calculator } from 'lucide-react';
import FinancialStatementGenerator from '@/components/financial/FinancialStatementGenerator';
import EquationVisualizer from '@/components/accounting/EquationVisualizer';

const FinancialTools = () => {
  const [activeTab, setActiveTab] = useState('statement-generator');

  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold">Financial Tools</h1>
          <p className="text-muted-foreground mt-1">
            Create and analyze financial statements for accounting practice
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="statement-generator" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              <span>Statement Generator</span>
            </TabsTrigger>
            <TabsTrigger value="equation-visualizer" className="flex items-center">
              <Calculator className="mr-2 h-4 w-4" />
              <span>Equation Visualizer</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="statement-generator">
            <FinancialStatementGenerator />
          </TabsContent>
          
          <TabsContent value="equation-visualizer">
            <EquationVisualizer />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default FinancialTools;
