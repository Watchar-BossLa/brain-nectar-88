import React from 'react';
import { PanelTabsProps } from '@/types/components';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from './OverviewTab';
import { ModelsTab } from './ModelsTab';
import { PanelTestTab } from './PanelTestTab';

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
