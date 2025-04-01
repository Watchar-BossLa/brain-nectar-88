
/**
 * Agent System Types
 */

// Agent types in the system
export type AgentType = 
  | 'COGNITIVE_PROFILE'
  | 'LEARNING_PATH'
  | 'CONTENT_ADAPTATION'
  | 'ASSESSMENT'
  | 'ENGAGEMENT'
  | 'FEEDBACK'
  | 'UI_UX'
  | 'SCHEDULING';

// Types of tasks that can be assigned to agents
export type TaskType = 
  | 'COGNITIVE_PROFILING'
  | 'PATH_GENERATION'
  | 'CONTENT_ADAPTATION'
  | 'ASSESSMENT_GENERATION'
  | 'ENGAGEMENT_STRATEGIES'
  | 'FEEDBACK_GENERATION'
  | 'UI_ADAPTATION'
  | 'SCHEDULE_OPTIMIZATION';

// Task priority levels
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

// Context tags to provide additional information for task processing
export type ContextTag = 
  | 'initial_setup'
  | 'user_profile'
  | 'course_context'
  | 'assessment_context'
  | 'feedback_loop'
  | 'adaptation_required'
  | 'system_event';

// Message types for agent communication
export type MessageType = 'TASK' | 'RESULT' | 'REQUEST' | 'RESPONSE' | 'NOTIFICATION' | 'SYSTEM';

/**
 * Agent Task Interface
 */
export interface AgentTask {
  id: string;
  userId: string;
  taskType: string;
  description: string;
  priority: TaskPriority;
  targetAgentTypes: AgentType[];
  context: ContextTag[];
  data: Record<string, any>;
  createdAt: string;
  completedAt?: string;
  result?: Record<string, any>;
}

/**
 * Agent Message Interface
 */
export interface AgentMessage {
  type: MessageType;
  content: string;
  data?: Record<string, any>;
  timestamp: string;
  sender?: AgentType;
  recipient?: AgentType;
  taskId?: string;
}

/**
 * System State Interface
 * 
 * Represents the current state of the agent system
 */
export interface SystemState {
  activeAgents: AgentType[];
  taskQueue: number;
  processingTasks: number;
  completedTasks: number;
  failedTasks: number;
  systemStatus: 'INITIALIZING' | 'READY' | 'DEGRADED' | 'ERROR';
  lastUpdated: string;
  metrics: {
    taskSuccessRate: number;
    averageProcessingTime: number;
    systemLoad: number;
  };
  globalVariables: Record<string, any>;
}
