
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SystemStatusProps {
  isEnabled: boolean;
  onToggle: () => void;
}

export function SystemStatus({ isEnabled, onToggle }: SystemStatusProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">System Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`h-2 w-2 rounded-full ${isEnabled ? 'bg-green-500' : 'bg-amber-500'} mr-2`}></div>
            <p className="text-sm font-medium">{isEnabled ? 'Enabled' : 'Disabled'}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="orchestration-toggle" 
              checked={isEnabled}
              onCheckedChange={onToggle}
            />
            <Label htmlFor="orchestration-toggle">Toggle</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
