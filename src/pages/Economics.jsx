import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, BarChart2, Building, Globe, DollarSign, Users, LineChart } from 'lucide-react';
import { SubjectIntegration, SubjectDashboard } from '@/components/subjects';
import MarketSimulator from '@/components/economics/market-simulator/MarketSimulator';

/**
 * Economics page component
 * @returns {React.ReactElement} Economics page component
 */
const Economics = () => {
  const [showSimulator, setShowSimulator] = useState(false);
  
  const openSimulator = () => {
    setShowSimulator(true);
  };
  
  const closeSimulator = () => {
    setShowSimulator(false);
  };
  
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Economics</h1>
            <p className="text-muted-foreground">
              Understand how societies allocate resources and make decisions
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
              subject="Economics" 
              description="Understand how societies allocate resources and make decisions"
              progress={10}
              topics={[
                {
                  title: "Microeconomics",
                  description: "Study of individual economic agents and markets",
                  status: "in_progress",
                  subtopics: [
                    { title: "Supply and Demand", completed: true },
                    { title: "Market Structures", completed: false },
                    { title: "Consumer Theory", completed: false },
                    { title: "Producer Theory", completed: false }
                  ]
                },
                {
                  title: "Macroeconomics",
                  description: "Study of the economy as a whole",
                  status: "not_started",
                  subtopics: [
                    { title: "GDP and Economic Growth", completed: false },
                    { title: "Inflation and Monetary Policy", completed: false },
                    { title: "Unemployment", completed: false },
                    { title: "Fiscal Policy", completed: false }
                  ]
                },
                {
                  title: "International Economics",
                  description: "Study of economic interactions between countries",
                  status: "not_started",
                  subtopics: [
                    { title: "Trade Theory", completed: false },
                    { title: "Exchange Rates", completed: false },
                    { title: "International Finance", completed: false },
                    { title: "Economic Integration", completed: false }
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
                    <CardTitle>Microeconomics</CardTitle>
                  </div>
                  <CardDescription>
                    Study of individual economic agents and markets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>
                      Supply and Demand
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-xs text-primary ml-2"
                        onClick={openSimulator}
                      >
                        Run Simulation
                      </Button>
                    </li>
                    <li>Market Structures</li>
                    <li>Consumer Theory</li>
                    <li>Producer Theory</li>
                    <li>Market Failures</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BarChart2 className="h-5 w-5 text-primary" />
                    <CardTitle>Macroeconomics</CardTitle>
                  </div>
                  <CardDescription>
                    Study of the economy as a whole
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>GDP and Economic Growth</li>
                    <li>Inflation and Monetary Policy</li>
                    <li>Unemployment</li>
                    <li>Fiscal Policy</li>
                    <li>Business Cycles</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    <CardTitle>International Economics</CardTitle>
                  </div>
                  <CardDescription>
                    Study of economic interactions between countries
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Trade Theory</li>
                    <li>Exchange Rates</li>
                    <li>International Finance</li>
                    <li>Economic Integration</li>
                    <li>Global Economic Institutions</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <CardTitle>Financial Economics</CardTitle>
                  </div>
                  <CardDescription>
                    Study of financial markets and instruments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Financial Markets</li>
                    <li>Asset Pricing</li>
                    <li>Corporate Finance</li>
                    <li>Financial Institutions</li>
                    <li>Behavioral Finance</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    <CardTitle>Development Economics</CardTitle>
                  </div>
                  <CardDescription>
                    Study of economic growth and structural change in developing economies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Economic Development Theories</li>
                    <li>Poverty and Inequality</li>
                    <li>Human Capital</li>
                    <li>Institutions and Development</li>
                    <li>Sustainable Development</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <CardTitle>Behavioral Economics</CardTitle>
                  </div>
                  <CardDescription>
                    Study of psychological, social, and emotional factors in economic decisions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Cognitive Biases</li>
                    <li>Prospect Theory</li>
                    <li>Social Preferences</li>
                    <li>Bounded Rationality</li>
                    <li>Nudge Theory</li>
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
                  <CardTitle>Market Simulator</CardTitle>
                  <CardDescription>
                    Simulate market dynamics and economic principles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <TrendingUp className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Explore how markets work through interactive simulations. Adjust supply and demand parameters, observe price equilibrium, and analyze the effects of market interventions like taxes, subsidies, and price controls.
                  </p>
                  <Button 
                    onClick={openSimulator}
                    className="w-full"
                  >
                    Launch Market Simulator
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Economic Data Analyzer</CardTitle>
                  <CardDescription>
                    Analyze and visualize economic indicators
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <LineChart className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Explore economic data from around the world. Visualize GDP growth, inflation rates, unemployment, and other key economic indicators. Compare data across countries and time periods.
                  </p>
                  <Button className="w-full">Launch Data Analyzer</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Policy Simulator</CardTitle>
                  <CardDescription>
                    Simulate the effects of economic policies
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <BarChart2 className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Experiment with different economic policies and observe their effects on key economic variables. Test fiscal and monetary policies, trade policies, and structural reforms in a simulated economy.
                  </p>
                  <Button className="w-full">Launch Policy Simulator</Button>
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
                      <li>Principles of Economics (Mankiw)</li>
                      <li>Microeconomics (Pindyck & Rubinfeld)</li>
                      <li>Macroeconomics (Blanchard)</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Online Courses</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Coursera: Economics of Money and Banking (Columbia University)</li>
                      <li>edX: Principles of Economics (MIT)</li>
                      <li>Khan Academy: Microeconomics and Macroeconomics</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Video Tutorials</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Crash Course Economics</li>
                      <li>EconplusDal YouTube Channel</li>
                      <li>MRUniversity Videos</li>
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
                      <li>Microeconomics Problem Sets</li>
                      <li>Macroeconomics Problem Sets</li>
                      <li>International Economics Problems</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Data Analysis</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Economic Data Analysis Exercises</li>
                      <li>Statistical Methods in Economics</li>
                      <li>Econometrics Practice</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Case Studies</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Economic Policy Case Studies</li>
                      <li>Financial Crisis Analysis</li>
                      <li>Development Economics Case Studies</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Cross-Subject Connections</h2>
          <SubjectIntegration currentSubject="Economics" />
        </div>
        
        {/* Market Simulator Modal */}
        {showSimulator && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-auto">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Market Simulator</h2>
                  <Button variant="ghost" onClick={closeSimulator}>
                    ✕
                  </Button>
                </div>
                <MarketSimulator />
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Economics;
