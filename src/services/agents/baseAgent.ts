
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
  
  /**
   * Utility method to log task processing events
   */
  protected logTaskEvent(task: AgentTask, message: string, data?: any): void {
    console.log(`[Agent:${this.type}] ${message} (Task ID: ${task.id}, Type: ${task.taskType})`);
    if (data) {
      console.log(`[Agent:${this.type}] Task data:`, data);
    }
  }
  
  /**
   * Utility method to log error events
   */
  protected logError(context: string, error: unknown): void {
    console.error(`[Agent:${this.type}] ${context}:`, error instanceof Error ? error.message : 'Unknown error');
    if (error instanceof Error && error.stack) {
      console.debug(`[Agent:${this.type}] Stack:`, error.stack);
    }
  }
  
  /**
   * Utility method to log message events
   */
  protected logMessageEvent(message: AgentMessage, context: string): void {
    console.log(`[Agent:${this.type}] ${context} (Message Type: ${message.type}, Sender: ${message.sender || 'unknown'})`);
  }
}
