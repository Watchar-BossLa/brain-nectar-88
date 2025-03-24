
import { BaseAgent } from '../baseAgent';
import { AgentMessage, AgentTask, AgentType, CognitiveProfile } from '../types';
import { ProfileGenerator } from './profileGenerator';
import { ProfileRepository } from './profileRepository';
import { MessageHandler } from './messageHandler';

/**
 * Cognitive Profile Agent
 * 
 * Builds and maintains a comprehensive model of the learner's cognitive patterns.
 */
export class CognitiveProfileAgent extends BaseAgent {
  protected type: AgentType = 'COGNITIVE_PROFILE';
  private profileGenerator: ProfileGenerator;
  private profileRepository: ProfileRepository;
  private messageHandler: MessageHandler;
  
  constructor() {
    super();
    this.profileGenerator = new ProfileGenerator();
    this.profileRepository = new ProfileRepository();
    this.messageHandler = new MessageHandler(
      this.profileGenerator,
      this.profileRepository,
      this.sendMessage.bind(this),
      this.log.bind(this)
    );
  }
  
  /**
   * Execute a task assigned to this agent
   */
  protected async executeTask(task: AgentTask): Promise<any> {
    const { taskType, userId, data } = task;
    
    switch (taskType) {
      case 'COGNITIVE_PROFILING':
        return this.generateCognitiveProfile(userId, data);
      default:
        throw new Error(`Unsupported task type for Cognitive Profile Agent: ${taskType}`);
    }
  }
  
  /**
   * Generate or update a cognitive profile for a user
   */
  private async generateCognitiveProfile(userId: string, data: Record<string, any>): Promise<CognitiveProfile> {
    this.log(`Generating cognitive profile for user ${userId}`);
    
    // Check if we already have a profile for this user
    const existingProfile = await this.profileRepository.getCognitiveProfile(userId);
    
    if (existingProfile) {
      // Update the existing profile
      return this.profileGenerator.updateCognitiveProfile(existingProfile, data);
    } else {
      // Create a new profile
      return this.profileGenerator.createInitialCognitiveProfile(userId);
    }
  }
  
  /**
   * Handle messages from other agents or the MCP
   */
  protected handleMessage(message: AgentMessage): void {
    this.messageHandler.handleMessage(message);
  }
}
