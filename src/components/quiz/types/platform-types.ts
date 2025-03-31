
export interface QuizSettingsProps {
  topics: string[];
  selectedTopics: string[];
  handleTopicChange: (topic: string) => void;
  subjects: string[];
  selectedSubjects: string[];
  handleSubjectChange: (subject: string) => void;
  questionCount: number;
  handleQuestionCountChange: (value: string) => void;
  initialDifficulty: number;
  handleDifficultyChange: (value: string) => void;
  showSettings?: boolean;
  setShowSettings?: (show: boolean) => void;
  handleStartQuiz?: () => void;
}

export interface QuizWelcomeProps {
  setShowSettings: (show: boolean) => void;
  handleStartQuiz: () => void;
}

export interface QuizAnalyticsProps {
  sessionId?: string;
  userId?: string;
  quizResults?: any;
}

export interface SocialTabProps {
  userId?: string;
  sessionId?: string;
  quizResults?: any;
}

export interface FormulasTabProps {
  subject?: string;
  topics?: string[];
}
