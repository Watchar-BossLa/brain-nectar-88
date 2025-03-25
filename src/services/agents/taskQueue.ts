
import { AgentTask, TaskType } from './types';
import { mcp } from './mcp';

/**
 * Submit a task to the task queue
 */
export const submitTask = async (
  userId: string,
  taskType: TaskType,
  description: string,
  taskData: any,
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
): Promise<void> => {
  // Create a unique task ID
  const taskId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Create the task object
  const task: AgentTask = {
    id: taskId,
    userId,
    taskType,
    description,
    priority: priority as any, // Casting to support TaskPriority type
    context: [taskType.toLowerCase()],
    data: taskData,
    createdAt: new Date().toISOString(),
    status: 'PENDING'
  };
  
  console.log(`Task submitted to queue: ${task.id}`);
  
  // Submit the task to the Master Control Program
  await mcp.submitTask(task);
};
