
import { AgentMessage, AgentTask, AgentType } from '../../types';
import { TaskProcessor } from '../taskProcessor';
import { CommunicationManager } from '../communication';

export class TaskManagementService {
  constructor(
    private taskProcessor: TaskProcessor,
    private communicationManager: CommunicationManager
  ) {}

  public async submitTask(task: AgentTask): Promise<void> {
    await this.taskProcessor.submitTask(task);
  }

  public broadcastMessage(message: AgentMessage, targetAgents?: AgentType[]): void {
    this.communicationManager.broadcastMessage(message, targetAgents);
  }

  public setLLMOrchestrationEnabled(enabled: boolean): void {
    this.taskProcessor.setLLMOrchestrationEnabled(enabled);
  }
}
