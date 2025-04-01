
// User Context Manager for MCP

import { communicationManager } from './communication';
import { AgentType } from '../types';

export class UserContextManager {
  private userId: string;
  private userPreferences: Record<string, any> = {};
  private learningHistory: any[] = [];
  
  constructor(userId: string) {
    this.userId = userId;
    this.initialize();
  }
  
  private async initialize() {
    await this.loadUserPreferences();
    await this.loadLearningHistory();
  }
  
  private async loadUserPreferences() {
    // In a real implementation, this would load from database
    this.userPreferences = {
      studyTime: 'morning',
      sessionLength: 30,
      topics: ['accounting', 'finance'],
      difficulty: 'intermediate'
    };
  }
  
  private async loadLearningHistory() {
    // In a real implementation, this would load from database
    this.learningHistory = [
      {
        date: new Date().toISOString(),
        activity: 'flashcard-review',
        duration: 15,
        performance: 0.8
      }
    ];
  }
  
  public getUserId(): string {
    return this.userId;
  }
  
  public getUserPreference(key: string): any {
    return this.userPreferences[key];
  }
  
  public getUserPreferences(): Record<string, any> {
    return { ...this.userPreferences };
  }
  
  public getLearningHistory(): any[] {
    return [...this.learningHistory];
  }
  
  public async updateUserPreference(key: string, value: any): Promise<void> {
    this.userPreferences[key] = value;
    // In a real implementation, this would save to database
    
    // Notify agents about the preference change
    await this.notifyPreferenceChange(key, value);
  }
  
  private async notifyPreferenceChange(key: string, value: any): Promise<void> {
    // Notify cognitive profile agent about the preference change
    await communicationManager.sendMessage({
      messageId: `pref-change-${Date.now()}`,
      senderId: 'ui_ux' as AgentType,
      recipientId: 'cognitive_profile' as AgentType,
      timestamp: new Date(),
      content: {
        type: 'PREFERENCE_CHANGED',
        preference: key,
        value
      }
    });
  }
  
  public async recordLearningActivity(activity: string, details: Record<string, any>): Promise<void> {
    const learningEvent = {
      date: new Date().toISOString(),
      activity,
      ...details
    };
    
    this.learningHistory.push(learningEvent);
    // In a real implementation, this would save to database
  }
}
