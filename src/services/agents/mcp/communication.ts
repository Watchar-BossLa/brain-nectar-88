
import { BaseAgent, AgentMessage } from './BaseAgent';
import { v4 as uuidv4 } from 'uuid';
import { agentRegistry } from './agentRegistry';
import { TaskCategory } from '../types/taskTypes';

/**
 * Send a message to a specific agent
 */
export const sendMessageToAgent = (
  targetAgentId: string,
  content: string,
  senderAgentId: string,
  metadata?: Record<string, any>
): boolean => {
  const targetAgent = agentRegistry.getAgent(targetAgentId);
  
  if (!targetAgent) {
    console.warn(`Agent with ID ${targetAgentId} not found.`);
    return false;
  }
  
  const message: AgentMessage = {
    id: uuidv4(),
    sender: senderAgentId,
    receiver: targetAgentId,
    content,
    timestamp: new Date().toISOString(),
    metadata: metadata || {}
  };
  
  targetAgent.receiveMessage(message);
  return true;
};

/**
 * Broadcast a message to all agents of a specific type
 */
export const broadcastMessageByType = (
  agentType: string,
  content: string,
  senderAgentId: string,
  metadata?: Record<string, any>
): number => {
  const agents = agentRegistry.getAgentsByType(agentType);
  let count = 0;
  
  agents.forEach(agent => {
    const message: AgentMessage = {
      id: uuidv4(),
      sender: senderAgentId,
      receiver: agent.id,
      content,
      timestamp: new Date().toISOString(),
      metadata: metadata || {}
    };
    
    agent.receiveMessage(message);
    count++;
  });
  
  return count;
};

/**
 * Forward a message to another agent
 */
export const forwardMessage = (
  message: AgentMessage,
  newReceiverId: string,
  additionalContext?: string
): boolean => {
  const targetAgent = agentRegistry.getAgent(newReceiverId);
  
  if (!targetAgent) {
    console.warn(`Target agent with ID ${newReceiverId} not found.`);
    return false;
  }
  
  const forwardedMessage: AgentMessage = {
    ...message,
    id: uuidv4(),
    receiver: newReceiverId,
    metadata: {
      ...message.metadata,
      originalReceiver: message.receiver,
      forwardedBy: message.receiver,
      additionalContext
    }
  };
  
  targetAgent.receiveMessage(forwardedMessage);
  return true;
};
