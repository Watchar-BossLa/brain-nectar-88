
import React from 'react';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export interface ModuleHeaderProps {
  title: string;
  topicsCount: number;
  totalDuration: string;
  progress: number;
  isExpanded: boolean;
  onToggle: () => void;
}

const ModuleHeader = ({ 
  title, 
  topicsCount, 
  totalDuration, 
  progress, 
  isExpanded, 
  onToggle 
}: ModuleHeaderProps) => {
  return (
    <div 
      className="flex items-center justify-between p-4 cursor-pointer"
      onClick={onToggle}
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
              <span>{topicsCount} topics</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{totalDuration}</span>
            </div>
          </div>
        </div>
      </div>
      
      <ModuleProgress progress={progress} isExpanded={isExpanded} />
    </div>
  );
};

interface ModuleProgressProps {
  progress: number;
  isExpanded: boolean;
}

const ModuleProgress = ({ progress, isExpanded }: ModuleProgressProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="hidden sm:block w-32">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>
      
      <ChevronIcon isExpanded={isExpanded} />
    </div>
  );
};

interface ChevronIconProps {
  isExpanded: boolean;
}

const ChevronIcon = ({ isExpanded }: ChevronIconProps) => {
  return (
    <div className={cn(
      "h-5 w-5 transition-transform duration-200",
      isExpanded && "transform rotate-180"
    )}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </div>
  );
};

export default ModuleHeader;
