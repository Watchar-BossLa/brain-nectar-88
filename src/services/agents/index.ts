
import { AgentTask, TaskType } from './types';
import { mcp } from './mcp';
import { initializeLLMSystem } from '../llm';

// Re-export the TaskType
export type { TaskType };

// Define task types for the system
export const TaskTypes = {
  LEARNING_PATH_GENERATION: 'LEARNING_PATH_GENERATION' as TaskType,
  TOPIC_MASTERY_ASSESSMENT: 'TOPIC_MASTERY_ASSESSMENT' as TaskType,
  LEARNING_PATH_UPDATE: 'LEARNING_PATH_UPDATE' as TaskType,
};

// Mock implementation for the missing functions
const generateLearningPath = async (userId: string, taskData: any) => {
  console.log(`Generating learning path for user ${userId}`);
  return { success: true, path: { modules: [], topics: [] } };
};

const assessTopicMastery = async (userId: string, taskData: any) => {
  console.log(`Assessing topic mastery for user ${userId}`);
  return { success: true, masteryLevel: 0.75 };
};

// Implement a simple task queue
const submitTaskToQueue = async (
  userId: string, 
  taskType: TaskType, 
  description: string, 
  taskData: any, 
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
) => {
  console.log(`Task added to queue: ${taskType} for user ${userId}`);
  
  // Create a task object
  const task: AgentTask = {
    id: `task-${Date.now()}`,
    userId,
    taskType,
    description,
    priority: priority as any, // Cast to support the TaskPriority type
    context: [taskType.toLowerCase()],
    data: taskData,
    createdAt: new Date().toISOString(),
  };
  
  // Submit the task to the MCP
  await mcp.submitTask(task);
};

// Simple handlers for the task types
const taskHandlers: { [key in TaskType]?: (userId: string, taskData: any) => Promise<any> } = {
  [TaskTypes.LEARNING_PATH_GENERATION]: generateLearningPath,
  [TaskTypes.TOPIC_MASTERY_ASSESSMENT]: assessTopicMastery,
  [TaskTypes.LEARNING_PATH_UPDATE]: generateLearningPath,
};

// Initialize the LLM orchestration system
let llmInitialized = false;

const initializeLLM = async () => {
  if (!llmInitialized) {
    try {
      await initializeLLMSystem();
      llmInitialized = true;
      console.log('LLM orchestration system initialized from MultiAgentSystem');
    } catch (error) {
      console.error('Failed to initialize LLM system:', error);
    }
  }
};

// Export the MultiAgentSystem interface
export const MultiAgentSystem = {
  initialize: async (userId: string) => {
    console.log(`Multi-Agent System initializing for user: ${userId}`);
    // Initialize MCP for this user
    await mcp.initializeForUser(userId);
    
    // Initialize LLM orchestration system
    await initializeLLM();
    
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
  
  enableLLMOrchestration: (enabled: boolean): void => {
    mcp.setLLMOrchestrationEnabled(enabled);
    console.log(`LLM orchestration ${enabled ? 'enabled' : 'disabled'}`);
  },
  
  isLLMOrchestrationEnabled: (): boolean => {
    return mcp.isLLMOrchestrationEnabled();
  }
};
