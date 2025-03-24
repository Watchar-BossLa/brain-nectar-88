
import { AgentMessage, AgentTask, AgentType, TaskStatus } from './types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Base Agent
 * 
 * Abstract base class for all specialized agents.
 */
export abstract class BaseAgent {
  protected abstract type: AgentType;
  protected messageQueue: AgentMessage[] = [];
  protected processingTask: boolean = false;
  
  /**
   * Get the type of this agent
   */
  public getType(): AgentType {
    return this.type;
  }
  
  /**
   * Process a task assigned to this agent
   */
  public async processTask(task: AgentTask): Promise<void> {
    console.log(`${this.type} agent processing task:`, task.id);
    
    if (this.processingTask) {
      console.warn(`${this.type} agent is already processing a task. Queueing task:`, task.id);
      // In a real implementation, we would queue this task
      // For simplicity, we're just continuing
    }
    
    this.processingTask = true;
    
    try {
      // Update task status
      await this.updateTaskStatus(task.id, 'IN_PROGRESS');
      
      // Delegate to the agent-specific implementation
      const result = await this.executeTask(task);
      
      // Update task status and result
      await this.updateTaskStatus(task.id, 'COMPLETED', result);
      
      console.log(`${this.type} agent completed task:`, task.id);
    } catch (error) {
      console.error(`${this.type} agent failed to process task:`, task.id, error);
      
      // Update task status as failed
      await this.updateTaskStatus(task.id, 'FAILED', null, 
        error instanceof Error ? error.message : 'Unknown error');
    } finally {
      this.processingTask = false;
    }
  }
  
  /**
   * Execute a task (to be implemented by specialized agents)
   */
  protected abstract executeTask(task: AgentTask): Promise<any>;
  
  /**
   * Receive a message from another agent or the MCP
   */
  public receiveMessage(message: AgentMessage): void {
    console.log(`${this.type} agent received message:`, message);
    this.messageQueue.push(message);
    this.processMessages();
  }
  
  /**
   * Process queued messages
   */
  protected processMessages(): void {
    // Process all messages in the queue
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.handleMessage(message);
      }
    }
  }
  
  /**
   * Handle a single message (to be implemented by specialized agents)
   */
  protected abstract handleMessage(message: AgentMessage): void;
  
  /**
   * Send a message to another agent through the MCP
   */
  protected sendMessage(targetAgentType: AgentType, content: string, data: Record<string, any> = {}): void {
    // In a real implementation, this would communicate with the MCP
    // For simplicity, we're just logging
    console.log(`${this.type} agent sending message to ${targetAgentType}:`, content);
    
    // Here we would call the MCP to route the message
    // For now, we're just creating the message object
    const message: AgentMessage = {
      type: 'TASK',
      content,
      data,
      timestamp: new Date().toISOString(),
      senderId: this.type,
      targetId: targetAgentType
    };
    
    // This is where we would send the message to the MCP
    // mcp.routeMessage(message);
  }
  
  /**
   * Update the status of a task
   */
  private async updateTaskStatus(
    taskId: string, 
    status: TaskStatus, 
    result: any = null, 
    errorMessage: string | null = null
  ): Promise<void> {
    // In a real implementation, this would update the task status in a database
    console.log(`Updating task ${taskId} status to ${status}`);
    
    // If we had a tasks table in the database, we would update it here
    /*
    try {
      await supabase
        .from('agent_tasks')
        .update({
          status,
          result,
          error_message: errorMessage,
          completed_at: status === 'COMPLETED' || status === 'FAILED' 
            ? new Date().toISOString() 
            : null
        })
        .eq('id', taskId);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
    */
  }
  
  /**
   * Log agent activity (for debugging and monitoring)
   */
  protected log(message: string, data: any = {}): void {
    console.log(`[${this.type}] ${message}`, data);
  }
}
