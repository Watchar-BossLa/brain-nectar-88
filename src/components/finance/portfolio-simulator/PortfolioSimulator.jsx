import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LineChart, BarChart, PieChart, RefreshCw, Download, Settings, Info, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import AssetSelector from './AssetSelector';
import PortfolioAnalysis from './PortfolioAnalysis';
import PortfolioOptimizer from './PortfolioOptimizer';
import { sampleAssets } from './sampleData';
import { calculatePortfolioPerformance, calculateRiskReturn } from './portfolioUtils';

const PortfolioSimulator = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [availableAssets, setAvailableAssets] = useState(sampleAssets);
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [timeHorizon, setTimeHorizon] = useState(10);
  const [rebalancingFrequency, setRebalancingFrequency] = useState('yearly');
  const [reinvestDividends, setReinvestDividends] = useState(true);
  const [activeTab, setActiveTab] = useState('builder');
  const [performanceData, setPerformanceData] = useState([]);
  const [riskReturn, setRiskReturn] = useState({ expectedReturn: 0, risk: 0, sharpeRatio: 0 });
  const [showSettings, setShowSettings] = useState(true);
  
  // Calculate total allocation
  const totalAllocation = portfolio.reduce((sum, asset) => sum + asset.allocation, 0);
  
  // Add asset to portfolio
  const addAsset = (asset) => {
    // Check if asset is already in portfolio
    if (portfolio.some(item => item.id === asset.id)) {
      return;
    }
    
    // Add asset with default allocation
    setPortfolio([...portfolio, { ...asset, allocation: 0 }]);
  };
  
  // Remove asset from portfolio
  const removeAsset = (assetId) => {
    setPortfolio(portfolio.filter(asset => asset.id !== assetId));
  };
  
  // Update asset allocation
  const updateAllocation = (assetId, allocation) => {
    setPortfolio(portfolio.map(asset => 
      asset.id === assetId ? { ...asset, allocation } : asset
    ));
  };
  
  // Rebalance portfolio to 100%
  const rebalancePortfolio = () => {
    if (portfolio.length === 0) return;
    
    const newPortfolio = [...portfolio];
    const totalCurrentAllocation = newPortfolio.reduce((sum, asset) => sum + asset.allocation, 0);
    
    if (totalCurrentAllocation === 0) {
      // If total allocation is 0, distribute evenly
      const evenAllocation = 100 / newPortfolio.length;
      newPortfolio.forEach(asset => asset.allocation = evenAllocation);
    } else {
      // Otherwise, scale proportionally to 100%
      const scaleFactor = 100 / totalCurrentAllocation;
      newPortfolio.forEach(asset => asset.allocation = asset.allocation * scaleFactor);
    }
    
    setPortfolio(newPortfolio);
  };
  
  // Reset portfolio
  const resetPortfolio = () => {
    setPortfolio([]);
  };
  
  // Toggle settings panel
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };
  
  // Download portfolio as CSV
  const downloadPortfolio = () => {
    if (portfolio.length === 0) return;
    
    const headers = ['Asset', 'Ticker', 'Type', 'Allocation', 'Expected Return', 'Risk'];
    const rows = portfolio.map(asset => [
      asset.name,
      asset.ticker,
      asset.type,
      `${asset.allocation.toFixed(2)}%`,
      `${(asset.expectedReturn * 100).toFixed(2)}%`,
      `${(asset.risk * 100).toFixed(2)}%`
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'portfolio.csv');
    link.click();
  };
  
  // Calculate portfolio performance when portfolio changes
  useEffect(() => {
    if (portfolio.length === 0) {
      setPerformanceData([]);
      setRiskReturn({ expectedReturn: 0, risk: 0, sharpeRatio: 0 });
      return;
    }
    
    // Calculate performance data
    const performance = calculatePortfolioPerformance(
      portfolio, 
      initialInvestment, 
      timeHorizon, 
      rebalancingFrequency, 
      reinvestDividends
    );
    
    setPerformanceData(performance);
    
    // Calculate risk-return metrics
    const riskReturnMetrics = calculateRiskReturn(portfolio);
    setRiskReturn(riskReturnMetrics);
    
  }, [portfolio, initialInvestment, timeHorizon, rebalancingFrequency, reinvestDividends]);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Investment Portfolio Simulator</CardTitle>
        <CardDescription>
          Create, analyze, and optimize your investment portfolio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="builder">Portfolio Builder</TabsTrigger>
            <TabsTrigger value="analysis">Performance Analysis</TabsTrigger>
            <TabsTrigger value="optimizer">Portfolio Optimizer</TabsTrigger>
          </TabsList>
          
          <TabsContent value="builder" className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Portfolio Builder */}
              <div className={`${showSettings ? 'lg:w-2/3' : 'w-full'}`}>
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Your Portfolio</CardTitle>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={toggleSettings}
                          title={showSettings ? "Hide Settings" : "Show Settings"}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={rebalancePortfolio}
                          title="Rebalance Portfolio"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={downloadPortfolio}
                          title="Download Portfolio"
                          disabled={portfolio.length === 0}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>
                      Total Allocation: {totalAllocation.toFixed(2)}%
                      <Progress value={totalAllocation} className="mt-2" />
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {portfolio.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>Your portfolio is empty. Add assets from the selector.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Asset</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Allocation</TableHead>
                              <TableHead>Expected Return</TableHead>
                              <TableHead>Risk</TableHead>
                              <TableHead></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {portfolio.map(asset => (
                              <TableRow key={asset.id}>
                                <TableCell className="font-medium">
                                  {asset.name} ({asset.ticker})
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">{asset.type}</Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={asset.allocation}
                                      onChange={(e) => updateAllocation(asset.id, Number(e.target.value))}
                                      className="w-16"
                                    />
                                    <span>%</span>
                                  </div>
                                </TableCell>
                                <TableCell className={asset.expectedReturn >= 0 ? 'text-green-600' : 'text-red-600'}>
                                  <div className="flex items-center">
                                    {asset.expectedReturn >= 0 ? 
                                      <TrendingUp className="h-4 w-4 mr-1" /> : 
                                      <TrendingDown className="h-4 w-4 mr-1" />
                                    }
                                    {(asset.expectedReturn * 100).toFixed(2)}%
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {(asset.risk * 100).toFixed(2)}%
                                </TableCell>
                                <TableCell>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => removeAsset(asset.id)}
                                  >
                                    Remove
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                    
                    <div className="mt-4 flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={resetPortfolio}
                        disabled={portfolio.length === 0}
                      >
                        Reset Portfolio
                      </Button>
                      
                      {totalAllocation !== 100 && portfolio.length > 0 && (
                        <Button onClick={rebalancePortfolio}>
                          Rebalance to 100%
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Portfolio Summary */}
                {portfolio.length > 0 && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Portfolio Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Expected Annual Return</div>
                          <div className={`text-2xl font-bold ${riskReturn.expectedReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {(riskReturn.expectedReturn * 100).toFixed(2)}%
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Risk (Volatility)</div>
                          <div className="text-2xl font-bold">
                            {(riskReturn.risk * 100).toFixed(2)}%
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                          <div className="text-2xl font-bold">
                            {riskReturn.sharpeRatio.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Initial Investment</div>
                          <div className="text-xl font-bold">
                            ${initialInvestment.toLocaleString()}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Projected Value (in {timeHorizon} years)</div>
                          <div className="text-xl font-bold">
                            ${performanceData.length > 0 
                              ? Math.round(performanceData[performanceData.length - 1].value).toLocaleString() 
                              : 0}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {/* Settings Panel */}
              {showSettings && (
                <div className="lg:w-1/3 space-y-6">
                  {/* Asset Selector */}
                  <AssetSelector 
                    assets={availableAssets} 
                    onAddAsset={addAsset} 
                    portfolio={portfolio}
                  />
                  
                  {/* Simulation Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Simulation Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="initial-investment">Initial Investment ($)</Label>
                        <Input 
                          id="initial-investment" 
                          type="number" 
                          min="1000" 
                          step="1000" 
                          value={initialInvestment} 
                          onChange={(e) => setInitialInvestment(Number(e.target.value))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="time-horizon">Time Horizon (Years)</Label>
                          <span>{timeHorizon} years</span>
                        </div>
                        <Slider 
                          id="time-horizon" 
                          min={1} 
                          max={30} 
                          step={1} 
                          value={[timeHorizon]} 
                          onValueChange={(value) => setTimeHorizon(value[0])}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="rebalancing-frequency">Rebalancing Frequency</Label>
                        <Select 
                          id="rebalancing-frequency" 
                          value={rebalancingFrequency} 
                          onValueChange={setRebalancingFrequency}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                            <SelectItem value="never">Never</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="reinvest-dividends" className="cursor-pointer">
                          Reinvest Dividends
                        </Label>
                        <Switch 
                          id="reinvest-dividends" 
                          checked={reinvestDividends} 
                          onCheckedChange={setReinvestDividends}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="analysis">
            <PortfolioAnalysis 
              portfolio={portfolio} 
              performanceData={performanceData} 
              riskReturn={riskReturn}
              initialInvestment={initialInvestment}
              timeHorizon={timeHorizon}
            />
          </TabsContent>
          
          <TabsContent value="optimizer">
            <PortfolioOptimizer 
              assets={availableAssets} 
              currentPortfolio={portfolio}
              onApplyOptimizedPortfolio={setPortfolio}
            />
          </TabsContent>
        </Tabs>
        
        {/* Tips */}
        <div className="flex items-start gap-2 text-sm text-muted-foreground mt-6">
          <Info className="h-4 w-4 mt-0.5" />
          <p>
            Tip: Build your portfolio by adding assets and setting allocations. 
            Use the analysis tab to view performance projections and the optimizer 
            to find the optimal asset allocation based on your risk tolerance.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioSimulator;
