
import { MasterControlProgram } from '../mcp';
import { LearningPathService } from './services/LearningPathService';
import { AssessmentService } from './services/AssessmentService';
import { StudyScheduleService } from './services/StudyScheduleService';
import { FlashcardService } from './services/FlashcardService';

/**
 * Agent Orchestrator
 * 
 * Advanced orchestration layer for coordinating complex multi-agent operations.
 * This manages complex task dependencies, parallel execution, and optimization
 * of agent resource allocation.
 */
export class AgentOrchestrator {
  private static instance: AgentOrchestrator;
  private mcp: MasterControlProgram;
  private learningPathService: LearningPathService;
  private assessmentService: AssessmentService;
  private studyScheduleService: StudyScheduleService;
  private flashcardService: FlashcardService;
  
  private constructor() {
    this.mcp = MasterControlProgram.getInstance();
    this.learningPathService = new LearningPathService(this.mcp);
    this.assessmentService = new AssessmentService(this.mcp);
    this.studyScheduleService = new StudyScheduleService(this.mcp);
    this.flashcardService = new FlashcardService(this.mcp);
    
    console.log('Agent Orchestrator initialized');
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): AgentOrchestrator {
    if (!AgentOrchestrator.instance) {
      AgentOrchestrator.instance = new AgentOrchestrator();
    }
    return AgentOrchestrator.instance;
  }
  
  /**
   * Generate an adaptive learning path for a user
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
    return this.learningPathService.generateAdaptiveLearningPath(userId, qualificationId, options);
  }
  
  /**
   * Create an assessment with adaptive difficulty
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
    return this.assessmentService.createAdaptiveAssessment(userId, topicIds, options);
  }
  
  /**
   * Optimize study schedule based on user's learning patterns
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
    return this.studyScheduleService.optimizeStudySchedule(userId, options);
  }
  
  /**
   * Generate a sequence of flashcards with spaced repetition optimization
   */
  public async generateOptimizedFlashcards(
    userId: string,
    topicIds: string[],
    options?: {
      count?: number;
      includeFormulas?: boolean;
      difficultyRange?: [number, number];
      prioritizeWeakAreas?: boolean;
    }
  ): Promise<any> {
    return this.flashcardService.generateOptimizedFlashcards(userId, topicIds, options);
  }
}

// Export singleton instance
export const agentOrchestrator = AgentOrchestrator.getInstance();
