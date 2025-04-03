
/**
 * Generate a unique task ID with optional prefix
 * 
 * @param prefix The prefix for the task ID
 * @returns A unique task ID
 */
export function generateTaskId(prefix: string): string {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 9);
  return `${prefix}-${timestamp}-${randomPart}`;
}

/**
 * Generate a unique ID for a subtask in a task chain
 * 
 * @param baseTaskId The base task ID
 * @param subtaskName The name of the subtask
 * @returns A unique subtask ID
 */
export function generateSubtaskId(baseTaskId: string, subtaskName: string): string {
  return `${baseTaskId}-${subtaskName}`;
}
