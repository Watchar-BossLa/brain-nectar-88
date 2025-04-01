
import { AgentType, SystemMetrics, Task } from '../types';

export class SystemStateManager {
  private globalVariables: Record<string, any> = {};
  private activeAgents: Record<AgentType, boolean> = {
    cognitive_profile: false,
    learning_path: false,
    content_adaptation: false,
    assessment: false,
    engagement: false,
    feedback: false,
    ui_ux: false,
    scheduling: false
  };
  private taskQueue: Task[] = [];
  private completedTasks: Task[] = [];
  private metrics: SystemMetrics = {
    completedTasks: 0,
    averageResponseTime: 0,
    successRate: 0,
    taskCompletionRate: 0
  };
  
  constructor() {
    this.initializeSystem();
  }
  
  private initializeSystem() {
    // Set default values for global variables
    this.globalVariables = {
      systemStatus: 'active',
      userSatisfactionMetric: 0,
      systemLoad: 0,
      activeAgentCount: 0
    };
    
    // Update metrics with default values
    this.updateMetrics();
  }
  
  public getGlobalVariables(): Record<string, any> {
    return { ...this.globalVariables };
  }
  
  public getGlobalVariable(key: string): any {
    return this.globalVariables[key];
  }
  
  public setGlobalVariable(key: string, value: any): void {
    this.globalVariables[key] = value;
  }
  
  public getActiveAgents(): Record<AgentType, boolean> {
    return { ...this.activeAgents };
  }
  
  public setAgentStatus(agentType: AgentType, active: boolean): void {
    this.activeAgents[agentType] = active;
    this.updateActiveAgentCount();
  }
  
  public getSystemMetrics(): SystemMetrics {
    return { ...this.metrics };
  }
  
  public updateMetrics(): void {
    // Calculate real metrics based on task history
    const totalTasks = this.completedTasks.length + this.taskQueue.length;
    
    this.metrics = {
      completedTasks: this.completedTasks.length,
      averageResponseTime: this.calculateAverageResponseTime(),
      successRate: this.calculateSuccessRate(),
      taskCompletionRate: totalTasks > 0 ? this.completedTasks.length / totalTasks : 0
    };
  }
  
  private updateActiveAgentCount(): void {
    let count = 0;
    for (const agentType in this.activeAgents) {
      if (this.activeAgents[agentType as AgentType]) {
        count++;
      }
    }
    this.setGlobalVariable('activeAgentCount', count);
  }
  
  private calculateAverageResponseTime(): number {
    if (this.completedTasks.length === 0) return 0;
    
    // Placeholder for actual calculation
    return 250; // milliseconds
  }
  
  private calculateSuccessRate(): number {
    if (this.completedTasks.length === 0) return 0;
    
    // Placeholder for actual success rate calculation
    // In a real implementation, this would track successful vs. failed tasks
    return 0.95; // 95% success rate
  }
}
