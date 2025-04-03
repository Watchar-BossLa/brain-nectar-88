import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLLMOrchestration } from '@/hooks/useLLMOrchestration';
import { useToast } from "@/components/ui/use-toast";
import { PanelTabs } from './llm-orchestration/panel/PanelTabs';
import { TaskCategory } from '@/types/enums';

/**
 * LLM Orchestration Panel Component
 * 
 * Provides a UI for configuring and monitoring the LLM orchestration system.
 */
export function LLMOrchestrationPanel() {
  const { 
    isInitialized, 
    availableModels, 
    modelMetrics,
    setOrchestrationEnabled,
    isOrchestrationEnabled,
    generateText,
    TaskCategory
  } = useLLMOrchestration();
  
  const { toast } = useToast();
  const [orchestrationEnabled, setOrchestrationEnabledState] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [testPrompt, setTestPrompt] = useState('Explain the accounting equation: Assets = Liabilities + Equity');
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize state from the orchestration system
  useEffect(() => {
    if (isInitialized) {
      setOrchestrationEnabledState(isOrchestrationEnabled());
    }
  }, [isInitialized, isOrchestrationEnabled]);

  // Toggle orchestration enabled state
  const handleToggleOrchestration = () => {
    const newState = !orchestrationEnabled;
    setOrchestrationEnabled(newState);
    setOrchestrationEnabledState(newState);
    
    toast({
      title: `LLM Orchestration ${newState ? 'Enabled' : 'Disabled'}`,
      description: `The agent system will ${newState ? 'now use' : 'no longer use'} LLM orchestration.`,
    });
  };

  // Test the LLM orchestration system
  const handleTestGeneration = async () => {
    if (!testPrompt.trim()) {
      toast({
        title: "Empty Prompt",
        description: "Please enter a prompt to test the LLM orchestration system.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    setGeneratedText('');
    
    try {
      const result = await generateText(
        testPrompt,
        TaskCategory.TEXT_GENERATION,
        0.5,
        ['accounting', 'finance']
      );
      
      setGeneratedText(result.text);
      
      toast({
        title: "Text Generated",
        description: `Generated with model: ${result.modelId} in ${result.executionTime}ms`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
      
      setGeneratedText('Error: Failed to generate text.');
    } finally {
      setIsGenerating(false);
    }
  };

  // If the system is not initialized, show a loading/error state
  if (!isInitialized) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>LLM Orchestration System</CardTitle>
          <CardDescription>The orchestration system is not initialized.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <Badge variant="outline" className="text-yellow-500">
              Unavailable
            </Badge>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Please ensure the LLM system is properly configured.
          </p>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>LLM Orchestration System</CardTitle>
            <CardDescription>Manage and monitor the intelligent model selection system</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${orchestrationEnabled ? 'bg-green-500' : 'bg-amber-500'} mr-2`}></div>
            <Badge 
              variant={orchestrationEnabled ? "default" : "outline"}
              className="cursor-pointer"
              onClick={handleToggleOrchestration}
            >
              {orchestrationEnabled ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <PanelTabs 
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          availableModels={availableModels}
          modelMetrics={modelMetrics}
          testProps={{
            testPrompt,
            setTestPrompt,
            isGenerating, 
            generatedText,
            handleTestGeneration,
            TaskCategory
          }}
        />
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex justify-between">
        <p className="text-xs text-muted-foreground">
          Models are selected based on task requirements and performance metrics.
        </p>
        <Badge variant="outline">v1.0</Badge>
      </CardFooter>
    </Card>
  );
}
