
import { AgentMessage, AgentType, AgentTypeEnum, MessageTypeEnum } from '../types';
import { createAgentRegistry } from './agentRegistry';

/**
 * CommunicationManager
 * 
 * Handles communication between agents in the system.
 */
export class CommunicationManager {
  private agentRegistry = createAgentRegistry();

  /**
   * Broadcast a message to all agents or specific agents
   */
  public broadcastMessage(message: AgentMessage, targetAgents?: AgentType[]): void {
    if (targetAgents && targetAgents.length > 0) {
      targetAgents.forEach(agentType => {
        const agent = this.agentRegistry.getAgent(agentType);
        if (agent) {
          agent.receiveMessage(message);
        }
      });
    } else {
      // Broadcast to all registered agents
      const registeredAgents = this.agentRegistry.getRegisteredAgentTypes();
      registeredAgents.forEach(agentType => {
        const agent = this.agentRegistry.getAgent(agentType);
        if (agent) {
          agent.receiveMessage(message);
        }
      });
    }
  }

  /**
   * Send a message from one agent to another
   */
  public sendDirectMessage(
    fromAgent: AgentType, 
    toAgent: AgentType, 
    content: string, 
    data: Record<string, any> = {}
  ): void {
    const targetAgent = this.agentRegistry.getAgent(toAgent);
    
    if (targetAgent) {
      targetAgent.receiveMessage({
        type: MessageTypeEnum.TASK,
        content,
        data,
        timestamp: new Date().toISOString(),
        senderId: fromAgent,
        targetId: toAgent
      });
    } else {
      console.warn(`Target agent ${toAgent} not found for direct message`);
    }
  }
}
