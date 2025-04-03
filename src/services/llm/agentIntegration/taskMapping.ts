
import { TaskCategory, TaskType } from '@/types/enums';
import { TaskTypeMapping } from './types';

/**
 * Map agent task type to LLM task category
 */
export const taskTypeToCategory: TaskTypeMapping = {
  [TaskType.COGNITIVE_PROFILING]: TaskCategory.REASONING,
  [TaskType.LEARNING_PATH_GENERATION]: TaskCategory.REASONING,
  [TaskType.CONTENT_ADAPTATION]: TaskCategory.CONTENT_CREATION,
  [TaskType.ASSESSMENT_GENERATION]: TaskCategory.QUESTION_ANSWERING,
  [TaskType.ENGAGEMENT_OPTIMIZATION]: TaskCategory.REASONING,
  [TaskType.FEEDBACK_GENERATION]: TaskCategory.TEXT_GENERATION,
  [TaskType.UI_OPTIMIZATION]: TaskCategory.REASONING,
  [TaskType.SCHEDULE_OPTIMIZATION]: TaskCategory.REASONING,
  [TaskType.FLASHCARD_OPTIMIZATION]: TaskCategory.CONTENT_CREATION
};

/**
 * Map agent task type to LLM task category
 * @param taskType The agent task type
 * @returns The corresponding LLM task category
 */
export function mapAgentTaskToLLMCategory(taskType: string): TaskCategory {
  return taskTypeToCategory[taskType as TaskType] || TaskCategory.TEXT_GENERATION;
}
