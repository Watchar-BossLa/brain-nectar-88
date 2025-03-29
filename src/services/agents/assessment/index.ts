
import { AgentMessage, AgentTask } from '../types';
import { BaseAgent } from '../baseAgent';
import { QuizQuestion } from '@/types/quiz';
import { agentIntegration } from '../../llm/agentIntegration';

/**
 * Assessment Agent
 * 
 * Evaluates understanding and creates targeted assessment opportunities.
 */
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
    // Handle messages from other agents
  }
  
  private async generateAssessment(userId: string, data: any): Promise<any> {
    console.log(`Generating assessment for user ${userId} with data:`, data);
    
    const { 
      topics = [], 
      difficulty = 2,
      previousPerformance = [],
      questionCount = 10
    } = data;

    try {
      // Use LLM integration to enhance question generation
      const llmResult = await agentIntegration.processAgentTask({
        id: `gen-questions-${Date.now()}`,
        userId,
        taskType: 'ASSESSMENT_GENERATION',
        description: 'Generate adaptive quiz questions',
        priority: 'HIGH',
        targetAgentTypes: ['ASSESSMENT'],
        context: ['quiz', 'adaptive_learning'],
        data: {
          topics,
          difficulty,
          previousPerformance,
          questionCount
        },
        createdAt: new Date().toISOString()
      });

      // Analyze user's previous performance to adjust difficulty
      const performanceAnalysis = this.analyzePerformance(previousPerformance);
      
      // Generate questions based on performance and topics
      const questions = this.adaptQuestionsToUser(
        performanceAnalysis, 
        topics, 
        difficulty,
        questionCount
      );

      return {
        status: 'success',
        assessment: {
          questions,
          recommendedTopics: performanceAnalysis.recommendedTopics,
          adaptiveDifficulty: performanceAnalysis.suggestedDifficulty
        }
      };
    } catch (error) {
      console.error('Error generating assessment:', error);
      return {
        status: 'error',
        message: 'Failed to generate assessment'
      };
    }
  }

  private analyzePerformance(previousPerformance: any[]): any {
    const analysis = {
      topicPerformance: {},
      overallAccuracy: 0,
      suggestedDifficulty: 2,
      recommendedTopics: []
    };

    if (!previousPerformance.length) {
      return analysis;
    }

    // Calculate performance metrics
    const totalQuestions = previousPerformance.length;
    const correctAnswers = previousPerformance.filter(p => p.isCorrect).length;
    analysis.overallAccuracy = correctAnswers / totalQuestions;

    // Analyze performance by topic
    previousPerformance.forEach(question => {
      if (!analysis.topicPerformance[question.topic]) {
        analysis.topicPerformance[question.topic] = {
          correct: 0,
          total: 0
        };
      }
      
      analysis.topicPerformance[question.topic].total++;
      if (question.isCorrect) {
        analysis.topicPerformance[question.topic].correct++;
      }
    });

    // Determine topics that need improvement
    analysis.recommendedTopics = Object.entries(analysis.topicPerformance)
      .filter(([_, stats]: [string, any]) => stats.correct / stats.total < 0.7)
      .map(([topic]) => topic);

    // Suggest difficulty based on overall performance
    if (analysis.overallAccuracy > 0.8) {
      analysis.suggestedDifficulty = Math.min(3, analysis.suggestedDifficulty + 1);
    } else if (analysis.overallAccuracy < 0.4) {
      analysis.suggestedDifficulty = Math.max(1, analysis.suggestedDifficulty - 1);
    }

    return analysis;
  }

  private adaptQuestionsToUser(
    performanceAnalysis: any,
    topics: string[],
    baseDifficulty: number,
    count: number
  ): QuizQuestion[] {
    // Import questions from our question bank
    const { quizQuestions } = require('@/components/quiz/data/quizQuestions');
    
    // Filter questions by topic if specified
    let availableQuestions = topics.length > 0
      ? quizQuestions.filter(q => topics.includes(q.topic))
      : quizQuestions;

    // Adjust difficulty based on performance
    const targetDifficulty = performanceAnalysis.suggestedDifficulty || baseDifficulty;
    
    // Prioritize questions from recommended topics
    const recommendedTopics = new Set(performanceAnalysis.recommendedTopics);
    availableQuestions.sort((a, b) => {
      // Prioritize questions from recommended topics
      const aRecommended = recommendedTopics.has(a.topic) ? 1 : 0;
      const bRecommended = recommendedTopics.has(b.topic) ? 1 : 0;
      
      if (aRecommended !== bRecommended) {
        return bRecommended - aRecommended;
      }
      
      // Then sort by closeness to target difficulty
      return Math.abs(a.difficulty - targetDifficulty) - Math.abs(b.difficulty - targetDifficulty);
    });

    // Select the specified number of questions
    return availableQuestions.slice(0, count);
  }
}

