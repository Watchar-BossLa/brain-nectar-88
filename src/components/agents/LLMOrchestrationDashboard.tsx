
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLLMOrchestration } from '@/hooks/useLLMOrchestration';
import { TaskCategory } from '@/services/llm';

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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`h-2 w-2 rounded-full ${isOrchestrationEnabled() ? 'bg-green-500' : 'bg-amber-500'} mr-2`}></div>
                <p className="text-sm font-medium">{isOrchestrationEnabled() ? 'Enabled' : 'Disabled'}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="orchestration-toggle" 
                  checked={isOrchestrationEnabled()}
                  onCheckedChange={handleToggleOrchestration}
                />
                <Label htmlFor="orchestration-toggle">Toggle</Label>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Available Models</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {availableModels.map((model) => (
                <Badge key={model} variant="outline">
                  {model}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        
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
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="status">Status</TabsTrigger>
              <TabsTrigger value="test">Test</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="status">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Model Registry</h3>
                  <div className="bg-muted rounded-md p-3 text-xs">
                    <p>Total models registered: {availableModels.length}</p>
                    <ul className="mt-2 space-y-1">
                      {availableModels.map(model => (
                        <li key={model}>{model}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="test">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Test LLM Orchestration</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="task-category">Task Category</Label>
                      <select 
                        id="task-category"
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        value={selectedTaskCategory}
                        onChange={(e) => setSelectedTaskCategory(e.target.value as TaskCategory)}
                      >
                        {Object.values(TaskCategory).map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="test-prompt">Test Prompt</Label>
                      <textarea 
                        id="test-prompt"
                        className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter a prompt to test the LLM orchestration system"
                        value={testPrompt}
                        onChange={(e) => setTestPrompt(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        onClick={handleTestGeneration} 
                        disabled={isGenerating || !testPrompt}
                      >
                        {isGenerating ? 'Generating...' : 'Test with Optimal Model'}
                      </Button>
                      
                      <div className="flex-1"></div>
                      
                      <select
                        className="flex h-9 w-48 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                      >
                        <option value="">Select specific model</option>
                        {availableModels.map((model) => (
                          <option key={model} value={model}>{model}</option>
                        ))}
                      </select>
                      
                      <Button
                        variant="outline"
                        onClick={handleTestWithModel}
                        disabled={isGenerating || !testPrompt || !selectedModel}
                      >
                        Test Selected Model
                      </Button>
                    </div>
                    
                    {testResult && (
                      <div>
                        <Label>Result</Label>
                        <div className="bg-muted rounded-md p-3 text-xs font-mono whitespace-pre-wrap">
                          {testResult}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="metrics">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Model Performance Metrics</h3>
                  {Object.keys(modelMetrics).length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {Object.entries(modelMetrics).map(([modelId, metrics]) => (
                        <div key={modelId} className="bg-muted rounded-md p-3">
                          <h4 className="text-xs font-medium mb-2">{modelId}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                            {Object.entries(metrics).map(([key, value]) => (
                              <div key={key} className="flex flex-col">
                                <span className="text-muted-foreground capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                </span>
                                <span className="font-medium">
                                  {typeof value === 'number' ? value.toFixed(2) : value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No metrics available yet. Test the system to generate metrics.</p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
