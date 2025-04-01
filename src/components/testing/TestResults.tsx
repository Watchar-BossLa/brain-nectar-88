
import React from 'react';
import { TestSummary } from '@/services/testing/TestRunner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowUpCircle, ArrowDownCircle, Clock } from 'lucide-react';
import { IssuesList } from './IssuesList';

interface TestResultsProps {
  results: TestSummary;
}

export const TestResults: React.FC<TestResultsProps> = ({ results }) => {
  const passRate = results.totalTests > 0 
    ? Math.round((results.passedTests / results.totalTests) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Results Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-muted p-4 rounded-md flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                {passRate >= 80 ? (
                  <ArrowUpCircle className="h-8 w-8 text-green-500" />
                ) : (
                  <ArrowDownCircle className="h-8 w-8 text-red-500" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pass Rate</p>
                <p className="text-2xl font-bold">{passRate}%</p>
              </div>
            </div>
            
            <div className="bg-muted p-4 rounded-md flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="text-2xl font-bold">{Math.round(results.duration)}ms</p>
              </div>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <div className="flex justify-between mb-2">
                <p className="text-sm text-muted-foreground">Tests</p>
                <p className="text-sm font-medium">{results.passedTests}/{results.totalTests}</p>
              </div>
              <Progress 
                value={passRate}
                className="h-2" 
              />
              <div className="flex justify-between mt-1">
                <p className="text-xs text-muted-foreground">Failed: {results.totalTests - results.passedTests}</p>
                <p className="text-xs text-muted-foreground">Passed: {results.passedTests}</p>
              </div>
            </div>
          </div>

          {/* Issues found */}
          <IssuesList issues={results.issues} />
        </CardContent>
      </Card>
      
      {Object.entries(results.results).map(([key, result]) => (
        <Card key={key}>
          <CardHeader>
            <CardTitle>
              {key.charAt(0).toUpperCase() + key.slice(1)} Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-md p-4">
              <pre className="text-xs overflow-auto max-h-60 whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
