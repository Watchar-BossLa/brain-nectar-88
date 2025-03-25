
import { AgentTask } from './types';
import { TaskCategory } from '../types';
import { performanceMonitoring } from '../performanceMonitoring';
import { mapAgentTaskToLLMCategory } from './taskMapping';

/**
 * Record task execution metrics for performance monitoring
 * @param task The agent task that was executed
 * @param modelId The ID of the model that processed the task
 * @param success Whether the task was processed successfully
 */
export function recordTaskExecution(task: AgentTask, modelId: string, success: boolean): void {
  // Record basic execution metrics
  const taskCategory = mapAgentTaskToLLMCategory(task.taskType);
  
  performanceMonitoring.recordExecution({
    modelId,
    taskId: task.id,
    startTime: Date.now() - 1000, // Approximate start time (1 second ago)
    endTime: Date.now(),
    inputTokens: 500, // Placeholder values
    outputTokens: 300, // Placeholder values
    success,
    errorMessage: success ? undefined : 'Task execution failed'
  });
  
  // Update model performance metrics if successful
  if (success) {
    performanceMonitoring.recordEvaluation(modelId, taskCategory, {
      accuracy: 0.85, // Placeholder values
      userSatisfaction: 0.9  // Placeholder values
    });
  }
}
