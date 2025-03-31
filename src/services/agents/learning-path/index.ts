import { AgentMessage, AgentTask, TaskType, MessageType } from '../types';
import { BaseAgent } from '../baseAgent';
import { calculateFlashcardRetention } from '@/services/spacedRepetition';
import { spacedRepetitionService } from '@/services/flashcards/spacedRepetitionService';
import { supabase } from '@/integrations/supabase/client';
import { calculateFlashcardRetention } from '@/hooks/flashcards/useFlashcardRetention';

/**
 * Learning Path Agent
 * 
 * Responsible for constructing and continuously optimizing personalized learning sequences.
 */
export class LearningPathAgent extends BaseAgent {
  constructor() {
    super('LEARNING_PATH');
  }
  
  async processTask(task: AgentTask): Promise<any> {
    console.log(`Learning Path Agent processing task: ${task.taskType}`);
    
    switch (task.taskType) {
      case 'LEARNING_PATH_GENERATION' as TaskType:
        return this.generateLearningPath(task.userId, task.data);
      case 'LEARNING_PATH_UPDATE' as TaskType:
        return this.updateLearningPath(task.userId, task.data);
      case 'FLASHCARD_SEQUENCE_OPTIMIZATION' as TaskType:
        return this.optimizeFlashcardSequence(task.userId, task.data);
      default:
        console.warn(`Learning Path Agent received unknown task type: ${task.taskType}`);
        return { status: 'error', message: 'Unknown task type' };
    }
  }
  
  receiveMessage(message: AgentMessage): void {
    console.log(`Learning Path Agent received message: ${message.type}`);
    // Handle messages from other agents
    if (message.type === 'NOTIFICATION') {
      // Check if this is a flashcard review notification
      if (message.content === 'FLASHCARD_REVIEW_COMPLETED' && message.data && message.data.userId) {
        // Trigger flashcard sequence optimization
        this.optimizeFlashcardSequence(message.data.userId, message.data);
      }
    }
  }
  
  private async generateLearningPath(userId: string, data: any): Promise<any> {
    console.log(`Generating learning path for user ${userId} with data:`, data);
    
    // Incorporate flashcard data in learning path generation
    const flashcardStats = await spacedRepetitionService.getFlashcardStats(userId);
    
    // Mock implementation - would connect to backend service in real implementation
    return {
      status: 'success',
      path: {
        modules: [
          {
            id: 'module-1',
            title: 'Introduction to Accounting',
            description: 'Fundamentals of accounting principles',
            topics: [
              { id: 'topic-1', title: 'The Accounting Equation', mastery: 0 },
              { id: 'topic-2', title: 'Double-Entry Bookkeeping', mastery: 0 }
            ]
          }
        ],
        flashcardRecommendations: {
          dueCount: flashcardStats.dueCards,
          recommendedReviewTime: this.getOptimalReviewTime(),
          masteryProgress: (flashcardStats.masteredCards / Math.max(flashcardStats.totalCards, 1)) * 100
        }
      }
    };
  }
  
  private async updateLearningPath(userId: string, data: any): Promise<any> {
    console.log(`Updating learning path for user ${userId} with data:`, data);
    
    // Mock implementation - would connect to backend service in real implementation
    return {
      status: 'success',
      message: 'Learning path updated successfully'
    };
  }
  
  private async optimizeFlashcardSequence(userId: string, data: any): Promise<any> {
    console.log(`Optimizing flashcard sequence for user ${userId}`);
    
    // Get retention data for all flashcards
    const retentionData = await calculateFlashcardRetention(userId);
    
    // Using data.cardRetention safely with nullish coalescing
    const cardRetentionData = retentionData.data?.cardRetention || {};
    const cardRetentionArray = Object.keys(cardRetentionData).map(id => ({
      id,
      ...cardRetentionData[id]
    }));
      
    // Calculate optimal review schedule based on retention data
    const recommendations = {
      overallRetention: Math.round((retentionData.data?.overallRetention || 0) * 100), // as percentage
      priorityCards: cardRetentionArray.slice(0, 5).map(card => card.id), // lowest retention cards
      optimalReviewTime: this.getOptimalReviewTime(),
      suggestedBatchSize: this.calculateOptimalBatchSize(cardRetentionArray.length)
    };
    
    return {
      status: 'success',
      recommendations
    };
  }
  
  private getOptimalReviewTime(): string {
    // Simple heuristic based on time of day
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 9) return 'morning';
    if (hour >= 9 && hour < 12) return 'mid-morning';
    if (hour >= 12 && hour < 15) return 'early afternoon';
    if (hour >= 15 && hour < 18) return 'late afternoon';
    if (hour >= 18 && hour < 21) return 'evening';
    return 'night';
  }
  
  private calculateOptimalBatchSize(dueCardCount: number): number {
    // Heuristic: 10-20 cards per session is ideal for most learners
    // But adapt based on how many are due
    if (dueCardCount <= 5) return dueCardCount;
    if (dueCardCount <= 10) return 10;
    if (dueCardCount <= 30) return 15;
    return 20;
  }
}

export const analyzeRetentionPatterns = async (userId: string) => {
  try {
    const retention = await calculateFlashcardRetention(userId);
    if (!retention.success) {
      console.error('Failed to calculate flashcard retention');
      return [];
    }
    
    // Use the overallRetention property from data object
    const overallRetention = retention.data?.overallRetention || 0.75;
    
    // Return recommendations based on retention rate
    if (overallRetention < 0.6) {
      return [
        'Your retention is below average. Consider shorter, more frequent review sessions.',
        'Focus on understanding concepts before memorizing details.'
      ];
    } else if (overallRetention < 0.8) {
      return [
        'Your retention is good, but could be improved.',
        'Try using more varied practice techniques like active recall.'
      ];
    } else {
      return [
        'Your retention is excellent!',
        'Consider increasing the interval between reviews to optimize your time.'
      ];
    }
  } catch (error) {
    console.error('Error analyzing retention patterns:', error);
    return [];
  }
};

export const getSpacedRepetitionData = async (userId: string) => {
  try {
    // Get flashcard data
    const { data: flashcards, error: flashcardsError } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId);
      
    if (flashcardsError) {
      console.error('Error fetching flashcards:', flashcardsError);
      return { success: false, error: flashcardsError.message };
    }
    
    // Get review data
    const { data: reviews, error: reviewsError } = await supabase
      .from('flashcard_reviews')
      .select('*')
      .eq('user_id', userId);
      
    if (reviewsError) {
      console.error('Error fetching flashcard reviews:', reviewsError);
      return { success: false, error: reviewsError.message };
    }
    
    // Calculate retention stats
    const retentionResult = await calculateFlashcardRetention(userId);
    
    // Return combined data
    return {
      success: true,
      data: {
        flashcards: flashcards || [],
        reviews: reviews || [],
        retention: retentionResult?.data || {
          overallRetention: 0,
          cardRetention: {},
          retentionByDay: {}
        }
      }
    };
  } catch (error) {
    console.error('Error in getSpacedRepetitionData:', error);
    return { success: false, error: 'Failed to get spaced repetition data' };
  }
};

export const getUserPerformanceData = async (userId: string) => {
  try {
    // Get quiz performance metrics
    const { data: quizPerformance, error: quizError } = await supabase
      .from('quiz_performance_metrics')
      .select('*')
      .eq('user_id', userId);
      
    if (quizError) {
      console.error('Error fetching quiz performance:', quizError);
      return { success: false, error: quizError.message };
    }
    
    // Get flashcard retention
    const retentionResult = await calculateFlashcardRetention(userId);
    const flashcardRetention = retentionResult.data;
    
    // Return combined data
    return {
      success: true,
      data: {
        quizPerformance: quizPerformance || [],
        flashcardRetention
      }
    };
  } catch (error) {
    console.error('Error in getUserPerformanceData:', error);
    return { success: false, error: 'Failed to get user performance data' };
  }
};
