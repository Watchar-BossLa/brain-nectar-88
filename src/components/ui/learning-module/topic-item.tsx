
import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TopicItemProps {
  id: string;
  title: string;
  duration: number;
  isCompleted: boolean;
  onClick?: (id: string) => void;
}

export const TopicItem = ({ 
  id, 
  title, 
  duration, 
  isCompleted,
  onClick
}: TopicItemProps) => {
  return (
    <li 
      className={cn(
        "flex items-center justify-between p-3 rounded-md border cursor-pointer hover:bg-accent/50 transition-colors",
        isCompleted ? "bg-primary/5 border-primary/20" : "bg-card border-border"
      )}
      onClick={() => onClick?.(id)}
    >
      <div className="flex items-center">
        <div className={cn(
          "w-5 h-5 rounded-full flex items-center justify-center mr-3",
          isCompleted ? "text-primary" : "text-muted-foreground"
        )}>
          {isCompleted ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <span className="text-xs font-medium">{id}</span>
          )}
        </div>
        <span className={cn(
          "font-medium",
          isCompleted && "text-primary"
        )}>
          {title}
        </span>
      </div>
      <div className="flex items-center text-sm text-muted-foreground">
        <Clock className="h-3.5 w-3.5 mr-1" />
        <span>{duration} min</span>
      </div>
    </li>
  );
};
