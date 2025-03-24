
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { renderLatexContent } from '../../flashcards/utils/latex-renderer';

interface BasicModeProps {
  assets: number;
  liabilities: number;
  equity: number;
  handleAssetChange: (value: number) => void;
  handleLiabilityChange: (value: number) => void;
}

const BasicMode: React.FC<BasicModeProps> = ({
  assets,
  liabilities,
  equity,
  handleAssetChange,
  handleLiabilityChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-center gap-2 md:gap-4 text-center">
        <div className="flex-1">
          <Label htmlFor="assets" className="text-lg font-medium mb-2 block">Assets</Label>
          <Input
            id="assets"
            type="number"
            value={assets}
            onChange={(e) => handleAssetChange(parseFloat(e.target.value) || 0)}
            className="text-center text-xl"
          />
        </div>
        <div className="flex items-center justify-center py-2">
          <span className="text-2xl font-bold">=</span>
        </div>
        <div className="flex-1">
          <Label htmlFor="liabilities" className="text-lg font-medium mb-2 block">Liabilities</Label>
          <Input
            id="liabilities"
            type="number"
            value={liabilities}
            onChange={(e) => handleLiabilityChange(parseFloat(e.target.value) || 0)}
            className="text-center text-xl"
          />
        </div>
        <div className="flex items-center justify-center py-2">
          <span className="text-2xl font-bold">+</span>
        </div>
        <div className="flex-1">
          <Label htmlFor="equity" className="text-lg font-medium mb-2 block">Equity</Label>
          <Input
            id="equity"
            type="number"
            value={equity}
            readOnly
            className="text-center text-xl bg-gray-100"
          />
        </div>
      </div>
      
      <div className="p-4 rounded-md bg-primary/10 mt-6">
        <h3 className="font-medium mb-2">Formula Explanation</h3>
        <div className="mb-3">
          {renderLatexContent('$$Assets = Liabilities + Equity$$', true)}
        </div>
        <p className="text-sm text-muted-foreground">
          In Basic Mode, the Equity value is automatically calculated as Assets minus Liabilities, 
          ensuring the equation always balances.
        </p>
      </div>
    </div>
  );
};

export default BasicMode;
