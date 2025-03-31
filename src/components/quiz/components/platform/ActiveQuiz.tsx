
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ActiveQuizCard from '../ActiveQuizCard';
import ConfidenceSlider from '../ConfidenceSlider';
import { ActiveQuizProps } from '../../types/platform-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FeedbackDialog from '../feedback/FeedbackDialog';
import { useToast } from '@/components/ui/use-toast';

// Update the component to use the correct props
const ActiveQuiz: React.FC<ActiveQuizProps> = ({ 
  quiz, 
  filteredQuestions, 
  questionCount,
  userConfidence,
  handleConfidenceChange
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
          <h2 className="text-2xl font-bold">Question {quiz.currentIndex + 1}</h2>
          <p className="text-muted-foreground">
            {Math.round((quiz.currentIndex / questionCount) * 100)}% complete
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
        currentQuestion={quiz.currentQuestion}
        currentIndex={quiz.currentIndex}
        availableQuestions={filteredQuestions.slice(0, questionCount)}
        selectedAnswer={quiz.selectedAnswer}
        setSelectedAnswer={quiz.setSelectedAnswer}
        isAnswerSubmitted={quiz.isAnswerSubmitted}
        isCorrect={quiz.isCorrect}
        submitAnswer={quiz.submitAnswer}
        nextQuestion={quiz.nextQuestion}
        previousQuestion={quiz.previousQuestion}
        skipQuestion={quiz.skipQuestion}
      />
      
      {!quiz.isAnswerSubmitted && (
        <div>
          <ConfidenceSlider
            value={userConfidence}
            onChange={handleConfidenceChange}
            disabled={quiz.isAnswerSubmitted}
          />
        </div>
      )}

      {/* Feedback Dialog */}
      <FeedbackDialog
        questionId={quiz.currentQuestion?.id || 'general'}
        questionText={quiz.currentQuestion?.text || 'Overall quiz feedback'}
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onSubmitFeedback={handleSubmitFeedback}
      />
    </motion.div>
  );
};

export default ActiveQuiz;
