
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
  learningStyle: string;
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

export type TaskType =
  | 'CREATE_LEARNING_PATH'
  | 'ADAPT_CONTENT'
  | 'GENERATE_ASSESSMENT'
  | 'PROVIDE_FEEDBACK'
  | 'SCHEDULE_STUDY'
  | 'PROFILE_USER'
  | 'OPTIMIZE_UI'
  | 'INCREASE_ENGAGEMENT';

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Additional model types

export interface ModelType {
  id: string;
  name: string;
  provider: string;
  capabilities: string[];
  version: string;
  maxTokens: number;
  trainingCutoff: string;
  apiEndpoint?: string;
  resourceRequirements?: {
    cpuUsage: number;
    memoryUsage: number;
    gpuUsage?: number;
  };
  defaultParameters?: {
    temperature: number;
    topP: number;
    presencePenalty: number;
    frequencyPenalty: number;
  };
}

export interface ModelEvaluation {
  modelId: string;
  accuracy: number;
  latency: number;
  costEfficiency: number;
  resourceEfficiency: number;
  f1Score?: number;
  userSatisfaction?: number;
}
