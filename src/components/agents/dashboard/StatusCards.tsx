
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatusCardsProps {
  activeAgents: string[];
  metrics: Record<string, number> | null;
}

export function StatusCards({ activeAgents, metrics }: StatusCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
            <p className="text-sm font-medium">Active</p>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Master Control Program is running
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Active Agents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1">
            {activeAgents.map((agent) => (
              <Badge key={agent} variant="secondary">
                {agent}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">System Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {metrics ? (
              Object.entries(metrics).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-xs capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                  <span className="text-sm font-medium">{typeof value === 'number' ? value.toFixed(2) : value}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">No metrics available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
