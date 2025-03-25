
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AgentSystemDashboard from '@/components/agents/AgentSystemDashboard';
import LLMOrchestrationDashboard from '@/components/agents/LLMOrchestrationDashboard';

/**
 * Agent Dashboard Page
 * 
 * Shows both Agent System Dashboard and LLM Orchestration Dashboard.
 */
export default function AgentDashboard() {
  return (
    <div className="container max-w-screen-xl mx-auto p-4">
      <Tabs defaultValue="agent-system" className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Agent System Dashboard</h1>
          <TabsList>
            <TabsTrigger value="agent-system">Agent System</TabsTrigger>
            <TabsTrigger value="llm-orchestration">LLM Orchestration</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="agent-system">
          <AgentSystemDashboard />
        </TabsContent>
        
        <TabsContent value="llm-orchestration">
          <LLMOrchestrationDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
