
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
