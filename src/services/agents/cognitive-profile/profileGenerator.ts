
import { CognitiveProfile } from '../types/profileTypes';
import { DataAnalysisUtils } from './utils/dataAnalysis';
import { LearningHistoryService } from './utils/historyService';
import { supabase } from '@/integrations/supabase/client';

/**
 * Creates and updates cognitive profiles
 */
export class ProfileGenerator {
  /**
   * Create an initial cognitive profile for a new user
   */
  public async createInitialCognitiveProfile(userId: string): Promise<CognitiveProfile> {
    console.log(`Creating initial cognitive profile for user ${userId}`);
    
    // Fetch user learning history to inform the initial profile
    const learningHistory = await LearningHistoryService.fetchUserLearningHistory(userId);
    
    // Create a default profile
    const profile: CognitiveProfile = {
      userId,
      learningSpeed: {},
      preferredContentFormats: ['text', 'video'],
      knowledgeGraph: {},
      attentionSpan: 25, // Default: 25 minutes (Pomodoro-inspired)
      retentionRates: {},
      lastUpdated: new Date().toISOString()
    };
    
    // If we have learning history, use it to populate the initial profile
    if (learningHistory.length > 0) {
      // Analyze content interaction patterns
      const contentTypes = DataAnalysisUtils.analyzeContentInteractions(learningHistory);
      if (contentTypes.length > 0) {
        profile.preferredContentFormats = contentTypes;
      }
      
      // Estimate learning speed across different domains
      profile.learningSpeed = DataAnalysisUtils.estimateLearningSpeed(learningHistory);
      
      // Build initial knowledge graph from completed topics
      profile.knowledgeGraph = DataAnalysisUtils.buildInitialKnowledgeGraph(learningHistory);
    }
    
    // In a real implementation, we would store this profile in the database
    /*
    await supabase
      .from('cognitive_profiles')
      .insert(profile);
    */
    
    return profile;
  }
  
  /**
   * Update an existing cognitive profile with new data
   */
  public async updateCognitiveProfile(
    existingProfile: CognitiveProfile, 
    newData: Record<string, any>
  ): Promise<CognitiveProfile> {
    console.log(`Updating cognitive profile for user ${existingProfile.userId}`);
    
    // Merge existing profile with new data
    const updatedProfile: CognitiveProfile = {
      ...existingProfile,
      ...newData,
      lastUpdated: new Date().toISOString()
    };
    
    // In a real implementation, we would update the profile in the database
    /*
    await supabase
      .from('cognitive_profiles')
      .update(updatedProfile)
      .eq('user_id', updatedProfile.userId);
    */
    
    return updatedProfile;
  }
}
