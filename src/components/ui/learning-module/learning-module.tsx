
import React, { useState } from 'react';
import ModuleHeader from './module-header';
import ModuleContent from './module-content';
import { TopicItemProps } from './topic-item';
import { Progress } from '@/components/ui/progress';

export interface LearningModuleProps {
  id: string;
  title: string;
  description?: string;
  topics: TopicItemProps[];
  initialExpanded?: boolean;
  onTopicClick?: (id: string) => void;
  bookmarked?: boolean;
  onBookmark?: () => void;
  progress?: number;
  totalDuration?: string;
  isActive?: boolean;
}

const LearningModule = ({
  title,
  description,
  topics,
  initialExpanded = false,
  onTopicClick,
  bookmarked = false,
  onBookmark,
  progress,
  totalDuration,
  isActive = false,
}: LearningModuleProps) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded || isActive);
  
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };
  
  const handleTopicClick = (id: string) => {
    if (onTopicClick) {
      onTopicClick(id);
    }
  };
  
  return (
    <div className={`rounded-lg border shadow-sm overflow-hidden ${isActive ? 'border-primary' : ''}`}>
      <ModuleHeader 
        title={title} 
        description={description}
        isExpanded={isExpanded}
        onToggle={handleToggle}
        bookmarked={bookmarked}
        onBookmark={onBookmark}
      />
      
      {progress !== undefined && (
        <div className="px-4 pb-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-1" />
          
          {totalDuration && (
            <div className="mt-2 text-xs text-muted-foreground text-right">
              Total duration: {totalDuration}
            </div>
          )}
        </div>
      )}
      
      <ModuleContent 
        topics={topics} 
        isExpanded={isExpanded}
        onTopicClick={handleTopicClick}
      />
    </div>
  );
};

export default LearningModule;
