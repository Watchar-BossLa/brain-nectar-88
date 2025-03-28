
import React, { useState, useEffect } from 'react';
import { useQuiz } from './hooks/useQuiz';
import { useAdaptiveQuiz } from './hooks/useAdaptiveQuiz';
import { useAssessmentAgent } from './hooks/useAssessmentAgent';
import { quizQuestions } from './data/quizQuestions';
import QuizSetupCard from './components/QuizSetupCard';
import ActiveQuizCard from './components/ActiveQuizCard';
import QuizResultsCard from './components/QuizResultsCard';
import ConfidenceSelector from './components/ConfidenceSelector';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { BrainCircuit } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdaptiveQuizPlatform = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [useAgentGeneration, setUseAgentGeneration] = useState(false);
  
  // Create a full quizHook instance to access all methods
  const quizHook = useQuiz();
  const {
    selectedTopics,
    quizLength,
    setQuizLength,
    allTopics,
    allSubjects,
    selectedSubject,
    setSelectedSubject,
    toggleTopic,
    currentDifficulty: initialDifficulty,
    setCurrentDifficulty: setInitialDifficulty,
  } = quizHook;
  
  // Use the assessment agent hook
  const {
    isGenerating,
    generateAdaptiveQuestions,
    submitQuizResults
  } = useAssessmentAgent();

  // Filter questions based on selected topics and subject
  const [filteredQuestions, setFilteredQuestions] = useState(quizQuestions);
  useEffect(() => {
    // Get filtered questions from the quiz hook instance
    const filteredQuestionsData = quizHook.getFilteredQuestions();
    setFilteredQuestions(filteredQuestionsData);
    setIsLoading(false);
  }, [selectedTopics, selectedSubject, quizHook]);

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
  } = useAdaptiveQuiz(filteredQuestions, initialDifficulty, quizLength);
  
  // Handler for AI-generated quiz
  const handleAIQuizGeneration = async () => {
    if (selectedTopics.length === 0) {
      toast({
        title: 'Topics Required',
        description: 'Please select at least one topic for the AI to generate questions.',
        variant: 'destructive',
      });
      return;
    }
    
    // Convert topics to IDs (in a real implementation, we'd have actual IDs)
    const topicIds = selectedTopics.map(topic => topic.replace(/\s+/g, '-').toLowerCase());
    
    // Request AI to generate questions
    const result = await generateAdaptiveQuestions(topicIds, {
      difficulty: currentDifficulty,
      count: quizLength,
      adaptationRate: 0.7 // Higher adaptation rate for AI-generated questions
    });
    
    if (result) {
      // In a real implementation, we would update the questions and start the quiz
      // For now, we'll just start the quiz with the filtered questions
      startQuiz();
    }
  };
  
  // Submit results when quiz is completed
  useEffect(() => {
    if (quizResults && useAgentGeneration) {
      submitQuizResults(quizResults);
    }
  }, [quizResults, useAgentGeneration, submitQuizResults]);

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
        <>
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Quiz Setup</h2>
            <Button 
              variant={useAgentGeneration ? "default" : "outline"}
              onClick={() => setUseAgentGeneration(!useAgentGeneration)}
              className="flex items-center gap-2"
            >
              <BrainCircuit className="h-4 w-4" />
              {useAgentGeneration ? "Using AI Generation" : "Use AI Generation"}
            </Button>
          </div>
          
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
            startQuiz={useAgentGeneration ? handleAIQuizGeneration : startQuiz}
            isProcessing={isGenerating}
            processingText="Generating quiz questions..."
          />
        </>
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
