
import { AgentTask } from '../types';

/**
 * TaskQueueManager
 * 
 * Manages the task queue with priority-based ordering
 */
export class TaskQueueManager {
  private taskQueue: AgentTask[] = [];

  /**
   * Add task to queue with appropriate priority ordering
   */
  public addTaskToQueue(task: AgentTask): void {
    // If task has no priority specified, default to MEDIUM
    if (!task.priority) {
      task.priority = 'MEDIUM';
    }
    
    // Priority order: CRITICAL > HIGH > MEDIUM > LOW
    const priorityValues = { 'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
    
    // Find the right position based on priority
    const insertIndex = this.taskQueue.findIndex(
      queuedTask => priorityValues[queuedTask.priority || 'MEDIUM'] > priorityValues[task.priority || 'MEDIUM']
    );
    
    if (insertIndex === -1) {
      // Add to the end if no higher priority task is found
      this.taskQueue.push(task);
    } else {
      // Insert at the right position
      this.taskQueue.splice(insertIndex, 0, task);
    }
  }

  /**
   * Get the next task from the queue
   */
  public getNextTask(): AgentTask | undefined {
    return this.taskQueue.shift();
  }

  /**
   * Check if the queue is empty
   */
  public isEmpty(): boolean {
    return this.taskQueue.length === 0;
  }

  /**
   * Get the current length of the queue
   */
  public getQueueLength(): number {
    return this.taskQueue.length;
  }

  /**
   * Clear all tasks from the queue
   */
  public clearQueue(): void {
    this.taskQueue = [];
  }

  /**
   * Get all tasks in the queue (for monitoring purposes)
   */
  public getQueueSnapshot(): AgentTask[] {
    return [...this.taskQueue];
  }

  /**
   * Remove a specific task from the queue by ID
   */
  public removeTaskById(taskId: string): boolean {
    const initialLength = this.taskQueue.length;
    this.taskQueue = this.taskQueue.filter(task => task.id !== taskId);
    return this.taskQueue.length < initialLength;
  }
}
