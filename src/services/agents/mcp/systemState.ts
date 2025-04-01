
import { SystemState, AgentType } from '../types';

/**
 * SystemStateManager
 * 
 * Manages the state of the multi-agent system
 */
export class SystemStateManager {
  private systemState: SystemState;
  private stateUpdateCallback?: (state: SystemState) => void;
  
  constructor(registeredAgents: AgentType[]) {
    // Initialize the system state with default values
    this.systemState = {
      activeAgents: registeredAgents,
      globalVariables: {},
      metrics: {
        taskSuccessRate: 0.98,
        averageProcessingTime: 150,
        systemLoad: 0.25,
        taskCompletionRate: 0.95,  // Now included in the type
        averageResponseTime: 200,  // Now included in the type
        userSatisfactionScore: 0.9  // Now included in the type
      },
      priorityMatrix: {},
      taskQueue: 0,
      processingTasks: 0,
      completedTasks: 0,
      failedTasks: 0,
      systemStatus: 'READY',
      lastUpdated: new Date().toISOString()
    };
  }
  
  /**
   * Get the current system state
   */
  public getSystemState(): SystemState {
    return { ...this.systemState };
  }
  
  /**
   * Update the system metrics
   */
  public updateMetrics(success: boolean): void {
    const metrics = this.systemState.metrics;
    
    // Update metrics based on task success/failure
    this.systemState = {
      ...this.systemState,
      metrics: {
        ...metrics,
        taskSuccessRate: success ? 
          metrics.taskSuccessRate * 0.9 + 0.1 : 
          metrics.taskSuccessRate * 0.9,
        systemLoad: Math.min(0.95, metrics.systemLoad + 0.05),
        taskCompletionRate: success ? 
          metrics.taskCompletionRate * 0.9 + 0.1 : 
          metrics.taskCompletionRate * 0.9
      },
      lastUpdated: new Date().toISOString()
    };
    
    if (this.stateUpdateCallback) {
      this.stateUpdateCallback(this.systemState);
    }
  }
  
  /**
   * Set a global variable in the system state
   */
  public setGlobalVariable(key: string, value: any): void {
    this.systemState.globalVariables = {
      ...this.systemState.globalVariables,
      [key]: value
    };
    
    if (this.stateUpdateCallback) {
      this.stateUpdateCallback(this.systemState);
    }
  }
  
  /**
   * Set a callback to be triggered when the state updates
   */
  public setStateUpdateCallback(callback: (state: SystemState) => void): void {
    this.stateUpdateCallback = callback;
  }
}
