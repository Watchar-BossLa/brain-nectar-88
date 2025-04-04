
/**
 * Type Conversion Utilities
 * 
 * This file contains utility functions for converting between different types
 * in the agent system, particularly focusing on enum conversions and type safety.
 */

import { 
  AgentTypeEnum, 
  TaskTypeEnum, 
  TaskPriorityEnum, 
  TaskStatusEnum, 
  MessageTypeEnum 
} from '../types';

/**
 * Converts a string to an AgentType enum value
 * @param agentTypeString The string representation of an agent type
 * @returns The corresponding AgentType enum value
 * @throws Error if the string does not match any valid agent type
 */
export function stringToAgentType(agentTypeString: string): AgentTypeEnum {
  if (Object.values(AgentTypeEnum).includes(agentTypeString as AgentTypeEnum)) {
    return agentTypeString as AgentTypeEnum;
  }
  throw new Error(`Invalid agent type: ${agentTypeString}`);
}

/**
 * Converts a string to a TaskType enum value
 * @param taskTypeString The string representation of a task type
 * @returns The corresponding TaskType enum value
 * @throws Error if the string does not match any valid task type
 */
export function stringToTaskType(taskTypeString: string): TaskTypeEnum {
  if (Object.values(TaskTypeEnum).includes(taskTypeString as TaskTypeEnum)) {
    return taskTypeString as TaskTypeEnum;
  }
  throw new Error(`Invalid task type: ${taskTypeString}`);
}

/**
 * Converts a string to a TaskPriority enum value
 * @param priorityString The string representation of a task priority
 * @returns The corresponding TaskPriority enum value
 * @throws Error if the string does not match any valid task priority
 */
export function stringToTaskPriority(priorityString: string): TaskPriorityEnum {
  if (Object.values(TaskPriorityEnum).includes(priorityString as TaskPriorityEnum)) {
    return priorityString as TaskPriorityEnum;
  }
  throw new Error(`Invalid task priority: ${priorityString}`);
}

/**
 * Converts a string to a TaskStatus enum value
 * @param statusString The string representation of a task status
 * @returns The corresponding TaskStatus enum value
 * @throws Error if the string does not match any valid task status
 */
export function stringToTaskStatus(statusString: string): TaskStatusEnum {
  if (Object.values(TaskStatusEnum).includes(statusString as TaskStatusEnum)) {
    return statusString as TaskStatusEnum;
  }
  throw new Error(`Invalid task status: ${statusString}`);
}

/**
 * Converts a string to a MessageType enum value
 * @param messageTypeString The string representation of a message type
 * @returns The corresponding MessageType enum value
 * @throws Error if the string does not match any valid message type
 */
export function stringToMessageType(messageTypeString: string): MessageTypeEnum {
  if (Object.values(MessageTypeEnum).includes(messageTypeString as MessageTypeEnum)) {
    return messageTypeString as MessageTypeEnum;
  }
  throw new Error(`Invalid message type: ${messageTypeString}`);
}

/**
 * Type guard to check if a value is a valid AgentType
 * @param value The value to check
 * @returns Whether the value is a valid AgentType
 */
export function isAgentType(value: any): value is AgentTypeEnum {
  return Object.values(AgentTypeEnum).includes(value);
}

/**
 * Type guard to check if a value is a valid TaskType
 * @param value The value to check
 * @returns Whether the value is a valid TaskType
 */
export function isTaskType(value: any): value is TaskTypeEnum {
  return Object.values(TaskTypeEnum).includes(value);
}

/**
 * Type guard to check if a value is a valid TaskPriority
 * @param value The value to check
 * @returns Whether the value is a valid TaskPriority
 */
export function isTaskPriority(value: any): value is TaskPriorityEnum {
  return Object.values(TaskPriorityEnum).includes(value);
}

/**
 * Type guard to check if a value is a valid TaskStatus
 * @param value The value to check
 * @returns Whether the value is a valid TaskStatus
 */
export function isTaskStatus(value: any): value is TaskStatusEnum {
  return Object.values(TaskStatusEnum).includes(value);
}

/**
 * Type guard to check if a value is a valid MessageType
 * @param value The value to check
 * @returns Whether the value is a valid MessageType
 */
export function isMessageType(value: any): value is MessageTypeEnum {
  return Object.values(MessageTypeEnum).includes(value);
}
