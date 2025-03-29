
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight, Settings } from 'lucide-react';
import { QuizWelcomeProps } from '../../types/platform-types';

const QuizWelcome: React.FC<QuizWelcomeProps> = ({ setShowSettings, handleStartQuiz }) => {
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-xl font-semibold">Ready to test your knowledge?</h2>
        <p className="text-muted-foreground">
          This adaptive quiz will adjust to your skill level as you progress.
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <Button 
          className="w-full"
          onClick={handleStartQuiz}
        >
          Start Quiz
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setShowSettings(true)}
        >
          Customize
          <Settings className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default QuizWelcome;
