
import React from 'react';
import { motion } from 'framer-motion';
import ActiveQuizCard from '../ActiveQuizCard';
import ConfidenceSlider from '../ConfidenceSlider';
import { ActiveQuizProps } from '../../types/platform-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp } from 'lucide-react';

// Update the component to use the correct props
const ActiveQuiz: React.FC<ActiveQuizProps> = ({ 
  quiz, 
  filteredQuestions, 
  questionCount,
  userConfidence,
  handleConfidenceChange
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
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
    </motion.div>
  );
};

export default ActiveQuiz;
