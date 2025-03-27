
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LatexRenderer from '@/components/math/LatexRenderer';
import { Plus, Minus, RefreshCw } from 'lucide-react';
import { AccountComponent } from './types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';

interface AdvancedModeProps {
  assetComponents: AccountComponent[];
  liabilityComponents: AccountComponent[];
  equityComponents: AccountComponent[];
  updateComponent: (type: 'assets' | 'liabilities' | 'equity', id: string, value: number) => void;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  isBalanced: boolean;
  resetValues: () => void;
}

const colors = {
  assets: ['#8884d8', '#9c88e0', '#aa8ce8', '#b991f0', '#c795f8'],
  liabilities: ['#82ca9d', '#8ed4a8', '#9adeb3', '#a6e8be', '#b2f2c9'],
  equity: ['#ffc658', '#ffd066', '#ffda75', '#ffe483', '#ffee91']
};

const AdvancedMode: React.FC<AdvancedModeProps> = ({
  assetComponents,
  liabilityComponents,
  equityComponents,
  updateComponent,
  totalAssets,
  totalLiabilities,
  totalEquity,
  isBalanced,
  resetValues
}) => {
  const formatForPieChart = (components: AccountComponent[]) => {
    return components.map(comp => ({
      name: comp.name,
      value: comp.value
    }));
  };

  const formatForBarChart = () => {
    return [
      { name: 'Assets', value: totalAssets },
      { name: 'Liabilities', value: totalLiabilities },
      { name: 'Equity', value: totalEquity }
    ];
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <LatexRenderer 
            latex="\\assets = \\liabilities + \\equity" 
            display={true} 
            size="large"
            interactive={true}
          />
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-medium text-purple-700">${totalAssets.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-lg font-medium text-green-700">${totalLiabilities.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-lg font-medium text-amber-600">${totalEquity.toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-2">
          {isBalanced ? (
            <span className="text-sm text-green-600 font-medium">Equation is balanced ✓</span>
          ) : (
            <span className="text-sm text-red-600 font-medium">Equation is not balanced ✗</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assets Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-purple-700">Assets</h3>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs"
              onClick={() => {
                // Add a new asset component with a unique ID
                const id = `asset-${Date.now()}`;
                updateComponent('assets', id, 0);
              }}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
          <div className="space-y-3">
            {assetComponents.map((component) => (
              <div key={component.id} className="flex items-center gap-2">
                <Input 
                  value={component.name} 
                  onChange={(e) => {
                    const newComponent = { ...component, name: e.target.value };
                    updateComponent('assets', component.id, component.value, newComponent.name);
                  }}
                  className="w-1/2"
                  placeholder="Asset name"
                />
                <Input 
                  type="number" 
                  value={component.value} 
                  onChange={(e) => updateComponent('assets', component.id, Number(e.target.value))}
                  className="w-1/2"
                />
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-destructive"
                  onClick={() => updateComponent('assets', component.id, 0, component.name, true)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Liabilities Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-green-700">Liabilities</h3>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs"
              onClick={() => {
                // Add a new liability component with a unique ID
                const id = `liability-${Date.now()}`;
                updateComponent('liabilities', id, 0);
              }}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
          <div className="space-y-3">
            {liabilityComponents.map((component) => (
              <div key={component.id} className="flex items-center gap-2">
                <Input 
                  value={component.name} 
                  onChange={(e) => {
                    const newComponent = { ...component, name: e.target.value };
                    updateComponent('liabilities', component.id, component.value, newComponent.name);
                  }}
                  className="w-1/2"
                  placeholder="Liability name"
                />
                <Input 
                  type="number" 
                  value={component.value} 
                  onChange={(e) => updateComponent('liabilities', component.id, Number(e.target.value))}
                  className="w-1/2"
                />
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-destructive"
                  onClick={() => updateComponent('liabilities', component.id, 0, component.name, true)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Equity Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-amber-600">Equity</h3>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs"
              onClick={() => {
                // Add a new equity component with a unique ID
                const id = `equity-${Date.now()}`;
                updateComponent('equity', id, 0);
              }}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
          <div className="space-y-3">
            {equityComponents.map((component) => (
              <div key={component.id} className="flex items-center gap-2">
                <Input 
                  value={component.name} 
                  onChange={(e) => {
                    const newComponent = { ...component, name: e.target.value };
                    updateComponent('equity', component.id, component.value, newComponent.name);
                  }}
                  className="w-1/2"
                  placeholder="Equity name"
                />
                <Input 
                  type="number" 
                  value={component.value} 
                  onChange={(e) => updateComponent('equity', component.id, Number(e.target.value))}
                  className="w-1/2"
                />
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-destructive"
                  onClick={() => updateComponent('equity', component.id, 0, component.name, true)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button 
          variant="outline" 
          onClick={resetValues}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Reset All Values
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Bar Chart */}
        <div className="h-64">
          <h3 className="text-lg font-semibold mb-2 text-center">Balance Overview</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formatForBarChart()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="value" name="Amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Charts */}
        <div className="grid grid-cols-3 gap-2 h-64">
          <div>
            <h3 className="text-xs text-center text-purple-700 font-medium">Assets</h3>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={formatForPieChart(assetComponents)}
                  cx="50%"
                  cy="50%"
                  outerRadius={40}
                  dataKey="value"
                >
                  {formatForPieChart(assetComponents).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors.assets[index % colors.assets.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 className="text-xs text-center text-green-700 font-medium">Liabilities</h3>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={formatForPieChart(liabilityComponents)}
                  cx="50%"
                  cy="50%"
                  outerRadius={40}
                  dataKey="value"
                >
                  {formatForPieChart(liabilityComponents).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors.liabilities[index % colors.liabilities.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 className="text-xs text-center text-amber-600 font-medium">Equity</h3>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={formatForPieChart(equityComponents)}
                  cx="50%"
                  cy="50%"
                  outerRadius={40}
                  dataKey="value"
                >
                  {formatForPieChart(equityComponents).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors.equity[index % colors.equity.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedMode;
