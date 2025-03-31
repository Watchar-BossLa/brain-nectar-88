
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useQuizState } from './hooks/adaptive-quiz/useQuizState';
import { useQuizActions } from './hooks/adaptive-quiz/useQuizActions';
import { useTopicSelection } from './hooks/quiz/useTopicSelection';
import QuizSettings from './components/platform/QuizSettings';
import QuizQuestion from './components/QuizQuestion';
import QuizResults from './components/platform/QuizResults';
import { Button } from '@/components/ui/button';
import { Settings, PlayCircle } from 'lucide-react';

interface AdaptiveQuizPlatformProps {
  initialSubject?: string;
}

const AdaptiveQuizPlatform: React.FC<AdaptiveQuizPlatformProps> = ({ 
  initialSubject = 'accounting'
}) => {
  const [showSettings, setShowSettings] = useState(true);
  const quizState = useQuizState();
  const quizActions = useQuizActions(quizState);
  
  const {
    selectedTopics,
    setSelectedTopics,
    selectedSubject,
    setSelectedSubject,
    questionCount,
    setQuestionCount,
    currentDifficulty,
    setCurrentDifficulty,
    quizStatus
  } = quizState;
  
  const {
    startQuiz,
    submitAnswer,
    restartQuiz,
    nextQuestion
  } = quizActions;
  
  // Initialize with the prop value
  useEffect(() => {
    if (initialSubject) {
      setSelectedSubject(initialSubject);
    }
  }, [initialSubject, setSelectedSubject]);
  
  const { allTopics, allSubjects, toggleTopic, getFilteredQuestions } = useTopicSelection(quizState);

  const handleStartQuiz = () => {
    startQuiz();
    setShowSettings(false);
  };

  const handleToggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <Card className="p-4 md:p-6">
      {quizStatus === 'setup' && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Quiz Setup</h2>
            <Button variant="outline" size="sm" onClick={handleToggleSettings}>
              {showSettings ? <PlayCircle className="h-4 w-4 mr-1" /> : <Settings className="h-4 w-4 mr-1" />}
              {showSettings ? 'Quick Start' : 'Show Settings'}
            </Button>
          </div>

          {showSettings ? (
            <QuizSettings
              topics={allTopics}
              selectedTopics={selectedTopics}
              handleTopicChange={toggleTopic}
              subjects={allSubjects}
              selectedSubjects={[selectedSubject]}
              handleSubjectChange={(subject) => setSelectedSubject(subject)}
              questionCount={questionCount}
              handleQuestionCountChange={(value) => setQuestionCount(Number(value))}
              initialDifficulty={currentDifficulty}
              handleDifficultyChange={(value) => setCurrentDifficulty(Number(value))}
              showSettings={showSettings}
              setShowSettings={setShowSettings}
              handleStartQuiz={handleStartQuiz}
            />
          ) : (
            <div className="text-center p-6">
              <p className="mb-4">Ready to start a quick quiz with the current settings?</p>
              <Button onClick={handleStartQuiz}>Start Quiz</Button>
            </div>
          )}

          <div className="flex justify-end mt-4">
            <Button 
              onClick={handleStartQuiz} 
              size="lg"
              className="w-full md:w-auto"
            >
              Start Quiz
            </Button>
          </div>
        </>
      )}

      {quizStatus === 'in-progress' && (
        <QuizQuestion
          key={quizState.currentQuestionIndex}
          question={quizState.questions[quizState.currentQuestionIndex]}
          onSubmit={submitAnswer}
          questionNumber={quizState.currentQuestionIndex + 1}
          totalQuestions={quizState.questions.length}
        />
      )}

      {quizStatus === 'completed' && (
        <QuizResults
          questions={quizState.questions}
          answers={quizState.userAnswers}
          onRestart={restartQuiz}
        />
      )}
    </Card>
  );
};

export default AdaptiveQuizPlatform;
