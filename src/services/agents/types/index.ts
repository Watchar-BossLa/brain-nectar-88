
// Import from agentTypes
import { AgentType } from './agentTypes';

// Import from taskTypes
import { 
  Task, 
  TaskResult,
  TaskCategory,
  TaskPriority,
  TaskStatus
} from './taskTypes';

// Export separately to avoid conflicts
export { AgentType };
export type { 
  Task, 
  TaskResult,
  TaskCategory,
  TaskPriority,
  TaskStatus
};

// Export any other types needed
export type SystemState = {
  status: 'initializing' | 'ready' | 'error';
  activeAgents: string[];
  lastActivity: Date;
};

export type AgentMessage = {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
};

export type AgentTask = {
  id: string;
  userId: string;
  taskType: string;
  description: string;
  priority: string;
  targetAgentTypes: string[];
  context: string[];
  data: Record<string, any>;
  createdAt: string;
  completedAt?: string;
  status?: string;
  result?: Record<string, any>;
};

export type CognitiveProfile = {
  id: string;
  userId: string;
  learningStyle: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  createdAt: Date;
  updatedAt: Date;
};
