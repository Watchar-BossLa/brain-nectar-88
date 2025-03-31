
import { Task } from "../types/taskTypes";

export interface AgentMessage {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface BaseAgent {
  id: string;
  name?: string;
  type?: string;
  getType(): string;
  processTask(task: Task): Promise<void> | void;
  receiveMessage(message: AgentMessage): void;
}
