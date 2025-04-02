
import { Task, TaskStatus } from '../types/taskTypes';
import { agentRegistry } from './agentRegistry';
import { masterControlProgram } from './MasterControlProgram';

// In-memory store for task assignments
const taskAssignments: Record<string, string> = {};

/**
 * Assign a task to the appropriate agent based on category
 */
export const assignTaskToAgent = async (task: Task): Promise<string | null> => {
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
    
    // Store the assignment in memory
    taskAssignments[task.id] = agent.id;
    
    // Process the task with the agent
    agent.processTask(task);
    
    console.log(`Task ${task.id} assigned to agent ${agent.id}`);
    
    return agent.id;
  } catch (error) {
    console.error('Error assigning task:', error);
    return null;
  }
};

/**
 * Process task result and update status
 */
export const processTaskResult = async (taskId: string, result: any): Promise<boolean> => {
  try {
    // Update the task status in the MasterControlProgram
    return await masterControlProgram.completeTask(taskId, result);
  } catch (error) {
    console.error('Error processing task result:', error);
    return false;
  }
};

/**
 * Mark a task as failed
 */
export const markTaskAsFailed = async (taskId: string, error: string): Promise<boolean> => {
  try {
    // For now, just log it
    console.log(`Task ${taskId} failed with error:`, error);
    return true;
  } catch (updateError) {
    console.error('Error marking task as failed:', updateError);
    return false;
  }
};
