
import { AgentTask, AgentType } from '../types';
import { determineTargetAgents } from './agentSelector';
import { 
  createLearningPathTask, 
  createCognitiveProfilingTask,
  createContentAdaptationTask,
  createAssessmentTask,
  createEngagementTask,
  createScheduleOptimizationTask,
  createFlashcardOptimizationTask
} from './taskCreators';
import { 
  generateAdaptiveLearningPath,
  createAdaptiveAssessment,
  optimizeStudySchedule
} from './taskServices';

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
    const targetAgents = determineTargetAgents(task);
    
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
    return generateAdaptiveLearningPath(this, userId, qualificationId, options);
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
    return createAdaptiveAssessment(this, userId, topicIds, options);
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
    return optimizeStudySchedule(this, userId, options);
  }
  
  // Task creation methods - Delegate to the taskCreators module
  public createLearningPathTask = createLearningPathTask;
  public createCognitiveProfilingTask = createCognitiveProfilingTask;
  public createContentAdaptationTask = createContentAdaptationTask;
  public createAssessmentTask = createAssessmentTask;
  public createEngagementTask = createEngagementTask;
  public createScheduleOptimizationTask = createScheduleOptimizationTask;
  public createFlashcardOptimizationTask = createFlashcardOptimizationTask;
}

// Create and export an instance for use throughout the application
export const agentOrchestrator = new AgentOrchestrator();
