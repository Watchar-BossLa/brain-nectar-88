
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import LearningModule from '@/components/ui/learning-module';
import { TopicItemProps } from '@/components/ui/learning-module';

export interface ModuleType {
  id: string;
  title: string;
  progress: number;
  totalDuration: string;
  topics: TopicItemProps[];
}

interface ModulesListProps {
  modules: ModuleType[];
}

const ModulesList = ({ modules }: ModulesListProps) => {
  return (
    <>
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search modules and topics..." 
            className="pl-9"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>
      
      {/* Modules List */}
      <div className="space-y-5">
        {modules.map((module, index) => (
          <LearningModule
            key={module.id}
            id={module.id}
            title={module.title}
            topics={module.topics}
            progress={module.progress}
            totalDuration={module.totalDuration}
            isActive={index === 3} // Set the current module as active
          />
        ))}
      </div>
    </>
  );
};

export default ModulesList;
