/**
 * AI Coach Insight Service
 * Service for generating and managing learning insights and recommendations
 */

import { supabase } from '@/integrations/supabase/client';
import { AICoachProfileService } from './AICoachProfileService';

/**
 * AI Coach Insight Service class
 */
export class AICoachInsightService {
  static instance;
  
  /**
   * Private constructor for singleton pattern
   */
  constructor() {
    this.initialized = false;
    this.profileService = AICoachProfileService.getInstance();
  }
  
  /**
   * Get the singleton instance
   * @returns {AICoachInsightService} The singleton instance
   */
  static getInstance() {
    if (!AICoachInsightService.instance) {
      AICoachInsightService.instance = new AICoachInsightService();
    }
    return AICoachInsightService.instance;
  }
  
  /**
   * Initialize the service
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async initialize(userId) {
    try {
      console.log('Initializing AI Coach Insight Service for user:', userId);
      this.userId = userId;
      
      // Ensure profile service is initialized
      if (!this.profileService.initialized) {
        await this.profileService.initialize(userId);
      }
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize AI Coach Insight Service:', error);
      return false;
    }
  }
  
  /**
   * Create a new insight
   * @param {string} insightType - Insight type
   * @param {Object} insightData - Insight data
   * @param {number} [confidence=0.8] - Confidence level (0-1)
   * @returns {Promise<Object>} Created insight
   */
  async createInsight(insightType, insightData, confidence = 0.8) {
    if (!this.initialized) {
      throw new Error('AI Coach Insight Service not initialized');
    }
    
    const { data: insight, error } = await supabase
      .from('ai_coach_insights')
      .insert({
        user_id: this.userId,
        insight_type: insightType,
        insight_data: insightData,
        confidence,
        is_applied: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return insight;
  }
  
  /**
   * Get user's insights
   * @param {string} [insightType] - Filter by insight type (optional)
   * @param {number} [limit=10] - Maximum number of insights
   * @returns {Promise<Array<Object>>} User insights
   */
  async getUserInsights(insightType, limit = 10) {
    if (!this.initialized) {
      throw new Error('AI Coach Insight Service not initialized');
    }
    
    let query = supabase
      .from('ai_coach_insights')
      .select('*')
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (insightType) {
      query = query.eq('insight_type', insightType);
    }
    
    const { data: insights, error } = await query;
    
    if (error) throw error;
    
    return insights || [];
  }
  
  /**
   * Mark insight as applied
   * @param {string} insightId - Insight ID
   * @returns {Promise<Object>} Updated insight
   */
  async markInsightAsApplied(insightId) {
    if (!this.initialized) {
      throw new Error('AI Coach Insight Service not initialized');
    }
    
    const { data: insight, error } = await supabase
      .from('ai_coach_insights')
      .update({
        is_applied: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', insightId)
      .eq('user_id', this.userId)
      .select()
      .single();
    
    if (error) throw error;
    
    return insight;
  }
  
  /**
   * Generate insights from study data
   * @param {Object} studyData - Study data
   * @returns {Promise<Array<Object>>} Generated insights
   */
  async generateInsightsFromStudyData(studyData) {
    if (!this.initialized) {
      throw new Error('AI Coach Insight Service not initialized');
    }
    
    // In a real implementation, this would use an AI model to analyze study data
    // For now, we'll generate some sample insights
    
    const insights = [];
    
    // Get learning style
    const learningStyle = await this.profileService.getLearningStyleAssessment();
    
    // Generate insights based on study data
    if (studyData.studySessions && studyData.studySessions.length > 0) {
      // Analyze study time patterns
      const timePatterns = this._analyzeStudyTimePatterns(studyData.studySessions);
      
      if (timePatterns.mostProductiveTime) {
        insights.push(await this.createInsight('productivity_pattern', {
          title: 'Optimal Study Time',
          description: `You seem to be most productive when studying during ${timePatterns.mostProductiveTime}. Consider scheduling your most challenging tasks during this time.`,
          data: timePatterns
        }, 0.85));
      }
      
      // Analyze session duration
      const durationInsight = this._analyzeSessionDuration(studyData.studySessions);
      
      if (durationInsight) {
        insights.push(await this.createInsight('session_duration', {
          title: 'Study Session Duration',
          description: durationInsight.description,
          data: durationInsight.data
        }, 0.75));
      }
    }
    
    // Generate learning style insights
    if (learningStyle.assessment_completed) {
      const dominantStyles = await this.profileService.getDominantLearningStyles(2);
      
      if (dominantStyles.length > 0) {
        const styleInsight = this._generateLearningStyleInsight(dominantStyles);
        
        insights.push(await this.createInsight('learning_style', {
          title: 'Learning Style Recommendation',
          description: styleInsight.description,
          dominantStyles,
          strategies: styleInsight.strategies
        }, 0.9));
      }
    }
    
    // Generate subject-specific insights
    if (studyData.subjects && studyData.subjects.length > 0) {
      const subjectInsight = this._generateSubjectInsight(studyData.subjects);
      
      if (subjectInsight) {
        insights.push(await this.createInsight('subject_focus', {
          title: 'Subject Focus',
          description: subjectInsight.description,
          data: subjectInsight.data
        }, 0.8));
      }
    }
    
    return insights;
  }
  
  /**
   * Analyze study time patterns
   * @param {Array<Object>} studySessions - Study sessions
   * @returns {Object} Time pattern analysis
   * @private
   */
  _analyzeStudyTimePatterns(studySessions) {
    // Group sessions by time of day
    const timeGroups = {
      morning: { count: 0, totalEffectiveness: 0, totalFocus: 0 },
      afternoon: { count: 0, totalEffectiveness: 0, totalFocus: 0 },
      evening: { count: 0, totalEffectiveness: 0, totalFocus: 0 },
      night: { count: 0, totalEffectiveness: 0, totalFocus: 0 }
    };
    
    studySessions.forEach(session => {
      if (!session.started_at || !session.effectiveness_score || !session.focus_score) {
        return;
      }
      
      const hour = new Date(session.started_at).getHours();
      let timeGroup;
      
      if (hour >= 5 && hour < 12) {
        timeGroup = 'morning';
      } else if (hour >= 12 && hour < 17) {
        timeGroup = 'afternoon';
      } else if (hour >= 17 && hour < 22) {
        timeGroup = 'evening';
      } else {
        timeGroup = 'night';
      }
      
      timeGroups[timeGroup].count++;
      timeGroups[timeGroup].totalEffectiveness += session.effectiveness_score;
      timeGroups[timeGroup].totalFocus += session.focus_score;
    });
    
    // Calculate averages
    Object.keys(timeGroups).forEach(key => {
      const group = timeGroups[key];
      if (group.count > 0) {
        group.avgEffectiveness = group.totalEffectiveness / group.count;
        group.avgFocus = group.totalFocus / group.count;
        group.avgScore = (group.avgEffectiveness + group.avgFocus) / 2;
      } else {
        group.avgEffectiveness = 0;
        group.avgFocus = 0;
        group.avgScore = 0;
      }
    });
    
    // Find most productive time
    let mostProductiveTime = null;
    let highestScore = 0;
    
    Object.keys(timeGroups).forEach(key => {
      const group = timeGroups[key];
      if (group.count >= 3 && group.avgScore > highestScore) {
        highestScore = group.avgScore;
        mostProductiveTime = key;
      }
    });
    
    return {
      timeGroups,
      mostProductiveTime
    };
  }
  
  /**
   * Analyze session duration
   * @param {Array<Object>} studySessions - Study sessions
   * @returns {Object|null} Duration insight
   * @private
   */
  _analyzeSessionDuration(studySessions) {
    // Group sessions by duration
    const durationGroups = {
      short: { count: 0, totalEffectiveness: 0, totalFocus: 0 }, // < 30 min
      medium: { count: 0, totalEffectiveness: 0, totalFocus: 0 }, // 30-60 min
      long: { count: 0, totalEffectiveness: 0, totalFocus: 0 } // > 60 min
    };
    
    studySessions.forEach(session => {
      if (!session.duration || !session.effectiveness_score || !session.focus_score) {
        return;
      }
      
      let durationGroup;
      
      if (session.duration < 30) {
        durationGroup = 'short';
      } else if (session.duration <= 60) {
        durationGroup = 'medium';
      } else {
        durationGroup = 'long';
      }
      
      durationGroups[durationGroup].count++;
      durationGroups[durationGroup].totalEffectiveness += session.effectiveness_score;
      durationGroups[durationGroup].totalFocus += session.focus_score;
    });
    
    // Calculate averages
    Object.keys(durationGroups).forEach(key => {
      const group = durationGroups[key];
      if (group.count > 0) {
        group.avgEffectiveness = group.totalEffectiveness / group.count;
        group.avgFocus = group.totalFocus / group.count;
        group.avgScore = (group.avgEffectiveness + group.avgFocus) / 2;
      } else {
        group.avgEffectiveness = 0;
        group.avgFocus = 0;
        group.avgScore = 0;
      }
    });
    
    // Find optimal duration
    let optimalDuration = null;
    let highestScore = 0;
    
    Object.keys(durationGroups).forEach(key => {
      const group = durationGroups[key];
      if (group.count >= 3 && group.avgScore > highestScore) {
        highestScore = group.avgScore;
        optimalDuration = key;
      }
    });
    
    if (!optimalDuration) {
      return null;
    }
    
    let description;
    
    switch (optimalDuration) {
      case 'short':
        description = 'Your data suggests you perform better with shorter study sessions (under 30 minutes). Consider using the Pomodoro Technique with shorter work periods.';
        break;
      case 'medium':
        description = 'Your most effective study sessions are between 30-60 minutes. This aligns well with standard Pomodoro techniques. Consider taking short breaks after each session.';
        break;
      case 'long':
        description = 'You seem to perform well during longer study sessions (over 60 minutes). Make sure to still take occasional breaks to maintain this performance.';
        break;
    }
    
    return {
      description,
      data: {
        durationGroups,
        optimalDuration
      }
    };
  }
  
  /**
   * Generate learning style insight
   * @param {Array<string>} dominantStyles - Dominant learning styles
   * @returns {Object} Learning style insight
   * @private
   */
  _generateLearningStyleInsight(dominantStyles) {
    const strategies = {};
    let description = 'Based on your learning style assessment, you tend to learn best through ';
    
    dominantStyles.forEach((style, index) => {
      if (index > 0) {
        description += ' and ';
      }
      
      switch (style) {
        case 'visual':
          description += 'visual methods';
          strategies.visual = [
            'Use diagrams, charts, and mind maps',
            'Watch educational videos',
            'Color-code your notes',
            'Create visual flashcards'
          ];
          break;
        
        case 'auditory':
          description += 'auditory methods';
          strategies.auditory = [
            'Record and listen to lectures',
            'Participate in group discussions',
            'Read material aloud',
            'Use text-to-speech for reading'
          ];
          break;
        
        case 'reading':
          description += 'reading and writing';
          strategies.reading = [
            'Take detailed notes',
            'Rewrite key concepts in your own words',
            'Create written summaries',
            'Use written flashcards'
          ];
          break;
        
        case 'kinesthetic':
          description += 'hands-on activities';
          strategies.kinesthetic = [
            'Use physical models or objects',
            'Take breaks for movement',
            'Study while walking',
            'Use gestures to remember concepts'
          ];
          break;
        
        case 'social':
          description += 'social learning';
          strategies.social = [
            'Form study groups',
            'Teach concepts to others',
            'Participate in discussions',
            'Seek feedback from peers'
          ];
          break;
        
        case 'solitary':
          description += 'independent study';
          strategies.solitary = [
            'Create a quiet, personal study space',
            'Set personal goals and track progress',
            'Use self-paced learning resources',
            'Schedule dedicated alone time for deep focus'
          ];
          break;
        
        case 'logical':
          description += 'logical reasoning';
          strategies.logical = [
            'Organize information in a systematic way',
            'Look for patterns and relationships',
            'Break complex topics into smaller parts',
            'Use problem-solving techniques'
          ];
          break;
      }
    });
    
    description += '. Here are some strategies that might work well for you:';
    
    return {
      description,
      strategies
    };
  }
  
  /**
   * Generate subject insight
   * @param {Array<Object>} subjects - Subject data
   * @returns {Object|null} Subject insight
   * @private
   */
  _generateSubjectInsight(subjects) {
    if (subjects.length === 0) {
      return null;
    }
    
    // Find subject with lowest performance
    let lowestPerformanceSubject = null;
    let lowestScore = Infinity;
    
    subjects.forEach(subject => {
      if (subject.performance_score < lowestScore) {
        lowestScore = subject.performance_score;
        lowestPerformanceSubject = subject;
      }
    });
    
    // Find subject with least study time
    let leastStudiedSubject = null;
    let leastTime = Infinity;
    
    subjects.forEach(subject => {
      if (subject.total_study_time < leastTime) {
        leastTime = subject.total_study_time;
        leastStudiedSubject = subject;
      }
    });
    
    let description;
    let data;
    
    if (lowestPerformanceSubject && lowestPerformanceSubject.name === leastStudiedSubject.name) {
      description = `You might want to dedicate more time to ${lowestPerformanceSubject.name}. It has your lowest performance score and you've spent the least amount of time studying it.`;
      data = {
        subject: lowestPerformanceSubject.name,
        performance: lowestPerformanceSubject.performance_score,
        studyTime: lowestPerformanceSubject.total_study_time
      };
    } else if (lowestPerformanceSubject) {
      description = `You might want to try different study techniques for ${lowestPerformanceSubject.name}. Despite your efforts, this subject has your lowest performance score.`;
      data = {
        subject: lowestPerformanceSubject.name,
        performance: lowestPerformanceSubject.performance_score
      };
    } else if (leastStudiedSubject) {
      description = `Consider allocating more time to ${leastStudiedSubject.name}. You've spent significantly less time on this subject compared to others.`;
      data = {
        subject: leastStudiedSubject.name,
        studyTime: leastStudiedSubject.total_study_time
      };
    } else {
      return null;
    }
    
    return {
      description,
      data
    };
  }
  
  /**
   * Create a recommendation
   * @param {string} recommendationType - Recommendation type
   * @param {string} title - Recommendation title
   * @param {string} description - Recommendation description
   * @param {Object} [recommendationData={}] - Recommendation data
   * @param {number} [priority=1] - Priority (1-5)
   * @returns {Promise<Object>} Created recommendation
   */
  async createRecommendation(recommendationType, title, description, recommendationData = {}, priority = 1) {
    if (!this.initialized) {
      throw new Error('AI Coach Insight Service not initialized');
    }
    
    const { data: recommendation, error } = await supabase
      .from('ai_coach_recommendations')
      .insert({
        user_id: this.userId,
        recommendation_type: recommendationType,
        title,
        description,
        priority,
        is_applied: false,
        recommendation_data: recommendationData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return recommendation;
  }
  
  /**
   * Get user's recommendations
   * @param {string} [recommendationType] - Filter by recommendation type (optional)
   * @param {boolean} [activeOnly=true] - Only return active (not applied) recommendations
   * @returns {Promise<Array<Object>>} User recommendations
   */
  async getUserRecommendations(recommendationType, activeOnly = true) {
    if (!this.initialized) {
      throw new Error('AI Coach Insight Service not initialized');
    }
    
    let query = supabase
      .from('ai_coach_recommendations')
      .select('*')
      .eq('user_id', this.userId)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (recommendationType) {
      query = query.eq('recommendation_type', recommendationType);
    }
    
    if (activeOnly) {
      query = query.eq('is_applied', false);
    }
    
    const { data: recommendations, error } = await query;
    
    if (error) throw error;
    
    return recommendations || [];
  }
  
  /**
   * Mark recommendation as applied
   * @param {string} recommendationId - Recommendation ID
   * @returns {Promise<Object>} Updated recommendation
   */
  async markRecommendationAsApplied(recommendationId) {
    if (!this.initialized) {
      throw new Error('AI Coach Insight Service not initialized');
    }
    
    const { data: recommendation, error } = await supabase
      .from('ai_coach_recommendations')
      .update({
        is_applied: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', recommendationId)
      .eq('user_id', this.userId)
      .select()
      .single();
    
    if (error) throw error;
    
    return recommendation;
  }
  
  /**
   * Generate recommendations from insights
   * @returns {Promise<Array<Object>>} Generated recommendations
   */
  async generateRecommendationsFromInsights() {
    if (!this.initialized) {
      throw new Error('AI Coach Insight Service not initialized');
    }
    
    // Get recent insights
    const insights = await this.getUserInsights(null, 20);
    
    // Filter to non-applied insights with high confidence
    const highConfidenceInsights = insights.filter(insight => 
      !insight.is_applied && insight.confidence >= 0.7
    );
    
    const recommendations = [];
    
    // Process insights by type
    for (const insight of highConfidenceInsights) {
      switch (insight.insight_type) {
        case 'productivity_pattern':
          if (insight.insight_data.mostProductiveTime) {
            const recommendation = await this.createRecommendation(
              'schedule_optimization',
              'Optimize Your Study Schedule',
              `Schedule your most challenging tasks during ${insight.insight_data.mostProductiveTime} when you're most productive.`,
              {
                mostProductiveTime: insight.insight_data.mostProductiveTime,
                insightId: insight.id
              },
              3
            );
            recommendations.push(recommendation);
            
            // Mark insight as applied
            await this.markInsightAsApplied(insight.id);
          }
          break;
        
        case 'session_duration':
          if (insight.insight_data.data && insight.insight_data.data.optimalDuration) {
            const duration = insight.insight_data.data.optimalDuration;
            let durationText, durationMinutes;
            
            switch (duration) {
              case 'short':
                durationText = 'shorter sessions (15-25 minutes)';
                durationMinutes = 25;
                break;
              case 'medium':
                durationText = 'medium-length sessions (30-45 minutes)';
                durationMinutes = 45;
                break;
              case 'long':
                durationText = 'longer sessions (60+ minutes)';
                durationMinutes = 60;
                break;
            }
            
            const recommendation = await this.createRecommendation(
              'session_optimization',
              'Optimize Your Study Session Length',
              `Your data shows you perform best with ${durationText}. Try adjusting your study sessions accordingly.`,
              {
                optimalDuration: duration,
                durationMinutes,
                insightId: insight.id
              },
              2
            );
            recommendations.push(recommendation);
            
            // Mark insight as applied
            await this.markInsightAsApplied(insight.id);
          }
          break;
        
        case 'learning_style':
          if (insight.insight_data.dominantStyles && insight.insight_data.dominantStyles.length > 0) {
            const style = insight.insight_data.dominantStyles[0];
            let strategyText, strategies;
            
            if (insight.insight_data.strategies && insight.insight_data.strategies[style]) {
              strategies = insight.insight_data.strategies[style];
              strategyText = strategies.join(', ');
            } else {
              strategyText = 'using appropriate learning techniques';
            }
            
            const recommendation = await this.createRecommendation(
              'learning_style_optimization',
              `Leverage Your ${style.charAt(0).toUpperCase() + style.slice(1)} Learning Style`,
              `Try these strategies that match your learning style: ${strategyText}`,
              {
                learningStyle: style,
                strategies,
                insightId: insight.id
              },
              4
            );
            recommendations.push(recommendation);
            
            // Mark insight as applied
            await this.markInsightAsApplied(insight.id);
          }
          break;
        
        case 'subject_focus':
          if (insight.insight_data.data && insight.insight_data.data.subject) {
            const recommendation = await this.createRecommendation(
              'subject_focus',
              `Focus on ${insight.insight_data.data.subject}`,
              insight.insight_data.description,
              {
                subject: insight.insight_data.data.subject,
                insightId: insight.id
              },
              3
            );
            recommendations.push(recommendation);
            
            // Mark insight as applied
            await this.markInsightAsApplied(insight.id);
          }
          break;
      }
    }
    
    return recommendations;
  }
}

/**
 * Hook for using the AI Coach Insight Service
 * @returns {Object} AI Coach Insight Service methods
 */
export function useAICoachInsight() {
  const service = AICoachInsightService.getInstance();
  
  return {
    initialize: service.initialize.bind(service),
    createInsight: service.createInsight.bind(service),
    getUserInsights: service.getUserInsights.bind(service),
    markInsightAsApplied: service.markInsightAsApplied.bind(service),
    generateInsightsFromStudyData: service.generateInsightsFromStudyData.bind(service),
    createRecommendation: service.createRecommendation.bind(service),
    getUserRecommendations: service.getUserRecommendations.bind(service),
    markRecommendationAsApplied: service.markRecommendationAsApplied.bind(service),
    generateRecommendationsFromInsights: service.generateRecommendationsFromInsights.bind(service)
  };
}
