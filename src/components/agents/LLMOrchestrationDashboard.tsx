import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLLMOrchestration } from '@/hooks/useLLMOrchestration';
import { SystemStatus } from './llm-orchestration/SystemStatus';
import { AvailableModels } from './llm-orchestration/AvailableModels';
import { DashboardTabs } from './llm-orchestration/dashboard/DashboardTabs';
import { TaskCategory } from '@/types/enums';

/**
 * LLM Orchestration Dashboard component
 * 
 * Displays the status and metrics of the LLM orchestration system and provides
 * controls for testing and configuring the system.
 */
export default function LLMOrchestrationDashboard() {
  const { 
    isInitialized, 
    availableModels, 
    modelMetrics,
    setOrchestrationEnabled,
    isOrchestrationEnabled,
    generateText,
    generateTextWithModel,
    TaskCategory
  } = useLLMOrchestration();
  
  const [selectedTab, setSelectedTab] = useState('status');
  const [testPrompt, setTestPrompt] = useState('Explain accounting principles for beginners');
  const [testResult, setTestResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedTaskCategory, setSelectedTaskCategory] = useState(TaskCategory.TEXT_GENERATION);

  // Toggle LLM orchestration
  const handleToggleOrchestration = () => {
    setOrchestrationEnabled(!isOrchestrationEnabled());
  };

  // Test LLM with automatic model selection
  const handleTestGeneration = async () => {
    if (!testPrompt) return;
    
    setIsGenerating(true);
    setTestResult('');
    
    try {
      const result = await generateText(testPrompt, selectedTaskCategory);
      setTestResult(`${result.text}\n\nModel used: ${result.modelId}\nExecution time: ${result.executionTime}ms`);
    } catch (error) {
      setTestResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Test with specific model
  const handleTestWithModel = async () => {
    if (!testPrompt || !selectedModel) return;
    
    setIsGenerating(true);
    setTestResult('');
    
    try {
      const result = await generateTextWithModel(selectedModel, testPrompt, selectedTaskCategory);
      setTestResult(`${result.text}\n\nExecution time: ${result.executionTime}ms`);
    } catch (error) {
      setTestResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isInitialized) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>LLM Orchestration System</CardTitle>
          <CardDescription>The system is not initialized yet.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Sign in to initialize the LLM orchestration system.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SystemStatus 
          isEnabled={isOrchestrationEnabled()} 
          onToggle={handleToggleOrchestration} 
        />
        
        <AvailableModels models={availableModels} />
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">MCP Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
              <p className="text-sm font-medium">Connected</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              LLM System is integrated with Master Control Program
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>LLM Orchestration</CardTitle>
          <CardDescription>Test and manage the LLM orchestration system</CardDescription>
        </CardHeader>
        <CardContent>
          <DashboardTabs
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            availableModels={availableModels}
            modelMetrics={modelMetrics}
            testProps={{
              testPrompt,
              setTestPrompt,
              isGenerating,
              testResult,
              handleTestGeneration,
              handleTestWithModel,
              selectedModel,
              setSelectedModel,
              selectedTaskCategory,
              setSelectedTaskCategory,
              TaskCategory
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
