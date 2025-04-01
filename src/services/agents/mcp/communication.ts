
import { v4 as uuidv4 } from 'uuid';
import { AgentMessage } from '../types';
import { AgentType, TaskPriority } from '../types/agentTypes';

/**
 * Manages communication between agents in the multi-agent system
 */
export class CommunicationManager {
  private static instance: CommunicationManager;
  private messageHandlers: Map<string, (message: AgentMessage) => void>;
  
  private constructor() {
    this.messageHandlers = new Map();
  }
  
  public static getInstance(): CommunicationManager {
    if (!CommunicationManager.instance) {
      CommunicationManager.instance = new CommunicationManager();
    }
    return CommunicationManager.instance;
  }
  
  /**
   * Send message from one agent to another
   */
  public sendMessage(
    senderId: string | AgentType,
    receiverId: string | AgentType,
    messageType: string,
    content: string,
    data?: any
  ): string {
    const message: AgentMessage = {
      id: uuidv4(),
      senderId: senderId.toString(),
      receiverId: receiverId.toString(),
      messageType,
      content,
      timestamp: new Date().toISOString(),
      priority: TaskPriority.MEDIUM, // Default priority
      data
    };
    
    this.deliverMessage(message);
    return message.id;
  }
  
  /**
   * Register a message handler for a specific agent
   */
  public registerMessageHandler(
    agentId: string | AgentType, 
    handler: (message: AgentMessage) => void
  ): void {
    this.messageHandlers.set(agentId.toString(), handler);
  }
  
  /**
   * Deliver a message to its intended recipient
   */
  private deliverMessage(message: AgentMessage): void {
    const handler = this.messageHandlers.get(message.receiverId);
    
    if (handler) {
      // Deliver message to handler
      setTimeout(() => handler(message), 0);
    } else {
      console.warn(`No handler registered for agent ${message.receiverId}`);
    }
  }
  
  /**
   * Broadcast message to all agents except sender
   */
  public broadcastMessage(
    senderId: string | AgentType,
    messageType: string,
    content: string,
    data?: any
  ): string[] {
    const messageIds: string[] = [];
    
    this.messageHandlers.forEach((_, recipientId) => {
      if (recipientId !== senderId.toString()) {
        const messageId = this.sendMessage(
          senderId,
          recipientId,
          messageType,
          content,
          data
        );
        messageIds.push(messageId);
      }
    });
    
    return messageIds;
  }
}

export const communicationManager = CommunicationManager.getInstance();

// Re-export the types
export type { AgentMessage };
