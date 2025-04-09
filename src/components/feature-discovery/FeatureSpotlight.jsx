import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, ArrowRight } from 'lucide-react';

/**
 * Feature Spotlight Component
 * Highlights a feature with a spotlight effect
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Target element to spotlight
 * @param {string} props.title - Spotlight title
 * @param {string} props.description - Spotlight description
 * @param {string} props.featureId - Unique identifier for the feature
 * @param {boolean} props.showOnce - Whether to show the spotlight only once
 * @param {boolean} props.forceShow - Whether to force showing the spotlight
 * @param {string} props.position - Position of the spotlight content
 * @param {Function} props.onDismiss - Function to call when spotlight is dismissed
 * @returns {React.ReactElement} Feature spotlight component
 */
const FeatureSpotlight = ({ 
  children, 
  title, 
  description, 
  featureId, 
  showOnce = true, 
  forceShow = false,
  position = "bottom",
  onDismiss
}) => {
  const [show, setShow] = useState(false);
  
  // Check if the spotlight has been seen before
  useEffect(() => {
    if (forceShow) {
      setShow(true);
      return;
    }
    
    if (showOnce) {
      const seenSpotlights = JSON.parse(localStorage.getItem('seenFeatureSpotlights') || '{}');
      if (!seenSpotlights[featureId]) {
        setShow(true);
      }
    } else {
      setShow(true);
    }
  }, [featureId, showOnce, forceShow]);
  
  // Handle dismiss
  const handleDismiss = () => {
    setShow(false);
    
    if (showOnce) {
      const seenSpotlights = JSON.parse(localStorage.getItem('seenFeatureSpotlights') || '{}');
      seenSpotlights[featureId] = true;
      localStorage.setItem('seenFeatureSpotlights', JSON.stringify(seenSpotlights));
    }
    
    if (onDismiss) {
      onDismiss();
    }
  };
  
  // Get position styles
  const getPositionStyles = () => {
    switch (position) {
      case 'top':
        return { bottom: '100%', marginBottom: '10px', left: '50%', transform: 'translateX(-50%)' };
      case 'bottom':
        return { top: '100%', marginTop: '10px', left: '50%', transform: 'translateX(-50%)' };
      case 'left':
        return { right: '100%', marginRight: '10px', top: '50%', transform: 'translateY(-50%)' };
      case 'right':
        return { left: '100%', marginLeft: '10px', top: '50%', transform: 'translateY(-50%)' };
      default:
        return { top: '100%', marginTop: '10px', left: '50%', transform: 'translateX(-50%)' };
    }
  };
  
  return (
    <div className="relative inline-block">
      {children}
      
      <AnimatePresence>
        {show && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={handleDismiss}
            />
            
            {/* Spotlight Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute z-50 w-64 bg-card rounded-lg shadow-lg"
              style={getPositionStyles()}
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{title}</h4>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 -mt-1 -mr-1" 
                    onClick={handleDismiss}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{description}</p>
                <Button 
                  size="sm" 
                  className="w-full" 
                  onClick={handleDismiss}
                >
                  Got it
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeatureSpotlight;
