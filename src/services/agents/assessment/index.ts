
import { BaseAgent } from '../baseAgent';
import { AgentMessage, AgentTask, AgentType } from '../types';
import { taskDistributionTester } from '../testing/taskDistributionTester';

/**
 * Assessment Agent
 * 
 * Specialized agent responsible for creating and evaluating adaptive assessments
 * to measure user knowledge and application of concepts.
 */
export class AssessmentAgent extends BaseAgent {
  type: AgentType = 'ASSESSMENT';
  
  /**
   * Process a task assigned to this agent
   * @param task The task to process
   */
  async processTask(task: AgentTask): Promise<void> {
    this.logTaskEvent(task, `Started processing task`);
    
    try {
      // Check if this is a test task and handle it appropriately
      if (task.data?.isTestTask) {
        await this.processTestTask(task);
        return;
      }
      
      // Implementation details would go here
      this.logTaskEvent(task, `Processing assessment task with details:`, {
        taskType: task.taskType,
        difficultyLevel: task.data?.difficulty || 'default',
        topicCount: task.data?.topicIds?.length || 0
      });
      
      // Simulating task processing time
      await new Promise(resolve => setTimeout(resolve, 800));
      
      this.logTaskEvent(task, `Completed processing task successfully`);
    } catch (error) {
      this.logError(`Error processing task ${task.id}`, error);
      throw error; // Re-throw to let the TaskProcessor know the task failed
    }
  }
  
  /**
   * Process a test task specifically for testing the distribution pipeline
   * @param task The test task to process
   */
  private async processTestTask(task: AgentTask): Promise<void> {
    this.logTaskEvent(task, `Processing test task for distribution pipeline testing`);
    
    try {
      // Record that this agent has started processing the test task
      taskDistributionTester.recordAgentProcessing(task.id, this.type);
      
      // Simulate processing time (shorter for test tasks)
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Process based on task type
      const result = {
        agentType: this.type,
        processingTime: 300,
        assessmentGenerated: {
          questionCount: 10,
          adaptiveDifficulty: true,
          estimatedTime: '15 minutes'
        }
      };
      
      this.logTaskEvent(task, `Test task processed successfully with result:`, result);
      
      // Record successful completion
      taskDistributionTester.recordAgentCompletion(task.id, this.type, true, result);
      
    } catch (error) {
      this.logError(`Error processing test task ${task.id}`, error);
      
      // Record failure
      taskDistributionTester.recordAgentCompletion(task.id, this.type, false, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw error;
    }
  }
  
  /**
   * Receive and process a message from another agent or system
   * @param message The message to process
   */
  async receiveMessage(message: AgentMessage): Promise<void> {
    this.logMessageEvent(message, `Received message`);
    
    try {
      // Implementation would go here
      this.logMessageEvent(message, `Message processed`);
    } catch (error) {
      this.logError(`Error processing message of type ${message.type}`, error);
    }
  }
}
