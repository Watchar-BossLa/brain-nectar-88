
import { supabase } from '@/integrations/supabase/client';
import { OpenAI, generateText } from '@/integrations/openai';
import { AbstractBaseAgent, AgentMessage } from '@/services/agents/mcp/BaseAgent';
import { LearningPathPrompts } from './prompts';
import { calculateRetention } from '@/services/spacedRepetition/algorithm';

interface UserProfile {
  id: string;
  learning_preferences?: string[];
  knowledge_areas?: string[];
}

class LearningPathAgent extends AbstractBaseAgent {
  constructor() {
    super('learning-path-agent', 'Learning Path Agent', 'learning-path');
  }

  async processTask(task: any): Promise<any> {
    switch (task.type) {
      case 'generate-path':
        return await this.generateLearningPath(task.userId);
      case 'update-path':
        return await this.updateLearningPath(task.userId, task.quizResults);
      default:
        throw new Error(`Unknown task type: ${task.type}`);
    }
  }

  async receiveMessage(message: AgentMessage): Promise<void> {
    await super.receiveMessage(message);
    
    if (message.metadata?.type === 'update-learning-path') {
      const userId = message.metadata.userId;
      await this.updateLearningPath(userId, null);
    }
  }

  /**
   * Generate a personalized learning path for a user
   */
  async generateLearningPath(userId: string): Promise<any> {
    try {
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        throw new Error('Failed to fetch user profile');
      }

      // Since properties might not exist on the profile, create default values
      const learning_preferences = profile.learning_preferences || ['visual', 'practice'];
      const knowledge_areas = profile.knowledge_areas || ['basic accounting'];
      
      // Get user's quiz results
      const { data: quizResults, error: quizError } = await supabase
        .from('quiz_sessions')
        .select('*, quiz_answered_questions(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (quizError) {
        console.error('Error fetching quiz results:', quizError);
        throw new Error('Failed to fetch quiz results');
      }
      
      // Analyze quiz results to identify knowledge gaps
      const topicPerformance: Record<string, { correct: number; total: number }> = {};
      
      quizResults?.forEach(session => {
        const questions = session.quiz_answered_questions || [];
        
        questions.forEach((q: any) => {
          if (!q.topic) return;
          
          if (!topicPerformance[q.topic]) {
            topicPerformance[q.topic] = { correct: 0, total: 0 };
          }
          
          topicPerformance[q.topic].total += 1;
          if (q.is_correct) {
            topicPerformance[q.topic].correct += 1;
          }
        });
      });
      
      // Find topics with low performance
      const weakTopics = Object.entries(topicPerformance)
        .filter(([_, stats]) => (stats.correct / stats.total) < 0.7)
        .map(([topic]) => topic);
      
      // Generate learning path with AI
      const prompt = `
        ${LearningPathPrompts.GENERATION}
        
        User profile:
        - Learning preferences: ${learning_preferences.join(', ')}
        - Knowledge areas: ${knowledge_areas.join(', ')}
        - Weak topics: ${weakTopics.join(', ') || 'None identified yet'}
        
        Generate a structured learning path with 3-5 stages, with specific resources and activities for each stage.
      `;
      
      const pathContent = await generateText(prompt);
      
      // Store the learning path
      const pathData = {
        stages: [
          {
            name: 'Fundamentals',
            topics: weakTopics.length > 0 ? weakTopics : ['Accounting Basics'],
            resources: ['Intro to Financial Accounting', 'Basic Accounting Principles'],
            activities: ['Study key terms', 'Practice basic transactions']
          },
          {
            name: 'Intermediate Concepts',
            topics: ['Financial Statements', 'Cash Flow Analysis'],
            resources: ['Understanding Financial Statements', 'Cash Flow Essentials'],
            activities: ['Analyze sample financial statements', 'Create cash flow projections']
          },
          {
            name: 'Advanced Application',
            topics: ['Advanced Financial Analysis', 'Decision Making'],
            resources: ['Financial Analysis Techniques', 'Decision Making Framework'],
            activities: ['Case studies', 'Decision simulation exercises']
          }
        ],
        generatedContent: pathContent,
        createdAt: new Date().toISOString()
      };
      
      // Save to database
      const { data: savedPath, error: saveError } = await supabase
        .from('user_learning_paths')
        .upsert({
          user_id: userId,
          path_data: pathData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_active: true
        })
        .select();
        
      if (saveError) {
        console.error('Error saving learning path:', saveError);
        throw new Error('Failed to save learning path');
      }
      
      return { 
        success: true, 
        message: 'Learning path generated successfully',
        path: pathData
      };
    } catch (error) {
      console.error('Error generating learning path:', error);
      return { 
        success: false, 
        message: 'Failed to generate learning path',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Update an existing learning path based on recent performance
   */
  async updateLearningPath(userId: string, quizResults: any = null): Promise<any> {
    try {
      // Get existing learning path
      const { data: existingPath, error: pathError } = await supabase
        .from('user_learning_paths')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();
        
      if (pathError) {
        console.error('Error fetching learning path:', pathError);
        // If no path exists, generate a new one
        if (pathError.message.includes('No rows found')) {
          return this.generateLearningPath(userId);
        }
        throw new Error('Failed to fetch learning path');
      }

      // Get recent quiz results if not provided
      let recentQuizData = quizResults;
      if (!recentQuizData) {
        const { data: recentQuiz, error: quizError } = await supabase
          .from('quiz_sessions')
          .select('*, quiz_answered_questions(*)')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (quizError) {
          console.error('Error fetching quiz results:', quizError);
          throw new Error('Failed to fetch quiz results');
        }
        
        recentQuizData = recentQuiz;
      }
      
      // Extract path data
      const pathData = existingPath.path_data || {};
      
      // Update with AI
      const prompt = `
        ${LearningPathPrompts.UPDATE}
        
        Current learning path:
        ${JSON.stringify(pathData.stages || [])}
        
        Recent quiz performance:
        ${JSON.stringify(recentQuizData || [])}
        
        Update the learning path to address recent performance issues and maintain progression.
      `;
      
      const updatedContent = await generateText(prompt);
      
      // Update path data
      const updatedPathData = {
        ...pathData,
        stages: pathData.stages || [],
        generatedContent: updatedContent,
        updatedAt: new Date().toISOString()
      };
      
      // Save updated path
      const { data: savedPath, error: saveError } = await supabase
        .from('user_learning_paths')
        .update({
          path_data: updatedPathData,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingPath.id)
        .select();
        
      if (saveError) {
        console.error('Error updating learning path:', saveError);
        throw new Error('Failed to update learning path');
      }
      
      return { 
        success: true, 
        message: 'Learning path updated successfully',
        path: updatedPathData
      };
    } catch (error) {
      console.error('Error updating learning path:', error);
      return { 
        success: false, 
        message: 'Failed to update learning path',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Export a singleton instance
export const learningPathAgent = new LearningPathAgent();
