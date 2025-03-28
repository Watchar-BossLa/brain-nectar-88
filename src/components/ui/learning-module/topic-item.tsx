
import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TopicItemProps {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  onClick?: () => void;
}

export function TopicItem({ id, title, duration, isCompleted, onClick }: TopicItemProps) {
  return (
    <div 
      className={cn(
        "flex items-center justify-between p-3 border rounded-md mb-2 cursor-pointer transition-colors",
        isCompleted ? "border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800" : "border-border hover:bg-muted/50"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {isCompleted ? (
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
        ) : (
          <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/40" />
        )}
        <span className={cn(
          "font-medium",
          isCompleted && "text-green-700 dark:text-green-400"
        )}>
          {title}
        </span>
      </div>
      <div className="flex items-center text-muted-foreground text-sm">
        <Clock className="h-3.5 w-3.5 mr-1.5" />
        {duration}
      </div>
    </div>
  );
}
