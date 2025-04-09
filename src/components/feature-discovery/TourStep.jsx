import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';

/**
 * Tour Step Component
 * Individual step in a guided tour
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Step title
 * @param {string} props.description - Step description
 * @param {string} props.targetSelector - CSS selector for the target element
 * @param {string} props.position - Position of the step content
 * @param {boolean} props.isFirst - Whether this is the first step
 * @param {boolean} props.isLast - Whether this is the last step
 * @param {Function} props.onNext - Function to call when user clicks next
 * @param {Function} props.onPrevious - Function to call when user clicks previous
 * @param {Function} props.onClose - Function to call when user closes the tour
 * @returns {React.ReactElement} Tour step component
 */
const TourStep = ({ 
  title, 
  description, 
  targetSelector, 
  position = "bottom", 
  isFirst = false, 
  isLast = false, 
  onNext, 
  onPrevious, 
  onClose 
}) => {
  const [targetElement, setTargetElement] = React.useState(null);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  
  // Find target element and calculate position
  React.useEffect(() => {
    const element = document.querySelector(targetSelector);
    if (element) {
      setTargetElement(element);
      
      const rect = element.getBoundingClientRect();
      const positions = {
        top: { 
          top: rect.top - 10 - 80, // 80 is the height of the tooltip
          left: rect.left + rect.width / 2 - 150 // 150 is half the width of the tooltip
        },
        bottom: { 
          top: rect.bottom + 10, 
          left: rect.left + rect.width / 2 - 150
        },
        left: { 
          top: rect.top + rect.height / 2 - 40, 
          left: rect.left - 10 - 300 // 300 is the width of the tooltip
        },
        right: { 
          top: rect.top + rect.height / 2 - 40, 
          left: rect.right + 10
        }
      };
      
      setPosition(positions[position]);
    }
  }, [targetSelector, position]);
  
  if (!targetElement) {
    return null;
  }
  
  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      
      {/* Highlight target element */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute z-[60] box-content"
        style={{
          top: targetElement.getBoundingClientRect().top - 4,
          left: targetElement.getBoundingClientRect().left - 4,
          width: targetElement.getBoundingClientRect().width,
          height: targetElement.getBoundingClientRect().height,
          border: '4px solid',
          borderColor: 'hsl(var(--primary))',
          borderRadius: '4px',
          pointerEvents: 'none'
        }}
      />
      
      {/* Tour step content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="fixed z-[70] w-[300px] bg-card rounded-lg shadow-lg"
        style={{
          top: position.top,
          left: position.left
        }}
      >
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium">{title}</h4>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 -mt-1 -mr-1" 
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onPrevious}
              disabled={isFirst}
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>
            
            {isLast ? (
              <Button size="sm" onClick={onClose}>
                Finish
              </Button>
            ) : (
              <Button size="sm" onClick={onNext}>
                Next
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default TourStep;
