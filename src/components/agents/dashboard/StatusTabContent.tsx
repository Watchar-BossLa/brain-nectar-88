
import React from 'react';

interface StatusTabContentProps {
  globalVariables: Record<string, any> | undefined;
  priorityMatrix: Record<string, number> | undefined;
}

export function StatusTabContent({ globalVariables, priorityMatrix }: StatusTabContentProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Global Variables</h3>
          <div className="bg-muted rounded-md p-3 text-xs font-mono">
            {globalVariables ? (
              <pre>{JSON.stringify(globalVariables, null, 2)}</pre>
            ) : (
              'No global variables'
            )}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Priority Matrix</h3>
          <div className="bg-muted rounded-md p-3 text-xs font-mono">
            {priorityMatrix ? (
              <pre>{JSON.stringify(priorityMatrix, null, 2)}</pre>
            ) : (
              'No priority matrix'
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
