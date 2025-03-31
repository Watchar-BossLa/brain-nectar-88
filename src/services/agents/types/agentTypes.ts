
// Agent-related types
export enum AgentType {
  COGNITIVE_PROFILE = 'COGNITIVE_PROFILE',
  LEARNING_PATH = 'LEARNING_PATH',
  CONTENT_ADAPTATION = 'CONTENT_ADAPTATION',
  ASSESSMENT = 'ASSESSMENT',
  SCHEDULING = 'SCHEDULING',
  UI_UX = 'UI_UX',
  ENGAGEMENT = 'ENGAGEMENT',
  FEEDBACK = 'FEEDBACK'
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export enum TaskType {
  GENERATE_COGNITIVE_PROFILE = 'GENERATE_COGNITIVE_PROFILE',
  UPDATE_COGNITIVE_PROFILE = 'UPDATE_COGNITIVE_PROFILE',
  GENERATE_LEARNING_PATH = 'GENERATE_LEARNING_PATH',
  ADAPT_CONTENT = 'ADAPT_CONTENT',
  GENERATE_ASSESSMENT = 'GENERATE_ASSESSMENT',
  GRADE_ASSESSMENT = 'GRADE_ASSESSMENT',
  GENERATE_STUDY_SCHEDULE = 'GENERATE_STUDY_SCHEDULE',
  OPTIMIZE_UI = 'OPTIMIZE_UI',
  TRACK_ENGAGEMENT = 'TRACK_ENGAGEMENT',
  PROCESS_FEEDBACK = 'PROCESS_FEEDBACK'
}

export interface Task {
  id: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  data: any;
}

export interface AgentTask {
  id: string;
  userId: string;
  taskType: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  targetAgentTypes: AgentType[];
  assignedAgentId?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  context: any;
  data: any;
}

export interface AgentMessage {
  id: string;
  type: string;
  data: any;
  senderId: string;
  recipientId: string;
  timestamp: string;
}

export interface SystemState {
  agents: Record<string, any>;
  tasks: Record<string, AgentTask>;
  metrics: {
    completedTasks: number;
    averageResponseTime: number;
    successRate: number;
  };
  globalVariables: Record<string, any>;
}

export interface CognitiveProfile {
  userId: string;
  learningStyle: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  optimalStudyDuration: number;
  retentionLevel: number;
  studyPatterns: Record<string, any>;
  preferredContentFormats: string[];
  knowledgeGraph: Record<string, any>;
  learningSpeed: string;
  lastUpdated: string;
}
