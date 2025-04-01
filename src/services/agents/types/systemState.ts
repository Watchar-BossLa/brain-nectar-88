
import { AgentType } from './agentTypes';

/**
 * System State Interface
 * 
 * Represents the current state of the agent system
 */
export interface SystemState {
  activeAgents: AgentType[];
  globalVariables: Record<string, any>;
  metrics: {
    taskSuccessRate: number;
    averageProcessingTime: number;
    systemLoad: number;
    taskCompletionRate?: number;
    averageResponseTime?: number;
    userSatisfactionScore?: number;
  };
  priorityMatrix: Record<string, any>;
  taskQueue?: number;
  processingTasks?: number;
  completedTasks?: number;
  failedTasks?: number;
  systemStatus?: 'INITIALIZING' | 'READY' | 'DEGRADED' | 'ERROR';
  lastUpdated?: string;
}
