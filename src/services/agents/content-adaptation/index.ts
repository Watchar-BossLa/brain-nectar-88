
import { BaseAgent } from '../baseAgent';
import { AgentMessage, AgentTask, AgentType } from '../types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Content Adaptation Agent
 * 
 * Transforms learning materials to match individual learner preferences.
 */
export class ContentAdaptationAgent extends BaseAgent {
  protected type: AgentType = 'CONTENT_ADAPTATION';
  
  /**
   * Execute a task assigned to this agent
   */
  protected async executeTask(task: AgentTask): Promise<any> {
    const { taskType, userId, data } = task;
    
    switch (taskType) {
      case 'CONTENT_ADAPTATION':
        return this.adaptContent(userId, data.contentId, data.preferredFormat);
      default:
        throw new Error(`Unsupported task type for Content Adaptation Agent: ${taskType}`);
    }
  }
  
  /**
   * Adapt content to match user preferences
   */
  private async adaptContent(
    userId: string, 
    contentId: string, 
    preferredFormat?: string
  ): Promise<any> {
    this.log(`Adapting content ${contentId} for user ${userId}`);
    
    try {
      // Fetch the content
      const { data: content, error: contentError } = await supabase
        .from('content')
        .select('*')
        .eq('id', contentId)
        .single();
      
      if (contentError) {
        throw contentError;
      }
      
      if (!content) {
        throw new Error(`Content with ID ${contentId} not found`);
      }
      
      // Request cognitive profile to inform adaptation
      // In a real implementation, this would wait for a response
      this.sendMessage('COGNITIVE_PROFILE', 'REQUEST_COGNITIVE_PROFILE', { userId });
      
      // For now, we'll use a simpler approach based just on the preferred format
      const format = preferredFormat || content.content_type;
      
      // Generate adapted content based on the original content and the preferred format
      const adaptedContent = this.generateAdaptedContent(content, format);
      
      return adaptedContent;
    } catch (error) {
      console.error('Error adapting content:', error);
      throw error;
    }
  }
  
  /**
   * Generate adapted content based on the original content and preferred format
   */
  private generateAdaptedContent(content: any, preferredFormat: string): any {
    // This is a simplified implementation
    // In a real system, this would use more sophisticated transformations
    
    // If the content is already in the preferred format, return it as is
    if (content.content_type === preferredFormat) {
      return {
        ...content,
        adaptationApplied: false
      };
    }
    
    // In a real implementation, we would transform the content to the preferred format
    // For now, we'll just add some metadata indicating the adaptation
    return {
      ...content,
      adaptationApplied: true,
      originalFormat: content.content_type,
      adaptedFormat: preferredFormat,
      adaptationNotes: `Transformed from ${content.content_type} to ${preferredFormat}`
    };
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
          // In a real implementation, we would use this data to guide content adaptation
        }
        break;
        
      case 'ADAPT_CONTENT_REQUEST':
        // Handle requests to adapt content
        if (data.userId && data.contentId) {
          this.adaptContent(data.userId, data.contentId, data.preferredFormat)
            .then(adaptedContent => {
              if (message.senderId) {
                this.sendMessage(message.senderId, 'CONTENT_ADAPTATION_RESULT', { adaptedContent });
              }
            })
            .catch(error => console.error('Error in content adaptation:', error));
        }
        break;
        
      default:
        this.log(`Unhandled message: ${content}`);
    }
  }
}
