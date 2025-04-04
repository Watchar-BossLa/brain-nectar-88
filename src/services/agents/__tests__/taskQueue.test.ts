
import { describe, it, expect } from 'vitest';
import { TaskQueue } from '../mcp/taskQueue';
import { TaskTypeEnum, TaskPriorityEnum } from '../types';

describe('TaskQueue', () => {
  it('should add tasks in the correct priority order', () => {
    const queue = new TaskQueue();
    
    const lowPriorityTask = {
      id: 'task-1',
      userId: 'user-1',
      taskType: TaskTypeEnum.COGNITIVE_PROFILING,
      description: 'Low priority task',
      priority: TaskPriorityEnum.LOW,
      context: [],
      data: {},
      createdAt: new Date().toISOString()
    };
    
    const highPriorityTask = {
      id: 'task-2',
      userId: 'user-1',
      taskType: TaskTypeEnum.COGNITIVE_PROFILING,
      description: 'High priority task',
      priority: TaskPriorityEnum.HIGH,
      context: [],
      data: {},
      createdAt: new Date().toISOString()
    };
    
    const mediumPriorityTask = {
      id: 'task-3',
      userId: 'user-1',
      taskType: TaskTypeEnum.COGNITIVE_PROFILING,
      description: 'Medium priority task',
      priority: TaskPriorityEnum.MEDIUM,
      context: [],
      data: {},
      createdAt: new Date().toISOString()
    };
    
    queue.addTask(lowPriorityTask);
    queue.addTask(highPriorityTask);
    queue.addTask(mediumPriorityTask);
    
    // The high priority task should be first
    const firstTask = queue.getNextTask();
    expect(firstTask?.id).toBe('task-2'); // High priority
    
    // The medium priority task should be next
    const secondTask = queue.getNextTask();
    expect(secondTask?.id).toBe('task-3'); // Medium priority
    
    // The low priority task should be last
    const thirdTask = queue.getNextTask();
    expect(thirdTask?.id).toBe('task-1'); // Low priority
    
    // The queue should now be empty
    expect(queue.isEmpty()).toBe(true);
  });
  
  it('should default to MEDIUM priority if not specified', () => {
    const queue = new TaskQueue();
    
    const taskWithoutPriority = {
      id: 'task-no-priority',
      userId: 'user-1',
      taskType: TaskTypeEnum.COGNITIVE_PROFILING,
      description: 'Task without priority',
      context: [],
      data: {},
      createdAt: new Date().toISOString()
    } as any;
    
    const highPriorityTask = {
      id: 'task-high',
      userId: 'user-1',
      taskType: TaskTypeEnum.COGNITIVE_PROFILING,
      description: 'High priority task',
      priority: TaskPriorityEnum.HIGH,
      context: [],
      data: {},
      createdAt: new Date().toISOString()
    };
    
    queue.addTask(taskWithoutPriority);
    queue.addTask(highPriorityTask);
    
    // The high priority task should be first
    const firstTask = queue.getNextTask();
    expect(firstTask?.id).toBe('task-high');
    
    // The task without priority should be assigned MEDIUM priority
    const secondTask = queue.getNextTask();
    expect(secondTask?.id).toBe('task-no-priority');
    expect(secondTask?.priority).toBe(TaskPriorityEnum.MEDIUM);
  });
});
