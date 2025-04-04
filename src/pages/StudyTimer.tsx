
import React from 'react';
import { TimerProvider } from '@/context/timer/TimerContext';
import { StudyTimerContent } from '@/components/study-timer/StudyTimerContent';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const StudyTimer = () => {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <MainLayout>
        <div className="container pt-8">
          <div className="max-w-lg mx-auto text-center p-8">
            <h1 className="text-2xl font-bold mb-4">
              Sign in to use the Study Timer
            </h1>
            <p className="text-muted-foreground mb-6">
              You need to be signed in to track your study sessions and save your progress.
            </p>
            <div className="flex justify-center space-x-4">
              <Button asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/sign-up">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <TimerProvider>
        <StudyTimerContent />
      </TimerProvider>
    </MainLayout>
  );
};

export default StudyTimer;
