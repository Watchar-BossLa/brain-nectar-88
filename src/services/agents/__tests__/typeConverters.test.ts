
import { describe, it, expect } from 'vitest';
import { 
  stringToAgentType,
  stringToTaskType,
  stringToTaskPriority,
  stringToTaskStatus,
  stringToMessageType,
  isAgentType,
  isTaskType,
  isTaskPriority,
  isTaskStatus,
  isMessageType
} from '../utils/typeConverters';
import { 
  AgentTypeEnum,
  TaskTypeEnum,
  TaskPriorityEnum,
  TaskStatusEnum,
  MessageTypeEnum
} from '../types';

describe('Type Converters', () => {
  describe('String to Enum Conversion', () => {
    it('should convert valid agent type strings to enum values', () => {
      expect(stringToAgentType('COGNITIVE_PROFILE')).toBe(AgentTypeEnum.COGNITIVE_PROFILE);
      expect(stringToAgentType('LEARNING_PATH')).toBe(AgentTypeEnum.LEARNING_PATH);
    });
    
    it('should throw error for invalid agent type strings', () => {
      expect(() => stringToAgentType('INVALID_TYPE')).toThrow('Invalid agent type');
    });
    
    it('should convert valid task type strings to enum values', () => {
      expect(stringToTaskType('COGNITIVE_PROFILING')).toBe(TaskTypeEnum.COGNITIVE_PROFILING);
      expect(stringToTaskType('LEARNING_PATH_GENERATION')).toBe(TaskTypeEnum.LEARNING_PATH_GENERATION);
    });
    
    it('should throw error for invalid task type strings', () => {
      expect(() => stringToTaskType('INVALID_TYPE')).toThrow('Invalid task type');
    });
    
    it('should convert valid task priority strings to enum values', () => {
      expect(stringToTaskPriority('HIGH')).toBe(TaskPriorityEnum.HIGH);
      expect(stringToTaskPriority('MEDIUM')).toBe(TaskPriorityEnum.MEDIUM);
    });
    
    it('should convert valid task status strings to enum values', () => {
      expect(stringToTaskStatus('PENDING')).toBe(TaskStatusEnum.PENDING);
      expect(stringToTaskStatus('COMPLETED')).toBe(TaskStatusEnum.COMPLETED);
    });
    
    it('should convert valid message type strings to enum values', () => {
      expect(stringToMessageType('TASK')).toBe(MessageTypeEnum.TASK);
      expect(stringToMessageType('SYSTEM')).toBe(MessageTypeEnum.SYSTEM);
    });
  });
  
  describe('Type Guards', () => {
    it('should correctly identify valid agent types', () => {
      expect(isAgentType(AgentTypeEnum.COGNITIVE_PROFILE)).toBe(true);
      expect(isAgentType('INVALID_TYPE')).toBe(false);
    });
    
    it('should correctly identify valid task types', () => {
      expect(isTaskType(TaskTypeEnum.COGNITIVE_PROFILING)).toBe(true);
      expect(isTaskType('INVALID_TYPE')).toBe(false);
    });
    
    it('should correctly identify valid priority types', () => {
      expect(isTaskPriority(TaskPriorityEnum.HIGH)).toBe(true);
      expect(isTaskPriority('INVALID_PRIORITY')).toBe(false);
    });
    
    it('should correctly identify valid status types', () => {
      expect(isTaskStatus(TaskStatusEnum.PENDING)).toBe(true);
      expect(isTaskStatus('INVALID_STATUS')).toBe(false);
    });
    
    it('should correctly identify valid message types', () => {
      expect(isMessageType(MessageTypeEnum.TASK)).toBe(true);
      expect(isMessageType('INVALID_MESSAGE')).toBe(false);
    });
  });
});
