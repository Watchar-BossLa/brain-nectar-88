
import { AgentTask } from './types';

/**
 * Construct a prompt from the agent task
 * @param task The agent task to generate a prompt for
 * @returns A formatted prompt string
 */
export function constructPromptFromTask(task: AgentTask): string {
  // Construct a system prompt based on task type
  let systemPrompt = '';
  switch (task.taskType) {
    case 'COGNITIVE_PROFILING':
      systemPrompt = 'You are an expert at cognitive profiling and learning style analysis.';
      break;
    case 'LEARNING_PATH_GENERATION':
      systemPrompt = 'You are an expert educational planner specializing in accounting and professional certification paths.';
      break;
    case 'CONTENT_ADAPTATION':
      systemPrompt = 'You are an expert at adapting educational content to match individual learning needs.';
      break;
    case 'ASSESSMENT_GENERATION':
      systemPrompt = 'You are an expert at creating educational assessments for accounting concepts.';
      break;
    default:
      systemPrompt = 'You are an AI assistant helping with educational tasks related to accounting.';
  }
  
  // Format task data into a string
  const taskDataStr = JSON.stringify(task.data, null, 2);
  
  // Combine everything into a prompt
  const prompt = `${systemPrompt}
  
Task Type: ${task.taskType}
Task Description: ${task.description}
Task Context: ${task.context.join(', ')}
Priority: ${task.priority}
Task Data:
${taskDataStr}

Please provide a detailed response for this task.`;
  
  return prompt;
}
