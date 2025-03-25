
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface ModelMetric {
  accuracy?: number;
  latency?: number;
  resourceEfficiency?: number;
  [key: string]: any;
}

interface ModelMetricsProps {
  modelId: string;
  metrics: ModelMetric;
}

export function ModelMetrics({ modelId, metrics }: ModelMetricsProps) {
  return (
    <div key={modelId} className="bg-muted rounded-md p-3">
      <h4 className="text-xs font-medium mb-2">{modelId}</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
        {Object.entries(metrics).map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <span className="text-muted-foreground capitalize">
              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
            </span>
            <span className="font-medium">
              {typeof value === 'number' ? value.toFixed(2) : String(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ModelTypeInfo({ modelId }: { modelId: string }) {
  return (
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
  );
}
