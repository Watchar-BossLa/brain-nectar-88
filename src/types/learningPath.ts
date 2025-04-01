
export interface LearningPath {
  id: string;
  name: string;
  description: string;
  topics: LearningPathTopic[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  progress?: number;
}

export interface LearningPathTopic {
  id: string;
  name: string;
  description: string;
  resources: LearningResource[];
  quizzes: Quiz[];
  order: number;
  completed?: boolean;
}

export interface LearningResource {
  id: string;
  title: string;
  type: 'video' | 'article' | 'document' | 'interactive';
  url: string;
  durationMinutes?: number;
  completed?: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  completed?: boolean;
  score?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
}

export interface LearningPathRecommendation {
  pathId: string;
  pathName: string;
  confidence: number;
  reason: string;
  topics: string[];
}

export interface UserLearningProgress {
  userId: string;
  pathId: string;
  progress: number;
  startedAt: string;
  lastAccessedAt: string;
  completedTopics: string[];
  quizScores: Record<string, number>;
}
