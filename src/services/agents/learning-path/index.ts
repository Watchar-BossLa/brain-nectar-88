// Import necessary types and functions
import { calculateFlashcardRetention } from '@/services/spacedRepetition';

export class LearningPathAgent {
  // Class properties
  private userId: string | null = null;
  private retentionThreshold = 0.7;
  private learningRateModifier = 1.0;
  
  constructor(userId?: string) {
    if (userId) {
      this.userId = userId;
    }
  }
  
  setUserId(userId: string) {
    this.userId = userId;
    return this;
  }
  
  setRetentionThreshold(threshold: number) {
    if (threshold > 0 && threshold <= 1) {
      this.retentionThreshold = threshold;
    }
    return this;
  }
  
  setLearningRateModifier(modifier: number) {
    if (modifier > 0) {
      this.learningRateModifier = modifier;
    }
    return this;
  }
  
  async getRetentionData(userId: string) {
    try {
      const result = await calculateFlashcardRetention(userId);
      
      return {
        estimatedRetention: result.estimatedRetention,
        nextReviewDate: result.nextReviewDate
      };
    } catch (error) {
      console.error('Error getting retention data:', error);
      return null;
    }
  }
  
  async analyzeRetention(userId: string) {
    const result = await calculateFlashcardRetention(userId);
    const retention = result.estimatedRetention;
    
    let recommendations = [];
    let status = "";
    
    if (retention > 0.8) {
      status = "excellent";
      recommendations = [
        "You're doing great! Consider increasing your learning load.",
        "Try tackling more difficult topics.",
        "Your retention is excellent - perfect time to connect concepts."
      ];
    } else if (retention > 0.5) {
      status = "good";
      recommendations = [
        "Your retention is good. Keep up the consistent reviews.",
        "Consider reviewing older material to strengthen connections.",
        "Try different learning techniques to improve retention further."
      ];
    } else {
      status = "needs improvement";
      recommendations = [
        "Focus on reviewing more frequently.",
        "Try breaking down complex topics into smaller chunks.",
        "Consider using memory techniques like spaced repetition and mnemonics."
      ];
    }
    
    return {
      retention: retention,
      status: status,
      recommendations: recommendations,
      nextReviewOptimal: result.nextReviewDate
    };
  }
  
  async generateLearningPath(userId: string) {
    try {
      const retentionResult = await calculateFlashcardRetention(userId);
      
      if (retentionResult) {
        const retention = retentionResult.estimatedRetention;
        const difficulty = retention > 0.8 ? "advanced" : 
                          retention > 0.6 ? "intermediate" : "beginner";
        
        const estimatedDays = Math.round(30 * (1 / (retention * this.learningRateModifier)));
        
        const modules = [
          {
            id: "module-1",
            title: "Foundational Concepts",
            estimatedCompletionDays: Math.round(estimatedDays * 0.3),
            topics: ["Basic principles", "Core terminology", "Fundamental techniques"]
          },
          {
            id: "module-2",
            title: "Intermediate Applications",
            estimatedCompletionDays: Math.round(estimatedDays * 0.4),
            topics: ["Practical examples", "Common use cases", "Problem-solving approaches"]
          },
          {
            id: "module-3",
            title: "Advanced Integration",
            estimatedCompletionDays: Math.round(estimatedDays * 0.3),
            topics: ["Complex scenarios", "System integration", "Performance optimization"]
          }
        ];
        
        return {
          pathId: `generated-path-${userId}-${Date.now()}`,
          modules: modules,
          estimatedCompletionDays: estimatedDays,
          difficulty: difficulty,
          retentionFactor: retention,
          recommendedReviewFrequency: Math.ceil(7 * (1 - retention))
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error generating learning path:', error);
      return null;
    }
  }
  
  async recommendNextSteps(userId: string) {
    try {
      const retentionData = await this.getRetentionData(userId);
      
      if (!retentionData) {
        return {
          recommendations: [
            "Start by creating some flashcards on topics you want to learn",
            "Review your flashcards daily to build knowledge",
            "Track your progress over time"
          ],
          priority: "getting-started"
        };
      }
      
      const { estimatedRetention } = retentionData;
      
      if (estimatedRetention < 0.5) {
        return {
          recommendations: [
            "Focus on reviewing existing material before adding new content",
            "Try different learning techniques like visualization or teaching concepts",
            "Break down difficult topics into smaller, manageable chunks"
          ],
          priority: "review"
        };
      } else if (estimatedRetention < 0.8) {
        return {
          recommendations: [
            "Balance reviewing existing material with learning new concepts",
            "Connect related ideas across different topics",
            "Start applying knowledge through practice problems"
          ],
          priority: "balanced"
        };
      } else {
        return {
          recommendations: [
            "You're ready to tackle more advanced material",
            "Consider creating more complex connections between topics",
            "Try teaching concepts to others to solidify understanding"
          ],
          priority: "advancement"
        };
      }
    } catch (error) {
      console.error('Error recommending next steps:', error);
      return {
        recommendations: [
          "Continue with regular reviews of your flashcards",
          "Add new material at a comfortable pace",
          "Track your progress to identify areas for improvement"
        ],
        priority: "general"
      };
    }
  }
  
  async optimizeLearningSchedule(userId: string) {
    try {
      const retentionData = await this.getRetentionData(userId);
      
      if (!retentionData) {
        return {
          dailyReviewTarget: 20,
          recommendedSessionDuration: 15,
          sessionsPerDay: 2,
          optimalReviewTimes: ["morning", "evening"]
        };
      }
      
      const { estimatedRetention } = retentionData;
      
      // Calculate optimal review schedule based on retention
      const dailyReviewTarget = Math.round(30 * (1 - estimatedRetention) + 10);
      const sessionDuration = estimatedRetention > 0.7 ? 20 : 15;
      const sessionsPerDay = dailyReviewTarget > 25 ? 3 : 2;
      
      return {
        dailyReviewTarget,
        recommendedSessionDuration: sessionDuration,
        sessionsPerDay,
        optimalReviewTimes: sessionsPerDay === 3 
          ? ["morning", "afternoon", "evening"] 
          : ["morning", "evening"]
      };
    } catch (error) {
      console.error('Error optimizing learning schedule:', error);
      return {
        dailyReviewTarget: 20,
        recommendedSessionDuration: 15,
        sessionsPerDay: 2,
        optimalReviewTimes: ["morning", "evening"]
      };
    }
  }
}

export const learningPathAgent = new LearningPathAgent();
