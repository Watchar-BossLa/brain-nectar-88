
import { AgentTask, TaskPriorityEnum } from '../types';

/**
 * TaskQueue
 * 
 * Handles the prioritization and management of tasks in the queue.
 */
export class TaskQueue {
  private taskQueue: AgentTask[] = [];

  /**
   * Add task to queue with appropriate priority ordering
   */
  public addTask(task: AgentTask): void {
    // If task has no priority specified, default to MEDIUM
    if (!task.priority) {
      task.priority = TaskPriorityEnum.MEDIUM;
    }
    
    // Priority order: CRITICAL > HIGH > MEDIUM > LOW
    const priorityValues = { 
      [TaskPriorityEnum.CRITICAL]: 0, 
      [TaskPriorityEnum.HIGH]: 1, 
      [TaskPriorityEnum.MEDIUM]: 2, 
      [TaskPriorityEnum.LOW]: 3 
    };
    
    // Find the right position based on priority
    const insertIndex = this.taskQueue.findIndex(
      queuedTask => priorityValues[queuedTask.priority || TaskPriorityEnum.MEDIUM] > priorityValues[task.priority || TaskPriorityEnum.MEDIUM]
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
   * Check if there are any tasks in the queue
   */
  public isEmpty(): boolean {
    return this.taskQueue.length === 0;
  }

  /**
   * Get the number of tasks in the queue
   */
  public size(): number {
    return this.taskQueue.length;
  }
}
