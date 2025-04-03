
import { TaskCategory, TaskType } from '@/types/index';

/**
 * Agent task interface for integration with LLM system
 * This is a simplified version that matches what agentIntegration expects
 */
export interface AgentTask {
  id: string;
  userId: string;
  taskType: TaskType | string;
  description: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  targetAgentTypes?: string[];
  context: string[];
  data: Record<string, any>;
  createdAt: string;
  status?: string;
}

/**
 * Result of processing an agent task with an LLM
 */
export interface AgentTaskResult {
  text: string;
  modelId: string;
  executionTime: number;
}

/**
 * Mapping from agent task types to LLM task categories
 */
export type TaskTypeMapping = Record<string, TaskCategory>;
