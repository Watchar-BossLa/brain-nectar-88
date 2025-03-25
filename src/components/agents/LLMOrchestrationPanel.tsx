
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useLLMOrchestration } from '@/hooks/useLLMOrchestration';
import { useToast } from "@/components/ui/use-toast";

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
  const [selectedModel, setSelectedModel] = useState('');

  // Initialize state from the orchestration system
  useEffect(() => {
    if (isInitialized) {
      setOrchestrationEnabledState(isOrchestrationEnabled());
      
      if (availableModels.length > 0 && !selectedModel) {
        setSelectedModel(availableModels[0]);
      }
    }
  }, [isInitialized, availableModels, isOrchestrationEnabled, selectedModel]);

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
            <Label htmlFor="orchestration-toggle">
              {orchestrationEnabled ? 'Enabled' : 'Disabled'}
            </Label>
            <Switch
              id="orchestration-toggle"
              checked={orchestrationEnabled}
              onCheckedChange={handleToggleOrchestration}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="models">Available Models</TabsTrigger>
            <TabsTrigger value="test">Test Generation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">System Status</h3>
                <p className="text-sm text-muted-foreground">
                  The LLM orchestration system is active and monitoring {availableModels.length} models.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Registered Models</h4>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold">{availableModels.length}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Orchestration Status</h4>
                  <div>
                    <Badge variant={orchestrationEnabled ? "default" : "outline"}>
                      {orchestrationEnabled ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Performance Overview</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <h4 className="text-sm font-medium">System Efficiency</h4>
                      <span className="text-sm">85%</span>
                    </div>
                    <Progress value={85} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <h4 className="text-sm font-medium">Response Quality</h4>
                      <span className="text-sm">92%</span>
                    </div>
                    <Progress value={92} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <h4 className="text-sm font-medium">Resource Optimization</h4>
                      <span className="text-sm">78%</span>
                    </div>
                    <Progress value={78} />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="models" className="mt-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Available Models</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableModels.map(modelId => {
                  const metrics = modelMetrics[modelId] || {};
                  
                  return (
                    <Card key={modelId} className="overflow-hidden">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">{modelId}</CardTitle>
                      </CardHeader>
                      
                      <CardContent className="p-4 pt-0">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Accuracy</span>
                            <span>{(metrics.accuracy * 100 || 0).toFixed(0)}%</span>
                          </div>
                          <Progress value={metrics.accuracy * 100 || 0} />
                          
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Latency</span>
                            <span>{metrics.latency || '0'}ms</span>
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Resource</span>
                            <span>{(metrics.resourceEfficiency * 100 || 0).toFixed(0)}%</span>
                          </div>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="bg-muted/50 p-4">
                        <div className="flex justify-between w-full">
                          <Badge variant="outline">
                            {modelId.includes('llama') ? 'Llama' : 
                             modelId.includes('mistral') ? 'Mistral' : 
                             modelId.includes('mixtral') ? 'Mixtral' : 'Other'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {modelId.includes('70b') ? 'Large' : 
                             modelId.includes('8x7b') ? 'Large' : 'Small'}
                          </span>
                        </div>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="test" className="mt-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Test LLM Orchestration</h3>
              <p className="text-sm text-muted-foreground">
                Test the orchestration system by generating text with automatic model selection.
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="test-prompt">Prompt</Label>
                <textarea
                  id="test-prompt"
                  className="w-full h-24 p-2 border rounded-md"
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  placeholder="Enter a prompt to test model selection..."
                />
              </div>
              
              <Button 
                onClick={handleTestGeneration} 
                disabled={isGenerating || !testPrompt.trim()}
              >
                {isGenerating ? "Generating..." : "Generate Text"}
              </Button>
              
              {generatedText && (
                <div className="mt-4 p-4 bg-muted rounded-md">
                  <h4 className="font-medium mb-2">Generated Output:</h4>
                  <p className="text-sm whitespace-pre-wrap">{generatedText}</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
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
