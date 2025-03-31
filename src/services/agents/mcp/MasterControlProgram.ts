
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { Task, TaskCategory, TaskPriority, TaskStatus } from '../types/taskTypes';
import { agentRegistry } from './agentRegistry';
import { assignTaskToAgent } from './taskProcessor';

// In-memory store for tasks since agent_tasks table doesn't exist
const inMemoryTasks: Record<string, Task> = {};

export class MasterControlProgram {
  private isEnabled: boolean = false;
  
  constructor() {
    console.log('MasterControlProgram initialized');
  }

  public async initialize(): Promise<void> {
    // Initialize the system state
    this.isEnabled = true;
    console.log('MasterControlProgram enabled');
  }

  public setLLMOrchestrationEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    console.log(`MasterControlProgram ${enabled ? 'enabled' : 'disabled'}`);
  }
  
  public isLLMOrchestrationEnabled(): boolean {
    return this.isEnabled;
  }

  public getSystemState(): Record<string, any> {
    return {
      isEnabled: this.isEnabled,
      agents: agentRegistry.getAllAgents().map(agent => ({
        id: agent.id,
        type: agent.getType(),
      })),
      tasksCount: Object.keys(inMemoryTasks).length
    };
  }

  public async submitTask(
    category: TaskCategory,
    description: string,
    payload?: Record<string, any>,
    priority: TaskPriority = TaskPriority.MEDIUM
  ): Promise<string | null> {
    if (!this.isEnabled) {
      console.warn('MasterControlProgram is disabled. Task not submitted.');
      return null;
    }
    
    try {
      const taskId = uuidv4();
      const now = new Date().toISOString();
      
      const task: Task = {
        id: taskId,
        category,
        priority,
        status: TaskStatus.CREATED,
        description,
        payload,
        createdAt: now,
        updatedAt: now,
      };
      
      // Store task in memory
      inMemoryTasks[taskId] = task;
      
      console.log('Creating task:', task);
      
      // Assign the task to an agent
      const agentId = await assignTaskToAgent(task);
      
      if (!agentId) {
        console.warn('No agent available to process this task');
        return null;
      }
      
      return taskId;
    } catch (error) {
      console.error('Error submitting task:', error);
      return null;
    }
  }

  public async getTaskStatus(taskId: string): Promise<TaskStatus | null> {
    if (!this.isEnabled) {
      console.warn('MasterControlProgram is disabled. Cannot get task status.');
      return null;
    }
    
    try {
      // Check in-memory tasks
      const task = inMemoryTasks[taskId];
      if (task) {
        return task.status;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting task status:', error);
      return null;
    }
  }

  public async getTaskResult(taskId: string): Promise<Record<string, any> | null> {
    if (!this.isEnabled) {
      console.warn('MasterControlProgram is disabled. Cannot get task result.');
      return null;
    }
    
    try {
      // Check in-memory tasks
      const task = inMemoryTasks[taskId];
      if (task) {
        return task.result || null;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting task result:', error);
      return null;
    }
  }
  
  public async completeTask(taskId: string, result: Record<string, any>): Promise<boolean> {
    if (!this.isEnabled) {
      console.warn('MasterControlProgram is disabled. Cannot complete task.');
      return false;
    }
    
    try {
      // Check in-memory tasks
      const task = inMemoryTasks[taskId];
      if (task) {
        task.status = TaskStatus.COMPLETED;
        task.result = result;
        task.completedAt = new Date().toISOString();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error completing task:', error);
      return false;
    }
  }
}

// Export a singleton instance
export const masterControlProgram = new MasterControlProgram();
