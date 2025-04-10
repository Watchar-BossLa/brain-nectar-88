import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ZAxis
} from 'recharts';
import { optimizePortfolio } from './portfolioUtils';

const PortfolioOptimizer = ({ assets, currentPortfolio, onApplyOptimizedPortfolio }) => {
  const [riskTolerance, setRiskTolerance] = useState(5);
  const [includeCurrentAssets, setIncludeCurrentAssets] = useState(true);
  const [optimizedPortfolios, setOptimizedPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  
  // Generate optimized portfolios when parameters change
  useEffect(() => {
    if (assets.length === 0) return;
    
    // Filter assets to include
    const assetsToInclude = includeCurrentAssets
      ? assets
      : currentPortfolio.length > 0
        ? assets.filter(asset => currentPortfolio.some(p => p.id === asset.id))
        : assets;
    
    if (assetsToInclude.length === 0) {
      setOptimizedPortfolios([]);
      setSelectedPortfolio(null);
      return;
    }
    
    // Generate portfolios with different risk levels
    const portfolios = [];
    for (let risk = 1; risk <= 10; risk++) {
      const optimized = optimizePortfolio(assetsToInclude, risk / 10);
      portfolios.push({
        id: risk,
        risk: optimized.risk * 100,
        return: optimized.expectedReturn * 100,
        sharpeRatio: optimized.sharpeRatio,
        portfolio: optimized.portfolio
      });
    }
    
    setOptimizedPortfolios(portfolios);
    
    // Select the portfolio closest to the user's risk tolerance
    const selected = portfolios.reduce((prev, curr) => {
      return Math.abs(curr.id - riskTolerance) < Math.abs(prev.id - riskTolerance) ? curr : prev;
    });
    
    setSelectedPortfolio(selected);
  }, [assets, currentPortfolio, includeCurrentAssets, riskTolerance]);
  
  // Apply the selected optimized portfolio
  const applyOptimizedPortfolio = () => {
    if (!selectedPortfolio) return;
    
    onApplyOptimizedPortfolio(selectedPortfolio.portfolio);
  };
  
  // Format percentage
  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };
  
  if (assets.length === 0) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="text-center text-muted-foreground">
            <p>No assets available for optimization.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Optimizer Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Portfolio Optimizer</CardTitle>
          <CardDescription>
            Find the optimal asset allocation based on your risk tolerance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="risk-tolerance">Risk Tolerance</Label>
                <span>
                  {riskTolerance === 1 ? 'Very Low' : 
                   riskTolerance <= 3 ? 'Low' : 
                   riskTolerance <= 7 ? 'Moderate' : 
                   riskTolerance <= 9 ? 'High' : 'Very High'}
                </span>
              </div>
              <Slider 
                id="risk-tolerance" 
                min={1} 
                max={10} 
                step={1} 
                value={[riskTolerance]} 
                onValueChange={(value) => setRiskTolerance(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Lower Risk, Lower Return</span>
                <span>Higher Risk, Higher Return</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="include-all-assets" className="cursor-pointer">
                Include All Available Assets
              </Label>
              <Switch 
                id="include-all-assets" 
                checked={includeCurrentAssets} 
                onCheckedChange={setIncludeCurrentAssets}
              />
            </div>
            
            <div className="text-sm text-muted-foreground">
              {includeCurrentAssets 
                ? 'The optimizer will consider all available assets.' 
                : 'The optimizer will only consider assets in your current portfolio.'}
            </div>
          </div>
          
          <Separator />
          
          {/* Efficient Frontier Chart */}
          <div>
            <h3 className="text-sm font-medium mb-2">Efficient Frontier</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid />
                  <XAxis 
                    type="number" 
                    dataKey="risk" 
                    name="Risk (%)" 
                    domain={[0, 'dataMax']}
                    label={{ value: 'Risk (%)', position: 'bottom', offset: 0 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="return" 
                    name="Return (%)" 
                    domain={[0, 'dataMax']}
                    label={{ value: 'Return (%)', angle: -90, position: 'left' }}
                  />
                  <ZAxis range={[60, 60]} />
                  <Tooltip 
                    formatter={(value) => `${value.toFixed(2)}%`}
                    cursor={{ strokeDasharray: '3 3' }}
                  />
                  <Scatter 
                    name="Portfolios" 
                    data={optimizedPortfolios} 
                    fill="#8884d8"
                  />
                  {selectedPortfolio && (
                    <Scatter 
                      name="Selected" 
                      data={[selectedPortfolio]} 
                      fill="#ff7300"
                      shape="star"
                    />
                  )}
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Each point represents a portfolio with different risk-return characteristics. 
              The highlighted point is your selected portfolio based on your risk tolerance.
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Optimized Portfolio */}
      {selectedPortfolio && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Optimized Portfolio</CardTitle>
            <CardDescription>
              Expected Return: {formatPercentage(selectedPortfolio.return)} | 
              Risk: {formatPercentage(selectedPortfolio.risk)} | 
              Sharpe Ratio: {selectedPortfolio.sharpeRatio.toFixed(2)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Current Allocation</TableHead>
                    <TableHead>Optimized Allocation</TableHead>
                    <TableHead>Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedPortfolio.portfolio.map(asset => {
                    const currentAsset = currentPortfolio.find(p => p.id === asset.id);
                    const currentAllocation = currentAsset ? currentAsset.allocation : 0;
                    const change = asset.allocation - currentAllocation;
                    
                    return (
                      <TableRow key={asset.id}>
                        <TableCell className="font-medium">
                          {asset.name} ({asset.ticker})
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{asset.type}</Badge>
                        </TableCell>
                        <TableCell>{currentAllocation.toFixed(2)}%</TableCell>
                        <TableCell>{asset.allocation.toFixed(2)}%</TableCell>
                        <TableCell>
                          <span className={change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : ''}>
                            {change > 0 ? '+' : ''}{change.toFixed(2)}%
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={applyOptimizedPortfolio}>
                Apply Optimized Portfolio
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PortfolioOptimizer;
