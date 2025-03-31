
export interface ScoreSummaryProps {
  score?: number;
  correctCount?: number;
  totalCount?: number;
}

export interface PerformanceByTopicProps {
  topicStats?: Record<string, { total: number; correct: number }>;
  performanceByTopic?: Record<string, { total: number; correct: number }>;
}

export interface PerformanceByDifficultyProps {
  difficultyStats?: Record<number, { total: number; correct: number }>;
  performanceByDifficulty?: Record<string, { total: number; correct: number }>;
}
