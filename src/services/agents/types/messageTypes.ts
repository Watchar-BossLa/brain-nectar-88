
import { AgentType } from './agentTypes';

export type MessageType = 
  | 'NOTIFICATION' 
  | 'REQUEST' 
  | 'RESPONSE' 
  | 'UPDATE' 
  | 'SYSTEM'
  | 'TASK';

export interface AgentMessage {
  id: string;
  senderId: string;
  receiverId: string;
  messageType: MessageType;
  type?: MessageType; // For compatibility with existing code
  content: string;
  timestamp: string;
  data?: Record<string, any>;
  priority?: string;
  sender?: string; // For compatibility with existing code
}
