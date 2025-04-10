import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  LineChart, 
  Line, 
  BarChart as RechartsBarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const PortfolioAnalysis = ({ portfolio, performanceData, riskReturn, initialInvestment, timeHorizon }) => {
  const [chartType, setChartType] = useState('growth');
  
  // Check if we have data to display
  if (portfolio.length === 0 || performanceData.length === 0) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="text-center text-muted-foreground">
            <p>Add assets to your portfolio to see performance analysis.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Calculate portfolio allocation by asset type
  const allocationByType = portfolio.reduce((acc, asset) => {
    const type = asset.type;
    if (!acc[type]) {
      acc[type] = 0;
    }
    acc[type] += asset.allocation;
    return acc;
  }, {});
  
  // Prepare data for pie chart
  const pieData = Object.entries(allocationByType).map(([name, value]) => ({
    name,
    value
  }));
  
  // Calculate annual returns
  const annualReturns = [];
  for (let i = 1; i < performanceData.length; i += 12) {
    if (i + 11 < performanceData.length) {
      const yearStart = performanceData[i - 1].value;
      const yearEnd = performanceData[i + 11].value;
      const yearReturn = (yearEnd - yearStart) / yearStart;
      annualReturns.push({
        year: `Year ${Math.floor(i / 12) + 1}`,
        return: yearReturn * 100
      });
    }
  }
  
  // Generate colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Format percentage
  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };
  
  return (
    <div className="space-y-6">
      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Performance Summary</CardTitle>
          <CardDescription>
            Projected performance over {timeHorizon} years with ${initialInvestment.toLocaleString()} initial investment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Initial Investment</div>
              <div className="text-2xl font-bold">
                {formatCurrency(initialInvestment)}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Projected Final Value</div>
              <div className="text-2xl font-bold">
                {formatCurrency(performanceData[performanceData.length - 1].value)}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Total Return</div>
              <div className="text-2xl font-bold">
                {formatPercentage(((performanceData[performanceData.length - 1].value / initialInvestment) - 1) * 100)}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Annualized Return</div>
              <div className="text-2xl font-bold">
                {formatPercentage(riskReturn.expectedReturn * 100)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Performance Charts */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-lg">Performance Analysis</CardTitle>
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select chart" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="growth">Portfolio Growth</SelectItem>
                <SelectItem value="returns">Annual Returns</SelectItem>
                <SelectItem value="allocation">Asset Allocation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            {chartType === 'growth' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={performanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    label={{ value: 'Month', position: 'insideBottomRight', offset: -10 }} 
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                    label={{ value: 'Portfolio Value', angle: -90, position: 'insideLeft' }} 
                  />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Portfolio Value']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    activeDot={{ r: 8 }} 
                    name="Portfolio Value"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
            
            {chartType === 'returns' && (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={annualReturns}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis 
                    tickFormatter={(value) => `${value}%`}
                    label={{ value: 'Annual Return (%)', angle: -90, position: 'insideLeft' }} 
                  />
                  <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, 'Annual Return']} />
                  <Legend />
                  <Bar 
                    dataKey="return" 
                    fill="#3b82f6" 
                    name="Annual Return"
                    isAnimationActive={true}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            )}
            
            {chartType === 'allocation' && (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, 'Allocation']} />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Risk Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Risk Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Expected Annual Return</div>
              <div className="text-2xl font-bold">
                {formatPercentage(riskReturn.expectedReturn * 100)}
              </div>
              <div className="text-sm text-muted-foreground">
                The weighted average of expected returns for all assets in your portfolio.
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Portfolio Risk (Volatility)</div>
              <div className="text-2xl font-bold">
                {formatPercentage(riskReturn.risk * 100)}
              </div>
              <div className="text-sm text-muted-foreground">
                The standard deviation of portfolio returns, a measure of volatility and risk.
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
              <div className="text-2xl font-bold">
                {riskReturn.sharpeRatio.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">
                A measure of risk-adjusted return. Higher is better. Above 1 is considered good.
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div>
            <h3 className="text-lg font-medium mb-4">Risk Assessment</h3>
            <div className="space-y-4">
              {riskReturn.sharpeRatio < 0.5 && (
                <div className="p-4 border border-red-200 bg-red-50 rounded-md">
                  <Badge className="bg-red-500 mb-2">High Risk</Badge>
                  <p className="text-sm">
                    Your portfolio has a low Sharpe ratio, indicating poor risk-adjusted returns. 
                    Consider reducing allocation to high-risk assets or using the Portfolio Optimizer.
                  </p>
                </div>
              )}
              
              {riskReturn.sharpeRatio >= 0.5 && riskReturn.sharpeRatio < 1 && (
                <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-md">
                  <Badge className="bg-yellow-500 mb-2">Moderate Risk</Badge>
                  <p className="text-sm">
                    Your portfolio has a moderate Sharpe ratio. There's room for improvement 
                    in your risk-adjusted returns. Consider using the Portfolio Optimizer.
                  </p>
                </div>
              )}
              
              {riskReturn.sharpeRatio >= 1 && (
                <div className="p-4 border border-green-200 bg-green-50 rounded-md">
                  <Badge className="bg-green-500 mb-2">Good Risk-Adjusted Return</Badge>
                  <p className="text-sm">
                    Your portfolio has a good Sharpe ratio, indicating favorable risk-adjusted returns. 
                    Your asset allocation appears to be well-balanced for your risk level.
                  </p>
                </div>
              )}
              
              {riskReturn.risk * 100 > 15 && (
                <div className="p-4 border border-blue-200 bg-blue-50 rounded-md">
                  <Badge className="bg-blue-500 mb-2">High Volatility</Badge>
                  <p className="text-sm">
                    Your portfolio has high volatility. While this may lead to higher returns, 
                    be prepared for significant fluctuations in value. Consider if this matches your risk tolerance.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioAnalysis;
