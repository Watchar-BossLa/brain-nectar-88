
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
import { quizQuestions } from './data/quizQuestions';

interface AdaptiveQuizPlatformProps {
  initialSubject?: string;
}

const AdaptiveQuizPlatform: React.FC<AdaptiveQuizPlatformProps> = ({ 
  initialSubject = 'accounting'
}) => {
  const [showSettings, setShowSettings] = useState(true);
  const [questions, setQuestions] = useState(quizQuestions);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [quizStatus, setQuizStatus] = useState<'setup' | 'in-progress' | 'completed'>('setup');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Set up custom state and actions
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject);
  const [questionCount, setQuestionCount] = useState(5);
  const [currentDifficulty, setCurrentDifficulty] = useState<1 | 2 | 3>(2);
  
  // Initialize with the prop value
  useEffect(() => {
    if (initialSubject) {
      setSelectedSubject(initialSubject);
    }
  }, [initialSubject]);
  
  const allTopics = [...new Set(quizQuestions
    .filter(q => !selectedSubject || q.subject === selectedSubject || (!q.subject && selectedSubject === 'accounting'))
    .map(q => q.topic)
  )];
  
  const allSubjects = [...new Set(quizQuestions.map(q => q.subject || 'accounting'))];
  
  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };
  
  const getFilteredQuestions = () => {
    return quizQuestions.filter(q => {
      // Filter by subject
      const subjectMatch = !selectedSubject || q.subject === selectedSubject || (!q.subject && selectedSubject === 'accounting');
      
      // Filter by topics if any are selected
      const topicMatch = selectedTopics.length === 0 || selectedTopics.includes(q.topic);
      
      return subjectMatch && topicMatch;
    });
  };
  
  const startQuiz = () => {
    const filteredQuestions = getFilteredQuestions();
    // Shuffle and limit to question count
    const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, questionCount);
    
    setQuestions(selected);
    setUserAnswers([]);
    setCurrentQuestionIndex(0);
    setQuizStatus('in-progress');
    setShowSettings(false);
  };
  
  const submitAnswer = (answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);
    
    // Move to next question or end quiz
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 1000); // Give time to show the result
    } else {
      setTimeout(() => {
        setQuizStatus('completed');
      }, 1000);
    }
  };
  
  const restartQuiz = () => {
    setQuizStatus('setup');
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowSettings(true);
  };
  
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
              handleDifficultyChange={(value) => setCurrentDifficulty(value as 1 | 2 | 3)}
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

      {quizStatus === 'in-progress' && questions[currentQuestionIndex] && (
        <QuizQuestion
          key={currentQuestionIndex}
          question={questions[currentQuestionIndex]}
          onSubmit={submitAnswer}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />
      )}

      {quizStatus === 'completed' && (
        <QuizResults
          questions={questions}
          answers={userAnswers}
          onRestart={restartQuiz}
        />
      )}
    </Card>
  );
};

export default AdaptiveQuizPlatform;
