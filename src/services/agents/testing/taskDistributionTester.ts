
import { v4 as uuidv4 } from 'uuid';
import { AgentTask, AgentType, TaskStatus, ContextTag, TaskPriority } from '../types';
import { taskMonitor } from '../monitoring/taskMonitor';
import { determineTargetAgents } from '../orchestration/agentSelector';

/**
 * TaskDistributionTester
 * 
 * A utility for testing the agent task distribution pipeline.
 * Allows for creating test tasks and tracking their progress through the system.
 */
export class TaskDistributionTester {
  private testTasks: Map<string, TestTaskRecord> = new Map();
  
  /**
   * Create and submit a test task to validate the task distribution pipeline
   * 
   * @param taskProcessor - The task processor to submit tasks to
   * @param options - Configuration options for the test task
   * @returns The created test task
   */
  public async createAndSubmitTestTask(
    taskProcessor: any,
    options: {
      userId?: string;
      taskType?: string;
      targetAgents?: AgentType[];
      priority?: TaskPriority;
      context?: ContextTag[];
      testData?: Record<string, any>;
    } = {}
  ): Promise<TestTaskResult> {
    // Generate unique ID for this test
    const testId = uuidv4();
    
    // Create a test task with the provided options
    const task: AgentTask = {
      id: `test-task-${testId}`,
      userId: options.userId || 'test-user',
      taskType: options.taskType || 'COGNITIVE_PROFILING',
      description: `Test task distribution pipeline - ${testId}`,
      priority: options.priority || 'MEDIUM',
      targetAgentTypes: options.targetAgents || [], // If empty, will be determined by the selector
      context: options.context || ['test'],
      data: {
        isTestTask: true,
        testId,
        timestamp: Date.now(),
        ...options.testData
      },
      createdAt: new Date().toISOString()
    };
    
    // If no target agents specified, determine them using the selector
    if (task.targetAgentTypes.length === 0) {
      task.targetAgentTypes = determineTargetAgents(task);
      console.log(`[TaskDistributionTester] Determined target agents for test task ${task.id}:`, task.targetAgentTypes);
    }
    
    // Record the test task
    this.testTasks.set(task.id, {
      taskId: task.id,
      testId,
      status: 'created',
      targetAgents: task.targetAgentTypes,
      startTime: Date.now(),
      agentProcessing: new Map(),
      endTime: null,
      success: false
    });
    
    console.log(`[TaskDistributionTester] Created test task ${task.id} with target agents: ${task.targetAgentTypes.join(', ')}`);
    
    try {
      // Start monitoring this task
      taskMonitor.recordTaskStart(task);
      
      // Submit the task to the processor
      await taskProcessor.submitTask(task);
      
      // Mark task as submitted
      const record = this.testTasks.get(task.id);
      if (record) {
        record.status = 'submitted';
      }
      
      console.log(`[TaskDistributionTester] Test task ${task.id} submitted successfully`);
      
      // Wait for processing to complete (in real implementation, you'd use events or callbacks)
      const result = await this.waitForTaskCompletion(task.id);
      return result;
      
    } catch (error) {
      console.error(`[TaskDistributionTester] Error submitting test task ${task.id}:`, error);
      
      // Update the task record
      const record = this.testTasks.get(task.id);
      if (record) {
        record.status = 'failed';
        record.endTime = Date.now();
        record.error = error instanceof Error ? error.message : 'Unknown error';
      }
      
      return {
        taskId: task.id,
        testId,
        success: false,
        processingTime: record ? (record.endTime || Date.now()) - record.startTime : 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        agentResults: {}
      };
    }
  }
  
  /**
   * Record agent processing of a test task
   */
  public recordAgentProcessing(taskId: string, agentType: AgentType): void {
    const record = this.testTasks.get(taskId);
    if (record) {
      record.agentProcessing.set(agentType, {
        startTime: Date.now(),
        endTime: null,
        success: false
      });
      console.log(`[TaskDistributionTester] Agent ${agentType} started processing task ${taskId}`);
    }
  }
  
  /**
   * Record agent completion of a test task
   */
  public recordAgentCompletion(
    taskId: string, 
    agentType: AgentType, 
    success: boolean, 
    result?: any
  ): void {
    const record = this.testTasks.get(taskId);
    if (record) {
      const agentRecord = record.agentProcessing.get(agentType);
      if (agentRecord) {
        agentRecord.endTime = Date.now();
        agentRecord.success = success;
        agentRecord.result = result;
        console.log(`[TaskDistributionTester] Agent ${agentType} ${success ? 'successfully completed' : 'failed'} processing task ${taskId}`);
        
        // Check if all agents have completed
        let allAgentsCompleted = true;
        let allAgentsSucceeded = true;
        
        for (const agent of record.targetAgents) {
          const agentProcessingRecord = record.agentProcessing.get(agent);
          if (!agentProcessingRecord || agentProcessingRecord.endTime === null) {
            allAgentsCompleted = false;
            break;
          }
          if (!agentProcessingRecord.success) {
            allAgentsSucceeded = false;
          }
        }
        
        // If all agents have completed, mark the task as completed
        if (allAgentsCompleted) {
          record.status = allAgentsSucceeded ? 'completed' : 'failed';
          record.endTime = Date.now();
          record.success = allAgentsSucceeded;
          
          console.log(`[TaskDistributionTester] All agents completed processing task ${taskId}, overall status: ${record.status}`);
        }
      }
    }
  }
  
  /**
   * Wait for a task to complete
   */
  private waitForTaskCompletion(taskId: string, timeout = 10000): Promise<TestTaskResult> {
    return new Promise((resolve, reject) => {
      // Check every 100ms
      const interval = setInterval(() => {
        const record = this.testTasks.get(taskId);
        if (!record) {
          clearInterval(interval);
          reject(new Error(`Task ${taskId} not found`));
          return;
        }
        
        if (record.status === 'completed' || record.status === 'failed') {
          clearInterval(interval);
          
          // Create result object
          const agentResults: Record<string, any> = {};
          record.agentProcessing.forEach((value, key) => {
            agentResults[key] = {
              success: value.success,
              processingTime: value.endTime ? value.endTime - value.startTime : null,
              result: value.result
            };
          });
          
          resolve({
            taskId,
            testId: record.testId,
            success: record.success,
            processingTime: record.endTime ? record.endTime - record.startTime : 0,
            error: record.error,
            agentResults
          });
        }
      }, 100);
      
      // Set timeout
      setTimeout(() => {
        clearInterval(interval);
        
        const record = this.testTasks.get(taskId);
        if (record && record.status !== 'completed' && record.status !== 'failed') {
          record.status = 'timeout';
          record.endTime = Date.now();
          record.error = 'Task processing timed out';
          
          // Create result object
          const agentResults: Record<string, any> = {};
          record.agentProcessing.forEach((value, key) => {
            agentResults[key] = {
              success: value.success,
              processingTime: value.endTime ? value.endTime - value.startTime : null,
              result: value.result
            };
          });
          
          resolve({
            taskId,
            testId: record.testId,
            success: false,
            processingTime: record.endTime - record.startTime,
            error: 'Task processing timed out',
            agentResults
          });
        }
      }, timeout);
    });
  }
  
  /**
   * Get a test task record
   */
  public getTestTaskRecord(taskId: string): TestTaskRecord | undefined {
    return this.testTasks.get(taskId);
  }
  
  /**
   * Get all test records
   */
  public getAllTestRecords(): TestTaskRecord[] {
    return Array.from(this.testTasks.values());
  }
  
  /**
   * Clear all test records
   */
  public clearTestRecords(): void {
    this.testTasks.clear();
  }
}

/**
 * Test task record
 */
interface TestTaskRecord {
  taskId: string;
  testId: string;
  status: 'created' | 'submitted' | 'completed' | 'failed' | 'timeout';
  targetAgents: AgentType[];
  startTime: number;
  agentProcessing: Map<AgentType, {
    startTime: number;
    endTime: number | null;
    success: boolean;
    result?: any;
  }>;
  endTime: number | null;
  success: boolean;
  error?: string;
}

/**
 * Test task result
 */
export interface TestTaskResult {
  taskId: string;
  testId: string;
  success: boolean;
  processingTime: number;
  error?: string;
  agentResults: Record<string, any>;
}

// Create and export a singleton instance for use throughout the application
export const taskDistributionTester = new TaskDistributionTester();
