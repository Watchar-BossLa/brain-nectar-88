
import { v4 as uuidv4 } from 'uuid';
import { CognitiveProfile } from '@/services/agents/types';

export class ProfileGenerator {
  /**
   * Generate an initial cognitive profile for a new user
   */
  public generateInitialProfile(userId: string): CognitiveProfile {
    return {
      userId: userId,
      learningStyle: {
        visual: 0.6,
        auditory: 0.4,
        reading: 0.5,
        kinesthetic: 0.3
      },
      strengths: ['basic-concepts', 'terminology'],
      weaknesses: ['complex-formulas', 'regulatory-frameworks'],
      recommendedTopics: ['accounting-fundamentals', 'basic-financial-statements'],
      retentionPatterns: {
        shortTerm: 0.8,
        mediumTerm: 0.6,
        longTerm: 0.4
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Using optional props that were added to CognitiveProfile
      preferredContentFormats: ['text', 'diagrams', 'interactive'],
      learningSpeed: 0.5,
      knowledgeGraph: {
        accounting: {
          familiarity: 0.3,
          connections: ['finance', 'business']
        },
        finance: {
          familiarity: 0.2,
          connections: ['economics', 'accounting']
        }
      },
      lastUpdated: new Date().toISOString(),
      // Add compatibility properties
      visual: 0.6,
      auditory: 0.4,
      reading: 0.5,
      kinesthetic: 0.3
    };
  }
  
  /**
   * Update a cognitive profile based on learning activities
   */
  public updateProfileFromActivities(
    existingProfile: CognitiveProfile,
    activities: any[]
  ): CognitiveProfile {
    // This is a simplified implementation
    // In a real system, we would analyze activities in detail
    
    const updatedProfile: CognitiveProfile = {
      ...existingProfile,
      updatedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    
    // For demonstration purposes, we'll make minimal adjustments
    // based on activity count
    if (activities.length > 0) {
      const topicFrequency: Record<string, number> = {};
      
      // Count topic frequencies in activities
      activities.forEach(activity => {
        const topic = activity.topic || 'general';
        topicFrequency[topic] = (topicFrequency[topic] || 0) + 1;
      });
      
      // Find top topics
      const topTopics = Object.entries(topicFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([topic]) => topic);
        
      // Update strengths with top topics
      updatedProfile.strengths = [
        ...new Set([...updatedProfile.strengths, ...topTopics])
      ].slice(0, 5);
    }
    
    return updatedProfile;
  }

  /**
   * Create initial cognitive profile
   * Added for compatibility with existing code
   */
  public createInitialCognitiveProfile(userId: string): Promise<CognitiveProfile> {
    const profile = this.generateInitialProfile(userId);
    return Promise.resolve(profile);
  }
}

export const profileGenerator = new ProfileGenerator();
