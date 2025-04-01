
import { AgentTask, AgentType } from '../types';

// TaskRouter handles directing tasks to the appropriate agents
export class TaskRouter {
  // Maps task types to the appropriate agent types
  private static taskToAgentMapping: Record<string, AgentType[]> = {
    "LEARNING_ASSESSMENT": ["cognitive_profile"],
    "PATH_CREATION": ["learning_path"],
    "CONTENT_ADAPTATION": ["content_adaptation"],
    "QUIZ_GENERATION": ["assessment"],
    "ENGAGEMENT_ANALYSIS": ["engagement"],
    "USER_FEEDBACK": ["feedback"],
    "UI_OPTIMIZATION": ["ui_ux"],
    "SCHEDULE_OPTIMIZATION": ["scheduling"]
  };
  
  // Maps specialized task types to collaborating agents
  private static specializedTaskMapping: Record<string, AgentType[]> = {
    "LEARNING_PROFILE_CREATION": ["cognitive_profile", "scheduling"],
    "ADAPTIVE_LEARNING_PATH": ["cognitive_profile", "learning_path", "assessment"]
  };
  
  /**
   * Route a task to appropriate agents based on task type
   * 
   * @param task The task to route
   * @returns Array of agent types that should handle this task
   */
  public static routeTask(task: AgentTask): AgentType[] {
    const taskType = task.taskType;
    
    if (taskType in this.specializedTaskMapping) {
      return this.specializedTaskMapping[taskType];
    }
    
    if (taskType in this.taskToAgentMapping) {
      return this.taskToAgentMapping[taskType];
    }
    
    // Default routing based on task requirements
    return this.determineAgentsByRequirements(task);
  }
  
  /**
   * Determine which agents should handle a task based on its requirements
   */
  private static determineAgentsByRequirements(task: AgentTask): AgentType[] {
    const requiredAgents: AgentType[] = [];
    
    if (task.context?.learningProfile) {
      requiredAgents.push("cognitive_profile" as AgentType);
    }
    
    if (task.context?.learningPath) {
      requiredAgents.push("learning_path" as AgentType);
    }
    
    if (task.context?.assessment) {
      requiredAgents.push("assessment" as AgentType);
    }
    
    if (task.context?.contentAdaptation) {
      requiredAgents.push("content_adaptation" as AgentType);
    }
    
    if (task.context?.userFeedback) {
      requiredAgents.push("feedback" as AgentType);
    }
    
    if (task.context?.engagement) {
      requiredAgents.push("engagement" as AgentType);
    }
    
    if (task.context?.ui) {
      requiredAgents.push("ui_ux" as AgentType);
    }
    
    if (task.context?.scheduling) {
      requiredAgents.push("scheduling" as AgentType);
    }
    
    // If no specific agents were determined, default to cognitive profile
    if (requiredAgents.length === 0) {
      requiredAgents.push("cognitive_profile" as AgentType, "learning_path" as AgentType, "assessment" as AgentType);
    }
    
    return requiredAgents;
  }
}
