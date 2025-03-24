
import { BaseAgent } from '../baseAgent';
import { AgentMessage, AgentTask, AgentType } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { generateLearningPath, updateLearningPath } from '@/services/learningPathService';

/**
 * Learning Path Agent
 * 
 * Constructs and continuously optimizes personalized learning sequences.
 */
export class LearningPathAgent extends BaseAgent {
  protected type: AgentType = 'LEARNING_PATH';
  
  /**
   * Execute a task assigned to this agent
   */
  protected async executeTask(task: AgentTask): Promise<any> {
    const { taskType, userId, data } = task;
    
    switch (taskType) {
      case 'LEARNING_PATH_GENERATION':
        return this.generatePersonalizedLearningPath(userId, data.qualificationId);
      default:
        throw new Error(`Unsupported task type for Learning Path Agent: ${taskType}`);
    }
  }
  
  /**
   * Generate a personalized learning path for a user
   */
  private async generatePersonalizedLearningPath(userId: string, qualificationId: string): Promise<any> {
    this.log(`Generating personalized learning path for user ${userId} and qualification ${qualificationId}`);
    
    try {
      // Leverage existing learning path generation service
      const { data, error } = await generateLearningPath(userId, qualificationId);
      
      if (error) {
        throw error;
      }
      
      // Process the generated path to enhance it with agent capabilities
      const enhancedPath = await this.enhanceLearningPath(userId, data);
      
      return enhancedPath;
    } catch (error) {
      console.error('Error generating learning path:', error);
      throw error;
    }
  }
  
  /**
   * Enhance a learning path with additional agent-specific optimizations
   */
  private async enhanceLearningPath(userId: string, path: any): Promise<any> {
    // Request cognitive profile data to inform path optimization
    // In a real implementation, this would wait for a response from the Cognitive Profile Agent
    // For simplicity, we're making the request but not waiting for a response
    this.sendMessage('COGNITIVE_PROFILE', 'REQUEST_COGNITIVE_PROFILE', { userId });
    
    // In a real implementation, we would wait for the cognitive profile data
    // and use it to optimize the learning path
    
    // For now, we'll just add some agent-specific enhancements
    const enhancedPath = path.map((module: any) => ({
      ...module,
      topics: module.topics.map((topic: any) => ({
        ...topic,
        agentRecommendations: {
          studyApproach: this.recommendStudyApproach(topic.mastery),
          estimatedTimeMinutes: this.estimateStudyTime(topic.mastery),
          prerequisiteStrength: topic.mastery < 30 ? 'critical' : topic.mastery < 60 ? 'important' : 'optional'
        }
      }))
    }));
    
    return enhancedPath;
  }
  
  /**
   * Recommend a study approach based on mastery level
   */
  private recommendStudyApproach(mastery: number): string {
    if (mastery < 30) {
      return 'foundational-learning';
    } else if (mastery < 70) {
      return 'practice-focused';
    } else if (mastery < 90) {
      return 'mastery-refinement';
    } else {
      return 'maintenance-review';
    }
  }
  
  /**
   * Estimate study time needed based on mastery level
   */
  private estimateStudyTime(mastery: number): number {
    if (mastery < 30) {
      return 45; // More time for new material
    } else if (mastery < 70) {
      return 30; // Moderate time for ongoing learning
    } else {
      return 15; // Brief review for high mastery
    }
  }
  
  /**
   * Handle messages from other agents or the MCP
   */
  protected handleMessage(message: AgentMessage): void {
    const { type, content, data } = message;
    
    switch (content) {
      case 'COGNITIVE_PROFILE_DATA':
        // Handle receiving cognitive profile data
        if (data.profile) {
          this.log('Received cognitive profile data', { userId: data.profile.userId });
          // In a real implementation, we would use this data to adjust learning paths
        }
        break;
        
      case 'UPDATE_LEARNING_PATH':
        // Handle requests to update a learning path
        if (data.userId && data.contentId && data.progressPercentage !== undefined) {
          updateLearningPath(data.userId, data.contentId, data.progressPercentage)
            .catch(error => console.error('Error updating learning path:', error));
        }
        break;
        
      default:
        this.log(`Unhandled message: ${content}`);
    }
  }
}
