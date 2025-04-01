
import { AgentTask, AgentType, TaskType } from '@/services/agents/types';

/**
 * System state interface for multi-agent system
 */
export interface AgentSystemState {
  activeAgents: Record<AgentType, boolean>;
  taskQueue: any[];
  completedTasks: any[];
  metrics: {
    completedTasks: number;
    averageResponseTime: number;
    successRate: number;
    taskCompletionRate: number;
    userSatisfactionScore?: number;
  };
  globalVariables: Record<string, any>;
  priorityMatrix: Record<string, number>;
  lastUpdated: string;
}

/**
 * Task submission options
 */
export interface TaskSubmissionOptions {
  userId?: string;
  priority?: string;
  metadata?: Record<string, any>;
}
