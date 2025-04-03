
export interface ScoreSummaryProps {
  score: number;
  correctCount: number;
  totalCount: number;
}

export interface PerformanceByTopicProps {
  topics: Record<string, { total: number; correct: number }>;
}

export interface PerformanceByDifficultyProps {
  difficulties: Record<string | number, { total: number; correct: number }>;
}
