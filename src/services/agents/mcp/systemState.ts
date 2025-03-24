
import { AgentType, SystemState } from '../types';

/**
 * SystemStateManager
 * 
 * Manages the system state including active agents, metrics, and global variables.
 */
export class SystemStateManager {
  private systemState: SystemState;

  constructor(activeAgents: AgentType[]) {
    this.systemState = {
      activeAgents,
      metrics: {
        taskCompletionRate: 0,
        averageResponseTime: 0,
        userSatisfactionScore: 0,
      },
      priorityMatrix: {},
      globalVariables: {},
    };
  }

  /**
   * Get the current system state
   */
  public getSystemState(): SystemState {
    return { ...this.systemState };
  }

  /**
   * Update system metrics based on task outcomes
   */
  public updateMetrics(success: boolean): void {
    // This is a simplified metrics update
    // In a real system, this would be much more sophisticated
    
    // Update task completion rate
    const currentRate = this.systemState.metrics.taskCompletionRate;
    const newRate = success
      ? currentRate + (1 - currentRate) * 0.1  // Slight increase for success
      : currentRate - currentRate * 0.1;       // Slight decrease for failure
    
    this.systemState.metrics.taskCompletionRate = Math.max(0, Math.min(1, newRate));
  }

  /**
   * Set a global variable in the system state
   */
  public setGlobalVariable(key: string, value: any): void {
    this.systemState.globalVariables[key] = value;
  }

  /**
   * Get a global variable from the system state
   */
  public getGlobalVariable(key: string): any {
    return this.systemState.globalVariables[key];
  }
}
