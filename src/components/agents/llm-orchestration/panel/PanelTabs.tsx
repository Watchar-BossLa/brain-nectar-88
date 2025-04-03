
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from './OverviewTab';
import { ModelsTab } from './ModelsTab';
import { PanelTestTab } from './PanelTestTab';
import { TaskCategory } from '@/types/enums';

interface PanelTabsProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  availableModels: string[];
  modelMetrics: Record<string, any>;
  testProps: {
    testPrompt: string;
    setTestPrompt: (prompt: string) => void;
    isGenerating: boolean;
    generatedText: string;
    handleTestGeneration: () => Promise<void>;
    TaskCategory: typeof TaskCategory;
  };
}

export function PanelTabs({
  selectedTab,
  setSelectedTab,
  availableModels,
  modelMetrics,
  testProps
}: PanelTabsProps) {
  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="models">Available Models</TabsTrigger>
        <TabsTrigger value="test">Test Generation</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="mt-4">
        <OverviewTab availableModels={availableModels} />
      </TabsContent>
      
      <TabsContent value="models" className="mt-4">
        <ModelsTab 
          availableModels={availableModels} 
          modelMetrics={modelMetrics} 
        />
      </TabsContent>
      
      <TabsContent value="test" className="mt-4">
        <PanelTestTab {...testProps} />
      </TabsContent>
    </Tabs>
  );
}
