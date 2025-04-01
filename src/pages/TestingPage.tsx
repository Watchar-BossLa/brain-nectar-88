
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { appTester, TestResult } from '@/services/testing/AppTester';
import { TestResultsView } from '@/components/testing/TestResultsView';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from '@/components/ui/use-toast';
import { Loader2, PlayCircle, AlertCircle, Check, BugPlay } from 'lucide-react';
import { testRunner, TestSummary } from '@/services/testing/TestRunner';
import { TestResults } from '@/components/testing/TestResults';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TestingPage() {
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, TestResult> | null>(null);
  const [overallResult, setOverallResult] = useState<{
    success: boolean;
    duration: number;
    timestamp: string;
  } | null>(null);
  const [progress, setProgress] = useState(0);
  const [bugTestResults, setBugTestResults] = useState<TestSummary | null>(null);
  const [activeTab, setActiveTab] = useState('component-tests');
  
  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestResults(null);
    setOverallResult(null);
    setProgress(10);
    
    try {
      setProgress(30);
      const results = await appTester.runAllTests();
      setProgress(90);
      
      setTestResults(results.results);
      setOverallResult({
        success: results.success,
        duration: results.duration,
        timestamp: results.timestamp
      });
      
      toast({
        title: results.success ? "All tests passed" : "Some tests failed",
        description: `Completed ${Object.keys(results.results).length} test suites in ${results.duration}ms`,
        variant: results.success ? "default" : "destructive",
      });
      
    } catch (error) {
      console.error('[TestingPage] Error running tests:', error);
      
      toast({
        title: "Error running tests",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      
    } finally {
      setProgress(100);
      setIsRunningTests(false);
    }
  };

  const runBugTests = async () => {
    setIsRunningTests(true);
    setBugTestResults(null);
    setProgress(10);
    
    try {
      setProgress(30);
      const results = await testRunner.runAll();
      setProgress(90);
      
      setBugTestResults(results);
      
      toast({
        title: results.issues.length === 0 ? "No bugs found" : `Found ${results.issues.length} potential issues`,
        description: `Completed ${results.totalTests} tests in ${Math.round(results.duration)}ms`,
        variant: results.issues.length === 0 ? "default" : "destructive",
      });
    } catch (error) {
      console.error('[TestingPage] Error running bug tests:', error);
      
      toast({
        title: "Error running bug tests",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setProgress(100);
      setIsRunningTests(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="container max-w-screen-xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Application Testing</h1>
          
          <div className="flex gap-2">
            <Button 
              onClick={runBugTests}
              disabled={isRunningTests}
              variant="outline"
              className="flex items-center"
            >
              {isRunningTests ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <BugPlay className="mr-2 h-4 w-4" />
                  Find Bugs
                </>
              )}
            </Button>
            
            <Button 
              onClick={runAllTests} 
              disabled={isRunningTests}
              className="flex items-center"
            >
              {isRunningTests ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Run Component Tests
                </>
              )}
            </Button>
          </div>
        </div>
        
        {isRunningTests && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2">
              Running tests... {progress}%
            </p>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="component-tests">Component Tests</TabsTrigger>
            <TabsTrigger value="bug-scan">Bug Scan</TabsTrigger>
          </TabsList>
          
          <TabsContent value="component-tests">
            {overallResult && (
              <Card className="mb-6">
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    {overallResult.success ? (
                      <Check className="h-5 w-5 mr-2 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                    )}
                    <CardTitle>Test Results</CardTitle>
                  </div>
                  <CardDescription>
                    Completed {testResults ? Object.keys(testResults).length : 0} test suites 
                    in {overallResult.duration}ms at {new Date(overallResult.timestamp).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-muted rounded-md p-3">
                      <div className="text-sm text-muted-foreground">Status</div>
                      <div className={`text-lg font-bold ${overallResult.success ? 'text-green-500' : 'text-red-500'}`}>
                        {overallResult.success ? 'PASSED' : 'FAILED'}
                      </div>
                    </div>
                    <div className="bg-muted rounded-md p-3">
                      <div className="text-sm text-muted-foreground">Duration</div>
                      <div className="text-lg font-bold">{overallResult.duration}ms</div>
                    </div>
                    <div className="bg-muted rounded-md p-3">
                      <div className="text-sm text-muted-foreground">Test Suites</div>
                      <div className="text-lg font-bold">{testResults ? Object.keys(testResults).length : 0}</div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-4">
                    {testResults && Object.entries(testResults).map(([key, result]) => (
                      <TestResultsView 
                        key={key} 
                        results={result} 
                        title={key.charAt(0).toUpperCase() + key.slice(1) + ' Tests'}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Agent System Tests</CardTitle>
                  <CardDescription>
                    Test the multi-agent system functionality and components
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    These tests validate the MCP, agent communication, task distribution, and LLM orchestration.
                  </p>
                  <Button 
                    onClick={async () => {
                      setIsRunningTests(true);
                      try {
                        const result = await appTester.testAgentSystem();
                        setTestResults(prev => ({ ...prev, agentSystem: result }));
                        toast({
                          title: result.success ? "Agent system tests passed" : "Agent system tests failed",
                          description: `Completed in ${result.duration}ms`,
                          variant: result.success ? "default" : "destructive",
                        });
                      } catch (error) {
                        toast({
                          title: "Test execution error",
                          description: error instanceof Error ? error.message : "Unknown error",
                          variant: "destructive",
                        });
                      } finally {
                        setIsRunningTests(false);
                      }
                    }}
                    disabled={isRunningTests}
                    variant="outline"
                  >
                    Run Agent System Tests
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Data Fetching Tests</CardTitle>
                  <CardDescription>
                    Test data retrieval and state management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    These tests validate data retrieval, state management, and API integration.
                  </p>
                  <Button 
                    onClick={async () => {
                      setIsRunningTests(true);
                      try {
                        const result = await appTester.testDataFetching();
                        setTestResults(prev => ({ ...prev, dataFetching: result }));
                        toast({
                          title: result.success ? "Data fetching tests passed" : "Data fetching tests failed",
                          description: `Completed in ${result.duration}ms`,
                          variant: result.success ? "default" : "destructive",
                        });
                      } catch (error) {
                        toast({
                          title: "Test execution error",
                          description: error instanceof Error ? error.message : "Unknown error",
                          variant: "destructive",
                        });
                      } finally {
                        setIsRunningTests(false);
                      }
                    }}
                    disabled={isRunningTests}
                    variant="outline"
                  >
                    Run Data Fetching Tests
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {testResults && testResults.agentSystem && (
              <div className="mt-6">
                <TestResultsView 
                  results={testResults.agentSystem}
                  title="Agent System Test Details"
                />
              </div>
            )}
            
            {testResults && testResults.dataFetching && (
              <div className="mt-6">
                <TestResultsView 
                  results={testResults.dataFetching}
                  title="Data Fetching Test Details" 
                />
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="bug-scan">
            {bugTestResults ? (
              <TestResults results={bugTestResults} />
            ) : (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center">
                    <BugPlay className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Run Bug Scan</h3>
                    <p className="text-muted-foreground mb-4">
                      Run a comprehensive bug scan to find potential issues in the application.
                    </p>
                    <Button onClick={runBugTests} disabled={isRunningTests}>
                      {isRunningTests ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Scanning...
                        </>
                      ) : (
                        'Start Bug Scan'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
