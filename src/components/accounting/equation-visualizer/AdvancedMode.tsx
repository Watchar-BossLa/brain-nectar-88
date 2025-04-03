import React from 'react';
import { AdvancedModeProps } from '@/types/components';
import { Button } from "@/components/ui/button";
import { RefreshCw } from 'lucide-react';
import AccountSection from './components/AccountSection';
import EquationStatus from './components/EquationStatus';

const AdvancedMode: React.FC<AdvancedModeProps> = ({
  assetComponents,
  liabilityComponents,
  equityComponents,
  updateComponent,
  totalAssets,
  totalLiabilities,
  totalEquity,
  isBalanced,
  resetValues,
}) => {
  return (
    <div>
      <div className="mb-6 flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={resetValues}
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          Reset
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AccountSection 
          title="Assets"
          components={assetComponents}
          updateComponent={updateComponent}
          componentType="assets"
          totalValue={totalAssets}
        />
        
        <AccountSection 
          title="Liabilities"
          components={liabilityComponents}
          updateComponent={updateComponent}
          componentType="liabilities"
          totalValue={totalLiabilities}
        />
        
        <AccountSection 
          title="Equity"
          components={equityComponents}
          updateComponent={updateComponent}
          componentType="equity"
          totalValue={totalEquity}
        />
      </div>
      
      <EquationStatus 
        isBalanced={isBalanced}
        totalAssets={totalAssets}
        totalLiabilities={totalLiabilities}
        totalEquity={totalEquity}
      />
    </div>
  );
};

export default AdvancedMode;
