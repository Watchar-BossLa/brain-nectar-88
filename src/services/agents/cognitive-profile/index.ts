
import { BaseAgent } from '../baseAgent';
import { AgentMessage, AgentTask, AgentType, CognitiveProfile } from '../types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Cognitive Profile Agent
 * 
 * Builds and maintains a comprehensive model of the learner's cognitive patterns.
 */
export class CognitiveProfileAgent extends BaseAgent {
  protected type: AgentType = 'COGNITIVE_PROFILE';
  
  /**
   * Execute a task assigned to this agent
   */
  protected async executeTask(task: AgentTask): Promise<any> {
    const { taskType, userId, data } = task;
    
    switch (taskType) {
      case 'COGNITIVE_PROFILING':
        return this.generateCognitiveProfile(userId, data);
      default:
        throw new Error(`Unsupported task type for Cognitive Profile Agent: ${taskType}`);
    }
  }
  
  /**
   * Generate or update a cognitive profile for a user
   */
  private async generateCognitiveProfile(userId: string, data: Record<string, any>): Promise<CognitiveProfile> {
    this.log(`Generating cognitive profile for user ${userId}`);
    
    // Check if we already have a profile for this user
    const existingProfile = await this.getCognitiveProfile(userId);
    
    if (existingProfile) {
      // Update the existing profile
      return this.updateCognitiveProfile(existingProfile, data);
    } else {
      // Create a new profile
      return this.createInitialCognitiveProfile(userId);
    }
  }
  
  /**
   * Retrieve the cognitive profile for a user
   */
  private async getCognitiveProfile(userId: string): Promise<CognitiveProfile | null> {
    this.log(`Retrieving cognitive profile for user ${userId}`);
    
    try {
      // In a real implementation, we would store cognitive profiles in the database
      // For now, we'll return null to simulate that we don't have a profile yet
      return null;
      
      /*
      const { data, error } = await supabase
        .from('cognitive_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found
          return null;
        }
        throw error;
      }
      
      return data as CognitiveProfile;
      */
    } catch (error) {
      console.error('Error retrieving cognitive profile:', error);
      return null;
    }
  }
  
  /**
   * Create an initial cognitive profile for a new user
   */
  private async createInitialCognitiveProfile(userId: string): Promise<CognitiveProfile> {
    this.log(`Creating initial cognitive profile for user ${userId}`);
    
    // Fetch user learning history to inform the initial profile
    const learningHistory = await this.fetchUserLearningHistory(userId);
    
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
      const contentTypes = this.analyzeContentInteractions(learningHistory);
      if (contentTypes.length > 0) {
        profile.preferredContentFormats = contentTypes;
      }
      
      // Estimate learning speed across different domains
      profile.learningSpeed = this.estimateLearningSpeed(learningHistory);
      
      // Build initial knowledge graph from completed topics
      profile.knowledgeGraph = this.buildInitialKnowledgeGraph(learningHistory);
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
  private async updateCognitiveProfile(
    existingProfile: CognitiveProfile, 
    newData: Record<string, any>
  ): Promise<CognitiveProfile> {
    this.log(`Updating cognitive profile for user ${existingProfile.userId}`);
    
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
  
  /**
   * Fetch a user's learning history to inform their cognitive profile
   */
  private async fetchUserLearningHistory(userId: string): Promise<any[]> {
    try {
      // Get user progress data
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select(`
          *,
          content:content_id(*)
        `)
        .eq('user_id', userId);
      
      if (progressError) {
        console.error('Error fetching user progress:', progressError);
        return [];
      }
      
      // Get flashcard data
      const { data: flashcardData, error: flashcardError } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', userId);
      
      if (flashcardError) {
        console.error('Error fetching flashcards:', flashcardError);
        return [];
      }
      
      // Combine all learning history data
      return [
        ...(progressData || []),
        ...(flashcardData || [])
      ];
    } catch (error) {
      console.error('Error fetching user learning history:', error);
      return [];
    }
  }
  
  /**
   * Analyze content interactions to determine preferred content formats
   */
  private analyzeContentInteractions(learningHistory: any[]): string[] {
    // Extract content types from progress data
    const contentTypes = learningHistory
      .filter(item => item.content && item.content.content_type)
      .map(item => item.content.content_type);
    
    // Count occurrences of each content type
    const typeCounts: Record<string, number> = {};
    contentTypes.forEach(type => {
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    
    // Sort by frequency
    const preferredTypes = Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([type]) => type);
    
    return preferredTypes.length > 0 ? preferredTypes : ['text', 'video'];
  }
  
  /**
   * Estimate learning speed across different domains based on user history
   */
  private estimateLearningSpeed(learningHistory: any[]): Record<string, number> {
    // This is a simplified implementation
    // In a real system, this would analyze completion times, repeated attempts, etc.
    
    const speeds: Record<string, number> = {};
    const defaultSpeed = 1.0; // Normal speed
    
    // Group by topic or subject area
    const topicGroups = this.groupByTopic(learningHistory);
    
    // Calculate speed for each topic
    for (const [topicId, items] of Object.entries(topicGroups)) {
      // Simple heuristic: calculate average progress rate
      const progressRates = items
        .filter(item => item.progress_percentage !== undefined)
        .map(item => ({
          progress: item.progress_percentage,
          time: new Date(item.updated_at).getTime() - new Date(item.created_at).getTime()
        }));
      
      if (progressRates.length > 0) {
        // Calculate progress per millisecond, normalized against a baseline
        const avgRate = progressRates.reduce((sum, item) => 
          sum + (item.progress / Math.max(1, item.time)), 0) / progressRates.length;
          
        // Convert to a scale where 1.0 is average
        speeds[topicId] = avgRate > 0 ? avgRate * 1000 : defaultSpeed;
      } else {
        speeds[topicId] = defaultSpeed;
      }
    }
    
    return speeds;
  }
  
  /**
   * Build initial knowledge graph from completed topics
   */
  private buildInitialKnowledgeGraph(learningHistory: any[]): Record<string, string[]> {
    const graph: Record<string, string[]> = {};
    
    // Extract completed topics from progress data
    const completedItems = learningHistory.filter(item => 
      item.status === 'completed' || item.progress_percentage >= 90
    );
    
    // Group by module or subject area
    const moduleGroups = this.groupByModule(completedItems);
    
    // For each module, create connections between its topics
    for (const [moduleId, items] of Object.entries(moduleGroups)) {
      const topicIds = [...new Set(items
        .filter(item => item.content && item.content.topic_id)
        .map(item => item.content.topic_id)
      )];
      
      // Create connections between topics in the same module
      topicIds.forEach(topicId => {
        if (!graph[topicId]) {
          graph[topicId] = [];
        }
        
        // Connect to other topics in the same module
        topicIds
          .filter(id => id !== topicId)
          .forEach(relatedId => {
            if (!graph[topicId].includes(relatedId)) {
              graph[topicId].push(relatedId);
            }
          });
      });
    }
    
    return graph;
  }
  
  /**
   * Group learning history items by topic
   */
  private groupByTopic(items: any[]): Record<string, any[]> {
    const groups: Record<string, any[]> = {};
    
    items.forEach(item => {
      const topicId = item.content?.topic_id || item.topic_id;
      if (topicId) {
        if (!groups[topicId]) {
          groups[topicId] = [];
        }
        groups[topicId].push(item);
      }
    });
    
    return groups;
  }
  
  /**
   * Group learning history items by module
   */
  private groupByModule(items: any[]): Record<string, any[]> {
    const groups: Record<string, any[]> = {};
    
    items.forEach(item => {
      const moduleId = item.content?.module_id || item.module_id;
      if (moduleId) {
        if (!groups[moduleId]) {
          groups[moduleId] = [];
        }
        groups[moduleId].push(item);
      }
    });
    
    return groups;
  }
  
  /**
   * Handle messages from other agents or the MCP
   */
  protected handleMessage(message: AgentMessage): void {
    const { type, content, data } = message;
    
    switch (content) {
      case 'INITIALIZE_FOR_USER':
        // Handle initialization for a new user
        if (data.userId) {
          this.generateCognitiveProfile(data.userId, {})
            .catch(error => console.error('Error during initialization:', error));
        }
        break;
        
      case 'REQUEST_COGNITIVE_PROFILE':
        // Handle requests for cognitive profile data
        if (data.userId) {
          this.getCognitiveProfile(data.userId)
            .then(profile => {
              if (profile && message.senderId) {
                this.sendMessage(message.senderId, 'COGNITIVE_PROFILE_DATA', { profile });
              }
            })
            .catch(error => console.error('Error fetching cognitive profile:', error));
        }
        break;
        
      default:
        this.log(`Unhandled message: ${content}`);
    }
  }
}
