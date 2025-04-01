
import { AgentMessage } from '../types/agentTypes'; 
import { agentRegistry } from './agentRegistry';

/**
 * Send a message to an agent
 */
export async function sendMessageToAgent(message: AgentMessage): Promise<boolean> {
  const { receiverId } = message;
  const agent = agentRegistry.getAgent(receiverId);
  
  if (!agent) {
    console.error(`Agent ${receiverId} not found for message delivery`);
    return false;
  }
  
  try {
    // Process the message asynchronously
    agent.receiveMessage(message);
    return true;
  } catch (error) {
    console.error(`Error delivering message to agent ${receiverId}:`, error);
    return false;
  }
}

/**
 * Broadcast a message to all agents
 */
export async function broadcastMessage(
  senderId: string, 
  content: string, 
  data: Record<string, any> = {}
): Promise<void> {
  const agents = agentRegistry.getAllAgents();
  
  for (const agent of agents) {
    if (agent.id !== senderId) { // Don't send to self
      const message: AgentMessage = {
        id: `broadcast-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        senderId,
        receiverId: agent.id,
        messageType: 'NOTIFICATION',
        content,
        timestamp: new Date().toISOString(),
        data,
        priority: 'MEDIUM'
      };
      
      sendMessageToAgent(message);
    }
  }
}

/**
 * Create a new agent message
 */
export function createAgentMessage(
  senderId: string,
  receiverId: string,
  content: string,
  data: Record<string, any> = {}
): AgentMessage {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    senderId,
    receiverId,
    messageType: 'NOTIFICATION',
    content,
    timestamp: new Date().toISOString(),
    data,
    priority: 'MEDIUM'
  };
}
