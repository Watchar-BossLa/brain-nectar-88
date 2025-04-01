
import { AgentTask } from "../types";

export interface AgentMessage {
  id: string;
  senderId: string;
  receiverId: string;
  messageType: string;
  content: string;
  timestamp: string;
  priority: string;
  data?: any;
}

export interface BaseAgent {
  id: string;
  name?: string;
  type?: string;
  getType(): string;
  processTask(task: AgentTask): Promise<void> | void;
  receiveMessage(message: AgentMessage): Promise<void> | void;
}
