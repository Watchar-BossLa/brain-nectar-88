
import { AgentTask, TaskPriority } from '../types';

/**
 * TaskQueueManager
 * 
 * Manages the queue of tasks to be processed by agents.
 * Implements priority-based queuing.
 */
export class TaskQueueManager {
  // Separate queues for different priority levels
  private highPriorityQueue: AgentTask[] = [];
  private mediumPriorityQueue: AgentTask[] = [];
  private lowPriorityQueue: AgentTask[] = [];
  
  /**
   * Add a task to the appropriate queue based on priority
   */
  public addTaskToQueue(task: AgentTask): void {
    switch (task.priority) {
      case 'HIGH':
      case 'CRITICAL':
        this.highPriorityQueue.push(task);
        break;
      case 'MEDIUM':
        this.mediumPriorityQueue.push(task);
        break;
      case 'LOW':
      default:
        this.lowPriorityQueue.push(task);
        break;
    }
  }
  
  /**
   * Get the next task to process, respecting priorities
   */
  public getNextTask(): AgentTask | null {
    // Check high priority queue first
    if (this.highPriorityQueue.length > 0) {
      return this.highPriorityQueue.shift() || null;
    }
    
    // Then medium priority
    if (this.mediumPriorityQueue.length > 0) {
      return this.mediumPriorityQueue.shift() || null;
    }
    
    // Finally low priority
    if (this.lowPriorityQueue.length > 0) {
      return this.lowPriorityQueue.shift() || null;
    }
    
    // No tasks available
    return null;
  }
  
  /**
   * Check if all queues are empty
   */
  public isEmpty(): boolean {
    return (
      this.highPriorityQueue.length === 0 && 
      this.mediumPriorityQueue.length === 0 && 
      this.lowPriorityQueue.length === 0
    );
  }
  
  /**
   * Get the total number of tasks in all queues
   */
  public getQueueSize(): number {
    return (
      this.highPriorityQueue.length + 
      this.mediumPriorityQueue.length + 
      this.lowPriorityQueue.length
    );
  }
  
  /**
   * Get queue statistics
   */
  public getQueueStats(): { high: number; medium: number; low: number; total: number } {
    return {
      high: this.highPriorityQueue.length,
      medium: this.mediumPriorityQueue.length,
      low: this.lowPriorityQueue.length,
      total: this.getQueueSize()
    };
  }
  
  /**
   * Clear all queues
   */
  public clearAllQueues(): void {
    this.highPriorityQueue = [];
    this.mediumPriorityQueue = [];
    this.lowPriorityQueue = [];
  }
}
