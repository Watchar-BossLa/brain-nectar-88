
import { AgentMessage, AgentTask } from '../types';
import { BaseAgent } from '../baseAgent';
import { QuizQuestion } from '@/types/quiz';
import { agentIntegration } from '../../llm/agentIntegration';

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
    
    try {
      const questions = this.adaptQuestionsToUser(
        data.previousPerformance || [],
        data.topics || [],
        data.difficulty || 2,
        data.questionCount || 10
      );

      return {
        status: 'success',
        taskId: `assessment-${Date.now()}`,
        data: {
          assessment: {
            questions,
            metadata: {
              difficulty: data.difficulty,
              topicsCovered: data.topics,
              generatedAt: new Date().toISOString()
            }
          }
        }
      };
    } catch (error) {
      console.error('Error generating assessment:', error);
      return {
        status: 'error',
        taskId: `assessment-${Date.now()}`,
        message: 'Failed to generate assessment'
      };
    }
  }

  private adaptQuestionsToUser(
    previousPerformance: any[],
    topics: string[],
    difficulty: number,
    count: number
  ): QuizQuestion[] {
    // Import questions from our question bank
    const { quizQuestions } = require('@/components/quiz/data/quizQuestions');
    
    // Filter questions by topic if specified
    let availableQuestions = topics.length > 0
      ? quizQuestions.filter(q => topics.includes(q.topic))
      : quizQuestions;

    // Sort by difficulty match and topics
    availableQuestions.sort((a, b) => {
      return Math.abs(a.difficulty - difficulty) - Math.abs(b.difficulty - difficulty);
    });

    // Select the specified number of questions
    return availableQuestions.slice(0, count);
  }
}
