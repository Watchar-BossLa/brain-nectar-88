import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, LineChart, Building2, PiggyBank, BarChart4, Landmark } from 'lucide-react';
import { SubjectIntegration, SubjectDashboard } from '@/components/subjects';
import PortfolioSimulator from '@/components/finance/portfolio-simulator/PortfolioSimulator';

/**
 * Finance page component
 * @returns {React.ReactElement} Finance page component
 */
const Finance = () => {
  const [showPortfolioSimulator, setShowPortfolioSimulator] = useState(false);
  
  const openPortfolioSimulator = () => {
    setShowPortfolioSimulator(true);
  };
  
  const closePortfolioSimulator = () => {
    setShowPortfolioSimulator(false);
  };
  
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Finance</h1>
            <p className="text-muted-foreground">
              Understand financial markets, investments, and money management
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <SubjectDashboard 
              subject="Finance" 
              description="Understand financial markets, investments, and money management"
              progress={50}
              topics={[
                {
                  title: "Financial Markets",
                  description: "Structure and function of financial markets",
                  status: "completed",
                  subtopics: [
                    { title: "Stock Markets", completed: true },
                    { title: "Bond Markets", completed: true },
                    { title: "Derivatives Markets", completed: true },
                    { title: "Foreign Exchange Markets", completed: true }
                  ]
                },
                {
                  title: "Investment Management",
                  description: "Principles and strategies for investment",
                  status: "in_progress",
                  subtopics: [
                    { title: "Portfolio Theory", completed: true },
                    { title: "Asset Allocation", completed: true },
                    { title: "Risk Management", completed: false },
                    { title: "Performance Evaluation", completed: false }
                  ]
                },
                {
                  title: "Corporate Finance",
                  description: "Financial decisions in corporations",
                  status: "not_started",
                  subtopics: [
                    { title: "Capital Budgeting", completed: false },
                    { title: "Capital Structure", completed: false },
                    { title: "Dividend Policy", completed: false },
                    { title: "Mergers and Acquisitions", completed: false }
                  ]
                }
              ]}
            />
          </TabsContent>
          
          <TabsContent value="topics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <CardTitle>Financial Markets</CardTitle>
                  </div>
                  <CardDescription>
                    Structure and function of financial markets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Stock Markets</li>
                    <li>Bond Markets</li>
                    <li>Derivatives Markets</li>
                    <li>Foreign Exchange Markets</li>
                    <li>Market Efficiency</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <PiggyBank className="h-5 w-5 text-primary" />
                    <CardTitle>Investment Management</CardTitle>
                  </div>
                  <CardDescription>
                    Principles and strategies for investment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Portfolio Theory</li>
                    <li>Asset Allocation</li>
                    <li>
                      Portfolio Management
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-xs text-primary ml-2"
                        onClick={openPortfolioSimulator}
                      >
                        Start Managing
                      </Button>
                    </li>
                    <li>Risk Management</li>
                    <li>Performance Evaluation</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <CardTitle>Corporate Finance</CardTitle>
                  </div>
                  <CardDescription>
                    Financial decisions in corporations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Capital Budgeting</li>
                    <li>Capital Structure</li>
                    <li>Working Capital Management</li>
                    <li>Dividend Policy</li>
                    <li>Mergers and Acquisitions</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <CardTitle>Personal Finance</CardTitle>
                  </div>
                  <CardDescription>
                    Managing individual finances
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Budgeting and Saving</li>
                    <li>Credit and Debt Management</li>
                    <li>Retirement Planning</li>
                    <li>Tax Planning</li>
                    <li>Estate Planning</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Landmark className="h-5 w-5 text-primary" />
                    <CardTitle>Banking and Financial Institutions</CardTitle>
                  </div>
                  <CardDescription>
                    Structure and operations of financial institutions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Commercial Banking</li>
                    <li>Investment Banking</li>
                    <li>Central Banking</li>
                    <li>Financial Regulation</li>
                    <li>Financial Innovation</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BarChart4 className="h-5 w-5 text-primary" />
                    <CardTitle>Financial Analysis</CardTitle>
                  </div>
                  <CardDescription>
                    Analyzing financial statements and performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Financial Statement Analysis</li>
                    <li>Ratio Analysis</li>
                    <li>Cash Flow Analysis</li>
                    <li>Valuation Methods</li>
                    <li>Financial Modeling</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="tools">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Simulator</CardTitle>
                  <CardDescription>
                    Build and analyze investment portfolios
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <PiggyBank className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Create investment portfolios, analyze risk and return, and optimize asset allocation with our interactive simulator.
                  </p>
                  <Button 
                    onClick={openPortfolioSimulator}
                    className="w-full"
                  >
                    Launch Portfolio Simulator
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Financial Calculator</CardTitle>
                  <CardDescription>
                    Calculate financial metrics and ratios
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <DollarSign className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Calculate time value of money, loan payments, investment returns, and financial ratios.
                  </p>
                  <Button className="w-full">Launch Calculator</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Stock Market Simulator</CardTitle>
                  <CardDescription>
                    Simulate stock market trading
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <LineChart className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Practice trading stocks with virtual money, analyze market trends, and develop trading strategies.
                  </p>
                  <Button className="w-full">Launch Simulator</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="resources">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Textbooks</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Principles of Corporate Finance (Brealey, Myers, Allen)</li>
                      <li>Investments (Bodie, Kane, Marcus)</li>
                      <li>Financial Markets and Institutions (Mishkin, Eakins)</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Online Courses</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Coursera: Financial Markets (Yale)</li>
                      <li>edX: Finance for Everyone (Michigan)</li>
                      <li>Khan Academy: Finance and Capital Markets</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Video Tutorials</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Two Minute Papers: Finance</li>
                      <li>The Plain Bagel</li>
                      <li>Patrick Boyle Finance</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Practice Materials</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Problem Sets</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Time Value of Money Problems</li>
                      <li>Portfolio Optimization Exercises</li>
                      <li>Financial Statement Analysis Problems</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Case Studies</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Corporate Finance Case Studies</li>
                      <li>Investment Management Cases</li>
                      <li>Financial Crisis Analysis</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Simulations</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Stock Market Simulation</li>
                      <li>Portfolio Management Simulation</li>
                      <li>Financial Planning Simulation</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Cross-Subject Connections</h2>
          <SubjectIntegration currentSubject="Finance" />
        </div>
        
        {/* Portfolio Simulator Modal */}
        {showPortfolioSimulator && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-auto">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Investment Portfolio Simulator</h2>
                  <Button variant="ghost" onClick={closePortfolioSimulator}>
                    ✕
                  </Button>
                </div>
                <PortfolioSimulator />
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Finance;
