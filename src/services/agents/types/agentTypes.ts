export enum TaskType {
  LEARNING_PATH_GENERATION = 'learning_path_generation',
  COGNITIVE_PROFILING = 'cognitive_profiling',
  SCHEDULE_OPTIMIZATION = 'schedule_optimization',
  ASSESSMENT_GENERATION = 'assessment_generation',
  CONTENT_ADAPTATION = 'content_adaptation',
  ENGAGEMENT_ANALYSIS = 'engagement_analysis',
  FEEDBACK_PROCESSING = 'feedback_processing',
  UI_UX_OPTIMIZATION = 'ui_ux_optimization',
  ANALYSIS = 'analysis',
  CONTENT_GENERATION = 'content_generation',
  ASSESSMENT = 'assessment',
  PLANNING = 'planning',
  FEEDBACK = 'feedback',
  ENGAGEMENT = 'engagement'
}

/**
 * Represents a task in the system.
 */
export interface Task {
  id: string;
  type: TaskType;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  agentId?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

/**
 * Represents a task assigned to an agent.
 */
export interface AgentTask {
  id: string;
  agentId: string;
  taskId: string;
  status: TaskStatus;
  assignedAt: string;
  completedAt?: string;
  results?: any;
}

/**
 * Represents a message exchanged between agents or with the system.
 */
export interface AgentMessage {
  id: string;
  agentId: string;
  taskId: string;
  content: string;
  timestamp: string;
  role: 'system' | 'user' | 'agent';
}

/**
 * Represents the overall state of the multi-agent system.
 */
export interface SystemState {
  tasks: Task[];
  agents: AgentType[];
  globalVariables: Record<string, any>;
  metrics: {
    taskCompletionRate: number;
    averageResponseTime: number;
    userSatisfactionScore: number;
  };
  lastUpdated: string;
}

/**
 * Represents a cognitive profile of a user.
 */
export interface CognitiveProfile {
  id: string;
  userId: string;
  strengths: string[];
  weaknesses: string[];
  learningStyle: string;
  knowledge gaps: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Enum for agent types.
 */
export enum AgentType {
  COGNITIVE_PROFILE = 'COGNITIVE_PROFILE',
  LEARNING_PATH = 'LEARNING_PATH',
  CONTENT_ADAPTATION = 'CONTENT_ADAPTATION',
  ASSESSMENT = 'ASSESSMENT',
  ENGAGEMENT = 'ENGAGEMENT',
  FEEDBACK = 'FEEDBACK',
  UI_UX = 'UI_UX',
  SCHEDULING = 'SCHEDULING'
}

/**
 * Enum for task priorities.
 */
export enum TaskPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

/**
 * Enum for task statuses.
 */
export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  BLOCKED = 'BLOCKED'
}
