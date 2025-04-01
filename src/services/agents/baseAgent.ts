
import { AgentTask, AgentType } from './types';
import { AgentMessage } from './types/agentTypes';

/**
 * Base agent class that all specialized agents should extend
 */
export abstract class BaseAgent {
  id: string;
  type: string;

  constructor(type: string) {
    this.id = `${type.toLowerCase()}-${Date.now()}`;
    this.type = type;
  }

  /**
   * Get the agent type
   */
  getType(): string {
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

  /**
   * Send a message to another agent
   */
  protected sendMessage(targetAgentId: string, content: string, data: any = {}): AgentMessage {
    const message: AgentMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      senderId: this.id,
      receiverId: targetAgentId,
      messageType: 'NOTIFICATION',
      content,
      timestamp: new Date().toISOString(),
      priority: 'MEDIUM' as any,
      data
    };

    // In a real implementation, this would send the message through a message bus
    console.log(`Agent ${this.id} sending message to ${targetAgentId}:`, content);
    
    return message;
  }
}

// Export the AgentMessage type for compatibility
export type { AgentMessage };
