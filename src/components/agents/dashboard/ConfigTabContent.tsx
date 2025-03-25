
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrainCircuit, Layers, Sparkles, Clock, HelpCircle, Settings } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface AgentConfig {
  enabled: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  retentionTarget: number;
  adaptiveRate: number;
  model: 'llama3' | 'mixtral' | 'codellama';
}

interface ConfigTabContentProps {
  onUpdateConfig?: (config: Record<string, AgentConfig>) => void;
}

export function ConfigTabContent({ onUpdateConfig }: ConfigTabContentProps) {
  const { toast } = useToast();
  const [llmOrchestrationEnabled, setLLMOrchestrationEnabled] = useState(true);
  const [agentConfigs, setAgentConfigs] = useState<Record<string, AgentConfig>>({
    'COGNITIVE_PROFILE': {
      enabled: true,
      priority: 'HIGH',
      retentionTarget: 85,
      adaptiveRate: 0.05,
      model: 'llama3'
    },
    'LEARNING_PATH': {
      enabled: true,
      priority: 'HIGH',
      retentionTarget: 80,
      adaptiveRate: 0.05,
      model: 'mixtral'
    },
    'CONTENT_ADAPTATION': {
      enabled: true,
      priority: 'MEDIUM',
      retentionTarget: 75,
      adaptiveRate: 0.03,
      model: 'llama3'
    },
    'ASSESSMENT': {
      enabled: true,
      priority: 'HIGH',
      retentionTarget: 90,
      adaptiveRate: 0.07,
      model: 'mixtral'
    },
    'SCHEDULING': {
      enabled: true,
      priority: 'MEDIUM',
      retentionTarget: 80,
      adaptiveRate: 0.04,
      model: 'llama3'
    }
  });

  const handleToggleAgent = (agentType: string, enabled: boolean) => {
    setAgentConfigs(prev => ({
      ...prev,
      [agentType]: {
        ...prev[agentType],
        enabled
      }
    }));
  };

  const handleChangePriority = (agentType: string, priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL') => {
    setAgentConfigs(prev => ({
      ...prev,
      [agentType]: {
        ...prev[agentType],
        priority
      }
    }));
  };

  const handleChangeRetentionTarget = (agentType: string, value: number[]) => {
    setAgentConfigs(prev => ({
      ...prev,
      [agentType]: {
        ...prev[agentType],
        retentionTarget: value[0]
      }
    }));
  };

  const handleChangeAdaptiveRate = (agentType: string, value: number[]) => {
    setAgentConfigs(prev => ({
      ...prev,
      [agentType]: {
        ...prev[agentType],
        adaptiveRate: value[0] / 100
      }
    }));
  };

  const handleChangeModel = (agentType: string, model: 'llama3' | 'mixtral' | 'codellama') => {
    setAgentConfigs(prev => ({
      ...prev,
      [agentType]: {
        ...prev[agentType],
        model
      }
    }));
  };

  const handleToggleLLMOrchestration = (enabled: boolean) => {
    setLLMOrchestrationEnabled(enabled);
  };

  const handleSaveConfig = () => {
    if (onUpdateConfig) {
      onUpdateConfig(agentConfigs);
    }
    
    toast({
      title: "Configuration Saved",
      description: "Agent system configuration has been updated.",
    });
  };

  const renderAgentConfig = (agentType: string, agentName: string, icon: React.ReactNode) => {
    const config = agentConfigs[agentType];
    if (!config) return null;

    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {icon}
              <CardTitle className="text-base">{agentName}</CardTitle>
            </div>
            <Switch 
              id={`${agentType}-enabled`}
              checked={config.enabled}
              onCheckedChange={(checked) => handleToggleAgent(agentType, checked)}
            />
          </div>
          <CardDescription>Configure parameters for the {agentName}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`${agentType}-priority`}>Priority</Label>
                <Select 
                  value={config.priority} 
                  onValueChange={(value) => handleChangePriority(agentType, value as any)}
                >
                  <SelectTrigger id={`${agentType}-priority`}>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`${agentType}-model`}>LLM Model</Label>
                <Select 
                  value={config.model} 
                  onValueChange={(value) => handleChangeModel(agentType, value as any)}
                >
                  <SelectTrigger id={`${agentType}-model`}>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="llama3">Llama 3</SelectItem>
                    <SelectItem value="mixtral">Mixtral 8x7B</SelectItem>
                    <SelectItem value="codellama">CodeLlama</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor={`${agentType}-retention`}>Retention Target: {config.retentionTarget}%</Label>
              </div>
              <Slider
                id={`${agentType}-retention`}
                value={[config.retentionTarget]}
                min={60}
                max={95}
                step={1}
                onValueChange={(value) => handleChangeRetentionTarget(agentType, value)}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor={`${agentType}-adaptive`}>Adaptive Rate: {(config.adaptiveRate * 100).toFixed(0)}%</Label>
              </div>
              <Slider
                id={`${agentType}-adaptive`}
                value={[config.adaptiveRate * 100]}
                min={1}
                max={10}
                step={1}
                onValueChange={(value) => handleChangeAdaptiveRate(agentType, value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="agents" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="agents">Agent Configuration</TabsTrigger>
          <TabsTrigger value="orchestration">LLM Orchestration</TabsTrigger>
          <TabsTrigger value="system">System Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="agents" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Agent Configuration</h3>
            <Button onClick={handleSaveConfig}>Save Configuration</Button>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Configure individual agents in the multi-agent system to optimize learning experience.
          </p>
          
          {renderAgentConfig('COGNITIVE_PROFILE', 'Cognitive Profile Agent', <BrainCircuit className="h-4 w-4" />)}
          {renderAgentConfig('LEARNING_PATH', 'Learning Path Agent', <Layers className="h-4 w-4" />)}
          {renderAgentConfig('CONTENT_ADAPTATION', 'Content Adaptation Agent', <Sparkles className="h-4 w-4" />)}
          {renderAgentConfig('ASSESSMENT', 'Assessment Agent', <HelpCircle className="h-4 w-4" />)}
          {renderAgentConfig('SCHEDULING', 'Scheduling Agent', <Clock className="h-4 w-4" />)}
        </TabsContent>
        
        <TabsContent value="orchestration" className="space-y-4 mt-4">
          <h3 className="text-lg font-medium">LLM Orchestration</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Configure the LLM orchestration layer that manages model selection and task routing.
          </p>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">LLM Orchestration</CardTitle>
                <Switch 
                  id="llm-orchestration-enabled"
                  checked={llmOrchestrationEnabled}
                  onCheckedChange={handleToggleLLMOrchestration}
                />
              </div>
              <CardDescription>Enable or disable the LLM orchestration system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Model Selection Strategy</Label>
                  <Select defaultValue="performance">
                    <SelectTrigger>
                      <SelectValue placeholder="Selection strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="performance">Performance Optimized</SelectItem>
                      <SelectItem value="cost">Cost Optimized</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Resource Allocation Strategy</Label>
                  <Select defaultValue="adaptive">
                    <SelectTrigger>
                      <SelectValue placeholder="Resource allocation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Allocation</SelectItem>
                      <SelectItem value="adaptive">Adaptive Allocation</SelectItem>
                      <SelectItem value="priority">Priority-based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Caching</Label>
                    <p className="text-sm text-muted-foreground">Cache model responses for improved performance</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Auto-update Models</Label>
                    <p className="text-sm text-muted-foreground">Automatically update to latest model versions</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system" className="space-y-4 mt-4">
          <h3 className="text-lg font-medium">System Settings</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Configure system-wide settings for the agent infrastructure.
          </p>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">System Configuration</CardTitle>
              <CardDescription>Global settings for the multi-agent system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Debug Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable detailed logging for debugging</p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Analytics Collection</Label>
                    <p className="text-sm text-muted-foreground">Collect anonymous usage data to improve the system</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Maximum Concurrent Agents</Label>
                  <Select defaultValue="5">
                    <SelectTrigger>
                      <SelectValue placeholder="Max concurrent agents" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Agents</SelectItem>
                      <SelectItem value="5">5 Agents</SelectItem>
                      <SelectItem value="8">8 Agents</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-2">
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Reset to Defaults
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
