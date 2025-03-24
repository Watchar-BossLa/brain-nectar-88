
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ChevronDown, Clock, BookOpen } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Topic {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
}

interface LearningModuleProps {
  id: string;
  title: string;
  topics: Topic[];
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

  return (
    <motion.div 
      className="border border-border rounded-lg overflow-hidden mb-4 bg-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center",
            progress === 100 ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary"
          )}>
            {progress === 100 ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <BookOpen className="h-4 w-4" />
            )}
          </div>
          
          <div>
            <h3 className="font-medium">{title}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                <span>{topics.length} topics</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{totalDuration}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:block w-32">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
          
          <ChevronDown 
            className={cn(
              "h-5 w-5 transition-transform duration-200",
              isExpanded && "transform rotate-180"
            )} 
          />
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
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
                  <li key={topic.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                        topic.isCompleted 
                          ? "bg-green-100 text-green-600" 
                          : "bg-secondary text-secondary-foreground"
                      )}>
                        {topic.isCompleted ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <span>{topic.id.split('-')[0]}</span>
                        )}
                      </div>
                      <span className={cn(
                        topic.isCompleted && "line-through text-muted-foreground"
                      )}>
                        {topic.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{topic.duration}</span>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6">
                <Button variant="default" className="w-full sm:w-auto">
                  {progress === 100 ? "Review Module" : "Continue Learning"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LearningModule;
