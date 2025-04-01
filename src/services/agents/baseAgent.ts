
import { AgentMessage, AgentTask, AgentType } from './types';

/**
 * Base Agent Interface
 * 
 * This abstract class defines the contract that all specialized agents must follow.
 */
export abstract class BaseAgent {
  /**
   * The type of agent (e.g., COGNITIVE_PROFILE, LEARNING_PATH)
   */
  abstract type: AgentType;
  
  /**
   * Get the type of this agent
   */
  getType(): AgentType {
    return this.type;
  }
  
  /**
   * Process a task assigned to this agent
   * @param task The task to process
   */
  abstract processTask(task: AgentTask): Promise<void>;
  
  /**
   * Receive and process a message from another agent or system
   * @param message The message to process
   */
  abstract receiveMessage(message: AgentMessage): Promise<void>;
}
