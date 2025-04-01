
import { AgentTask, TaskStatus } from '../types';

/**
 * TaskMonitor
 * 
 * Utility service to monitor task processing and provide insights
 * for debugging and performance analysis.
 */
export class TaskMonitor {
  private static instance: TaskMonitor;
  private taskHistory: Map<string, TaskProcessingRecord> = new Map();
  private isEnabled: boolean = true;

  /**
   * Get the TaskMonitor singleton instance
   */
  public static getInstance(): TaskMonitor {
    if (!TaskMonitor.instance) {
      TaskMonitor.instance = new TaskMonitor();
    }
    return TaskMonitor.instance;
  }
  
  /**
   * Record the start of task processing
   */
  public recordTaskStart(task: AgentTask): void {
    if (!this.isEnabled) return;
    
    const record: TaskProcessingRecord = {
      taskId: task.id,
      taskType: task.taskType,
      userId: task.userId,
      startTime: Date.now(),
      endTime: null,
      status: task.status || 'pending',
      targetAgents: task.targetAgentTypes,
      events: [
        {
          time: Date.now(),
          event: 'TASK_STARTED',
          details: `Task ${task.id} (${task.taskType}) processing started`
        }
      ]
    };
    
    this.taskHistory.set(task.id, record);
    console.log(`[TaskMonitor] Started monitoring task ${task.id}`);
  }
  
  /**
   * Record a task processing event
   */
  public recordTaskEvent(taskId: string, event: string, details?: any): void {
    if (!this.isEnabled) return;
    
    const record = this.taskHistory.get(taskId);
    if (!record) {
      console.warn(`[TaskMonitor] Attempted to record event for unknown task: ${taskId}`);
      return;
    }
    
    record.events.push({
      time: Date.now(),
      event,
      details: details || event
    });
    
    console.log(`[TaskMonitor] Recorded event for task ${taskId}: ${event}`);
  }
  
  /**
   * Record the completion of task processing
   */
  public recordTaskCompletion(taskId: string, status: TaskStatus, result?: any): void {
    if (!this.isEnabled) return;
    
    const record = this.taskHistory.get(taskId);
    if (!record) {
      console.warn(`[TaskMonitor] Attempted to complete unknown task: ${taskId}`);
      return;
    }
    
    record.endTime = Date.now();
    record.status = status;
    record.result = result;
    
    record.events.push({
      time: Date.now(),
      event: 'TASK_COMPLETED',
      details: `Task ${taskId} completed with status: ${status}`
    });
    
    const duration = record.endTime - record.startTime;
    console.log(`[TaskMonitor] Task ${taskId} completed in ${duration}ms with status: ${status}`);
  }
  
  /**
   * Get processing record for a specific task
   */
  public getTaskRecord(taskId: string): TaskProcessingRecord | undefined {
    return this.taskHistory.get(taskId);
  }
  
  /**
   * Get all task records for a specific user
   */
  public getUserTaskRecords(userId: string): TaskProcessingRecord[] {
    return Array.from(this.taskHistory.values())
      .filter(record => record.userId === userId);
  }
  
  /**
   * Enable or disable task monitoring
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    console.log(`[TaskMonitor] Task monitoring ${enabled ? 'enabled' : 'disabled'}`);
  }
  
  /**
   * Get task processing statistics
   */
  public getProcessingStats(): TaskProcessingStats {
    const records = Array.from(this.taskHistory.values());
    
    const completed = records.filter(r => r.status === 'completed').length;
    const failed = records.filter(r => r.status === 'failed').length;
    const pending = records.filter(r => r.status === 'pending').length;
    const processing = records.filter(r => r.status === 'processing').length;
    
    const durations = records
      .filter(r => r.endTime !== null)
      .map(r => r.endTime! - r.startTime);
    
    const avgDuration = durations.length > 0
      ? durations.reduce((sum, d) => sum + d, 0) / durations.length
      : 0;
    
    return {
      totalTasks: records.length,
      completed,
      failed,
      pending,
      processing,
      successRate: records.length > 0 ? (completed / records.length) : 0,
      averageProcessingTime: avgDuration,
    };
  }
  
  /**
   * Clear old task records to prevent memory leaks
   * (keeps only the most recent N records)
   */
  public cleanupOldRecords(maxRecords: number = 1000): void {
    const records = Array.from(this.taskHistory.entries())
      .sort(([, a], [, b]) => (b.startTime - a.startTime));
      
    if (records.length > maxRecords) {
      const toRemove = records.slice(maxRecords);
      toRemove.forEach(([taskId]) => this.taskHistory.delete(taskId));
      console.log(`[TaskMonitor] Cleaned up ${toRemove.length} old task records`);
    }
  }
}

/**
 * Record of a task's processing history
 */
export interface TaskProcessingRecord {
  taskId: string;
  taskType: string;
  userId: string;
  startTime: number;
  endTime: number | null;
  status: TaskStatus;
  targetAgents: string[];
  events: TaskProcessingEvent[];
  result?: any;
}

/**
 * Event in task processing
 */
export interface TaskProcessingEvent {
  time: number;
  event: string;
  details?: any;
}

/**
 * Task processing statistics
 */
export interface TaskProcessingStats {
  totalTasks: number;
  completed: number;
  failed: number;
  pending: number;
  processing: number;
  successRate: number;
  averageProcessingTime: number;
}

// Export singleton instance
export const taskMonitor = TaskMonitor.getInstance();
