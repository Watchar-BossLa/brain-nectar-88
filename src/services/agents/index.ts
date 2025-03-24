import { generateLearningPath } from './learningPathAgent';
import { assessTopicMastery } from './topicMasteryAgent';
import { TaskType } from './types';
import { submitTask as submitTaskToQueue } from './taskQueue';

export { TaskType };

export const TaskTypes = {
  LEARNING_PATH_GENERATION: 'LEARNING_PATH_GENERATION' as TaskType,
  TOPIC_MASTERY_ASSESSMENT: 'TOPIC_MASTERY_ASSESSMENT' as TaskType,
  LEARNING_PATH_UPDATE: 'LEARNING_PATH_UPDATE' as TaskType,
};

const taskHandlers: { [key in TaskType]: (userId: string, taskData: any) => Promise<any> } = {
  [TaskTypes.LEARNING_PATH_GENERATION]: generateLearningPath,
  [TaskTypes.TOPIC_MASTERY_ASSESSMENT]: assessTopicMastery,
  [TaskTypes.LEARNING_PATH_UPDATE]: generateLearningPath, // Assuming learning path generation also handles updates
};

export const MultiAgentSystem = {
  initialize: async (userId: string) => {
    console.log(`Multi-Agent System initializing for user: ${userId}`);
    // Add any initialization logic here, e.g., loading user profile, etc.
    return Promise.resolve();
  },

  submitTask: async (
    userId: string,
    taskType: TaskType,
    description: string,
    taskData: any,
    priority: 'HIGH' | 'MEDIUM' | 'LOW'
  ): Promise<void> => {
    console.log(`Task submitted by user ${userId}: ${taskType} - ${description}`);
    await submitTaskToQueue(userId, taskType, description, taskData, priority);
  },

  processTask: async (userId: string, taskType: TaskType, taskData: any): Promise<any> => {
    console.log(`Processing task for user ${userId}: ${taskType}`);
    const handler = taskHandlers[taskType];

    if (!handler) {
      throw new Error(`No task handler registered for task type: ${taskType}`);
    }

    try {
      return await handler(userId, taskData);
    } catch (error: any) {
      console.error(`Task processing failed for user ${userId} on task ${taskType}:`, error);
      throw error;
    }
  },
};
