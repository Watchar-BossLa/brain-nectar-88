
import { TaskCategory } from '@/types/tasks';

// Define a basic message structure for agent communication
export interface AgentMessage {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Define the base agent interface
export interface BaseAgent {
  id: string;
  name: string;
  type: string;
  getType(): string;
  processTask(task: any): Promise<any>;
  receiveMessage(message: AgentMessage): Promise<void>;
}

// The abstract BaseAgent class provides common functionality for all agents
export abstract class AbstractBaseAgent implements BaseAgent {
  id: string;
  name: string;
  type: string;

  constructor(id: string, name: string, type: string) {
    this.id = id;
    this.name = name;
    this.type = type;
  }

  getType(): string {
    return this.type;
  }

  abstract processTask(task: any): Promise<any>;
  
  async receiveMessage(message: AgentMessage): Promise<void> {
    console.log(`${this.name} received message: ${message.content}`);
  }
}
