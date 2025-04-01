
// This file contains types for the agent system

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: AgentStatus;
  config: AgentConfig;
  createdAt: string;
  updatedAt: string;
}

export enum AgentStatus {
  ACTIVE = 'ACTIVE',
  IDLE = 'IDLE',
  ERROR = 'ERROR',
  STOPPED = 'STOPPED'
}

export interface AgentConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  globalVariables: Record<string, any>;
  priorityMatrix: Record<string, number>;
}

export interface AgentTask {
  id: string;
  agentId: string;
  goalId: string;
  name: string;
  description: string;
  category: TaskCategory;
  priority: number;
  status: TaskStatus;
  context: Record<string, any>;
  data?: any;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  failureReason?: string;
  type?: string;
}

export enum TaskCategory {
  ASSESSMENT = 'ASSESSMENT',
  CONTENT_CREATION = 'CONTENT_CREATION',
  FEEDBACK = 'FEEDBACK',
  LEARNING_PATH = 'LEARNING_PATH',
  TUTORING = 'TUTORING'
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  BLOCKED = 'BLOCKED'
}

export interface Goal {
  id: string;
  agentId: string;
  name: string;
  description: string;
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  failureReason?: string;
}

export enum GoalStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

// Additional types needed for the agent system based on errors
export interface AgentMessage {
  id: string;
  senderId: string;
  recipientId: string;
  messageId: string;
  content: string;
  type?: string;
  data?: any;
  timestamp: string;
  priority: number;
  messageType?: string;
}

export interface SystemState {
  agents: Record<string, AgentStatus>;
  taskQueue: AgentTask[];
  activeTasks: Record<string, AgentTask>;
  resources: Record<string, number>;
  lastUpdated: string;
}

export interface CognitiveProfile {
  userId: string;
  learningStyle: string | { visual: number; auditory: number; reading: number; kinesthetic: number; };
  strengths: string[];
  weaknesses: string[];
  interests: string[];
  preferredFormats: string[];
  attention: number;
  retention: number;
  motivation: number;
  updatedAt?: Date;
  lastUpdated?: Date;
}

export type AgentType = 
  | 'COGNITIVE_PROFILE'
  | 'LEARNING_PATH'
  | 'UI_UX'
  | 'CONTENT_ADAPTATION'
  | 'ASSESSMENT'
  | 'FEEDBACK'
  | 'ENGAGEMENT'
  | 'SCHEDULING';

export interface Task {
  id: string;
  type: string;
  priority: string;
  status: string;
  data: any;
}

export enum TaskType {
  CREATE_LEARNING_PATH = 'CREATE_LEARNING_PATH',
  ADAPT_CONTENT = 'ADAPT_CONTENT',
  GENERATE_ASSESSMENT = 'GENERATE_ASSESSMENT',
  PROVIDE_FEEDBACK = 'PROVIDE_FEEDBACK',
  SCHEDULE_STUDY = 'SCHEDULE_STUDY',
  PROFILE_USER = 'PROFILE_USER',
  OPTIMIZE_UI = 'OPTIMIZE_UI',
  INCREASE_ENGAGEMENT = 'INCREASE_ENGAGEMENT'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}
