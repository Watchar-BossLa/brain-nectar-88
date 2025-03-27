
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, RefreshCw } from 'lucide-react';
import { AccountComponent, UpdateComponentFunction } from './types';
import { LatexRenderer } from '../../math/LatexRendererWrapper';

interface AdvancedModeProps {
  assetComponents: AccountComponent[];
  liabilityComponents: AccountComponent[];
  equityComponents: AccountComponent[];
  updateComponent: UpdateComponentFunction;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  isBalanced: boolean;
  resetValues: () => void;
}

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
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetValue, setNewAssetValue] = useState(0);
  const [newLiabilityName, setNewLiabilityName] = useState('');
  const [newLiabilityValue, setNewLiabilityValue] = useState(0);
  const [newEquityName, setNewEquityName] = useState('');
  const [newEquityValue, setNewEquityValue] = useState(0);

  // Add new asset
  const handleAddAsset = () => {
    if (newAssetName && newAssetValue) {
      const id = `asset-${Date.now()}`;
      updateComponent('assets', id, newAssetValue, newAssetName);
      setNewAssetName('');
      setNewAssetValue(0);
    }
  };

  // Add new liability
  const handleAddLiability = () => {
    if (newLiabilityName && newLiabilityValue) {
      const id = `liability-${Date.now()}`;
      updateComponent('liabilities', id, newLiabilityValue, newLiabilityName);
      setNewLiabilityName('');
      setNewLiabilityValue(0);
    }
  };

  // Add new equity
  const handleAddEquity = () => {
    if (newEquityName && newEquityValue) {
      const id = `equity-${Date.now()}`;
      updateComponent('equity', id, newEquityValue, newEquityName);
      setNewEquityName('');
      setNewEquityValue(0);
    }
  };

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
        {/* Assets Section */}
        <div className="border rounded-md p-4">
          <h3 className="font-medium mb-3 flex justify-between">
            <span>Assets</span>
            <span className="text-primary">${totalAssets.toLocaleString()}</span>
          </h3>
          
          {assetComponents.map(asset => (
            <div key={asset.id} className="flex items-center gap-2 mb-2">
              <Input 
                value={asset.name}
                onChange={(e) => updateComponent('assets', asset.id, asset.value, e.target.value)}
                className="flex-1"
              />
              <Input 
                type="number"
                value={asset.value}
                onChange={(e) => updateComponent('assets', asset.id, parseFloat(e.target.value) || 0)}
                className="w-24"
              />
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => updateComponent('assets', asset.id, 0, '', true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {/* Add new asset */}
          <div className="flex items-center gap-2 mt-4">
            <Input 
              placeholder="New asset name"
              value={newAssetName}
              onChange={(e) => setNewAssetName(e.target.value)}
              className="flex-1"
            />
            <Input 
              type="number"
              placeholder="Value"
              value={newAssetValue || ''}
              onChange={(e) => setNewAssetValue(parseFloat(e.target.value) || 0)}
              className="w-24"
            />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleAddAsset}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Liabilities Section */}
        <div className="border rounded-md p-4">
          <h3 className="font-medium mb-3 flex justify-between">
            <span>Liabilities</span>
            <span className="text-primary">${totalLiabilities.toLocaleString()}</span>
          </h3>
          
          {liabilityComponents.map(liability => (
            <div key={liability.id} className="flex items-center gap-2 mb-2">
              <Input 
                value={liability.name}
                onChange={(e) => updateComponent('liabilities', liability.id, liability.value, e.target.value)}
                className="flex-1"
              />
              <Input 
                type="number"
                value={liability.value}
                onChange={(e) => updateComponent('liabilities', liability.id, parseFloat(e.target.value) || 0)}
                className="w-24"
              />
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => updateComponent('liabilities', liability.id, 0, '', true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {/* Add new liability */}
          <div className="flex items-center gap-2 mt-4">
            <Input 
              placeholder="New liability name"
              value={newLiabilityName}
              onChange={(e) => setNewLiabilityName(e.target.value)}
              className="flex-1"
            />
            <Input 
              type="number"
              placeholder="Value"
              value={newLiabilityValue || ''}
              onChange={(e) => setNewLiabilityValue(parseFloat(e.target.value) || 0)}
              className="w-24"
            />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleAddLiability}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Equity Section */}
        <div className="border rounded-md p-4">
          <h3 className="font-medium mb-3 flex justify-between">
            <span>Equity</span>
            <span className="text-primary">${totalEquity.toLocaleString()}</span>
          </h3>
          
          {equityComponents.map(equity => (
            <div key={equity.id} className="flex items-center gap-2 mb-2">
              <Input 
                value={equity.name}
                onChange={(e) => updateComponent('equity', equity.id, equity.value, e.target.value)}
                className="flex-1"
              />
              <Input 
                type="number"
                value={equity.value}
                onChange={(e) => updateComponent('equity', equity.id, parseFloat(e.target.value) || 0)}
                className="w-24"
              />
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => updateComponent('equity', equity.id, 0, '', true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {/* Add new equity */}
          <div className="flex items-center gap-2 mt-4">
            <Input 
              placeholder="New equity name"
              value={newEquityName}
              onChange={(e) => setNewEquityName(e.target.value)}
              className="flex-1"
            />
            <Input 
              type="number"
              placeholder="Value"
              value={newEquityValue || ''}
              onChange={(e) => setNewEquityValue(parseFloat(e.target.value) || 0)}
              className="w-24"
            />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleAddEquity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className={`p-4 rounded-md mt-6 ${isBalanced ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
        <h3 className="font-medium mb-2">Accounting Equation Status</h3>
        <div className="mb-3">
          <LatexRenderer 
            latex={`\\text{Assets} = \\text{Liabilities} + \\text{Equity} \\quad \\Rightarrow \\quad $${totalAssets.toLocaleString()} = ${totalLiabilities.toLocaleString()} + ${totalEquity.toLocaleString()}$`} 
            display={true} 
          />
        </div>
        <p className={`text-sm ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
          {isBalanced 
            ? 'The accounting equation is balanced.' 
            : `The accounting equation is not balanced. Difference: $${Math.abs(totalAssets - (totalLiabilities + totalEquity)).toLocaleString()}`}
        </p>
      </div>
    </div>
  );
};

export default AdvancedMode;
