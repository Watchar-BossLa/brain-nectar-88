
export interface ScoreSummaryProps {
  score: number;
  correctCount: number;
  totalCount: number;
}

export interface PerformanceByTopicProps {
  topicStats?: Record<string, { total: number; correct: number }>;
  performanceByTopic?: Record<string, { total: number; correct: number }>;
}

export interface PerformanceByDifficultyProps {
  difficultyStats?: Record<number, { total: number; correct: number }>;
  performanceByDifficulty?: Record<string, { total: number; correct: number }>;
}

export interface QuestionFeedback {
  questionId: string;
  feedback: string;
  rating: number;
  timestamp: string;
  userId?: string;
  questionText?: string;
  feedbackType?: string;  // Added this property
  feedbackText?: string;  // Added this property
  createdAt?: string;     // Added this property
}

export interface ScoreDataItem {
  name: string;
  score: number;
  average: number;
  color?: string;
}
