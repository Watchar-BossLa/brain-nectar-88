import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import TourStep from './TourStep';

/**
 * Guided Tour Component
 * Provides a step-by-step tour of a feature
 * 
 * @param {Object} props - Component props
 * @param {Array} props.steps - Tour steps
 * @param {boolean} props.active - Whether the tour is active
 * @param {string} props.tourId - Unique identifier for the tour
 * @param {boolean} props.showOnce - Whether to show the tour only once
 * @param {Function} props.onComplete - Function to call when tour is complete
 * @param {Function} props.onClose - Function to call when tour is closed
 * @returns {React.ReactElement} Guided tour component
 */
const GuidedTour = ({ 
  steps, 
  active = false, 
  tourId, 
  showOnce = true, 
  onComplete, 
  onClose 
}) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Check if the tour has been seen before
  useEffect(() => {
    if (active) {
      if (showOnce) {
        const seenTours = JSON.parse(localStorage.getItem('seenGuidedTours') || '{}');
        if (!seenTours[tourId]) {
          setIsActive(true);
        }
      } else {
        setIsActive(true);
      }
    } else {
      setIsActive(false);
    }
  }, [active, tourId, showOnce]);
  
  // Handle next step
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };
  
  // Handle previous step
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Handle complete
  const handleComplete = () => {
    setIsActive(false);
    
    if (showOnce) {
      const seenTours = JSON.parse(localStorage.getItem('seenGuidedTours') || '{}');
      seenTours[tourId] = true;
      localStorage.setItem('seenGuidedTours', JSON.stringify(seenTours));
    }
    
    if (onComplete) {
      onComplete();
    }
  };
  
  // Handle close
  const handleClose = () => {
    setIsActive(false);
    
    if (onClose) {
      onClose();
    }
  };
  
  if (!isActive || steps.length === 0) {
    return null;
  }
  
  const step = steps[currentStep];
  
  return (
    <AnimatePresence>
      {isActive && (
        <TourStep
          key={`tour-step-${currentStep}`}
          title={step.title}
          description={step.description}
          targetSelector={step.targetSelector}
          position={step.position}
          isFirst={currentStep === 0}
          isLast={currentStep === steps.length - 1}
          onNext={handleNextStep}
          onPrevious={handlePreviousStep}
          onClose={handleClose}
        />
      )}
    </AnimatePresence>
  );
};

export default GuidedTour;
