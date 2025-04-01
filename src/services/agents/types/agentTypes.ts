
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

export interface Task {
  id: string;
  agentId: string;
  goalId: string;
  name: string;
  description: string;
  category: TaskCategory;
  priority: number;
  status: TaskStatus;
  context: Record<string, any>;
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
