import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, LineChart, Building2, PiggyBank, BarChart4, Landmark } from 'lucide-react';

const Finance = () => {
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center gap-3 mb-6">
          <DollarSign className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Finance Learning Center</h1>
        </div>
        
        <p className="text-muted-foreground mb-8 max-w-3xl">
          Master the principles of finance through comprehensive learning resources, interactive 
          simulations, and practical applications. From personal finance to corporate financial 
          management, develop the knowledge and skills to make informed financial decisions.
        </p>
        
        <Tabs defaultValue="topics" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="calculators">Financial Calculators</TabsTrigger>
            <TabsTrigger value="markets">Market Simulations</TabsTrigger>
            <TabsTrigger value="cases">Case Studies</TabsTrigger>
          </TabsList>
          
          <TabsContent value="topics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Personal Finance */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <PiggyBank className="h-5 w-5" />
                    Personal Finance
                  </CardTitle>
                  <CardDescription>Managing individual finances</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Budgeting & Financial Planning</li>
                    <li>Saving & Investment Strategies</li>
                    <li>Credit Management</li>
                    <li>Tax Planning</li>
                    <li>Retirement Planning</li>
                    <li>Estate Planning</li>
                  </ul>
                </CardContent>
              </Card>
              
              {/* Corporate Finance */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Corporate Finance
                  </CardTitle>
                  <CardDescription>Financial management for businesses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Financial Statement Analysis</li>
                    <li>Capital Budgeting</li>
                    <li>Working Capital Management</li>
                    <li>Capital Structure</li>
                    <li>Dividend Policy</li>
                    <li>Mergers & Acquisitions</li>
                  </ul>
                </CardContent>
              </Card>
              
              {/* Investments */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Investments
                  </CardTitle>
                  <CardDescription>Securities and portfolio management</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Stock Valuation</li>
                    <li>Bond Valuation</li>
                    <li>Portfolio Theory</li>
                    <li>Asset Allocation</li>
                    <li>Risk Management</li>
                    <li>Alternative Investments</li>
                  </ul>
                </CardContent>
              </Card>
              
              {/* Financial Markets */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart4 className="h-5 w-5" />
                    Financial Markets
                  </CardTitle>
                  <CardDescription>Structure and function of markets</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Stock Markets</li>
                    <li>Bond Markets</li>
                    <li>Derivatives Markets</li>
                    <li>Foreign Exchange</li>
                    <li>Market Efficiency</li>
                    <li>Market Microstructure</li>
                  </ul>
                </CardContent>
              </Card>
              
              {/* Banking & Financial Institutions */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Landmark className="h-5 w-5" />
                    Banking & Financial Institutions
                  </CardTitle>
                  <CardDescription>Financial intermediaries and services</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Commercial Banking</li>
                    <li>Investment Banking</li>
                    <li>Insurance Companies</li>
                    <li>Asset Management</li>
                    <li>Financial Regulation</li>
                    <li>Central Banking</li>
                  </ul>
                </CardContent>
              </Card>
              
              {/* International Finance */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    International Finance
                  </CardTitle>
                  <CardDescription>Global financial systems</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Exchange Rate Determination</li>
                    <li>International Monetary System</li>
                    <li>Balance of Payments</li>
                    <li>International Capital Markets</li>
                    <li>Global Financial Crises</li>
                    <li>International Financial Management</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="calculators">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Investment Calculator</CardTitle>
                  <CardDescription>Plan and analyze investment growth</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Calculate future value of investments, compare different investment strategies, 
                    and visualize the growth of your portfolio over time.
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Supports various investment types and scenarios</span>
                  </div>
                  <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                    Open Calculator
                  </button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Loan & Mortgage Calculator</CardTitle>
                  <CardDescription>Analyze loan payments and amortization</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Calculate monthly payments, total interest, and amortization schedules 
                    for various types of loans and mortgages.
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Compare different loan terms and interest rates</span>
                  </div>
                  <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                    Open Calculator
                  </button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Retirement Planning Calculator</CardTitle>
                  <CardDescription>Plan for your financial future</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Estimate retirement savings needs, analyze different saving strategies, 
                    and project income during retirement years.
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <PiggyBank className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Accounts for inflation, taxes, and Social Security</span>
                  </div>
                  <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                    Open Calculator
                  </button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Stock & Bond Valuation</CardTitle>
                  <CardDescription>Calculate intrinsic values of securities</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Apply various valuation models to estimate the intrinsic value of stocks and bonds, 
                    including DCF, dividend discount, and yield-to-maturity calculations.
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <LineChart className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Compare market prices to calculated values</span>
                  </div>
                  <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                    Open Calculator
                  </button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="markets">
            <Card>
              <CardHeader>
                <CardTitle>Financial Market Simulations</CardTitle>
                <CardDescription>
                  Experience real-world market dynamics in a risk-free environment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Our market simulations provide a realistic trading experience without the risk of real money. 
                  Practice investment strategies, learn market mechanics, and develop trading skills 
                  in various market scenarios.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Stock Market Simulator</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Trade virtual stocks with real-time market data. Build and manage a portfolio, 
                      analyze performance, and compete with other users.
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Includes historical and real-time data</span>
                    </div>
                    <button className="text-primary text-sm hover:underline">
                      Start Trading
                    </button>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Portfolio Management Simulator</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Manage a diversified investment portfolio across multiple asset classes. 
                      Optimize for risk and return based on your investment goals.
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <BarChart4 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Includes performance analytics and benchmarking</span>
                    </div>
                    <button className="text-primary text-sm hover:underline">
                      Start Managing
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Options Trading Simulator</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Practice options strategies in a simulated environment. Learn about calls, puts, 
                      spreads, and other derivatives without risking real capital.
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <LineChart className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Visualize option payoffs and risk profiles</span>
                    </div>
                    <button className="text-primary text-sm hover:underline">
                      Start Trading
                    </button>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Forex Trading Simulator</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Trade currency pairs in a simulated forex market. Learn about exchange rates, 
                      leverage, and international currency markets.
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Includes major and minor currency pairs</span>
                    </div>
                    <button className="text-primary text-sm hover:underline">
                      Start Trading
                    </button>
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Market Scenario Simulator</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Experience how markets react to different economic scenarios, such as recessions, 
                    inflation, interest rate changes, and other market-moving events.
                  </p>
                  <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                    Explore Scenarios
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cases">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Corporate Finance Case Studies</CardTitle>
                  <CardDescription>Real-world business financial decisions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Analyze real-world corporate finance scenarios, including capital budgeting decisions, 
                    financing choices, and financial restructuring cases.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm mb-4">
                    <li>Tesla's Capital Raising Strategy</li>
                    <li>Amazon's Reinvestment Policy</li>
                    <li>Disney-Fox Merger Analysis</li>
                    <li>Apple's Share Buyback Program</li>
                  </ul>
                  <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                    View Case Studies
                  </button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Investment Management Cases</CardTitle>
                  <CardDescription>Portfolio and asset management decisions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Study real investment management scenarios, including asset allocation decisions, 
                    portfolio construction, and performance evaluation.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm mb-4">
                    <li>Warren Buffett's Investment Philosophy</li>
                    <li>Yale Endowment's Asset Allocation</li>
                    <li>Hedge Fund Strategy Analysis</li>
                    <li>ESG Investment Implementation</li>
                  </ul>
                  <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                    View Case Studies
                  </button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Financial Crisis Case Studies</CardTitle>
                  <CardDescription>Analysis of major financial crises</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Examine the causes, consequences, and responses to major financial crises 
                    throughout history, with lessons for investors and policymakers.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm mb-4">
                    <li>2008 Global Financial Crisis</li>
                    <li>1997 Asian Financial Crisis</li>
                    <li>2000 Dot-com Bubble</li>
                    <li>1929 Stock Market Crash</li>
                  </ul>
                  <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                    View Case Studies
                  </button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Personal Finance Case Studies</CardTitle>
                  <CardDescription>Real-life financial planning scenarios</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Analyze real-life personal finance scenarios, including retirement planning, 
                    debt management, and major financial decisions.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm mb-4">
                    <li>Early Retirement Planning</li>
                    <li>Student Loan Repayment Strategies</li>
                    <li>Home Buying vs. Renting Analysis</li>
                    <li>Family Estate Planning</li>
                  </ul>
                  <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                    View Case Studies
                  </button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Finance;
