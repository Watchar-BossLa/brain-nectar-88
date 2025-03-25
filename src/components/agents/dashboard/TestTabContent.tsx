
import React from 'react';
import { Button } from "@/components/ui/button";

interface TestTabContentProps {
  handleTestTask: () => Promise<void>;
}

export function TestTabContent({ handleTestTask }: TestTabContentProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Test Agent Task</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Submit a test task to the agent system to verify functionality.
        </p>
        <Button onClick={handleTestTask}>
          Submit Test Task
        </Button>
      </div>
    </div>
  );
}
