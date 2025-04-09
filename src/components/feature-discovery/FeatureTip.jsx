import React, { useState, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { X, Lightbulb } from 'lucide-react';

/**
 * Feature Tip Component
 * Shows a tooltip with information about a feature
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Trigger element
 * @param {string} props.title - Tip title
 * @param {string} props.description - Tip description
 * @param {string} props.featureId - Unique identifier for the feature
 * @param {boolean} props.showOnce - Whether to show the tip only once
 * @param {boolean} props.forceShow - Whether to force showing the tip
 * @param {string} props.side - Side to show the tooltip on
 * @returns {React.ReactElement} Feature tip component
 */
const FeatureTip = ({ 
  children, 
  title, 
  description, 
  featureId, 
  showOnce = true, 
  forceShow = false,
  side = "right"
}) => {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  
  // Check if the tip has been seen before
  useEffect(() => {
    if (forceShow) {
      setOpen(true);
      return;
    }
    
    if (showOnce) {
      const seenTips = JSON.parse(localStorage.getItem('seenFeatureTips') || '{}');
      if (!seenTips[featureId]) {
        setOpen(true);
      }
    } else {
      setOpen(true);
    }
  }, [featureId, showOnce, forceShow]);
  
  // Handle dismiss
  const handleDismiss = () => {
    setOpen(false);
    setDismissed(true);
    
    if (showOnce) {
      const seenTips = JSON.parse(localStorage.getItem('seenFeatureTips') || '{}');
      seenTips[featureId] = true;
      localStorage.setItem('seenFeatureTips', JSON.stringify(seenTips));
    }
  };
  
  // If dismissed and not forced, just render children
  if (dismissed && !forceShow) {
    return children;
  }
  
  return (
    <TooltipProvider>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          className="w-80 p-0 overflow-hidden"
          sideOffset={5}
        >
          <div className="bg-primary-50 dark:bg-primary-950 p-1 flex items-center justify-between">
            <div className="flex items-center text-xs font-medium text-primary">
              <Lightbulb className="h-3 w-3 mr-1" />
              <span>Feature Tip</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5" 
              onClick={handleDismiss}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <div className="p-3">
            <h4 className="font-medium mb-1">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FeatureTip;
