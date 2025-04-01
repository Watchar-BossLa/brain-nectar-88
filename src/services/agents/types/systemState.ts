
import { AgentType } from './agentTypes';

/**
 * System state definition for the multi-agent system
 */
export interface SystemState {
  activeAgents: AgentType[];
  globalVariables: Record<string, any>;
  metrics: SystemMetrics;
  priorityMatrix: Record<string, number>;
  taskQueue: number;
  processingTasks: number;
  completedTasks: number;
  failedTasks: number;
  systemStatus: 'INITIALIZING' | 'READY' | 'BUSY' | 'ERROR' | 'OFFLINE';
  lastUpdated: string;
}

/**
 * System metrics for monitoring
 */
export interface SystemMetrics {
  taskSuccessRate: number;
  averageProcessingTime: number;
  systemLoad: number;
  [key: string]: number;
}
