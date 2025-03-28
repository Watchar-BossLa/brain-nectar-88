
import React, { useState } from 'react';
import ModuleHeader from './module-header';
import ModuleContent from './module-content';
import { TopicItemProps } from './topic-item';

export interface LearningModuleProps {
  id: string;
  title: string;
  description?: string;
  topics: TopicItemProps[];
  initialExpanded?: boolean;
  onTopicClick?: (id: string) => void;
  bookmarked?: boolean;
  onBookmark?: () => void;
}

const LearningModule = ({
  title,
  description,
  topics,
  initialExpanded = false,
  onTopicClick,
  bookmarked = false,
  onBookmark,
}: LearningModuleProps) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };
  
  const handleTopicClick = (id: string) => {
    if (onTopicClick) {
      onTopicClick(id);
    }
  };
  
  return (
    <div className="rounded-lg border shadow-sm overflow-hidden">
      <ModuleHeader 
        title={title} 
        description={description}
        isExpanded={isExpanded}
        onToggle={handleToggle}
        bookmarked={bookmarked}
        onBookmark={onBookmark}
      />
      <ModuleContent 
        topics={topics} 
        isExpanded={isExpanded}
        onTopicClick={handleTopicClick}
      />
    </div>
  );
};

export default LearningModule;
