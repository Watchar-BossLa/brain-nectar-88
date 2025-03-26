
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AssetItem {
  name: string;
  amount: number;
}

interface LiabilityItem {
  name: string;
  amount: number;
}

interface EquityItem {
  name: string;
  amount: number;
}

interface BalanceSheetProps {
  assets: AssetItem[];
  liabilities: LiabilityItem[];
  equity: EquityItem[];
  asOf?: string;
  className?: string;
}

/**
 * Balance Sheet component that visualizes assets, liabilities, and equity
 */
const BalanceSheet: React.FC<BalanceSheetProps> = ({
  assets = [],
  liabilities = [],
  equity = [],
  asOf = new Date().toISOString().split('T')[0],
  className = ""
}) => {
  const totalAssets = assets.reduce((sum, item) => sum + item.amount, 0);
  const totalLiabilities = liabilities.reduce((sum, item) => sum + item.amount, 0);
  const totalEquity = equity.reduce((sum, item) => sum + item.amount, 0);
  
  const chartData = [
    { name: 'Assets', value: totalAssets },
    { name: 'Liabilities', value: totalLiabilities },
    { name: 'Equity', value: totalEquity }
  ];
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Balance Sheet</CardTitle>
        <CardDescription>
          As of {new Date(asOf).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column: Assets */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Assets</h3>
            <div className="space-y-2">
              {assets.map((asset, index) => (
                <div key={index} className="flex justify-between">
                  <span>{asset.name}</span>
                  <span>${asset.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold border-t pt-2">
                <span>Total Assets</span>
                <span>${totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
          
          {/* Right column: Liabilities and Equity */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Liabilities</h3>
              <div className="space-y-2">
                {liabilities.map((liability, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{liability.name}</span>
                    <span>${liability.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Total Liabilities</span>
                  <span>${totalLiabilities.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Equity</h3>
              <div className="space-y-2">
                {equity.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.name}</span>
                    <span>${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Total Equity</span>
                  <span>${totalEquity.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Visualization */}
        <div className="h-64 mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="value" name="Amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceSheet;
