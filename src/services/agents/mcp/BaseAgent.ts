
import { AgentMessage, AgentTask } from "../types";

export interface BaseAgent {
  id: string;
  name?: string;
  type?: string;
  getType(): string;
  processTask(task: AgentTask): Promise<void> | void;
  receiveMessage(message: AgentMessage): Promise<void> | void;
}
