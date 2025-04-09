import React from 'react';
import { Progress } from '@/components/ui/progress';

/**
 * Onboarding Progress Component
 * Shows progress through the onboarding flow
 * 
 * @param {Object} props - Component props
 * @param {number} props.currentStep - Current step index (0-based)
 * @param {number} props.totalSteps - Total number of steps
 * @returns {React.ReactElement} Onboarding progress component
 */
const OnboardingProgress = ({ currentStep, totalSteps }) => {
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;
  
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Step {currentStep + 1} of {totalSteps}</span>
        <span>{Math.round(progressPercentage)}% complete</span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  );
};

export default OnboardingProgress;
