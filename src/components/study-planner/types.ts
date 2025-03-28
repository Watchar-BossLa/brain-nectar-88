
export interface StudySession {
  id: string;
  title: string;
  date: Date;
  duration: number;
  topic: string;
  completed: boolean;
}

export interface StudyTopic {
  value: string;
  label: string;
}

export interface StudyStatistics {
  totalSessionsCount: number;
  completedSessionsCount: number;
  completionPercentage: number;
  totalMinutes: number;
  completedMinutes: number;
  upcomingSessions: StudySession[];
}

export interface StudyPlanOptions {
  startDate: Date;
  examDate?: Date;
  studyHoursPerWeek: number;
  priorityTopics: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  dailyStudyMinutes?: number;
}

export interface StudyPlanResponse {
  success: boolean;
  schedule?: any;
  sessions?: StudySession[];
  error?: string;
}
