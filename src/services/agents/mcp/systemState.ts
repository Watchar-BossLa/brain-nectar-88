
import { v4 as uuidv4 } from 'uuid';
import { AgentType, SystemState, Task, TaskPriority, TaskStatus, TaskType } from '../types/agentTypes';

/**
 * Manages the system state for the Multi-Agent System
 */
export class SystemStateManager {
  private state: SystemState;
  
  constructor() {
    // Initialize default system state
    this.state = {
      activeAgents: this.initializeActiveAgents(),
      taskQueue: [],
      completedTasks: [],
      metrics: {
        completedTasks: 0,
        averageResponseTime: 0,
        successRate: 0,
        taskCompletionRate: 0,
        userSatisfactionScore: 0,
      },
      globalVariables: {},
      priorityMatrix: {},
      lastUpdated: new Date().toISOString()
    };
  }

  private initializeActiveAgents(): Record<AgentType, boolean> {
    const activeAgents: Record<AgentType, boolean> = {} as Record<AgentType, boolean>;
    
    // Initialize all agent types as inactive
    Object.values(AgentType).forEach(agentType => {
      activeAgents[agentType] = false;
    });
    
    return activeAgents;
  }
  
  /**
   * Get current system state
   */
  public getState(): SystemState {
    return { ...this.state };
  }
  
  /**
   * Update system state
   */
  public updateState(partialState: Partial<SystemState>): void {
    this.state = {
      ...this.state,
      ...partialState,
      lastUpdated: new Date().toISOString()
    };
  }
  
  /**
   * Mark an agent as active
   */
  public activateAgent(agentType: AgentType): void {
    const activeAgents = { ...this.state.activeAgents };
    activeAgents[agentType] = true;
    this.updateState({ activeAgents });
  }
  
  /**
   * Mark an agent as inactive
   */
  public deactivateAgent(agentType: AgentType): void {
    const activeAgents = { ...this.state.activeAgents };
    activeAgents[agentType] = false;
    this.updateState({ activeAgents });
  }
  
  /**
   * Update metrics after task completion
   */
  public updateMetricsAfterTaskCompletion(
    executionTimeMs: number,
    success: boolean,
    userSatisfactionScore?: number
  ): void {
    const { metrics } = this.state;
    
    const newCompletedTasks = metrics.completedTasks + 1;
    const newSuccessRate = (
      (metrics.successRate * metrics.completedTasks) + (success ? 1 : 0)
    ) / newCompletedTasks;
    
    const newAvgResponseTime = (
      (metrics.averageResponseTime * metrics.completedTasks) + executionTimeMs
    ) / newCompletedTasks;
    
    const updatedMetrics = {
      ...metrics,
      completedTasks: newCompletedTasks,
      averageResponseTime: newAvgResponseTime,
      successRate: newSuccessRate,
      userSatisfactionScore: userSatisfactionScore !== undefined 
        ? userSatisfactionScore 
        : metrics.userSatisfactionScore
    };
    
    this.updateState({ metrics: updatedMetrics });
  }
}

export const systemStateManager = new SystemStateManager();
