
/**
 * Types for the multi-agent system
 * 
 * This file defines the core types and interfaces used throughout the agent system.
 * It centralizes type definitions to ensure consistency across the codebase.
 */
import { 
  AgentType as AgentTypeEnum, 
  TaskType as TaskTypeEnum, 
  TaskPriority as TaskPriorityEnum, 
  TaskStatus as TaskStatusEnum, 
  MessageType as MessageTypeEnum 
} from '../../types/enums';

// Re-export the enum types
export type AgentType = AgentTypeEnum;
export type TaskType = TaskTypeEnum;
export type TaskPriority = TaskPriorityEnum;
export type TaskStatus = TaskStatusEnum;
export type MessageType = MessageTypeEnum;

// Also provide the enums for direct access
export { AgentTypeEnum, TaskTypeEnum, TaskPriorityEnum, TaskStatusEnum, MessageTypeEnum };

/**
 * A task that can be assigned to one or more agents
 * 
 * Tasks represent work items that need to be processed by agents in the system.
 * They contain all necessary context and data for processing.
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
 * 
 * Messages enable communication between different agents in the system.
 * They can contain various types of content and metadata.
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
 * 
 * This represents the global state of the multi-agent system,
 * including agent statuses and performance metrics.
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
 * 
 * Contains information about a user's learning characteristics, preferences,
 * and knowledge state to enable personalized adaptations.
 */
export interface CognitiveProfile {
  userId: string;
  learningSpeed: Record<string, number>;
  preferredContentFormats?: string[];
  contentPreferences?: string[];
  strengths?: string[];
  weaknesses?: string[];
  knowledgeGraph: Record<string, string[]>;
  attentionSpan?: number;
  retentionRates?: Record<string, number>;
  lastUpdated: string;
}

/**
 * Agent capability description
 * 
 * Describes a specific capability that an agent can perform,
 * including its inputs and outputs.
 */
export interface AgentCapability {
  name: string;
  description: string;
  requiredData: string[];
  outputFormat: string;
}
