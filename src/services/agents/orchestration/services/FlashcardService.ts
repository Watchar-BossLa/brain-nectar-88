
import { MasterControlProgram } from '../../mcp';
import { AgentTask, AgentTypeEnum, TaskPriorityEnum, TaskTypeEnum } from '../../types';

/**
 * Flashcard Service
 * 
 * Handles operations related to flashcard generation and spaced repetition
 */
export class FlashcardService {
  private mcp: MasterControlProgram;
  
  constructor(mcp: MasterControlProgram) {
    this.mcp = mcp;
  }
  
  /**
   * Generate a sequence of flashcards with spaced repetition optimization
   */
  public async generateOptimizedFlashcards(
    userId: string,
    topicIds: string[],
    options?: {
      count?: number;
      includeFormulas?: boolean;
      difficultyRange?: [number, number];
      prioritizeWeakAreas?: boolean;
    }
  ): Promise<any> {
    console.log(`Generating optimized flashcards for user ${userId} on topics: ${topicIds.join(', ')}`);
    
    // Create task for flashcard generation and optimization
    const taskId = `flashcards-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    const flashcardTask: AgentTask = {
      id: taskId,
      userId,
      taskType: TaskTypeEnum.FLASHCARD_OPTIMIZATION,
      description: 'Generate optimized flashcard sequence',
      priority: TaskPriorityEnum.MEDIUM,
      targetAgentTypes: [AgentTypeEnum.LEARNING_PATH, AgentTypeEnum.COGNITIVE_PROFILE],
      context: ['flashcards', 'spaced_repetition', 'optimization'],
      data: { 
        topicIds,
        options: options || {
          count: 20,
          includeFormulas: true,
          difficultyRange: [0.3, 0.8],
          prioritizeWeakAreas: true
        }
      },
      createdAt: new Date().toISOString(),
    };
    
    // Submit the flashcard optimization task
    await this.mcp.submitTask(flashcardTask);
    
    return {
      status: 'processing',
      taskId: flashcardTask.id
    };
  }
}
