
import { AgentTask, AgentType, TaskPriority } from '../types';
import { ContextTag } from '../types/taskTypes';

/**
 * Functions for creating different types of agent tasks
 */

/**
 * Create a learning path generation task
 */
export function createLearningPathTask(userId: string): AgentTask {
  return {
    id: `learning-path-${Date.now()}`,
    userId,
    taskType: 'LEARNING_PATH_GENERATION',
    description: 'Generate initial learning path',
    priority: 'HIGH' as TaskPriority,
    targetAgentTypes: ['LEARNING_PATH', 'COGNITIVE_PROFILE'] as AgentType[],
    context: ['learning_path', 'qualification', 'adaptive'] as ContextTag[],
    data: {},
    createdAt: new Date().toISOString()
  };
}

/**
 * Create a cognitive profiling task
 */
export function createCognitiveProfilingTask(userId: string): AgentTask {
  return {
    id: `cognitive-profile-${Date.now()}`,
    userId,
    taskType: 'COGNITIVE_PROFILING',
    description: 'Create initial cognitive profile',
    priority: 'HIGH' as TaskPriority,
    targetAgentTypes: ['COGNITIVE_PROFILE'] as AgentType[],
    context: ['cognitive_profile', 'qualification', 'adaptive'] as ContextTag[],
    data: {},
    createdAt: new Date().toISOString()
  };
}

/**
 * Create a content adaptation task
 */
export function createContentAdaptationTask(userId: string, topicIds: string[]): AgentTask {
  return {
    id: `content-adaptation-${Date.now()}`,
    userId,
    taskType: 'CONTENT_ADAPTATION',
    description: 'Adapt learning content to user profile',
    priority: 'MEDIUM' as TaskPriority,
    targetAgentTypes: ['CONTENT_ADAPTATION', 'COGNITIVE_PROFILE'] as AgentType[],
    context: ['learning_path', 'cognitive_profile', 'qualification'] as ContextTag[],
    data: {
      topicIds
    },
    createdAt: new Date().toISOString()
  };
}

/**
 * Create an assessment generation task
 */
export function createAssessmentTask(userId: string, topicIds: string[], difficulty: number): AgentTask {
  return {
    id: `assessment-${Date.now()}`,
    userId,
    taskType: 'ASSESSMENT_GENERATION',
    description: 'Generate adaptive assessment',
    priority: 'MEDIUM' as TaskPriority,
    targetAgentTypes: ['ASSESSMENT'] as AgentType[],
    context: ['assessment', 'adaptive', 'difficulty'] as ContextTag[],
    data: {
      topicIds,
      difficulty,
      questionCount: 10
    },
    createdAt: new Date().toISOString()
  };
}

/**
 * Create an engagement optimization task
 */
export function createEngagementTask(userId: string): AgentTask {
  return {
    id: `engagement-${Date.now()}`,
    userId,
    taskType: 'ENGAGEMENT_OPTIMIZATION',
    description: 'Optimize user engagement strategies',
    priority: 'LOW' as TaskPriority,
    targetAgentTypes: ['ENGAGEMENT', 'COGNITIVE_PROFILE'] as AgentType[],
    context: ['engagement', 'user_profile'] as ContextTag[],
    data: {},
    createdAt: new Date().toISOString()
  };
}

/**
 * Create a schedule optimization task
 */
export function createScheduleOptimizationTask(userId: string, options: any): AgentTask {
  return {
    id: `schedule-${Date.now()}`,
    userId,
    taskType: 'SCHEDULE_OPTIMIZATION',
    description: 'Optimize study schedule',
    priority: 'MEDIUM' as TaskPriority,
    targetAgentTypes: ['SCHEDULING'] as AgentType[],
    context: ['schedule', 'optimization', 'study_plan'] as ContextTag[],
    data: {
      options
    },
    createdAt: new Date().toISOString()
  };
}

/**
 * Create a flashcard optimization task
 */
export function createFlashcardOptimizationTask(userId: string, cardIds: string[]): AgentTask {
  return {
    id: `flashcard-${Date.now()}`,
    userId,
    taskType: 'FLASHCARD_OPTIMIZATION',
    description: 'Optimize flashcard spaced repetition',
    priority: 'MEDIUM' as TaskPriority,
    targetAgentTypes: ['SCHEDULING'] as AgentType[],
    context: ['flashcards', 'spaced_repetition', 'optimization'] as ContextTag[],
    data: {
      cardIds
    },
    createdAt: new Date().toISOString()
  };
}
