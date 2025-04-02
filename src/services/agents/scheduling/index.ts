
import { AgentMessage, AgentTask } from '../types';
import { BaseAgent } from '../baseAgent';
import { ScheduleOptimizer } from './scheduleOptimizer';
import { FlashcardScheduler } from './flashcardScheduler';
import { SpacedRepetitionScheduler } from './spacedRepetitionScheduler';
import { ExamPrepPlanner } from './examPrepPlanner';

/**
 * Scheduling Agent
 * 
 * Optimizes study timing and session structure.
 */
export class SchedulingAgent extends BaseAgent {
  private scheduleOptimizer: ScheduleOptimizer;
  private flashcardScheduler: FlashcardScheduler;
  private spacedRepetitionScheduler: SpacedRepetitionScheduler;
  private examPrepPlanner: ExamPrepPlanner;

  constructor() {
    super('SCHEDULING');
    this.scheduleOptimizer = new ScheduleOptimizer();
    this.flashcardScheduler = new FlashcardScheduler();
    this.spacedRepetitionScheduler = new SpacedRepetitionScheduler();
    this.examPrepPlanner = new ExamPrepPlanner();
  }
  
  async processTask(task: AgentTask): Promise<any> {
    console.log(`Scheduling Agent processing task: ${task.taskType}`);
    
    switch (task.taskType) {
      case 'SCHEDULE_OPTIMIZATION':
        return this.scheduleOptimizer.optimizeSchedule(task.userId, task.data);
      case 'FLASHCARD_OPTIMIZATION':
        return this.flashcardScheduler.optimizeFlashcards(task.userId, task.data);
      default:
        console.warn(`Scheduling Agent received unknown task type: ${task.taskType}`);
        return { status: 'error', message: 'Unknown task type' };
    }
  }
  
  receiveMessage(message: AgentMessage): void {
    console.log(`Scheduling Agent received message: ${message.type}`);
    // Handle messages from other agents
  }
  
  async optimizeSchedule(userId: string, data: any): Promise<any> {
    return this.scheduleOptimizer.optimizeSchedule(userId, data);
  }
  
  async optimizeFlashcards(userId: string, data: any): Promise<any> {
    return this.flashcardScheduler.optimizeFlashcards(userId, data);
  }
  
  async createSpacedRepetitionSchedule(userId: string, data: any): Promise<any> {
    return this.spacedRepetitionScheduler.createSchedule(userId, data);
  }
  
  async createExamPrepPlan(userId: string, data: any): Promise<any> {
    return this.examPrepPlanner.createPlan(userId, data);
  }
}
