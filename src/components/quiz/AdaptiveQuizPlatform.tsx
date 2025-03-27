
import React, { useState, useEffect } from 'react';
import { useQuiz } from './hooks/useQuiz';
import { useAdaptiveQuiz } from './hooks/useAdaptiveQuiz';
import { quizQuestions } from './data/quizQuestions';
import QuizSetupCard from './components/QuizSetupCard';
import ActiveQuizCard from './components/ActiveQuizCard';
import QuizResultsCard from './components/QuizResultsCard';
import ConfidenceSelector from './components/ConfidenceSelector';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

const AdaptiveQuizPlatform = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Use the standard quiz setup hooks to get topic and subject selection
  const {
    selectedTopics,
    quizLength,
    setQuizLength,
    allTopics,
    allSubjects,
    selectedSubject,
    setSelectedSubject,
    toggleTopic,
    getFilteredQuestions,
  } = useQuiz();

  // Filter questions based on selected topics and subject
  const [filteredQuestions, setFilteredQuestions] = useState(quizQuestions);
  useEffect(() => {
    setFilteredQuestions(getFilteredQuestions());
    setIsLoading(false);
  }, [selectedTopics, selectedSubject, getFilteredQuestions]);

  // Use the adaptive quiz hook with filtered questions
  const {
    activeQuiz,
    currentQuestion,
    currentIndex,
    selectedAnswer,
    setSelectedAnswer,
    isAnswerSubmitted,
    isCorrect,
    quizResults,
    currentDifficulty,
    setCurrentDifficulty,
    answeredQuestions,
    userConfidence,
    startQuiz,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    skipQuestion,
    restartQuiz,
    setConfidence,
  } = useAdaptiveQuiz(filteredQuestions, currentDifficulty, quizLength);

  if (isLoading) {
    return (
      <Card className="w-full flex justify-center items-center p-8">
        <CardContent>
          <Spinner size="lg" />
          <p className="text-center mt-4">Loading quiz questions...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {!activeQuiz && !quizResults && (
        <QuizSetupCard
          allTopics={allTopics}
          selectedTopics={selectedTopics}
          toggleTopic={toggleTopic}
          allSubjects={allSubjects}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
          quizLength={quizLength}
          setQuizLength={setQuizLength}
          currentDifficulty={currentDifficulty}
          setCurrentDifficulty={setCurrentDifficulty}
          startQuiz={startQuiz}
        />
      )}
      
      {activeQuiz && currentQuestion && (
        <>
          {!isAnswerSubmitted && (
            <div className="mb-4">
              <ConfidenceSelector
                selected={userConfidence}
                onChange={setConfidence}
                disabled={isAnswerSubmitted}
              />
            </div>
          )}
          
          <ActiveQuizCard
            currentQuestion={currentQuestion}
            currentIndex={currentIndex}
            availableQuestions={filteredQuestions.slice(0, quizLength)}
            selectedAnswer={selectedAnswer}
            setSelectedAnswer={setSelectedAnswer}
            isAnswerSubmitted={isAnswerSubmitted}
            isCorrect={isCorrect}
            submitAnswer={submitAnswer}
            nextQuestion={() => nextQuestion()}
            previousQuestion={() => previousQuestion()}
            skipQuestion={() => skipQuestion()}
          />
        </>
      )}
      
      {quizResults && (
        <QuizResultsCard
          quizResults={quizResults}
          answeredQuestions={answeredQuestions}
          restartQuiz={restartQuiz}
          resetQuiz={() => window.location.href = window.location.pathname}
        />
      )}
    </div>
  );
};

export default AdaptiveQuizPlatform;
