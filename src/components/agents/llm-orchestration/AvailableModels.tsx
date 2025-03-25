
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AvailableModelsProps {
  models: string[];
}

export function AvailableModels({ models }: AvailableModelsProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Available Models</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1">
          {models.map((model) => (
            <Badge key={model} variant="outline">
              {model}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
