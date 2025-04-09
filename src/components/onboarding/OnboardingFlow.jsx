import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Network, Zap, BrainCircuit, Video, BookOpen, Users } from 'lucide-react';
import OnboardingStep from './OnboardingStep';
import OnboardingProgress from './OnboardingProgress';
import FeatureHighlight from './FeatureHighlight';
import WelcomeModal from './WelcomeModal';

// Mock feature images (in a real app, these would be actual screenshots)
const featureImages = {
  knowledgeMap: '/images/onboarding/knowledge-map.png',
  spacedRepetition: '/images/onboarding/spaced-repetition.png',
  aiCoach: '/images/onboarding/ai-coach.png',
  visualRecognition: '/images/onboarding/visual-recognition.png',
  recommendations: '/images/onboarding/recommendations.png',
  collaborative: '/images/onboarding/collaborative.png'
};

/**
 * Onboarding Flow Component
 * Guides new users through the app's features
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the onboarding flow is open
 * @param {Function} props.onOpenChange - Function to call when open state changes
 * @param {Function} props.onComplete - Function to call when onboarding is complete
 * @returns {React.ReactElement} Onboarding flow component
 */
const OnboardingFlow = ({ open, onOpenChange, onComplete }) => {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Reset state when opened
  useEffect(() => {
    if (open) {
      setShowWelcome(true);
      setCurrentStep(0);
    }
  }, [open]);
  
  // Handle start onboarding
  const handleStartOnboarding = () => {
    setShowWelcome(false);
  };
  
  // Handle skip onboarding
  const handleSkipOnboarding = () => {
    if (onComplete) {
      onComplete();
    }
  };
  
  // Handle next step
  const handleNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, onboardingSteps.length - 1));
  };
  
  // Handle previous step
  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };
  
  // Handle complete onboarding
  const handleCompleteOnboarding = () => {
    if (onComplete) {
      onComplete();
    }
  };
  
  // Handle try feature
  const handleTryFeature = (path) => {
    if (onComplete) {
      onComplete();
    }
    navigate(path);
  };
  
  // Onboarding steps
  const onboardingSteps = [
    {
      title: 'Knowledge Visualization System',
      description: 'Create visual maps of your knowledge',
      icon: <Network className="h-5 w-5" />,
      content: (
        <FeatureHighlight
          title="Knowledge Maps"
          description="Visualize connections between concepts and create structured knowledge graphs"
          icon={<Network className="h-5 w-5" />}
          imageSrc={featureImages.knowledgeMap}
          imageAlt="Knowledge Map Screenshot"
          path="/knowledge-visualization-system"
          onTryFeature={handleTryFeature}
        />
      )
    },
    {
      title: 'Adaptive Spaced Repetition',
      description: 'Remember more with scientifically-proven methods',
      icon: <Zap className="h-5 w-5" />,
      content: (
        <FeatureHighlight
          title="Spaced Repetition"
          description="Use adaptive algorithms to optimize your memory retention"
          icon={<Zap className="h-5 w-5" />}
          imageSrc={featureImages.spacedRepetition}
          imageAlt="Spaced Repetition Screenshot"
          path="/adaptive-spaced-repetition"
          onTryFeature={handleTryFeature}
        />
      )
    },
    {
      title: 'AI Study Coach',
      description: 'Get personalized guidance for your learning journey',
      icon: <BrainCircuit className="h-5 w-5" />,
      content: (
        <FeatureHighlight
          title="AI Study Coach"
          description="Receive personalized guidance and answers to your study questions"
          icon={<BrainCircuit className="h-5 w-5" />}
          imageSrc={featureImages.aiCoach}
          imageAlt="AI Study Coach Screenshot"
          path="/ai-study-coach"
          onTryFeature={handleTryFeature}
        />
      )
    },
    {
      title: 'Visual Recognition System',
      description: 'Capture and analyze study materials',
      icon: <Video className="h-5 w-5" />,
      content: (
        <FeatureHighlight
          title="Visual Recognition"
          description="Capture handwritten notes, diagrams, and formulas for digital processing"
          icon={<Video className="h-5 w-5" />}
          imageSrc={featureImages.visualRecognition}
          imageAlt="Visual Recognition Screenshot"
          path="/visual-recognition"
          onTryFeature={handleTryFeature}
        />
      )
    },
    {
      title: 'Learning Recommendations',
      description: 'Discover personalized learning content',
      icon: <BookOpen className="h-5 w-5" />,
      content: (
        <FeatureHighlight
          title="Smart Recommendations"
          description="Get personalized content recommendations based on your learning profile"
          icon={<BookOpen className="h-5 w-5" />}
          imageSrc={featureImages.recommendations}
          imageAlt="Learning Recommendations Screenshot"
          path="/learning-recommendations"
          onTryFeature={handleTryFeature}
        />
      )
    },
    {
      title: 'Collaborative Learning',
      description: 'Study with peers in virtual groups',
      icon: <Users className="h-5 w-5" />,
      content: (
        <FeatureHighlight
          title="Study Groups"
          description="Join or create study groups to collaborate with other learners"
          icon={<Users className="h-5 w-5" />}
          imageSrc={featureImages.collaborative}
          imageAlt="Collaborative Learning Screenshot"
          path="/study-groups"
          onTryFeature={handleTryFeature}
        />
      )
    }
  ];
  
  // Current step
  const step = onboardingSteps[currentStep];
  
  return (
    <>
      {/* Welcome Modal */}
      {open && showWelcome && (
        <WelcomeModal
          open={open && showWelcome}
          onOpenChange={(isOpen) => {
            if (!isOpen && onOpenChange) {
              onOpenChange(false);
            }
          }}
          onStartOnboarding={handleStartOnboarding}
          onSkipOnboarding={handleSkipOnboarding}
        />
      )}
      
      {/* Onboarding Steps */}
      {open && !showWelcome && (
        <Dialog 
          open={open && !showWelcome} 
          onOpenChange={(isOpen) => {
            if (!isOpen && onOpenChange) {
              onOpenChange(false);
            }
          }}
        >
          <DialogContent className="sm:max-w-[600px] p-0">
            <div className="absolute right-4 top-4 z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCompleteOnboarding}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              <OnboardingProgress
                currentStep={currentStep}
                totalSteps={onboardingSteps.length}
              />
              
              <OnboardingStep
                title={step.title}
                description={step.description}
                icon={step.icon}
                isFirst={currentStep === 0}
                isLast={currentStep === onboardingSteps.length - 1}
                onNext={handleNextStep}
                onPrevious={handlePreviousStep}
                onComplete={handleCompleteOnboarding}
              >
                {step.content}
              </OnboardingStep>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default OnboardingFlow;
