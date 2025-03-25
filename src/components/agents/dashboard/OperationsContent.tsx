
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusTabContent } from './StatusTabContent';
import { TestTabContent } from './TestTabContent';
import { ConfigTabContent } from './ConfigTabContent';

interface OperationsContentProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  globalVariables: Record<string, any> | undefined;
  priorityMatrix: Record<string, number> | undefined;
  handleTestTask: () => Promise<void>;
}

export function OperationsContent({
  selectedTab,
  setSelectedTab,
  globalVariables,
  priorityMatrix,
  handleTestTask
}: OperationsContentProps) {
  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="status">Status</TabsTrigger>
        <TabsTrigger value="test">Test</TabsTrigger>
        <TabsTrigger value="config">Configuration</TabsTrigger>
      </TabsList>
      
      <TabsContent value="status">
        <StatusTabContent 
          globalVariables={globalVariables}
          priorityMatrix={priorityMatrix}
        />
      </TabsContent>
      
      <TabsContent value="test">
        <TestTabContent handleTestTask={handleTestTask} />
      </TabsContent>
      
      <TabsContent value="config">
        <ConfigTabContent />
      </TabsContent>
    </Tabs>
  );
}
