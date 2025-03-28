
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ModuleHeaderProps {
  title: string;
  description?: string;
  isExpanded: boolean;
  onToggle: () => void;
  bookmarked?: boolean;
  onBookmark?: () => void;
}

export const ModuleHeader = ({ 
  title, 
  description, 
  isExpanded, 
  onToggle,
  bookmarked = false,
  onBookmark
}: ModuleHeaderProps) => {
  return (
    <div className={cn(
      "p-4 rounded-t-lg flex items-start justify-between transition-colors duration-200",
      isExpanded ? "bg-primary/10" : "bg-card"
    )}>
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {onBookmark && (
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={(e) => {
              e.stopPropagation();
              onBookmark();
            }}
            className="text-muted-foreground hover:text-primary"
          >
            <Bookmark 
              className={cn(
                "h-4 w-4", 
                bookmarked ? "fill-primary text-primary" : "fill-none"
              )} 
            />
          </Button>
        )}
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={onToggle}
          className="text-muted-foreground hover:text-primary"
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default ModuleHeader;
