import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, BookOpen, BrainCircuit, Network, Zap, Video, Users } from 'lucide-react';

/**
 * Welcome Modal Component
 * Shown to new users when they first log in
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the modal is open
 * @param {Function} props.onOpenChange - Function to call when open state changes
 * @param {Function} props.onStartOnboarding - Function to call when user starts onboarding
 * @param {Function} props.onSkipOnboarding - Function to call when user skips onboarding
 * @returns {React.ReactElement} Welcome modal component
 */
const WelcomeModal = ({ open, onOpenChange, onStartOnboarding, onSkipOnboarding }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <Sparkles className="h-6 w-6 mr-2 text-primary" />
            Welcome to Study Bee!
          </DialogTitle>
          <DialogDescription>
            Your intelligent study companion for effective learning
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <p className="text-center text-muted-foreground">
            Study Bee offers powerful features to enhance your learning experience:
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start space-x-2 p-2 rounded-lg border">
              <Network className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="text-sm font-medium">Knowledge Maps</h3>
                <p className="text-xs text-muted-foreground">Visualize connections between concepts</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2 p-2 rounded-lg border">
              <Zap className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="text-sm font-medium">Spaced Repetition</h3>
                <p className="text-xs text-muted-foreground">Remember more with adaptive reviews</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2 p-2 rounded-lg border">
              <BrainCircuit className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="text-sm font-medium">AI Study Coach</h3>
                <p className="text-xs text-muted-foreground">Get personalized learning guidance</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2 p-2 rounded-lg border">
              <Video className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="text-sm font-medium">Visual Recognition</h3>
                <p className="text-xs text-muted-foreground">Capture and analyze study materials</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2 p-2 rounded-lg border">
              <BookOpen className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="text-sm font-medium">Smart Recommendations</h3>
                <p className="text-xs text-muted-foreground">Discover relevant learning content</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2 p-2 rounded-lg border">
              <Users className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="text-sm font-medium">Collaborative Learning</h3>
                <p className="text-xs text-muted-foreground">Study with peers in virtual groups</p>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={onSkipOnboarding}
            className="sm:w-auto w-full"
          >
            Skip Tour
          </Button>
          <Button 
            onClick={onStartOnboarding}
            className="sm:w-auto w-full"
          >
            Take a Quick Tour
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
