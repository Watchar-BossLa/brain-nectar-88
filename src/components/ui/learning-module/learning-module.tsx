
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ModuleHeader from './module-header';
import ModuleContent from './module-content';
import { TopicItemProps } from './topic-item';

export interface LearningModuleProps {
  id: string;
  title: string;
  topics: TopicItemProps[];
  progress: number;
  totalDuration: string;
  isActive?: boolean;
}

const LearningModule = ({
  id,
  title,
  topics,
  progress,
  totalDuration,
  isActive = false
}: LearningModuleProps) => {
  const [isExpanded, setIsExpanded] = useState(isActive);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div 
      className="border border-border rounded-lg overflow-hidden mb-4 bg-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ModuleHeader
        title={title}
        topicsCount={topics.length}
        totalDuration={totalDuration}
        progress={progress}
        isExpanded={isExpanded}
        onToggle={toggleExpanded}
      />
      
      <AnimatePresence>
        {isExpanded && (
          <ModuleContent
            topics={topics}
            progress={progress}
            isExpanded={isExpanded}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LearningModule;
