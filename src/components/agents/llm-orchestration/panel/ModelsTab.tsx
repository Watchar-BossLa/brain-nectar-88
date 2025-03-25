
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ModelTypeInfo } from '../ModelMetrics';

interface ModelsTabProps {
  availableModels: string[];
  modelMetrics: Record<string, any>;
}

export function ModelsTab({ availableModels, modelMetrics }: ModelsTabProps) {
  return (
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
                <ModelTypeInfo modelId={modelId} />
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
