
import { AgentType, AgentMessage, CommunicationManager } from '../types';

class InternalCommunicationManager implements CommunicationManager {
  private static instance: InternalCommunicationManager;
  private messageHandlers: Map<AgentType | 'MCP', ((message: AgentMessage) => Promise<void>)[]>;
  private messageLog: AgentMessage[];
  
  private constructor() {
    this.messageHandlers = new Map();
    this.messageLog = [];
  }
  
  public static getInstance(): InternalCommunicationManager {
    if (!InternalCommunicationManager.instance) {
      InternalCommunicationManager.instance = new InternalCommunicationManager();
    }
    return InternalCommunicationManager.instance;
  }
  
  public async sendMessage(message: AgentMessage): Promise<boolean> {
    // Log the message for debugging/history
    this.messageLog.push(message);
    
    // Get handlers for recipient
    const handlers = this.messageHandlers.get(message.recipientId);
    
    if (!handlers || handlers.length === 0) {
      console.warn(`No handlers registered for recipient: ${message.recipientId}`);
      return false;
    }
    
    try {
      // Deliver message to all registered handlers
      await Promise.all(handlers.map(handler => handler(message)));
      return true;
    } catch (error) {
      console.error(`Error delivering message to ${message.recipientId}:`, error);
      return false;
    }
  }
  
  public registerMessageHandler(
    agentType: AgentType | 'MCP',
    handler: (message: AgentMessage) => Promise<void>
  ): void {
    const existingHandlers = this.messageHandlers.get(agentType) || [];
    this.messageHandlers.set(agentType, [...existingHandlers, handler]);
  }
  
  public getMessageLog(): AgentMessage[] {
    return [...this.messageLog];
  }
}

// Export singleton instance
export const communicationManager = InternalCommunicationManager.getInstance();
