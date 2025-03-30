
import { AgentType } from './agentTypes';

export type MessageType = 
  | 'NOTIFICATION' 
  | 'REQUEST' 
  | 'RESPONSE' 
  | 'UPDATE' 
  | 'SYSTEM'
  | 'TASK';

export interface AgentMessage {
  type: MessageType;
  content: string;
  senderId?: AgentType;
  targetId?: AgentType;
  data?: Record<string, any>;
  timestamp: string;
}
