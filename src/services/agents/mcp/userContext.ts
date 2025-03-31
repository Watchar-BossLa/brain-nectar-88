
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { CommunicationManager } from './communication';

class UserContextManager {
  private contextData: Map<string, Map<string, any>> = new Map();
  private communicationManager: CommunicationManager;
  
  constructor() {
    this.communicationManager = new CommunicationManager();
  }
  
  // Get user preferences
  async getUserPreferences(userId: string): Promise<any> {
    try {
      // Get user profile from Supabase
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching user profile:', error);
        return {};
      }
      
      // Mocked preferences, in a real app this would come from the database
      return {
        learningStyle: 'visual',
        preferredDifficulty: 'adaptive',
        preferredStudyTime: '20min',
        notificationsEnabled: true,
        dailyGoal: 3
      };
    } catch (error) {
      console.error('Error in getUserPreferences:', error);
      return {};
    }
  }
  
  // Get learning history
  async getLearningHistory(userId: string): Promise<any> {
    try {
      // Get quiz session history
      const { data: quizSessions, error: quizError } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (quizError) {
        console.error('Error fetching quiz sessions:', quizError);
      }
      
      // Get flashcard review history
      const { data: flashcardReviews, error: flashcardError } = await supabase
        .from('flashcard_reviews')
        .select('*')
        .eq('user_id', userId)
        .order('reviewed_at', { ascending: false })
        .limit(10);
        
      if (flashcardError) {
        console.error('Error fetching flashcard reviews:', flashcardError);
      }
      
      return {
        quizSessions: quizSessions || [],
        flashcardReviews: flashcardReviews || []
      };
    } catch (error) {
      console.error('Error in getLearningHistory:', error);
      return {
        quizSessions: [],
        flashcardReviews: []
      };
    }
  }
  
  // Set context data for a user and specific context type
  setContextData(userId: string, contextType: string, data: any): void {
    if (!this.contextData.has(userId)) {
      this.contextData.set(userId, new Map());
    }
    
    const userContexts = this.contextData.get(userId)!;
    userContexts.set(contextType, data);
  }
  
  // Get context data for a user and specific context type
  getContextData(userId: string, contextType: string): any {
    if (!this.contextData.has(userId)) {
      return null;
    }
    
    const userContexts = this.contextData.get(userId)!;
    return userContexts.get(contextType) || null;
  }
}

// Export an instance of the manager
export const userContextManager = new UserContextManager();
