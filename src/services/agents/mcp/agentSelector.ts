
import { AgentTask, AgentType, AgentTypeEnum } from '../types';

/**
 * AgentSelector
 * 
 * Determines which agent(s) should handle a given task.
 */
export class AgentSelector {
  /**
   * Determine which agent(s) should handle a given task
   */
  public determineTargetAgents(task: AgentTask): AgentType[] {
    // If the task specifies target agents, use those
    if (task.targetAgentTypes && task.targetAgentTypes.length > 0) {
      return task.targetAgentTypes;
    }
    
    // Otherwise, determine the best agent(s) based on the task type
    const { taskType } = task;
    
    switch (taskType) {
      case 'COGNITIVE_PROFILING':
        return [AgentTypeEnum.COGNITIVE_PROFILE];
      case 'LEARNING_PATH_GENERATION':
        return [AgentTypeEnum.LEARNING_PATH];
      case 'CONTENT_ADAPTATION':
        return [AgentTypeEnum.CONTENT_ADAPTATION];
      case 'ASSESSMENT_GENERATION':
        return [AgentTypeEnum.ASSESSMENT];
      case 'ENGAGEMENT_OPTIMIZATION':
        return [AgentTypeEnum.ENGAGEMENT];
      case 'FEEDBACK_GENERATION':
        return [AgentTypeEnum.FEEDBACK];
      case 'UI_OPTIMIZATION':
        return [AgentTypeEnum.UI_UX];
      case 'SCHEDULE_OPTIMIZATION':
        return [AgentTypeEnum.SCHEDULING];
      case 'FLASHCARD_OPTIMIZATION':
        // For flashcard tasks, involve the cognitive profile and engagement agents
        return [AgentTypeEnum.COGNITIVE_PROFILE, AgentTypeEnum.SCHEDULING];
      case 'MULTI_AGENT_COORDINATION':
        // For complex tasks requiring multiple agents
        return this.determineMultiAgentTeam(task);
      default:
        // If we can't determine a specific agent, return an empty array
        // The MCP will handle this case
        return [];
    }
  }

  /**
   * For complex tasks, determine the optimal team of agents
   */
  private determineMultiAgentTeam(task: AgentTask): AgentType[] {
    const { context } = task;
    const team: AgentType[] = [];
    
    // Enhanced team composition based on task context with more granular analysis
    if (context.includes('learning_path') || context.includes('study_plan')) {
      team.push(AgentTypeEnum.LEARNING_PATH);
    }
    
    if (context.includes('assessment') || context.includes('test') || context.includes('quiz')) {
      team.push(AgentTypeEnum.ASSESSMENT);
    }
    
    if (context.includes('content') || context.includes('material') || context.includes('resources')) {
      team.push(AgentTypeEnum.CONTENT_ADAPTATION);
    }
    
    if (context.includes('user_profile') || context.includes('cognitive') || context.includes('learning_style')) {
      team.push(AgentTypeEnum.COGNITIVE_PROFILE);
    }
    
    if (context.includes('feedback') || context.includes('review') || context.includes('evaluation')) {
      team.push(AgentTypeEnum.FEEDBACK);
    }
    
    if (context.includes('engagement') || context.includes('motivation') || context.includes('gamification')) {
      team.push(AgentTypeEnum.ENGAGEMENT);
    }
    
    if (context.includes('ui') || context.includes('interface') || context.includes('display')) {
      team.push(AgentTypeEnum.UI_UX);
    }
    
    if (context.includes('schedule') || context.includes('timing') || context.includes('planning') || 
        context.includes('spaced_repetition') || context.includes('flashcard')) {
      team.push(AgentTypeEnum.SCHEDULING);
    }
    
    // If we couldn't determine a specific team, default to the core agents
    if (team.length === 0) {
      return [AgentTypeEnum.COGNITIVE_PROFILE, AgentTypeEnum.LEARNING_PATH, AgentTypeEnum.ASSESSMENT];
    }
    
    return team;
  }
}
