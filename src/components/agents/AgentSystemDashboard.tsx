
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMultiAgentSystem } from '@/hooks/useMultiAgentSystem';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * Agent System Dashboard component
 * 
 * Displays the status and metrics of the multi-agent system managed by the MCP.
 */
export default function AgentSystemDashboard() {
  const { isInitialized, systemState, submitTask, TaskTypes } = useMultiAgentSystem();
  const [selectedTab, setSelectedTab] = useState('status');

  // Handle test task submission
  const handleTestTask = async () => {
    try {
      await submitTask(
        TaskTypes.COGNITIVE_PROFILING,
        'Test cognitive profiling task',
        { test: true },
        'MEDIUM'
      );
    } catch (error) {
      console.error('Error submitting test task:', error);
    }
  };

  if (!isInitialized) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Multi-Agent System</CardTitle>
          <CardDescription>The system is not initialized yet.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Sign in to initialize the multi-agent system.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
              <p className="text-sm font-medium">Active</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Master Control Program is running
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Active Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {systemState?.activeAgents.map((agent) => (
                <Badge key={agent} variant="secondary">
                  {agent}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">System Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {systemState?.metrics ? (
                Object.entries(systemState.metrics).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-xs capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                    <span className="text-sm font-medium">{typeof value === 'number' ? value.toFixed(2) : value}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No metrics available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agent Operations</CardTitle>
          <CardDescription>Manage and test the agent system</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="status">Status</TabsTrigger>
              <TabsTrigger value="test">Test</TabsTrigger>
              <TabsTrigger value="config">Configuration</TabsTrigger>
            </TabsList>
            
            <TabsContent value="status">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Global Variables</h3>
                    <div className="bg-muted rounded-md p-3 text-xs font-mono">
                      {systemState?.globalVariables ? (
                        <pre>{JSON.stringify(systemState.globalVariables, null, 2)}</pre>
                      ) : (
                        'No global variables'
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Priority Matrix</h3>
                    <div className="bg-muted rounded-md p-3 text-xs font-mono">
                      {systemState?.priorityMatrix ? (
                        <pre>{JSON.stringify(systemState.priorityMatrix, null, 2)}</pre>
                      ) : (
                        'No priority matrix'
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="test">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Test Agent Task</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Submit a test task to the agent system to verify functionality.
                  </p>
                  <Button onClick={handleTestTask}>
                    Submit Test Task
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="config">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">System Configuration</h3>
                  <p className="text-xs text-muted-foreground">
                    Configuration options will be available in a future update.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
