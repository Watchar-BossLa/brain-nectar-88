
// This file re-exports consolidated types from the types directory
export { 
  AgentType,
  TaskType,
  TaskPriority,
  TaskStatus,
  AgentTask
} from './types/agentTypes';

export { ContextTag } from './types/taskTypes';
export { MessageType, AgentMessage } from './types/messageTypes';
export { 
  CognitiveProfile,
  ProfileUpdateOptions,
  ProfileAnalysisResult 
} from './types/profileTypes';
export {
  SystemState,
  SystemMetrics
} from './types/systemState';
