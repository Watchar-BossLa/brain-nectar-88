
import { AgentMessage, AgentTask } from '../types';
import { BaseAgent } from '../baseAgent';
import { AssessmentService } from './assessmentService';

export class AssessmentAgent extends BaseAgent {
  constructor() {
    super('ASSESSMENT');
  }
  
  async processTask(task: AgentTask): Promise<any> {
    console.log(`Assessment Agent processing task: ${task.taskType}`);
    
    switch (task.taskType) {
      case 'ASSESSMENT_GENERATION':
        return this.generateAssessment(task.userId, task.data);
      default:
        console.warn(`Assessment Agent received unknown task type: ${task.taskType}`);
        return { status: 'error', message: 'Unknown task type' };
    }
  }
  
  receiveMessage(message: AgentMessage): void {
    console.log(`Assessment Agent received message: ${message.type}`);
  }
  
  private async generateAssessment(userId: string, data: any): Promise<any> {
    console.log(`Generating assessment for user ${userId} with data:`, data);
    return AssessmentService.generateAssessment(userId, data);
  }
}
