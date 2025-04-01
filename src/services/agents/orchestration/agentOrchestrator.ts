
import { AgentTask, AgentType } from '../types';
import { ContextTag, TaskStatus } from '../types/taskTypes';

/**
 * Agent Orchestrator
 * 
 * Handles the coordination between agents, determining which agents should handle 
 * specific tasks and managing inter-agent communication.
 */
export class AgentOrchestrator {
  private agentRegistry: Map<AgentType, any> = new Map();
  
  /**
   * Register an agent with the orchestrator
   */
  public registerAgent(type: AgentType, agent: any): void {
    this.agentRegistry.set(type, agent);
  }
  
  /**
   * Distribute a task to the appropriate agents
   */
  public async distributeTask(task: AgentTask): Promise<void> {
    const targetAgents = this.determineTargetAgents(task);
    
    for (const agentType of targetAgents) {
      const agent = this.agentRegistry.get(agentType);
      if (agent) {
        await agent.processTask(task);
      } else {
        console.warn(`Agent ${agentType} not found for task distribution`);
      }
    }
  }
  
  /**
   * Generate an adaptive learning path
   */
  public async generateAdaptiveLearningPath(
    userId: string,
    qualificationId: string,
    options?: {
      priorityTopics?: string[];
      timeConstraint?: number;
      complexityPreference?: 'basic' | 'standard' | 'advanced';
    }
  ): Promise<any> {
    const task = this.createLearningPathTask(userId);
    task.data = {
      ...task.data,
      qualificationId,
      options
    };
    
    await this.distributeTask(task);
    return {
      taskId: task.id,
      status: 'pending',
      message: 'Learning path generation initiated'
    };
  }
  
  /**
   * Create an adaptive assessment
   */
  public async createAdaptiveAssessment(
    userId: string,
    topicIds: string[],
    options?: {
      initialDifficulty?: number;
      adaptationRate?: number;
      questionCount?: number;
      timeLimit?: number;
    }
  ): Promise<any> {
    const difficulty = options?.initialDifficulty || 0.5;
    const task = this.createAssessmentTask(userId, topicIds, difficulty);
    task.data = {
      ...task.data,
      options
    };
    
    await this.distributeTask(task);
    return {
      taskId: task.id,
      status: 'pending',
      message: 'Assessment generation initiated'
    };
  }
  
  /**
   * Optimize study schedule
   */
  public async optimizeStudySchedule(
    userId: string,
    options?: {
      dailyAvailableTime?: number;
      priorityTopics?: string[];
      startDate?: string;
      endDate?: string;
      goalDate?: string;
    }
  ): Promise<any> {
    const task = this.createScheduleOptimizationTask(userId, options || {});
    
    await this.distributeTask(task);
    return {
      taskId: task.id,
      status: 'pending',
      message: 'Schedule optimization initiated'
    };
  }
  
  /**
   * Determine which agents should handle a specific task
   */
  private determineTargetAgents(task: AgentTask): AgentType[] {
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
  
  /**
   * Create a learning path generation task
   */
  public createLearningPathTask(userId: string): AgentTask {
    return {
      id: `learning-path-${Date.now()}`,
      userId,
      taskType: 'LEARNING_PATH_GENERATION',
      description: 'Generate initial learning path',
      priority: 'HIGH',
      targetAgentTypes: ['LEARNING_PATH', 'COGNITIVE_PROFILE'],
      context: ['learning_path', 'qualification', 'adaptive'],
      data: {},
      createdAt: new Date().toISOString()
    };
  }
  
  /**
   * Create a cognitive profiling task
   */
  public createCognitiveProfilingTask(userId: string): AgentTask {
    return {
      id: `cognitive-profile-${Date.now()}`,
      userId,
      taskType: 'COGNITIVE_PROFILING',
      description: 'Create initial cognitive profile',
      priority: 'HIGH',
      targetAgentTypes: ['COGNITIVE_PROFILE'],
      context: ['cognitive_profile', 'qualification', 'adaptive'],
      data: {},
      createdAt: new Date().toISOString()
    };
  }
  
  /**
   * Create a content adaptation task
   */
  public createContentAdaptationTask(userId: string, topicIds: string[]): AgentTask {
    return {
      id: `content-adaptation-${Date.now()}`,
      userId,
      taskType: 'CONTENT_ADAPTATION',
      description: 'Adapt learning content to user profile',
      priority: 'MEDIUM',
      targetAgentTypes: ['CONTENT_ADAPTATION', 'COGNITIVE_PROFILE'],
      context: ['learning_path', 'cognitive_profile', 'qualification'],
      data: {
        topicIds
      },
      createdAt: new Date().toISOString()
    };
  }
  
  /**
   * Create an assessment generation task
   */
  public createAssessmentTask(userId: string, topicIds: string[], difficulty: number): AgentTask {
    return {
      id: `assessment-${Date.now()}`,
      userId,
      taskType: 'ASSESSMENT_GENERATION',
      description: 'Generate adaptive assessment',
      priority: 'MEDIUM',
      targetAgentTypes: ['ASSESSMENT'],
      context: ['assessment', 'adaptive', 'difficulty'],
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
  public createEngagementTask(userId: string): AgentTask {
    return {
      id: `engagement-${Date.now()}`,
      userId,
      taskType: 'ENGAGEMENT_OPTIMIZATION',
      description: 'Optimize user engagement strategies',
      priority: 'LOW',
      targetAgentTypes: ['ENGAGEMENT', 'COGNITIVE_PROFILE'],
      context: ['engagement', 'user_profile'],
      data: {},
      createdAt: new Date().toISOString()
    };
  }
  
  /**
   * Create a schedule optimization task
   */
  public createScheduleOptimizationTask(userId: string, options: any): AgentTask {
    return {
      id: `schedule-${Date.now()}`,
      userId,
      taskType: 'SCHEDULE_OPTIMIZATION',
      description: 'Optimize study schedule',
      priority: 'MEDIUM',
      targetAgentTypes: ['SCHEDULING'],
      context: ['schedule', 'optimization', 'study_plan'],
      data: {
        options
      },
      createdAt: new Date().toISOString()
    };
  }
  
  /**
   * Create a flashcard optimization task
   */
  public createFlashcardOptimizationTask(userId: string, cardIds: string[]): AgentTask {
    return {
      id: `flashcard-${Date.now()}`,
      userId,
      taskType: 'FLASHCARD_OPTIMIZATION',
      description: 'Optimize flashcard spaced repetition',
      priority: 'MEDIUM',
      targetAgentTypes: ['SCHEDULING'],
      context: ['flashcards', 'spaced_repetition', 'optimization'],
      data: {
        cardIds
      },
      createdAt: new Date().toISOString()
    };
  }
}

// Create and export an instance for use throughout the application
export const agentOrchestrator = new AgentOrchestrator();
