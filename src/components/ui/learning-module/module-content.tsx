
import React from 'react';
import { cn } from '@/lib/utils';
import { TopicItem, TopicItemProps } from './topic-item';

export interface ModuleContentProps {
  topics: TopicItemProps[];
  isExpanded: boolean;
  onTopicClick: (id: string) => void;
}

export const ModuleContent = ({ 
  topics, 
  isExpanded,
  onTopicClick
}: ModuleContentProps) => {
  if (!isExpanded) return null;
  
  return (
    <div className={cn(
      "p-4 rounded-b-lg bg-accent/30 border-t border-border",
    )}>
      <ul className="space-y-2">
        {topics.map(topic => (
          <TopicItem 
            key={topic.id} 
            id={topic.id}
            title={topic.title}
            duration={topic.duration}
            isCompleted={topic.isCompleted}
            onClick={onTopicClick}
          />
        ))}
      </ul>
    </div>
  );
};

export default ModuleContent;
