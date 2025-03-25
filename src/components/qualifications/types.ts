
export interface QualificationType {
  id: string;
  name: string;
  fullName: string;
  description: string;
  levels: string[];
  totalExams: number;
  examsPassed?: number;
  startedDate?: string;
  expectedCompletion?: string;
  activeStudents: number;
  status: 'in-progress' | 'not-started' | 'completed';
  color: string;
}

export interface QualificationModule {
  code: string;
  name: string;
  status: 'passed' | 'in-progress' | 'scheduled' | 'not-started';
  topics?: QualificationTopic[];
}

export interface QualificationTopic {
  id: string;
  name: string;
  weight: number;
}

export interface QualificationLevel {
  level: string;
  modules: QualificationModule[];
}
