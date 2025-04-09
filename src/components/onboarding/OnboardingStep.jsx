import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

/**
 * Onboarding Step Component
 * Individual step in the onboarding flow
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Step title
 * @param {string} props.description - Step description
 * @param {React.ReactNode} props.icon - Step icon
 * @param {React.ReactNode} props.children - Step content
 * @param {boolean} props.isFirst - Whether this is the first step
 * @param {boolean} props.isLast - Whether this is the last step
 * @param {Function} props.onNext - Function to call when user clicks next
 * @param {Function} props.onPrevious - Function to call when user clicks previous
 * @param {Function} props.onComplete - Function to call when user completes onboarding
 * @returns {React.ReactElement} Onboarding step component
 */
const OnboardingStep = ({ 
  title, 
  description, 
  icon, 
  children, 
  isFirst = false, 
  isLast = false, 
  onNext, 
  onPrevious, 
  onComplete 
}) => {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center">
          {icon && <div className="mr-2">{icon}</div>}
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          disabled={isFirst}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        
        {isLast ? (
          <Button onClick={onComplete}>
            Complete Tour
          </Button>
        ) : (
          <Button onClick={onNext}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default OnboardingStep;
