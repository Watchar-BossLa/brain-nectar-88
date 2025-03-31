import { supabase } from '@/integrations/supabase/client';
import { Task, TaskCategory, TaskStatus } from '../types/taskTypes';
import { agentRegistry } from './agentRegistry';
import { v4 as uuidv4 } from 'uuid';

export class MasterControlProgram {
  private static instance: MasterControlProgram;
  private isRunning: boolean = false;
  private taskCheckInterval: number = 5000; // 5 seconds
  private intervalId?: NodeJS.Timeout;

  private constructor() {}

  public static getInstance(): MasterControlProgram {
    if (!MasterControlProgram.instance) {
      MasterControlProgram.instance = new MasterControlProgram();
    }
    return MasterControlProgram.instance;
  }

  public start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.intervalId = setInterval(() => this.checkForTasks(), this.taskCheckInterval);
    console.log('MCP started and checking for tasks');
  }

  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.isRunning = false;
    console.log('MCP stopped');
  }

  public registerAgentTypes(): string[] {
    // Return array of registered agent types
    const agents = agentRegistry.getAllAgents();
    return Array.from(new Set(agents.map(agent => agent.type || 'unknown')));
  }

  private async checkForTasks(): Promise<void> {
    try {
      // Fetch tasks from the database with status 'created'
      const { data: tasks, error } = await supabase
        .from('agent_tasks')
        .select('*')
        .eq('status', TaskStatus.CREATED);

      if (error) {
        console.error('Error fetching tasks:', error);
        return;
      }

      if (tasks && tasks.length > 0) {
        console.log(`Found ${tasks.length} new tasks`);
        // Process each task
        for (const task of tasks) {
          await this.processTask(task);
        }
      } else {
        //console.log('No new tasks found');
      }
    } catch (error) {
      console.error('Error checking for tasks:', error);
    }
  }

  private async processTask(task: Task): Promise<void> {
    try {
      // Assign the task to an agent
      const agentId = await this.assignTaskToAgent(task);

      if (agentId) {
        console.log(`Task ${task.id} assigned to agent ${agentId}`);
      } else {
        console.warn(`Task ${task.id} could not be assigned`);
        // Update task status to 'failed'
        await supabase
          .from('agent_tasks')
          .update({ status: TaskStatus.FAILED, updated_at: new Date().toISOString() })
          .eq('id', task.id);
      }
    } catch (error) {
      console.error('Error processing task:', error);
      // Update task status to 'failed'
      await supabase
        .from('agent_tasks')
        .update({ status: TaskStatus.FAILED, updated_at: new Date().toISOString() })
        .eq('id', task.id);
    }
  }

  private async assignTaskToAgent(task: Task): Promise<string | null> {
    try {
      // Find agents that can handle this task category
      const agents = agentRegistry.getAgentsByType(task.category);

      if (!agents || agents.length === 0) {
        console.warn(`No agent found for category ${task.category}`);
        return null;
      }

      // For now, just pick the first available agent
      // In a more sophisticated implementation, we could consider agent load, etc.
      const agent = agents[0];

      // Update the task in the database
      await supabase
        .from('agent_tasks')
        .update({ assigned_to: agent.id, status: TaskStatus.ASSIGNED, updated_at: new Date().toISOString() })
        .eq('id', task.id);

      // Process the task with the agent
      agent.processTask(task);
      return agent.id;
    } catch (error) {
      console.error('Error assigning task:', error);
      return null;
    }
  }
}

export const mcp = MasterControlProgram.getInstance();
