
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMultiAgentSystem } from '@/hooks/useMultiAgentSystem';
import { StatusCards, OperationsContent } from './dashboard';

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
      // Use a TaskType that actually exists in the TaskTypes object
      const firstAvailableTaskType = Object.values(TaskTypes)[0];
      await submitTask(
        firstAvailableTaskType,
        'Test task',
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
      <StatusCards 
        activeAgents={systemState?.activeAgents || []}
        metrics={systemState?.metrics || null}
      />

      <Card>
        <CardHeader>
          <CardTitle>Agent Operations</CardTitle>
          <CardDescription>Manage and test the agent system</CardDescription>
        </CardHeader>
        <CardContent>
          <OperationsContent
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            globalVariables={systemState?.globalVariables}
            priorityMatrix={systemState?.priorityMatrix}
            handleTestTask={handleTestTask}
          />
        </CardContent>
      </Card>
    </div>
  );
}
