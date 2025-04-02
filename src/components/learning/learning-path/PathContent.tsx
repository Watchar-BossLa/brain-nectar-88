
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import PathOverviewCard from './PathOverviewCard';
import ModuleCard from './ModuleCard';

interface PathContentProps {
  path: any;
}

const PathContent = ({ path }: PathContentProps) => {
  return (
    <TabsContent key={path.id} value={path.id} className="space-y-4">
      {/* Path overview card */}
      <PathOverviewCard path={path} />
      
      {/* Recommended modules and topics */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recommended Study Plan</h3>
        
        {(path.modules || [1, 2, 3]).map((module: any, index: number) => (
          <ModuleCard 
            key={module.id || index} 
            index={index + 1} 
            module={module.id ? module : {
              title: `Module ${index + 1}`,
              topics: [
                { id: `${index}-1`, title: 'Topic 1', mastery: Math.floor(Math.random() * 100) },
                { id: `${index}-2`, title: 'Topic 2', mastery: Math.floor(Math.random() * 100) }
              ]
            }} 
          />
        ))}
      </div>
    </TabsContent>
  );
};

export default PathContent;
