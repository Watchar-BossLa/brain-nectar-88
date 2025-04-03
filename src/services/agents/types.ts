/**
 * Types for the multi-agent system
 */
import { 
  AgentType, 
  TaskType, 
  TaskPriority, 
  TaskStatus, 
  MessageType 
} from '../../types/enums';

// Re-export for backward compatibility
export { 
  AgentType, 
  TaskType, 
  TaskPriority, 
  TaskStatus, 
  MessageType 
};

/**
 * A task that can be assigned to one or more agents
 */
export interface AgentTask {
  id: string;
  userId: string;
  taskType: TaskType;
  description: string;
  priority: TaskPriority;
  targetAgentTypes?: AgentType[];
  context: string[];
  data: Record<string, any>;
  createdAt: string;
  status?: TaskStatus;
  completedAt?: string;
  result?: any;
}

/**
 * A message that can be sent between agents
 */
export interface AgentMessage {
  type: MessageType;
  content: string;
  data: Record<string, any>;
  timestamp: string;
  senderId?: AgentType;
  targetId?: AgentType;
}

/**
 * System state maintained by the MCP
 */
export interface SystemState {
  activeAgents: AgentType[];
  metrics: {
    taskCompletionRate: number;
    averageResponseTime: number;
    userSatisfactionScore: number;
    [key: string]: number;
  };
  priorityMatrix: Record<string, number>;
  globalVariables: Record<string, any>;
}

/**
 * Cognitive profile of a user
 */
export interface CognitiveProfile {
  userId: string;
  learningSpeed: Record<string, number>;
  preferredContentFormats: string[];
  knowledgeGraph: Record<string, string[]>;
  attentionSpan: number;
  retentionRates: Record<string, number>;
  lastUpdated: string;
}

/**
 * Agent capability description
 */
export interface AgentCapability {
  name: string;
  description: string;
  requiredData: string[];
  outputFormat: string;
}
