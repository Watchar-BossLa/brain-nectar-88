import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { Button } from '@/components/ui/button';
import { OnboardingFlow } from '@/components/onboarding';
import { Sparkles } from 'lucide-react';

/**
 * Welcome Header Component
 * Shows a personalized welcome message on the dashboard
 * 
 * @returns {React.ReactElement} Welcome header component
 */
const WelcomeHeader = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  
  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
    
    // Check if user is new (in a real app, this would be based on user data)
    const hasCompletedOnboarding = localStorage.getItem('onboardingCompleted');
    setIsNewUser(!hasCompletedOnboarding);
  }, []);
  
  // Handle onboarding complete
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('onboardingCompleted', 'true');
    setIsNewUser(false);
  };
  
  // Get user's first name
  const getFirstName = () => {
    if (!user || !user.email) return '';
    
    // In a real app, you would use the user's actual name
    // For now, we'll use the part of the email before the @ symbol
    return user.email.split('@')[0];
  };
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {greeting}, {getFirstName()}!
        </h1>
        <p className="text-muted-foreground">
          Welcome back to your personalized learning dashboard
        </p>
      </div>
      
      {isNewUser && (
        <Button 
          onClick={() => setShowOnboarding(true)}
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          <span>Take a Tour</span>
        </Button>
      )}
      
      {/* Onboarding Flow */}
      <OnboardingFlow 
        open={showOnboarding} 
        onOpenChange={setShowOnboarding}
        onComplete={handleOnboardingComplete}
      />
    </div>
  );
};

export default WelcomeHeader;
