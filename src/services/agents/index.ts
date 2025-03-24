
import { mcp } from './mcp';
import { AgentTask, AgentType, TaskType } from './types';

/**
 * Multi-Agent System Service
 * 
 * Provides simplified access to the autonomous multi-agent system.
 * This is the main entry point for components to interact with the agent system.
 */
export const MultiAgentSystem = {
  /**
   * Initialize the multi-agent system for a user
   */
  initialize: async (userId: string): Promise<void> => {
    return mcp.initializeForUser(userId);
  },
  
  /**
   * Submit a task to the multi-agent system
   */
  submitTask: async (
    userId: string,
    taskType: TaskType,
    description: string,
    data: Record<string, any> = {},
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM',
    targetAgents?: AgentType[]
  ): Promise<void> => {
    const task: AgentTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      userId,
      taskType,
      description,
      priority,
      targetAgentTypes: targetAgents,
      context: [taskType.toLowerCase()],
      data,
      createdAt: new Date().toISOString()
    };
    
    return mcp.submitTask(task);
  },
  
  /**
   * Get the current system state
   */
  getSystemState: () => {
    return mcp.getSystemState();
  },
  
  /**
   * Task type constants for easier use
   */
  TaskTypes: {
    COGNITIVE_PROFILING: 'COGNITIVE_PROFILING' as TaskType,
    LEARNING_PATH_GENERATION: 'LEARNING_PATH_GENERATION' as TaskType,
    CONTENT_ADAPTATION: 'CONTENT_ADAPTATION' as TaskType,
    ASSESSMENT_GENERATION: 'ASSESSMENT_GENERATION' as TaskType,
    ENGAGEMENT_OPTIMIZATION: 'ENGAGEMENT_OPTIMIZATION' as TaskType,
    FEEDBACK_GENERATION: 'FEEDBACK_GENERATION' as TaskType,
    UI_OPTIMIZATION: 'UI_OPTIMIZATION' as TaskType,
    SCHEDULE_OPTIMIZATION: 'SCHEDULE_OPTIMIZATION' as TaskType,
    MULTI_AGENT_COORDINATION: 'MULTI_AGENT_COORDINATION' as TaskType
  }
};

// Export the MCP for direct access if needed
export { mcp };

// Export types for use in components
export * from './types';
