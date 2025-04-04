
import { describe, it, expect } from 'vitest';
import { AgentSelector } from '../mcp/agentSelector';
import { AgentTypeEnum, TaskTypeEnum, TaskPriorityEnum } from '../types';

describe('AgentSelector', () => {
  const selector = new AgentSelector();
  
  it('should select the correct agent for cognitive profiling tasks', () => {
    const task = {
      id: 'test-1',
      userId: 'user-1',
      taskType: TaskTypeEnum.COGNITIVE_PROFILING,
      description: 'Test task',
      priority: TaskPriorityEnum.MEDIUM,
      context: [],
      data: {},
      createdAt: new Date().toISOString()
    };
    
    const agents = selector.determineTargetAgents(task);
    expect(agents).toContain(AgentTypeEnum.COGNITIVE_PROFILE);
    expect(agents.length).toBe(1);
  });
  
  it('should select multiple agents for flashcard optimization tasks', () => {
    const task = {
      id: 'test-2',
      userId: 'user-1',
      taskType: TaskTypeEnum.FLASHCARD_OPTIMIZATION,
      description: 'Test flashcard task',
      priority: TaskPriorityEnum.MEDIUM,
      context: [],
      data: {},
      createdAt: new Date().toISOString()
    };
    
    const agents = selector.determineTargetAgents(task);
    expect(agents).toContain(AgentTypeEnum.COGNITIVE_PROFILE);
    expect(agents).toContain(AgentTypeEnum.SCHEDULING);
    expect(agents.length).toBe(2);
  });
  
  it('should use targetAgentTypes when specified', () => {
    const task = {
      id: 'test-3',
      userId: 'user-1',
      taskType: TaskTypeEnum.COGNITIVE_PROFILING,
      description: 'Test task with specified agents',
      priority: TaskPriorityEnum.MEDIUM,
      targetAgentTypes: [AgentTypeEnum.UI_UX, AgentTypeEnum.FEEDBACK],
      context: [],
      data: {},
      createdAt: new Date().toISOString()
    };
    
    const agents = selector.determineTargetAgents(task);
    expect(agents).toContain(AgentTypeEnum.UI_UX);
    expect(agents).toContain(AgentTypeEnum.FEEDBACK);
    expect(agents.length).toBe(2);
  });
  
  it('should select relevant agents based on context', () => {
    const task = {
      id: 'test-4',
      userId: 'user-1',
      taskType: TaskTypeEnum.MULTI_AGENT_COORDINATION,
      description: 'Test multi-agent task',
      priority: TaskPriorityEnum.MEDIUM,
      context: ['learning_path', 'content', 'engagement'],
      data: {},
      createdAt: new Date().toISOString()
    };
    
    const agents = selector.determineTargetAgents(task);
    expect(agents).toContain(AgentTypeEnum.LEARNING_PATH);
    expect(agents).toContain(AgentTypeEnum.CONTENT_ADAPTATION);
    expect(agents).toContain(AgentTypeEnum.ENGAGEMENT);
    expect(agents.length).toBe(3);
  });
});
