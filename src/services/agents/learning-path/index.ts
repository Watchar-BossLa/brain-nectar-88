import { supabase } from '@/integrations/supabase/client';
import { OpenAI } from '@/integrations/openai';
import { TaskCategory } from '@/types/task-category';
import { LearningPathPrompts } from './prompts';
import { calculateRetention } from '@/services/spacedRepetition';

// Use a different name for the local method to avoid naming conflicts
const calculateCardRetention = (flashcardId: string) => {
  return calculateRetention({ id: flashcardId } as any);
};

export class LearningPathAgent {
  private openai: OpenAI;
  
  constructor() {
    this.openai = new OpenAI();
  }
  
  async generateLearningPath(userId: string, qualificationId: string, options: {
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    timeframe?: number; // weeks
    focusAreas?: string[];
  }) {
    try {
      // Get user's existing knowledge and preferences
      const { data: userData, error: userError } = await supabase
        .from('user_profiles')
        .select('learning_preferences, knowledge_areas')
        .eq('user_id', userId)
        .single();
        
      if (userError) throw userError;
      
      // Get qualification details
      const { data: qualificationData, error: qualError } = await supabase
        .from('qualifications')
        .select('*')
        .eq('id', qualificationId)
        .single();
        
      if (qualError) throw qualError;
      
      // Get user's flashcard mastery data
      const { data: flashcardData, error: flashcardError } = await supabase
        .from('flashcards')
        .select('id, topic_id, mastery_level')
        .eq('user_id', userId);
        
      if (flashcardError) throw flashcardError;
      
      // Calculate topic mastery levels
      const topicMastery: Record<string, number> = {};
      
      if (flashcardData) {
        flashcardData.forEach(card => {
          if (!card.topic_id) return;
          
          if (!topicMastery[card.topic_id]) {
            topicMastery[card.topic_id] = 0;
          }
          
          // Count cards and sum mastery
          topicMastery[card.topic_id] += card.mastery_level || 0;
        });
        
        // Calculate average mastery per topic
        Object.keys(topicMastery).forEach(topicId => {
          const topicCards = flashcardData.filter(card => card.topic_id === topicId);
          if (topicCards.length > 0) {
            topicMastery[topicId] = topicMastery[topicId] / topicCards.length;
          }
        });
      }
      
      // Get qualification topics
      const { data: topicsData, error: topicsError } = await supabase
        .from('topics')
        .select('*')
        .eq('qualification_id', qualificationId);
        
      if (topicsError) throw topicsError;
      
      // Prepare data for AI
      const promptData = {
        qualification: qualificationData,
        topics: topicsData,
        userPreferences: userData?.learning_preferences || {},
        userKnowledge: userData?.knowledge_areas || [],
        topicMastery: topicMastery,
        options: options
      };
      
      // Generate learning path with AI
      const response = await this.openai.createChatCompletion({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: LearningPathPrompts.SYSTEM_PROMPT },
          { role: 'user', content: this.formatLearningPathPrompt(promptData) }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        category: TaskCategory.LEARNING_PATH
      });
      
      if (!response.choices || response.choices.length === 0) {
        throw new Error('Failed to generate learning path');
      }
      
      // Parse AI response
      const learningPathData = this.parseLearningPathResponse(response.choices[0].message.content);
      
      // Save learning path to database
      const { data: pathData, error: pathError } = await supabase
        .from('user_learning_paths')
        .upsert({
          user_id: userId,
          qualification_id: qualificationId,
          path_data: learningPathData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: 'active'
        })
        .select()
        .single();
        
      if (pathError) throw pathError;
      
      return {
        success: true,
        learningPath: pathData
      };
      
    } catch (error) {
      console.error('Error generating learning path:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  private formatLearningPathPrompt(data: any): string {
    return `
      Please create a personalized learning path for the following qualification:
      
      QUALIFICATION:
      ${JSON.stringify(data.qualification, null, 2)}
      
      TOPICS:
      ${JSON.stringify(data.topics, null, 2)}
      
      USER PREFERENCES:
      ${JSON.stringify(data.userPreferences, null, 2)}
      
      USER KNOWLEDGE AREAS:
      ${JSON.stringify(data.userKnowledge, null, 2)}
      
      TOPIC MASTERY LEVELS:
      ${JSON.stringify(data.topicMastery, null, 2)}
      
      OPTIONS:
      Difficulty: ${data.options.difficulty || 'intermediate'}
      Timeframe: ${data.options.timeframe || 12} weeks
      Focus Areas: ${data.options.focusAreas ? JSON.stringify(data.options.focusAreas) : 'None specified'}
      
      Please structure the learning path with modules and topics, including estimated study times,
      prerequisites, and recommended resources. The output should be valid JSON.
    `;
  }
  
  private parseLearningPathResponse(response: string): any {
    try {
      // Extract JSON from the response
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || 
                        response.match(/```\n([\s\S]*?)\n```/) ||
                        response.match(/{[\s\S]*}/);
                        
      if (jsonMatch) {
        const jsonString = jsonMatch[0].startsWith('{') ? jsonMatch[0] : jsonMatch[1];
        return JSON.parse(jsonString);
      }
      
      // If no JSON format is found, try to parse the entire response
      return JSON.parse(response);
    } catch (error) {
      console.error('Error parsing learning path response:', error);
      throw new Error('Failed to parse learning path response');
    }
  }
  
  async updateLearningPathProgress(userId: string, pathId: string, topicId: string, status: string, masteryLevel: number) {
    try {
      // Get current learning path
      const { data: pathData, error: pathError } = await supabase
        .from('user_learning_paths')
        .select('*')
        .eq('id', pathId)
        .eq('user_id', userId)
        .single();
        
      if (pathError) throw pathError;
      
      if (!pathData || !pathData.path_data) {
        throw new Error('Learning path not found');
      }
      
      // Update topic status in path data
      const updatedPathData = { ...pathData.path_data };
      
      // Find and update the topic
      let topicFound = false;
      
      if (updatedPathData.modules) {
        for (const module of updatedPathData.modules) {
          if (module.topics) {
            for (const topic of module.topics) {
              if (topic.id === topicId) {
                topic.status = status;
                topic.mastery_level = masteryLevel;
                topicFound = true;
                break;
              }
            }
          }
          
          if (topicFound) break;
        }
      }
      
      if (!topicFound) {
        throw new Error('Topic not found in learning path');
      }
      
      // Update module status based on topics
      if (updatedPathData.modules) {
        for (const module of updatedPathData.modules) {
          if (module.topics && module.topics.length > 0) {
            const completedTopics = module.topics.filter(t => t.status === 'completed').length;
            const totalTopics = module.topics.length;
            
            if (completedTopics === totalTopics) {
              module.status = 'completed';
            } else if (completedTopics > 0) {
              module.status = 'in_progress';
            } else {
              module.status = 'not_started';
            }
          }
        }
      }
      
      // Update learning path in database
      const { data: updatedPath, error: updateError } = await supabase
        .from('user_learning_paths')
        .update({
          path_data: updatedPathData,
          updated_at: new Date().toISOString()
        })
        .eq('id', pathId)
        .eq('user_id', userId)
        .select()
        .single();
        
      if (updateError) throw updateError;
      
      return {
        success: true,
        learningPath: updatedPath
      };
      
    } catch (error) {
      console.error('Error updating learning path progress:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  async getTopicRecommendations(userId: string, qualificationId: string) {
    try {
      // Get user's flashcard data
      const { data: flashcardData, error: flashcardError } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', userId);
        
      if (flashcardError) throw flashcardError;
      
      // Get qualification topics
      const { data: topicsData, error: topicsError } = await supabase
        .from('topics')
        .select('*')
        .eq('qualification_id', qualificationId);
        
      if (topicsError) throw topicsError;
      
      // Calculate topic mastery and identify weak areas
      const topicStats: Record<string, {
        totalCards: number;
        avgMastery: number;
        avgRetention: number;
        dueCards: number;
        lastStudied: string | null;
      }> = {};
      
      // Initialize stats for all topics
      if (topicsData) {
        topicsData.forEach(topic => {
          topicStats[topic.id] = {
            totalCards: 0,
            avgMastery: 0,
            avgRetention: 0,
            dueCards: 0,
            lastStudied: null
          };
        });
      }
      
      // Calculate stats from flashcards
      if (flashcardData) {
        const now = new Date();
        
        flashcardData.forEach(card => {
          if (!card.topic_id || !topicStats[card.topic_id]) return;
          
          const stats = topicStats[card.topic_id];
          stats.totalCards++;
          
          // Add mastery
          stats.avgMastery += card.mastery_level || 0;
          
          // Calculate retention
          const retention = calculateCardRetention(card.id);
          stats.avgRetention += retention;
          
          // Check if card is due
          if (card.next_review_date) {
            const reviewDate = new Date(card.next_review_date);
            if (reviewDate <= now) {
              stats.dueCards++;
            }
          }
          
          // Track last studied date
          if (card.last_reviewed_at) {
            const reviewedDate = new Date(card.last_reviewed_at);
            if (!stats.lastStudied || reviewedDate > new Date(stats.lastStudied)) {
              stats.lastStudied = card.last_reviewed_at;
            }
          }
        });
        
        // Calculate averages
        Object.keys(topicStats).forEach(topicId => {
          const stats = topicStats[topicId];
          if (stats.totalCards > 0) {
            stats.avgMastery = stats.avgMastery / stats.totalCards;
            stats.avgRetention = stats.avgRetention / stats.totalCards;
          }
        });
      }
      
      // Sort topics by priority (due cards, low mastery, not recently studied)
      const prioritizedTopics = topicsData
        ? topicsData.map(topic => {
            const stats = topicStats[topic.id];
            const dueFactor = stats.dueCards * 10;
            const masteryFactor = (1 - stats.avgMastery) * 100;
            const retentionFactor = (1 - stats.avgRetention) * 50;
            
            // Calculate recency factor
            let recencyFactor = 0;
            if (!stats.lastStudied) {
              recencyFactor = 100; // Never studied
            } else {
              const daysSinceStudied = (Date.now() - new Date(stats.lastStudied).getTime()) / (1000 * 60 * 60 * 24);
              recencyFactor = Math.min(daysSinceStudied * 2, 100);
            }
            
            const priorityScore = dueFactor + masteryFactor + retentionFactor + recencyFactor;
            
            return {
              ...topic,
              stats,
              priorityScore
            };
          })
          .sort((a, b) => b.priorityScore - a.priorityScore)
        : [];
      
      return {
        success: true,
        recommendations: prioritizedTopics.slice(0, 5),
        topicStats
      };
      
    } catch (error) {
      console.error('Error getting topic recommendations:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const learningPathAgent = new LearningPathAgent();
