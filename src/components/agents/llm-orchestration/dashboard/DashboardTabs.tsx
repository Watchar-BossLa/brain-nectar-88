
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModelMetrics } from '../ModelMetrics';
import { TestTab } from './TestTab';
import { TaskCategory } from '@/types/enums';

interface DashboardTabsProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  availableModels: string[];
  modelMetrics: Record<string, any>;
  testProps: {
    testPrompt: string;
    setTestPrompt: (prompt: string) => void;
    isGenerating: boolean;
    testResult: string;
    handleTestGeneration: () => Promise<void>;
    handleTestWithModel: () => Promise<void>;
    selectedModel: string;
    setSelectedModel: (model: string) => void;
    selectedTaskCategory: TaskCategory;
    setSelectedTaskCategory: (category: TaskCategory) => void;
    TaskCategory: typeof TaskCategory;
  };
}

export function DashboardTabs({
  selectedTab,
  setSelectedTab,
  availableModels,
  modelMetrics,
  testProps
}: DashboardTabsProps) {
  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="status">Status</TabsTrigger>
        <TabsTrigger value="test">Test</TabsTrigger>
        <TabsTrigger value="metrics">Metrics</TabsTrigger>
      </TabsList>
      
      <TabsContent value="status">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Model Registry</h3>
            <div className="bg-muted rounded-md p-3 text-xs">
              <p>Total models registered: {availableModels.length}</p>
              <ul className="mt-2 space-y-1">
                {availableModels.map(model => (
                  <li key={model}>{model}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="test">
        <TestTab {...testProps} />
      </TabsContent>
      
      <TabsContent value="metrics">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Model Performance Metrics</h3>
            {Object.keys(modelMetrics).length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {Object.entries(modelMetrics).map(([modelId, metrics]) => (
                  <ModelMetrics key={modelId} modelId={modelId} metrics={metrics} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No metrics available yet. Test the system to generate metrics.</p>
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
