
import React from 'react';
import { motion } from 'framer-motion';
import ActiveQuizCard from '../ActiveQuizCard';
import ConfidenceSlider from '../ConfidenceSlider';
import { ActiveQuizProps } from '../../types/platform-types';

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
        <div className="mt-4">
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
