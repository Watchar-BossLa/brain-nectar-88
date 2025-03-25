
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface OverviewTabProps {
  availableModels: string[];
}

export function OverviewTab({ availableModels }: OverviewTabProps) {
  return (
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
            <Badge variant="default">Active</Badge>
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
  );
}
