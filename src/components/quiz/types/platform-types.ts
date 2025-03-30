
import { AnsweredQuestion } from '../types';

export interface AnalyticsTabProps {
  answeredQuestions: AnsweredQuestion[];
  setActiveTab: (tab: string) => void;
}

export interface QuizWelcomeProps {
  setShowSettings: (show: boolean) => void;
  handleStartQuiz: () => void;
}

export interface QuizSettingsProps {
  topics: string[];
  selectedTopics: string[];
  handleTopicChange: (topic: string) => void;
  subjects: any[];
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

export interface ActiveQuizProps {
  quiz: any;
  filteredQuestions: any[];
  questionCount: number;
  userConfidence: number;
  handleConfidenceChange: (value: number) => void;
}
