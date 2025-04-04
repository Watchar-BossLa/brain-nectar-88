
import { AgentTypeEnum, MessageTypeEnum } from '../types';
import { CommunicationManager } from './communication';

/**
 * UserContextManager
 * 
 * Handles initialization and management of user-specific context.
 */
export class UserContextManager {
  private communicationManager: CommunicationManager;
  
  constructor(communicationManager: CommunicationManager) {
    this.communicationManager = communicationManager;
  }
  
  /**
   * Initialize the system for a specific user
   */
  public async initializeForUser(
    userId: string, 
    setGlobalVariable: (key: string, value: any) => void
  ): Promise<void> {
    // Set global variables
    setGlobalVariable('currentUserId', userId);
    setGlobalVariable('userInitialized', true);
    setGlobalVariable('initializationTime', Date.now());
    
    // Notify agents that a new user has been initialized
    this.communicationManager.broadcastMessage({
      type: MessageTypeEnum.SYSTEM,
      content: `User context initialized for ${userId}`,
      data: { userId },
      timestamp: new Date().toISOString()
    }, [AgentTypeEnum.COGNITIVE_PROFILE, AgentTypeEnum.LEARNING_PATH]);
    
    console.log(`User context initialized for ${userId}`);
  }
}
