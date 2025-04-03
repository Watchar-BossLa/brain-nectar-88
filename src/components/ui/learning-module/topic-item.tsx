
import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TopicItemProps {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
}

const TopicItem = ({ id, title, duration, isCompleted }: TopicItemProps) => {
  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center text-xs",
          isCompleted 
            ? "bg-green-100 text-green-600" 
            : "bg-secondary text-secondary-foreground"
        )}>
          {isCompleted ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <span>{id.split('-')[0]}</span>
          )}
        </div>
        <span className={cn(
          isCompleted && "line-through text-muted-foreground"
        )}>
          {title}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>{duration}</span>
      </div>
    </li>
  );
};

export default TopicItem;
