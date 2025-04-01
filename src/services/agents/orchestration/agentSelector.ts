import { AgentTask, AgentType } from '../types';

/**
 * Functions for determining which agents should handle specific tasks
 */

/**
 * Determine which agents should handle a specific task
 */
export function determineTargetAgents(task: AgentTask): AgentType[] {
  // If the task already specifies target agents, use those
  if (task.targetAgentTypes && task.targetAgentTypes.length > 0) {
    return task.targetAgentTypes;
  }
  
  // Otherwise, determine based on task type and context
  switch (task.taskType) {
    case 'LEARNING_PATH_GENERATION':
      // For learning path generation, include cognitive profile agent for context
      return ['LEARNING_PATH', 'COGNITIVE_PROFILE'];
      
    case 'LEARNING_PATH_UPDATE':
      // For learning path updates, we only need the learning path agent
      return ['LEARNING_PATH'];
      
    case 'COGNITIVE_PROFILING':
      // For cognitive profiling, we need to analyze user data
      return ['COGNITIVE_PROFILE'];
      
    case 'CONTENT_ADAPTATION':
      // Content adaptation needs both learning path and cognitive profile context
      return ['CONTENT_ADAPTATION', 'LEARNING_PATH', 'COGNITIVE_PROFILE'];
      
    case 'ASSESSMENT_GENERATION':
      // Assessment generation needs to know about learning paths
      return ['ASSESSMENT', 'LEARNING_PATH'];
      
    case 'ENGAGEMENT_OPTIMIZATION':
      // Engagement strategies should consider cognitive profile
      return ['ENGAGEMENT', 'COGNITIVE_PROFILE'];
      
    case 'FEEDBACK_GENERATION':
      // Feedback generation should adapt based on cognitive profile
      return ['FEEDBACK', 'COGNITIVE_PROFILE'];
      
    case 'SCHEDULE_OPTIMIZATION':
      // Schedule optimization needs to know learning paths and cognitive profile
      return ['SCHEDULING', 'LEARNING_PATH', 'COGNITIVE_PROFILE'];
      
    case 'UI_OPTIMIZATION':
      // UI adaptation should consider cognitive profile
      return ['UI_UX', 'COGNITIVE_PROFILE'];
      
    case 'FLASHCARD_OPTIMIZATION':
      // Flashcard optimization should consider spacing effect
      return ['SCHEDULING'];
      
    default:
      console.warn(`No specific agent mapping for task type: ${task.taskType}`);
      return [];
  }
}
