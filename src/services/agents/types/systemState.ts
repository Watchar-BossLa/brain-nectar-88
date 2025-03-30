
import { AgentType } from './agentTypes';

export interface SystemState {
  activeAgents: AgentType[];
  taskQueue?: number;
  completedTasks?: number;
  failedTasks?: number;
  uptime?: number;
  globalVariables: Record<string, any>;
  lastUpdated?: string;
  metrics?: {
    taskCompletionRate: number;
    averageResponseTime: number;
    userSatisfactionScore: number;
  };
  priorityMatrix?: Record<string, number>;
}
