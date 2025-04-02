
import { AgentMessage, AgentType } from '../types';
import { ProfileGenerator } from './profileGenerator';
import { ProfileRepository } from './profileRepository';

/**
 * Handles messages for the cognitive profile agent
 */
export class MessageHandler {
  private profileGenerator: ProfileGenerator;
  private profileRepository: ProfileRepository;
  private sendMessageCallback: (targetAgentType: AgentType, content: string, data: Record<string, any>) => void;
  private logCallback: (message: string, data?: any) => void;
  
  constructor(
    profileGenerator: ProfileGenerator, 
    profileRepository: ProfileRepository,
    sendMessageCallback: (targetAgentType: AgentType, content: string, data: Record<string, any>) => void,
    logCallback: (message: string, data?: any) => void
  ) {
    this.profileGenerator = profileGenerator;
    this.profileRepository = profileRepository;
    this.sendMessageCallback = sendMessageCallback;
    this.logCallback = logCallback;
  }
  
  /**
   * Handle an incoming message
   */
  public async handleMessage(message: AgentMessage): Promise<void> {
    const { type, content, data, senderId } = message;
    
    switch (content) {
      case 'INITIALIZE_FOR_USER':
        // Handle initialization for a new user
        if (data.userId) {
          try {
            await this.profileGenerator.createInitialCognitiveProfile(data.userId);
          } catch (error) {
            this.logCallback('Error during initialization:', error);
          }
        }
        break;
        
      case 'REQUEST_COGNITIVE_PROFILE':
        // Handle requests for cognitive profile data
        if (data.userId && senderId) {
          try {
            const profile = await this.profileRepository.getCognitiveProfile(data.userId);
            if (profile) {
              this.sendMessageCallback(senderId, 'COGNITIVE_PROFILE_DATA', { profile });
            }
          } catch (error) {
            this.logCallback('Error fetching cognitive profile:', error);
          }
        }
        break;
        
      default:
        this.logCallback(`Unhandled message: ${content}`);
    }
  }
}
