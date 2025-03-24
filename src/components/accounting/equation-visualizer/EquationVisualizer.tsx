
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator } from 'lucide-react';
import { useEquationVisualizer } from './useEquationVisualizer';
import BasicMode from './BasicMode';
import InteractiveMode from './InteractiveMode';
import { VisualizerMode } from './types';

const EquationVisualizer = () => {
  const {
    assets,
    liabilities,
    equity,
    isBalanced,
    mode,
    transactions,
    setMode,
    handleAssetChange,
    handleLiabilityChange,
    handleEquityChange,
    applyTransaction
  } = useEquationVisualizer();

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
        <Tabs defaultValue="basic" onValueChange={(value) => setMode(value as VisualizerMode)}>
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Basic Mode</TabsTrigger>
            <TabsTrigger value="interactive">Interactive Mode</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <BasicMode 
              assets={assets}
              liabilities={liabilities}
              equity={equity}
              handleAssetChange={handleAssetChange}
              handleLiabilityChange={handleLiabilityChange}
            />
          </TabsContent>
          
          <TabsContent value="interactive">
            <InteractiveMode 
              assets={assets}
              liabilities={liabilities}
              equity={equity}
              isBalanced={isBalanced}
              transactions={transactions}
              handleAssetChange={handleAssetChange}
              handleLiabilityChange={handleLiabilityChange}
              handleEquityChange={handleEquityChange}
              applyTransaction={applyTransaction}
            />
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
