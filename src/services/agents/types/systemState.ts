
/**
 * System State Interface
 * 
 * Represents the current state of the agent system
 */
export interface SystemState {
  activeAgents: import('./agentTypes').AgentType[];
  globalVariables: Record<string, any>;
  metrics: {
    taskCompletionRate?: number;
    averageResponseTime?: number;
    userSatisfactionScore?: number;
    taskSuccessRate: number;
    averageProcessingTime: number;
    systemLoad: number;
  };
  priorityMatrix: Record<string, any>;
  taskQueue?: number;
  processingTasks?: number;
  completedTasks?: number;
  failedTasks?: number;
  systemStatus?: 'INITIALIZING' | 'READY' | 'DEGRADED' | 'ERROR';
  lastUpdated?: string;
}
