
export enum TaskCategory {
  ASSESSMENT = 'assessment',
  CONTENT_REVIEW = 'content_review',
  LEARNING_PATH = 'learning_path',
  FLASHCARD_GENERATION = 'flashcard_generation',
  TUTORING = 'tutoring',
  SYSTEM = 'system'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum TaskStatus {
  CREATED = 'created',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export interface Task {
  id: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  description: string;
  payload?: Record<string, any>;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  result?: Record<string, any>;
}

export interface TaskResult {
  success: boolean;
  data?: Record<string, any>;
  error?: string;
}
