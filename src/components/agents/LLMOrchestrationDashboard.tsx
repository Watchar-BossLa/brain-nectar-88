
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { LLMOrchestrationPanel } from './LLMOrchestrationPanel';

/**
 * LLM Orchestration Dashboard
 * 
 * Provides an overview and management interface for the intelligent
 * model selection system.
 */
export function LLMOrchestrationDashboard() {
  return (
    <div className="container mx-auto p-4">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">LLM Orchestration System</h1>
          <p className="text-muted-foreground">
            Intelligent model selection and deployment for optimal performance
          </p>
        </div>
        
        <Separator />
        
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="models">Models</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
          </TabsList>
          
          <div className="mt-6 space-y-6">
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Dynamic Model Routing</CardTitle>
                    <CardDescription>
                      Intelligent task categorization and model selection
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Automatically routes tasks to the most appropriate model based on
                      task requirements, complexity, and performance history.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Multi-Parameter Evaluation</CardTitle>
                    <CardDescription>
                      Sophisticated evaluation across dimensions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Assesses model suitability based on task appropriateness,
                      quality benchmarks, latency, and resource efficiency.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Monitoring</CardTitle>
                    <CardDescription>
                      Continuous evaluation and refinement
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Monitors model outputs against quality metrics with
                      automated feedback loops for system improvement.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <LLMOrchestrationPanel />
            </TabsContent>
            
            <TabsContent value="models" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Open-Source Model Integration</CardTitle>
                  <CardDescription>
                    Leveraging state-of-the-art open-source models
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    The orchestration system seamlessly connects to the Hugging Face ecosystem,
                    prioritizing the latest versions from the Llama, Mistral, and other model families.
                  </p>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Llama Models</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Llama 3 8B - General purpose</li>
                          <li>Llama 3 70B - High performance</li>
                          <li>Code Llama - Specialized for code</li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Mistral Models</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Mistral 7B - Efficient general purpose</li>
                          <li>Mixtral 8x7B - Mixture of experts</li>
                          <li>Specialized instruction models</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Adaptive Resource Allocation</CardTitle>
                  <CardDescription>
                    Balancing performance requirements with infrastructure constraints
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Dynamically scales compute allocation based on task complexity
                    and optimizes resource usage.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Simple Tasks</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Uses smaller, efficient models for basic tasks like
                          classification or simple text generation.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Medium Complexity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Balances performance and efficiency for tasks like
                          content generation and summarization.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Complex Reasoning</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Utilizes large, high-performance models for complex
                          reasoning and specialized tasks.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="configuration" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Standardization Layer</CardTitle>
                  <CardDescription>
                    Unified interface for consistent interaction patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    The orchestration system provides a standardized API that abstracts
                    model-specific implementations, allowing consistent interaction
                    regardless of the underlying model selected.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Configuration Management</CardTitle>
                  <CardDescription>
                    Version-controlled parameter systems
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Implements version-controlled configuration systems for model
                    selection parameters, enabling rapid adjustment of orchestration behavior.
                  </p>
                </CardContent>
              </Card>
              
              <LLMOrchestrationPanel />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
