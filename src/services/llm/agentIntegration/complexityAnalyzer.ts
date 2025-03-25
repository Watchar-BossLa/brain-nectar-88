
import { AgentTask } from './types';

/**
 * Analyze task complexity based on various factors
 * @param task The agent task to analyze
 * @returns A complexity score between 0 and 1
 */
export function deriveTaskComplexity(task: AgentTask): number {
  // Higher priority tasks are typically more complex
  const priorityFactor = task.priority === 'CRITICAL' ? 0.9 : 
                      task.priority === 'HIGH' ? 0.7 : 
                      task.priority === 'MEDIUM' ? 0.5 : 0.3;
  
  // The more context provided, the more complex the task might be
  const contextFactor = Math.min(0.1 * task.context.length, 0.5);
  
  // If task data is extensive, complexity increases
  const dataComplexity = Object.keys(task.data).length > 5 ? 0.2 : 0.1;
  
  // Combine factors with weights
  let complexity = (priorityFactor * 0.5) + (contextFactor * 0.3) + (dataComplexity * 0.2);
  
  // Ensure complexity is between 0 and 1
  return Math.min(Math.max(complexity, 0), 1);
}
