
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
  // Calculate question pool stats
  const getTopicMasteryElement = () => {
    if (!quiz.topicMastery || Object.keys(quiz.topicMastery).length === 0) {
      return null;
    }
    
    const currentTopic = quiz.currentQuestion?.topic;
    
    // If there's a current topic, show its mastery
    if (currentTopic && quiz.topicMastery && quiz.topicMastery[currentTopic] !== undefined) {
      const topicMastery = quiz.topicMastery[currentTopic] * 100; // Convert to percentage
      
      return (
        <Card className="mt-4 bg-muted/40">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Topic Mastery: {currentTopic.replace(/_/g, ' ')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <Progress value={topicMastery} className="h-2 mt-1" />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-muted-foreground">Beginner</span>
              <span className="text-xs font-medium">{Math.round(topicMastery)}%</span>
              <span className="text-xs text-muted-foreground">Master</span>
            </div>
          </CardContent>
        </Card>
      );
    }
    
    return null;
  };
  
  // Display current streak information
  const getStreakElement = () => {
    if (quiz.correctStreak > 2 || quiz.incorrectStreak > 1) {
      return (
        <div className="flex items-center gap-2 mt-4 px-4 py-2 rounded-md bg-muted/40">
          <Brain className={`h-5 w-5 ${quiz.correctStreak > 2 ? "text-green-500" : "text-red-500"}`} />
          <span className="text-sm">
            {quiz.correctStreak > 2 
              ? `${quiz.correctStreak} correct in a row!` 
              : `${quiz.incorrectStreak} incorrect in a row. Take your time!`}
          </span>
        </div>
      );
    }
    
    return null;
  };
  
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
      
      {quiz.correctStreak || quiz.incorrectStreak ? getStreakElement() : null}
      {quiz.topicMastery ? getTopicMasteryElement() : null}
    </motion.div>
  );
};

export default ActiveQuiz;
