
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import { taskDistributionTester, TestTaskResult } from '@/services/agents/testing/taskDistributionTester';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskType } from '@/services/agents/types';

interface TestDistributionCardProps {
  taskProcessor: any;
}

export function TestDistributionCard({ taskProcessor }: TestDistributionCardProps) {
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testResult, setTestResult] = useState<TestTaskResult | null>(null);
  const [selectedTaskType, setSelectedTaskType] = useState<TaskType>('COGNITIVE_PROFILING');

  const runTaskDistributionTest = async () => {
    setIsRunningTest(true);
    try {
      // Run a distribution test with the selected task type
      const result = await taskDistributionTester.createAndSubmitTestTask(taskProcessor, {
        taskType: selectedTaskType,
        testData: {
          source: 'test-distribution-card',
          timestamp: Date.now(),
        }
      });
      
      setTestResult(result);
      console.log('Task distribution test completed:', result);
    } catch (error) {
      console.error('Error running task distribution test:', error);
      setTestResult({
        taskId: 'error',
        testId: 'error',
        success: false,
        processingTime: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        agentResults: {}
      });
    } finally {
      setIsRunningTest(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-base">Test Task Distribution Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="w-full sm:w-2/3">
              <label className="text-sm text-muted-foreground mb-1 block">Task Type</label>
              <Select
                value={selectedTaskType}
                onValueChange={(value) => setSelectedTaskType(value as TaskType)}
                disabled={isRunningTest}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="COGNITIVE_PROFILING">Cognitive Profiling</SelectItem>
                    <SelectItem value="LEARNING_PATH_GENERATION">Learning Path Generation</SelectItem>
                    <SelectItem value="ASSESSMENT_GENERATION">Assessment Generation</SelectItem>
                    <SelectItem value="CONTENT_ADAPTATION">Content Adaptation</SelectItem>
                    <SelectItem value="ENGAGEMENT_OPTIMIZATION">Engagement Optimization</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-1/3 mt-2 sm:mt-6">
              <Button 
                onClick={runTaskDistributionTest} 
                disabled={isRunningTest}
                className="w-full"
              >
                {isRunningTest ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  'Run Test'
                )}
              </Button>
            </div>
          </div>
          
          {testResult && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2 text-sm">Test Results</h4>
              <div className="bg-muted p-3 rounded-md text-xs">
                <div className="mb-1">
                  <span className="font-medium">Task ID:</span> {testResult.taskId}
                </div>
                <div className="mb-1">
                  <span className="font-medium">Status:</span> {testResult.success ? 'Successful' : 'Failed'}
                </div>
                <div className="mb-1">
                  <span className="font-medium">Processing Time:</span> {testResult.processingTime}ms
                </div>
                {testResult.error && (
                  <div className="mb-1 text-red-500">
                    <span className="font-medium">Error:</span> {testResult.error}
                  </div>
                )}
                <div className="mt-2">
                  <span className="font-medium">Agent Results:</span>
                  <pre className="mt-1 overflow-auto max-h-40 bg-background p-2 rounded text-xs">
                    {JSON.stringify(testResult.agentResults, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
