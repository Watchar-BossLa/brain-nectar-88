
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import TopicItem, { TopicItemProps } from './topic-item';

export interface ModuleContentProps {
  topics: TopicItemProps[];
  progress: number;
  isExpanded: boolean;
}

const ModuleContent = ({ topics, progress, isExpanded }: ModuleContentProps) => {
  if (!isExpanded) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="border-t border-border bg-background/50"
    >
      <div className="p-4">
        <ul className="space-y-3">
          {topics.map((topic) => (
            <TopicItem
              key={topic.id}
              id={topic.id}
              title={topic.title}
              duration={topic.duration}
              isCompleted={topic.isCompleted}
            />
          ))}
        </ul>
        
        <div className="mt-6">
          <Button variant="default" className="w-full sm:w-auto">
            {progress === 100 ? "Review Module" : "Continue Learning"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ModuleContent;
