
import { QuizQuestion, QuizResults, AnsweredQuestion } from '../types';
import { Dispatch, SetStateAction } from 'react';

export interface ActiveQuizProps {
  quiz: {
    currentQuestion: QuizQuestion;
    currentIndex: number;
    selectedAnswer: string;
    setSelectedAnswer: (answer: string) => void;
    isAnswerSubmitted: boolean;
    isCorrect: boolean | null;
    submitAnswer: () => void;
    nextQuestion: () => void;
    previousQuestion: () => void;
    skipQuestion: () => void;
  };
  filteredQuestions: QuizQuestion[];
  questionCount: number;
  userConfidence: number;
  handleConfidenceChange: (value: number) => void;
}

export interface QuizSettingsProps {
  topics: string[];
  selectedTopics: string[];
  handleTopicChange: (topic: string) => void;
  subjects: string[];
  selectedSubjects: string[];
  handleSubjectChange: (subject: string) => void;
  questionCount: number;
  handleQuestionCountChange: (value: string) => void;
  initialDifficulty: 1 | 2 | 3;
  handleDifficultyChange: (value: string) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  handleStartQuiz: () => void;
}

export interface QuizWelcomeProps {
  setShowSettings: (show: boolean) => void;
  handleStartQuiz: () => void;
}

export interface AnalyticsTabProps {
  answeredQuestions: any[];
  setActiveTab: (tab: string) => void;
}

export interface FormulasTabProps {
  // Add any props needed for the FormulasTab component
}
