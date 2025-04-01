import { AgentTask, AgentType, TaskType } from '../types';
import { ContextTag } from '../types/taskTypes';

/**
 * Determine the appropriate agent(s) to handle a task
 */
export function determineTargetAgents(task: AgentTask): AgentType[] {
  // If the task already specifies target agents, use those
  if (task.targetAgentTypes && task.targetAgentTypes.length > 0) {
    return task.targetAgentTypes;
  }
  
  // Otherwise, determine the appropriate agents based on task type
  return determineAgentsByTaskType(task.taskType, task.context as ContextTag[]);
}

/**
 * Get the appropriate agent type(s) for a task type
 */
function determineAgentsByTaskType(taskType: string, context?: ContextTag[]): AgentType[] {
  const contextSet = new Set(context || []);
  
  switch (taskType) {
    case 'COGNITIVE_PROFILING':
      return ['COGNITIVE_PROFILE'];
      
    case 'LEARNING_PATH_GENERATION':
    case 'LEARNING_PATH_UPDATE':
    case 'PATH_GENERATION':
      return ['LEARNING_PATH'];
      
    case 'CONTENT_ADAPTATION':
      return ['CONTENT_ADAPTATION'];
      
    case 'ASSESSMENT_GENERATION':
      return ['ASSESSMENT'];
      
    case 'ENGAGEMENT_OPTIMIZATION':
    case 'ENGAGEMENT_STRATEGIES':
      return ['ENGAGEMENT'];
      
    case 'FEEDBACK_GENERATION':
      return ['FEEDBACK'];
      
    case 'UI_OPTIMIZATION':
    case 'UI_ADAPTATION':
      return ['UI_UX'];
      
    case 'SCHEDULE_OPTIMIZATION':
      // Add specific context checks
      if (contextSet.has('learning_path' as ContextTag) || 
          contextSet.has('study_plan' as ContextTag)) {
        return ['SCHEDULING', 'LEARNING_PATH'];
      }
      return ['SCHEDULING'];
      
    case 'ASSESSMENT_GENERATION':
      if (contextSet.has('assessment' as ContextTag) || 
          contextSet.has('test' as ContextTag) || 
          contextSet.has('quiz' as ContextTag)) {
        return ['ASSESSMENT', 'LEARNING_PATH'];
      }
      return ['ASSESSMENT'];
      
    case 'CONTENT_ADAPTATION':
      if (contextSet.has('content' as ContextTag) || 
          contextSet.has('material' as ContextTag) || 
          contextSet.has('resources' as ContextTag)) {
        return ['CONTENT_ADAPTATION'];
      }
      return ['CONTENT_ADAPTATION', 'LEARNING_PATH'];
      
    case 'COGNITIVE_PROFILING':
      if (contextSet.has('cognitive' as ContextTag) || 
          contextSet.has('learning_style' as ContextTag)) {
        return ['COGNITIVE_PROFILE'];
      }
      return ['COGNITIVE_PROFILE'];
      
    case 'FEEDBACK_GENERATION':
      if (contextSet.has('feedback' as ContextTag) || 
          contextSet.has('review' as ContextTag) || 
          contextSet.has('evaluation' as ContextTag)) {
        return ['FEEDBACK', 'ASSESSMENT'];
      }
      return ['FEEDBACK'];
      
    case 'ENGAGEMENT_OPTIMIZATION':
      if (contextSet.has('engagement' as ContextTag) || 
          contextSet.has('motivation' as ContextTag) || 
          contextSet.has('gamification' as ContextTag)) {
        return ['ENGAGEMENT'];
      }
      return ['ENGAGEMENT', 'UI_UX'];
      
    case 'UI_OPTIMIZATION':
      if (contextSet.has('ui' as ContextTag) || 
          contextSet.has('interface' as ContextTag) || 
          contextSet.has('display' as ContextTag)) {
        return ['UI_UX'];
      }
      return ['UI_UX'];
      
    case 'SCHEDULE_OPTIMIZATION':
      if (contextSet.has('schedule' as ContextTag) || 
          contextSet.has('timing' as ContextTag) || 
          contextSet.has('planning' as ContextTag) ||
          contextSet.has('spaced_repetition' as ContextTag) ||
          contextSet.has('flashcard' as ContextTag)) {
        return ['SCHEDULING'];
      }
      return ['SCHEDULING'];
      
    default:
      console.warn(`No specific agent mapping for task type: ${taskType}`);
      return [];
  }
}
