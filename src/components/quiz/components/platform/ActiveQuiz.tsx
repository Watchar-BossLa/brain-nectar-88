
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ActiveQuizCard from '../ActiveQuizCard';
import ConfidenceSlider from '../ConfidenceSlider';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FeedbackDialog from '../feedback/FeedbackDialog';
import { useToast } from '@/components/ui/use-toast';

// Define the correct props interface for ActiveQuiz
interface ActiveQuizProps {
  currentQuestion: any;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer: string;
  setSelectedAnswer: (answer: string) => void;
  isAnswerSubmitted: boolean;
  isCorrect: boolean | null;
  userConfidence: number;
  handleConfidenceChange: (value: number) => void;
  submitAnswer: () => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  skipQuestion: () => void;
  availableQuestions: any[];
}

// Update the component to use the correct props
const ActiveQuiz: React.FC<ActiveQuizProps> = ({ 
  currentQuestion,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  setSelectedAnswer,
  isAnswerSubmitted,
  isCorrect,
  userConfidence,
  handleConfidenceChange,
  submitAnswer,
  nextQuestion,
  previousQuestion,
  skipQuestion,
  availableQuestions
}) => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmitFeedback = (feedback: {
    questionId: string;
    feedbackType: 'issue' | 'suggestion' | 'praise';
    feedbackText: string;
  }) => {
    // In a real app, we would save this to the database
    console.log('Quiz feedback submitted:', feedback);
    
    toast({
      title: "Feedback received",
      description: "Thank you for your feedback on this quiz!",
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Question {currentIndex + 1}</h2>
          <p className="text-muted-foreground mt-1">
            {Math.round((currentIndex / totalQuestions) * 100)}% complete
          </p>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsFeedbackOpen(true)}
          className="flex items-center gap-1"
        >
          <MessageSquare className="h-4 w-4" />
          Feedback
        </Button>
      </div>
      
      <ActiveQuizCard
        currentQuestion={currentQuestion}
        currentIndex={currentIndex}
        availableQuestions={availableQuestions.slice(0, totalQuestions)}
        selectedAnswer={selectedAnswer}
        setSelectedAnswer={setSelectedAnswer}
        isAnswerSubmitted={isAnswerSubmitted}
        isCorrect={isCorrect}
        submitAnswer={submitAnswer}
        nextQuestion={nextQuestion}
        previousQuestion={previousQuestion}
        skipQuestion={skipQuestion}
      />
      
      {!isAnswerSubmitted && (
        <div>
          <ConfidenceSlider
            value={userConfidence}
            onChange={handleConfidenceChange}
            disabled={isAnswerSubmitted}
          />
        </div>
      )}

      {/* Feedback Dialog */}
      <FeedbackDialog
        questionId={currentQuestion?.id || 'general'}
        questionText={currentQuestion?.text || 'Overall quiz feedback'}
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onSubmitFeedback={handleSubmitFeedback}
      />
    </motion.div>
  );
};

export default ActiveQuiz;
