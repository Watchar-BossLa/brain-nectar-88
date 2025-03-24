
import React from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EquationVisualizer from '@/components/accounting/EquationVisualizer';
import FinancialStatementGenerator from '@/components/financial/FinancialStatementGenerator';
import StandardsLibrary from '@/components/accounting/StandardsLibrary';
import { Calculator, FileText, BookText } from 'lucide-react';

const FinancialTools = () => {
  return (
    <MainLayout>
      <div className="p-6 md:p-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-semibold">Financial Tools</h1>
          <p className="text-muted-foreground mt-1">
            Interactive tools for learning accounting concepts and standards
          </p>
        </motion.div>

        <Tabs defaultValue="equation" className="space-y-6">
          <div className="bg-background sticky top-0 z-10 pb-4 pt-1">
            <TabsList className="w-full md:w-auto justify-start overflow-x-auto">
              <TabsTrigger value="equation" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                <span>Accounting Equation</span>
              </TabsTrigger>
              <TabsTrigger value="statements" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Financial Statements</span>
              </TabsTrigger>
              <TabsTrigger value="standards" className="flex items-center gap-2">
                <BookText className="h-4 w-4" />
                <span>Accounting Standards</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="equation">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <EquationVisualizer />
            </motion.div>
          </TabsContent>
          
          <TabsContent value="statements">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <FinancialStatementGenerator />
            </motion.div>
          </TabsContent>
          
          <TabsContent value="standards">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <StandardsLibrary />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default FinancialTools;
