
import { AgentMessage, AgentTask, AgentType, AgentTypeEnum } from './types';

/**
 * Base Agent
 * 
 * Base class for all specialized agents in the system.
 * Provides common functionality and enforces consistent interface.
 */
export abstract class BaseAgent {
  protected type: AgentType;
  
  constructor(type: AgentType) {
    this.type = type;
  }
  
  /**
   * Get the type of this agent
   * @returns The agent type enum value
   */
  getType(): AgentType {
    return this.type;
  }
  
  /**
   * Process a task assigned to this agent
   * @param task The task to process
   * @returns The result of processing the task
   */
  abstract processTask(task: AgentTask): Promise<any>;
  
  /**
   * Receive a message from another agent
   * @param message The message to process
   */
  abstract receiveMessage(message: AgentMessage): void;
}
