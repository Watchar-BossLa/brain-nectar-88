import { Task, TaskCategory, TaskStatus } from '../types/taskTypes';
import { agentRegistry } from './agentRegistry';
import { supabase } from '@/integrations/supabase/client';

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
    
    // Process the task with the agent
    agent.processTask(task);
    
    // Update the task in the database
    await supabase
      .from('agent_tasks')
      .update({ 
        assigned_to: agent.id,
        status: TaskStatus.ASSIGNED,
        updated_at: new Date().toISOString()
      })
      .eq('id', task.id);
    
    return agent.id;
  } catch (error) {
    console.error('Error assigning task:', error);
    return null;
  }
};

/**
 * Process task result and update the database
 */
export const processTaskResult = async (taskId: string, result: any): Promise<boolean> => {
  try {
    // Update the task in the database with the result
    await supabase
      .from('agent_tasks')
      .update({
        status: TaskStatus.COMPLETED,
        result: result,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId);
      
    return true;
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
    // Update the task in the database with the failure status
    await supabase
      .from('agent_tasks')
      .update({
        status: TaskStatus.FAILED,
        result: { success: false, error: error },
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId);
      
    return true;
  } catch (updateError) {
    console.error('Error marking task as failed:', updateError);
    return false;
  }
};
