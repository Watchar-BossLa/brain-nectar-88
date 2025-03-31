
export interface ScoreSummaryProps {
  score?: number;
  correctCount?: number;
  totalCount?: number;
  // For backward compatibility
  score?: number;
  correctCount?: number;
  totalCount?: number;
}

export interface PerformanceByTopicProps {
  topicStats?: Record<string, { total: number; correct: number }>;
  performanceByTopic?: Record<string, { total: number; correct: number }>;
  // For backward compatibility
  topicStats?: Record<string, { total: number; correct: number }>;
}

export interface PerformanceByDifficultyProps {
  difficultyStats?: Record<number, { total: number; correct: number }>;
  performanceByDifficulty?: Record<string, { total: number; correct: number }>;
  // For backward compatibility
  difficultyStats?: Record<number, { total: number; correct: number }>;
}

export interface QuestionFeedback {
  questionId: string;
  feedback: string;
  rating: number;
  timestamp: string;
  userId?: string;
  questionText?: string;
}

export interface ScoreDataItem {
  name: string;
  score: number;
  average: number;
}
