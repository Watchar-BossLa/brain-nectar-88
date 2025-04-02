
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PathTabsListProps {
  paths: any[];
  onValueChange: (value: string) => void;
}

const PathTabsList = ({ paths, onValueChange }: PathTabsListProps) => {
  return (
    <TabsList className="mb-4">
      {paths.map((path) => (
        <TabsTrigger 
          key={path.id} 
          value={path.id}
          onClick={() => onValueChange(path.id)}
        >
          {path.title}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default PathTabsList;
