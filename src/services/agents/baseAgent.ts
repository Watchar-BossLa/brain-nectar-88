
import { AgentMessage, AgentTask, AgentType } from './types';

/**
 * Base Agent
 * 
 * Base class for all specialized agents in the system.
 */
export abstract class BaseAgent {
  protected type: AgentType;
  
  constructor(type: AgentType) {
    this.type = type;
  }
  
  /**
   * Get the type of this agent
   */
  getType(): AgentType {
    return this.type;
  }
  
  /**
   * Process a task assigned to this agent
   */
  abstract processTask(task: AgentTask): Promise<any>;
  
  /**
   * Receive a message from another agent
   */
  abstract receiveMessage(message: AgentMessage): void;
}
