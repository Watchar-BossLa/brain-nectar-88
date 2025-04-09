/**
 * AI Coach Study Plan Service
 * Service for generating and managing personalized study plans
 */

import { supabase } from '@/integrations/supabase/client';
import { AICoachProfileService } from './AICoachProfileService';
import { AICoachGoalService } from './AICoachGoalService';

/**
 * AI Coach Study Plan Service class
 */
export class AICoachStudyPlanService {
  static instance;
  
  /**
   * Private constructor for singleton pattern
   */
  constructor() {
    this.initialized = false;
    this.profileService = AICoachProfileService.getInstance();
    this.goalService = AICoachGoalService.getInstance();
  }
  
  /**
   * Get the singleton instance
   * @returns {AICoachStudyPlanService} The singleton instance
   */
  static getInstance() {
    if (!AICoachStudyPlanService.instance) {
      AICoachStudyPlanService.instance = new AICoachStudyPlanService();
    }
    return AICoachStudyPlanService.instance;
  }
  
  /**
   * Initialize the service
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async initialize(userId) {
    try {
      console.log('Initializing AI Coach Study Plan Service for user:', userId);
      this.userId = userId;
      
      // Ensure profile service is initialized
      if (!this.profileService.initialized) {
        await this.profileService.initialize(userId);
      }
      
      // Ensure goal service is initialized
      if (!this.goalService.initialized) {
        await this.goalService.initialize(userId);
      }
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize AI Coach Study Plan Service:', error);
      return false;
    }
  }
  
  /**
   * Generate a personalized study plan
   * @param {Object} planParameters - Plan parameters
   * @param {string} [planParameters.goalId] - Goal ID (optional)
   * @param {string} [planParameters.subject] - Subject (optional)
   * @param {string} [planParameters.timeFrame='week'] - Time frame (day, week, month)
   * @param {number} [planParameters.hoursPerDay] - Hours per day
   * @param {Array<string>} [planParameters.focusAreas] - Focus areas
   * @param {Object} [planParameters.preferences={}] - User preferences
   * @returns {Promise<Object>} Generated study plan
   */
  async generateStudyPlan(planParameters) {
    if (!this.initialized) {
      throw new Error('AI Coach Study Plan Service not initialized');
    }
    
    const {
      goalId,
      subject,
      timeFrame = 'week',
      hoursPerDay,
      focusAreas = [],
      preferences = {}
    } = planParameters;
    
    // Get learning style
    const learningStyle = await this.profileService.getLearningStyleAssessment();
    const dominantStyles = await this.profileService.getDominantLearningStyles(2);
    
    // Get goal if provided
    let goal = null;
    if (goalId) {
      goal = await this.goalService.getGoal(goalId);
    }
    
    // Get recent study sessions
    const recentSessions = await this.goalService.getAllStudySessions(10);
    
    // In a real implementation, this would use an AI model to generate a personalized plan
    // For now, we'll generate a simple plan based on the parameters
    
    // Generate plan title
    let planTitle;
    if (goal) {
      planTitle = `Study Plan for ${goal.title}`;
    } else if (subject) {
      planTitle = `Study Plan for ${subject}`;
    } else {
      planTitle = `Personalized Study Plan`;
    }
    
    // Generate plan description
    let planDescription;
    if (goal) {
      planDescription = `This plan is designed to help you achieve your goal: ${goal.title}`;
    } else if (subject) {
      planDescription = `This plan is focused on helping you master ${subject}`;
    } else {
      planDescription = `This personalized study plan is based on your learning style and preferences`;
    }
    
    // Generate time allocation
    const totalDays = timeFrame === 'day' ? 1 : timeFrame === 'week' ? 7 : 30;
    const totalHours = hoursPerDay ? hoursPerDay * totalDays : totalDays * 2;
    
    // Generate study blocks
    const studyBlocks = this._generateStudyBlocks(
      totalHours,
      totalDays,
      focusAreas,
      dominantStyles,
      goal,
      subject
    );
    
    // Generate study plan
    const studyPlan = {
      title: planTitle,
      description: planDescription,
      timeFrame,
      totalDays,
      totalHours,
      hoursPerDay: hoursPerDay || (totalHours / totalDays),
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + totalDays * 24 * 60 * 60 * 1000).toISOString(),
      goalId: goal ? goal.id : null,
      subject,
      focusAreas,
      learningStyles: dominantStyles,
      studyBlocks,
      preferences,
      created_at: new Date().toISOString()
    };
    
    return studyPlan;
  }
  
  /**
   * Generate study blocks for plan
   * @param {number} totalHours - Total hours
   * @param {number} totalDays - Total days
   * @param {Array<string>} focusAreas - Focus areas
   * @param {Array<string>} learningStyles - Learning styles
   * @param {Object} goal - Goal (optional)
   * @param {string} subject - Subject (optional)
   * @returns {Array<Object>} Study blocks
   * @private
   */
  _generateStudyBlocks(totalHours, totalDays, focusAreas, learningStyles, goal, subject) {
    const blocks = [];
    let remainingHours = totalHours;
    
    // If no focus areas provided, generate some based on goal or subject
    const areas = focusAreas.length > 0 ? focusAreas : this._generateDefaultFocusAreas(goal, subject);
    
    // Distribute hours among focus areas
    const hoursPerArea = remainingHours / areas.length;
    
    // Generate blocks for each area
    areas.forEach((area, index) => {
      const areaHours = Math.round(hoursPerArea * 10) / 10; // Round to 1 decimal place
      remainingHours -= areaHours;
      
      // Generate activities based on learning styles
      const activities = this._generateActivitiesForLearningStyles(area, learningStyles);
      
      blocks.push({
        id: `block_${index + 1}`,
        title: area,
        hours: areaHours,
        description: `Focus on ${area} for approximately ${areaHours} hours`,
        activities,
        completed: false
      });
    });
    
    // Add any remaining hours to the last block
    if (remainingHours > 0 && blocks.length > 0) {
      blocks[blocks.length - 1].hours += Math.round(remainingHours * 10) / 10;
    }
    
    return blocks;
  }
  
  /**
   * Generate default focus areas
   * @param {Object} goal - Goal (optional)
   * @param {string} subject - Subject (optional)
   * @returns {Array<string>} Focus areas
   * @private
   */
  _generateDefaultFocusAreas(goal, subject) {
    if (goal && goal.goal_type === 'topic_mastery' && goal.metrics && goal.metrics.topics) {
      return goal.metrics.topics;
    }
    
    if (subject) {
      switch (subject.toLowerCase()) {
        case 'mathematics':
        case 'math':
          return ['Algebra', 'Geometry', 'Calculus', 'Statistics'];
        
        case 'science':
          return ['Biology', 'Chemistry', 'Physics', 'Earth Science'];
        
        case 'history':
          return ['Ancient History', 'Medieval History', 'Modern History', 'World Wars'];
        
        case 'english':
        case 'language arts':
          return ['Literature', 'Grammar', 'Writing', 'Comprehension'];
        
        case 'computer science':
        case 'programming':
          return ['Algorithms', 'Data Structures', 'Programming Languages', 'Software Design'];
        
        default:
          return ['Core Concepts', 'Problem Solving', 'Theory', 'Practical Application'];
      }
    }
    
    // Default focus areas
    return ['Fundamentals', 'Advanced Concepts', 'Problem Solving', 'Review'];
  }
  
  /**
   * Generate activities based on learning styles
   * @param {string} area - Focus area
   * @param {Array<string>} learningStyles - Learning styles
   * @returns {Array<Object>} Activities
   * @private
   */
  _generateActivitiesForLearningStyles(area, learningStyles) {
    const activities = [];
    
    // Generate activities for each learning style
    learningStyles.forEach(style => {
      switch (style) {
        case 'visual':
          activities.push({
            id: `${area}_visual_1`,
            title: `Create mind maps for ${area}`,
            description: 'Visualize concepts and their relationships using mind maps or diagrams',
            duration: 30,
            completed: false,
            learningStyle: 'visual'
          });
          activities.push({
            id: `${area}_visual_2`,
            title: `Watch video tutorials on ${area}`,
            description: 'Find and watch educational videos that explain key concepts',
            duration: 45,
            completed: false,
            learningStyle: 'visual'
          });
          break;
        
        case 'auditory':
          activities.push({
            id: `${area}_auditory_1`,
            title: `Listen to lectures on ${area}`,
            description: 'Find and listen to recorded lectures or podcasts on this topic',
            duration: 45,
            completed: false,
            learningStyle: 'auditory'
          });
          activities.push({
            id: `${area}_auditory_2`,
            title: `Verbal review of ${area}`,
            description: 'Record yourself explaining concepts and listen to the recordings',
            duration: 30,
            completed: false,
            learningStyle: 'auditory'
          });
          break;
        
        case 'reading':
          activities.push({
            id: `${area}_reading_1`,
            title: `Read textbook chapters on ${area}`,
            description: 'Read and take notes from relevant textbook chapters',
            duration: 60,
            completed: false,
            learningStyle: 'reading'
          });
          activities.push({
            id: `${area}_reading_2`,
            title: `Create written summaries of ${area}`,
            description: 'Write concise summaries of key concepts in your own words',
            duration: 45,
            completed: false,
            learningStyle: 'reading'
          });
          break;
        
        case 'kinesthetic':
          activities.push({
            id: `${area}_kinesthetic_1`,
            title: `Hands-on practice with ${area}`,
            description: 'Engage in practical exercises or experiments related to this topic',
            duration: 60,
            completed: false,
            learningStyle: 'kinesthetic'
          });
          activities.push({
            id: `${area}_kinesthetic_2`,
            title: `Create physical models for ${area}`,
            description: 'Build physical models or use manipulatives to understand concepts',
            duration: 45,
            completed: false,
            learningStyle: 'kinesthetic'
          });
          break;
        
        case 'social':
          activities.push({
            id: `${area}_social_1`,
            title: `Group discussion on ${area}`,
            description: 'Discuss concepts with peers or in a study group',
            duration: 60,
            completed: false,
            learningStyle: 'social'
          });
          activities.push({
            id: `${area}_social_2`,
            title: `Teach someone about ${area}`,
            description: 'Reinforce your understanding by teaching concepts to someone else',
            duration: 45,
            completed: false,
            learningStyle: 'social'
          });
          break;
        
        case 'solitary':
          activities.push({
            id: `${area}_solitary_1`,
            title: `Independent study of ${area}`,
            description: 'Set aside quiet time for focused, independent study',
            duration: 60,
            completed: false,
            learningStyle: 'solitary'
          });
          activities.push({
            id: `${area}_solitary_2`,
            title: `Self-assessment on ${area}`,
            description: 'Create and complete self-assessment questions to test your understanding',
            duration: 45,
            completed: false,
            learningStyle: 'solitary'
          });
          break;
        
        case 'logical':
          activities.push({
            id: `${area}_logical_1`,
            title: `Problem-solving in ${area}`,
            description: 'Work through practice problems and logical exercises',
            duration: 60,
            completed: false,
            learningStyle: 'logical'
          });
          activities.push({
            id: `${area}_logical_2`,
            title: `Analyze patterns in ${area}`,
            description: 'Identify and analyze patterns and relationships between concepts',
            duration: 45,
            completed: false,
            learningStyle: 'logical'
          });
          break;
      }
    });
    
    // Add some general activities regardless of learning style
    activities.push({
      id: `${area}_general_1`,
      title: `Practice problems for ${area}`,
      description: 'Solve practice problems to reinforce understanding',
      duration: 45,
      completed: false,
      learningStyle: 'general'
    });
    
    activities.push({
      id: `${area}_general_2`,
      title: `Review notes on ${area}`,
      description: 'Review and organize your notes on this topic',
      duration: 30,
      completed: false,
      learningStyle: 'general'
    });
    
    return activities;
  }
  
  /**
   * Save study plan
   * @param {Object} studyPlan - Study plan
   * @returns {Promise<Object>} Saved study plan with ID
   */
  async saveStudyPlan(studyPlan) {
    if (!this.initialized) {
      throw new Error('AI Coach Study Plan Service not initialized');
    }
    
    // Create a session to store the study plan
    const { data: session, error } = await supabase
      .from('ai_coach_sessions')
      .insert({
        user_id: this.userId,
        profile_id: (await this.profileService.getCoachProfile()).id,
        session_type: 'study_plan',
        status: 'active',
        session_data: {
          study_plan: studyPlan
        },
        started_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Return the study plan with the session ID as its ID
    return {
      ...studyPlan,
      id: session.id
    };
  }
  
  /**
   * Get saved study plans
   * @param {number} [limit=5] - Maximum number of plans
   * @returns {Promise<Array<Object>>} Saved study plans
   */
  async getSavedStudyPlans(limit = 5) {
    if (!this.initialized) {
      throw new Error('AI Coach Study Plan Service not initialized');
    }
    
    // Get sessions with study plans
    const { data: sessions, error } = await supabase
      .from('ai_coach_sessions')
      .select('*')
      .eq('user_id', this.userId)
      .eq('session_type', 'study_plan')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    // Extract study plans from sessions
    const studyPlans = sessions.map(session => ({
      ...session.session_data.study_plan,
      id: session.id
    }));
    
    return studyPlans;
  }
  
  /**
   * Get study plan by ID
   * @param {string} planId - Plan ID (session ID)
   * @returns {Promise<Object>} Study plan
   */
  async getStudyPlan(planId) {
    if (!this.initialized) {
      throw new Error('AI Coach Study Plan Service not initialized');
    }
    
    // Get session
    const { data: session, error } = await supabase
      .from('ai_coach_sessions')
      .select('*')
      .eq('id', planId)
      .eq('user_id', this.userId)
      .eq('session_type', 'study_plan')
      .single();
    
    if (error) throw error;
    
    // Extract study plan
    const studyPlan = {
      ...session.session_data.study_plan,
      id: session.id
    };
    
    return studyPlan;
  }
  
  /**
   * Update study plan
   * @param {string} planId - Plan ID (session ID)
   * @param {Object} updates - Updates to apply
   * @returns {Promise<Object>} Updated study plan
   */
  async updateStudyPlan(planId, updates) {
    if (!this.initialized) {
      throw new Error('AI Coach Study Plan Service not initialized');
    }
    
    // Get current session
    const { data: session, error: getError } = await supabase
      .from('ai_coach_sessions')
      .select('session_data')
      .eq('id', planId)
      .eq('user_id', this.userId)
      .eq('session_type', 'study_plan')
      .single();
    
    if (getError) throw getError;
    
    // Update study plan
    const updatedPlan = {
      ...session.session_data.study_plan,
      ...updates
    };
    
    // Update session
    const { data: updatedSession, error } = await supabase
      .from('ai_coach_sessions')
      .update({
        session_data: {
          study_plan: updatedPlan
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', planId)
      .eq('user_id', this.userId)
      .select()
      .single();
    
    if (error) throw error;
    
    // Return updated study plan
    return {
      ...updatedPlan,
      id: updatedSession.id
    };
  }
  
  /**
   * Mark study block as completed
   * @param {string} planId - Plan ID (session ID)
   * @param {string} blockId - Block ID
   * @returns {Promise<Object>} Updated study plan
   */
  async markStudyBlockCompleted(planId, blockId) {
    if (!this.initialized) {
      throw new Error('AI Coach Study Plan Service not initialized');
    }
    
    // Get current study plan
    const studyPlan = await this.getStudyPlan(planId);
    
    // Find and update the block
    const updatedBlocks = studyPlan.studyBlocks.map(block => {
      if (block.id === blockId) {
        return {
          ...block,
          completed: true
        };
      }
      return block;
    });
    
    // Update the study plan
    return this.updateStudyPlan(planId, {
      studyBlocks: updatedBlocks
    });
  }
  
  /**
   * Mark activity as completed
   * @param {string} planId - Plan ID (session ID)
   * @param {string} blockId - Block ID
   * @param {string} activityId - Activity ID
   * @returns {Promise<Object>} Updated study plan
   */
  async markActivityCompleted(planId, blockId, activityId) {
    if (!this.initialized) {
      throw new Error('AI Coach Study Plan Service not initialized');
    }
    
    // Get current study plan
    const studyPlan = await this.getStudyPlan(planId);
    
    // Find and update the activity
    const updatedBlocks = studyPlan.studyBlocks.map(block => {
      if (block.id === blockId) {
        const updatedActivities = block.activities.map(activity => {
          if (activity.id === activityId) {
            return {
              ...activity,
              completed: true
            };
          }
          return activity;
        });
        
        return {
          ...block,
          activities: updatedActivities
        };
      }
      return block;
    });
    
    // Update the study plan
    return this.updateStudyPlan(planId, {
      studyBlocks: updatedBlocks
    });
  }
  
  /**
   * Delete study plan
   * @param {string} planId - Plan ID (session ID)
   * @returns {Promise<boolean>} Success status
   */
  async deleteStudyPlan(planId) {
    if (!this.initialized) {
      throw new Error('AI Coach Study Plan Service not initialized');
    }
    
    // Delete session
    const { error } = await supabase
      .from('ai_coach_sessions')
      .delete()
      .eq('id', planId)
      .eq('user_id', this.userId)
      .eq('session_type', 'study_plan');
    
    if (error) throw error;
    
    return true;
  }
}

/**
 * Hook for using the AI Coach Study Plan Service
 * @returns {Object} AI Coach Study Plan Service methods
 */
export function useAICoachStudyPlan() {
  const service = AICoachStudyPlanService.getInstance();
  
  return {
    initialize: service.initialize.bind(service),
    generateStudyPlan: service.generateStudyPlan.bind(service),
    saveStudyPlan: service.saveStudyPlan.bind(service),
    getSavedStudyPlans: service.getSavedStudyPlans.bind(service),
    getStudyPlan: service.getStudyPlan.bind(service),
    updateStudyPlan: service.updateStudyPlan.bind(service),
    markStudyBlockCompleted: service.markStudyBlockCompleted.bind(service),
    markActivityCompleted: service.markActivityCompleted.bind(service),
    deleteStudyPlan: service.deleteStudyPlan.bind(service)
  };
}
