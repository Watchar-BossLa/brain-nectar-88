
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, ArrowRight, PlusSquare, MinusSquare } from 'lucide-react';
import { useEquationVisualizer } from './useEquationVisualizer';
import BasicMode from './BasicMode';
import InteractiveMode from './InteractiveMode';
import AdvancedMode from './AdvancedMode';
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
    applyTransaction,
    resetValues,
    assetComponents,
    liabilityComponents,
    equityComponents,
    updateComponent
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
        <Tabs value={mode} onValueChange={(value) => setMode(value as VisualizerMode)}>
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Basic Mode</TabsTrigger>
            <TabsTrigger value="interactive">Interactive Mode</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Mode</TabsTrigger>
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
          
          <TabsContent value="advanced">
            <AdvancedMode
              assetComponents={assetComponents}
              liabilityComponents={liabilityComponents}
              equityComponents={equityComponents}
              updateComponent={updateComponent}
              totalAssets={assets}
              totalLiabilities={liabilities}
              totalEquity={equity}
              isBalanced={isBalanced}
              resetValues={resetValues}
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
