import { AgentTask, AgentType, TaskType } from '../types';

/**
 * Determine which agent(s) should handle a given task
 */
export function determineTargetAgents(task: AgentTask): AgentType[] {
  // If the task specifies target agents, use those
  if (task.targetAgentTypes && task.targetAgentTypes.length > 0) {
    return task.targetAgentTypes;
  }
  
  // Otherwise, determine the best agent(s) based on the task type
  const { taskType } = task;
  
  switch (taskType) {
    case 'COGNITIVE_PROFILING':
      return ['COGNITIVE_PROFILE'];
    case 'LEARNING_PATH_GENERATION':
      return ['LEARNING_PATH'];
    case 'CONTENT_ADAPTATION':
      return ['CONTENT_ADAPTATION'];
    case 'ASSESSMENT_GENERATION':
      return ['ASSESSMENT'];
    case 'ENGAGEMENT_OPTIMIZATION':
      return ['ENGAGEMENT'];
    case 'FEEDBACK_GENERATION':
      return ['FEEDBACK'];
    case 'UI_OPTIMIZATION':
      return ['UI_UX'];
    case 'SCHEDULE_OPTIMIZATION':
      return ['SCHEDULING'];
    case 'FLASHCARD_OPTIMIZATION':
      // For flashcard tasks, involve the cognitive profile and engagement agents
      return ['COGNITIVE_PROFILE', 'SCHEDULING'];
    case 'MULTI_AGENT_COORDINATION':
      // For complex tasks requiring multiple agents
      return determineMultiAgentTeam(task);
    default:
      // If we can't determine a specific agent, return an empty array
      // The MCP will handle this case
      return [];
  }
}

/**
 * For complex tasks, determine the optimal team of agents
 */
export function determineMultiAgentTeam(task: AgentTask): AgentType[] {
  const { context } = task;
  const team: AgentType[] = [];
  
  // Enhanced team composition based on task context with more granular analysis
  if (context.includes('learning_path') || context.includes('study_plan')) {
    team.push('LEARNING_PATH');
  }
  
  if (context.includes('assessment') || context.includes('test') || context.includes('quiz')) {
    team.push('ASSESSMENT');
  }
  
  if (context.includes('content') || context.includes('material') || context.includes('resources')) {
    team.push('CONTENT_ADAPTATION');
  }
  
  if (context.includes('user_profile') || context.includes('cognitive') || context.includes('learning_style')) {
    team.push('COGNITIVE_PROFILE');
  }
  
  if (context.includes('feedback') || context.includes('review') || context.includes('evaluation')) {
    team.push('FEEDBACK');
  }
  
  if (context.includes('engagement') || context.includes('motivation') || context.includes('gamification')) {
    team.push('ENGAGEMENT');
  }
  
  if (context.includes('ui') || context.includes('interface') || context.includes('display')) {
    team.push('UI_UX');
  }
  
  if (context.includes('schedule') || context.includes('timing') || context.includes('planning') || 
      context.includes('spaced_repetition') || context.includes('flashcard')) {
    team.push('SCHEDULING');
  }
  
  // If we couldn't determine a specific team, default to the core agents
  if (team.length === 0) {
    return ['COGNITIVE_PROFILE', 'LEARNING_PATH', 'ASSESSMENT'];
  }
  
  return team;
}
