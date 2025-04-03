
import { TaskCategory } from '../../../types/enums';
import { TaskTypeMapping } from './types';

/**
 * Map agent task type to LLM task category
 */
export const taskTypeToCategory: TaskTypeMapping = {
  'COGNITIVE_PROFILING': TaskCategory.REASONING,
  'LEARNING_PATH_GENERATION': TaskCategory.REASONING,
  'CONTENT_ADAPTATION': TaskCategory.CONTENT_CREATION,
  'ASSESSMENT_GENERATION': TaskCategory.QUESTION_ANSWERING,
  'ENGAGEMENT_OPTIMIZATION': TaskCategory.REASONING,
  'FEEDBACK_GENERATION': TaskCategory.TEXT_GENERATION,
  'UI_OPTIMIZATION': TaskCategory.REASONING,
  'SCHEDULE_OPTIMIZATION': TaskCategory.REASONING,
  'FLASHCARD_OPTIMIZATION': TaskCategory.CONTENT_CREATION
};

/**
 * Map agent task type to LLM task category
 * @param taskType The agent task type
 * @returns The corresponding LLM task category
 */
export function mapAgentTaskToLLMCategory(taskType: string): TaskCategory {
  return taskTypeToCategory[taskType] || TaskCategory.TEXT_GENERATION;
}
