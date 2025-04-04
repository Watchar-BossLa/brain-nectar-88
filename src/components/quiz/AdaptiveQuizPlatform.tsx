
import React from 'react';
import { useQuiz } from './hooks/useQuiz';
import QuizSetupCard from './components/QuizSetupCard';
import ActiveQuizCard from './components/ActiveQuizCard';
import QuizResultsCard from './components/QuizResultsCard';

const AdaptiveQuizPlatform = () => {
  const {
    activeQuiz,
    currentDifficulty,
    setCurrentDifficulty,
    currentQuestion,
    currentIndex,
    selectedAnswer,
    setSelectedAnswer,
    isAnswerSubmitted,
    isCorrect,
    quizResults,
    selectedTopics,
    quizLength,
    setQuizLength,
    availableQuestions,
    answeredQuestions,
    allTopics,
    allSubjects,
    selectedSubject,
    setSelectedSubject,
    startQuiz,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    skipQuestion,
    restartQuiz,
    toggleTopic,
  } = useQuiz();

  const resetQuiz = () => {
    // Reset quiz state without starting a new one
    if (quizResults) {
      // Just hide the results to go back to setup
      window.location.href = window.location.pathname;
    }
  };

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
        <ActiveQuizCard
          question={currentQuestion}
          currentQuestion={currentQuestion}
          currentIndex={currentIndex}
          availableQuestions={availableQuestions}
          selectedAnswer={selectedAnswer}
          setSelectedAnswer={setSelectedAnswer}
          isAnswerSubmitted={isAnswerSubmitted}
          isCorrect={isCorrect}
          submitAnswer={submitAnswer}
          nextQuestion={() => nextQuestion()}
          previousQuestion={() => previousQuestion(availableQuestions)}
          skipQuestion={() => skipQuestion()}
        />
      )}
      
      {quizResults && (
        <QuizResultsCard
          quizResults={quizResults}
          answeredQuestions={answeredQuestions}
          restartQuiz={restartQuiz}
          resetQuiz={resetQuiz}
        />
      )}
    </div>
  );
};

export default AdaptiveQuizPlatform;
