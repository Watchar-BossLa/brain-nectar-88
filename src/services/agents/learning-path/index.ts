
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { BaseAgent } from '../mcp/BaseAgent';
import { Task, TaskCategory } from '../types/taskTypes';

// Implement BaseAgent interface
export class LearningPathAgent implements BaseAgent {
  id: string;
  
  constructor() {
    this.id = `learning-path-agent-${uuidv4().substring(0, 8)}`;
    console.log(`LearningPathAgent initialized with ID: ${this.id}`);
  }
  
  getType(): string {
    return TaskCategory.LEARNING_PATH;
  }
  
  async processTask(task: Task): Promise<void> {
    console.log(`LearningPathAgent ${this.id} processing task ${task.id}`);
    
    try {
      if (task.category !== TaskCategory.LEARNING_PATH) {
        throw new Error(`LearningPathAgent cannot handle task category ${task.category}`);
      }
      
      // Extract the user ID from the task payload
      const userId = task.payload?.userId;
      if (!userId) {
        throw new Error('Task payload is missing user ID');
      }
      
      // Gather user information, preferences and learning history
      const userInfo = await this.getUserInfo(userId);
      
      // Generate a personalized learning path
      const learningPath = await this.generateLearningPath(userId, userInfo);
      
      // Store the learning path
      await this.storeLearningPath(userId, learningPath);
      
      console.log(`Learning path generated for user ${userId}`);
    } catch (error) {
      console.error(`Error in LearningPathAgent processing task ${task.id}:`, error);
    }
  }
  
  receiveMessage(message: any): void {
    console.log(`LearningPathAgent ${this.id} received message from ${message.sender}`);
  }
  
  private async getUserInfo(userId: string): Promise<any> {
    try {
      // Get user profile
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileError || !userProfile) {
        throw new Error(`Error fetching user profile: ${profileError?.message || 'User profile not found'}`);
      }
      
      // For now, we'll just mock some learning preferences and knowledge areas
      const learningPreferences = {
        learningStyle: 'visual',
        preferredTimeOfDay: 'evening',
        sessionDuration: 30
      };
      
      const knowledgeAreas = {
        accounting: 'intermediate',
        finance: 'beginner',
        taxation: 'advanced'
      };
      
      // Get recent quiz performance
      const { data: quizPerformance, error: quizError } = await supabase
        .from('quiz_performance_metrics')
        .select('*')
        .eq('user_id', userId);
        
      if (quizError) {
        console.warn(`Error fetching quiz performance: ${quizError.message}`);
      }
      
      return {
        profile: userProfile,
        learningPreferences,
        knowledgeAreas,
        quizPerformance: quizPerformance || []
      };
    } catch (error) {
      console.error('Error getting user info:', error);
      return {
        profile: {},
        learningPreferences: {},
        knowledgeAreas: {},
        quizPerformance: []
      };
    }
  }
  
  private async generateLearningPath(userId: string, userInfo: any): Promise<any> {
    // In a real implementation, this would use AI/LLMs to generate a personalized path
    // For now, we'll create a simple mock learning path
    
    const learningPath = {
      userId,
      generatedAt: new Date().toISOString(),
      recommendedModules: [
        {
          moduleId: 'module-1',
          title: 'Financial Accounting Basics',
          reason: 'Matches your beginner level in finance',
          priority: 'high'
        },
        {
          moduleId: 'module-2',
          title: 'Intermediate Accounting Concepts',
          reason: 'Aligns with your intermediate accounting knowledge',
          priority: 'medium'
        },
        {
          moduleId: 'module-3',
          title: 'Advanced Tax Planning',
          reason: 'Reinforces your advanced taxation knowledge',
          priority: 'low'
        }
      ],
      dailyGoals: {
        flashcardReviews: 10,
        quizQuestions: 5,
        readingTimeMinutes: 20
      },
      adaptivityRules: {
        increaseDifficultyThreshold: 0.85,
        decreaseDifficultyThreshold: 0.60
      }
    };
    
    return learningPath;
  }
  
  private async storeLearningPath(userId: string, learningPath: any): Promise<void> {
    // In a real implementation, this would store the learning path in the database
    console.log(`Storing learning path for user ${userId}:`, learningPath);
    
    // For now, we'll just log it
    return;
  }
}

// Export a function to create a new agent instance
export const createLearningPathAgent = (): BaseAgent => {
  return new LearningPathAgent();
};
