/**
 * Knowledge Exchange Service
 * Service for Q&A and knowledge sharing
 */

import { supabase } from '@/integrations/supabase/client';
import { CollaborativeNetworkService } from './CollaborativeNetworkService';

/**
 * Knowledge Exchange Service class
 */
export class KnowledgeExchangeService {
  static instance;
  
  /**
   * Private constructor for singleton pattern
   */
  constructor() {
    this.initialized = false;
    this.collaborativeNetwork = CollaborativeNetworkService.getInstance();
  }
  
  /**
   * Get the singleton instance
   * @returns {KnowledgeExchangeService} The singleton instance
   */
  static getInstance() {
    if (!KnowledgeExchangeService.instance) {
      KnowledgeExchangeService.instance = new KnowledgeExchangeService();
    }
    return KnowledgeExchangeService.instance;
  }
  
  /**
   * Initialize the service
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async initialize(userId) {
    try {
      console.log('Initializing Knowledge Exchange Service for user:', userId);
      this.userId = userId;
      
      // Ensure collaborative network service is initialized
      if (!this.collaborativeNetwork.initialized) {
        await this.collaborativeNetwork.initialize(userId);
      }
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Knowledge Exchange Service:', error);
      return false;
    }
  }
  
  /**
   * Ask a new question
   * @param {Object} questionData - Question data
   * @param {string} questionData.title - Question title
   * @param {string} questionData.content - Question content
   * @param {Array<string>} [questionData.tags=[]] - Question tags
   * @param {string} [questionData.groupId=null] - Group ID (null for public questions)
   * @returns {Promise<Object>} Created question
   */
  async askQuestion(questionData) {
    if (!this.initialized) {
      throw new Error('Knowledge Exchange Service not initialized');
    }
    
    const {
      title,
      content,
      tags = [],
      groupId = null
    } = questionData;
    
    // If group ID is provided, check if user is a member
    if (groupId) {
      const { data: membership, error: membershipError } = await supabase
        .from('group_members')
        .select('role')
        .eq('group_id', groupId)
        .eq('user_id', this.userId)
        .maybeSingle();
      
      if (membershipError) throw membershipError;
      
      if (!membership) {
        throw new Error('You must be a member of the group to ask questions');
      }
    }
    
    // Create question in database
    const { data: question, error } = await supabase
      .from('knowledge_questions')
      .insert({
        user_id: this.userId,
        group_id: groupId,
        title,
        content,
        tags,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Create activity for asking question
    await this._createActivity('asked_question', {
      question_id: question.id,
      question_title: question.title,
      group_id: groupId
    });
    
    return question;
  }
  
  /**
   * Answer a question
   * @param {string} questionId - Question ID
   * @param {Object} answerData - Answer data
   * @param {string} answerData.content - Answer content
   * @returns {Promise<Object>} Created answer
   */
  async answerQuestion(questionId, answerData) {
    if (!this.initialized) {
      throw new Error('Knowledge Exchange Service not initialized');
    }
    
    const { content } = answerData;
    
    // Get question details
    const { data: question, error: questionError } = await supabase
      .from('knowledge_questions')
      .select('*')
      .eq('id', questionId)
      .single();
    
    if (questionError) throw questionError;
    
    // If question is in a group, check if user is a member
    if (question.group_id) {
      const { data: membership, error: membershipError } = await supabase
        .from('group_members')
        .select('role')
        .eq('group_id', question.group_id)
        .eq('user_id', this.userId)
        .maybeSingle();
      
      if (membershipError) throw membershipError;
      
      if (!membership) {
        throw new Error('You must be a member of the group to answer this question');
      }
    }
    
    // Create answer in database
    const { data: answer, error } = await supabase
      .from('knowledge_answers')
      .insert({
        question_id: questionId,
        user_id: this.userId,
        content,
        is_accepted: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Create activity for answering question
    await this._createActivity('answered_question', {
      question_id: questionId,
      question_title: question.title,
      answer_id: answer.id,
      group_id: question.group_id
    });
    
    return answer;
  }
  
  /**
   * Get questions with filtering
   * @param {Object} [options] - Options
   * @param {string} [options.groupId] - Filter by group ID (null for public questions)
   * @param {Array<string>} [options.tags] - Filter by tags
   * @param {string} [options.userId] - Filter by user ID
   * @param {boolean} [options.answered] - Filter by answered status
   * @param {number} [options.limit=20] - Maximum number of questions
   * @param {number} [options.offset=0] - Offset for pagination
   * @returns {Promise<Array<Object>>} Questions
   */
  async getQuestions(options = {}) {
    if (!this.initialized) {
      throw new Error('Knowledge Exchange Service not initialized');
    }
    
    const {
      groupId,
      tags,
      userId,
      answered,
      limit = 20,
      offset = 0
    } = options;
    
    // Build query
    let query = supabase
      .from('knowledge_questions')
      .select(`
        *,
        user:user_id(id, username, avatar_url),
        answer_count:knowledge_answers(count)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Apply group filter
    if (groupId !== undefined) {
      if (groupId === null) {
        query = query.is('group_id', null);
      } else {
        // Check if user is a member of the group
        const { data: membership, error: membershipError } = await supabase
          .from('group_members')
          .select('role')
          .eq('group_id', groupId)
          .eq('user_id', this.userId)
          .maybeSingle();
        
        if (membershipError) throw membershipError;
        
        if (!membership) {
          throw new Error('You must be a member of the group to view its questions');
        }
        
        query = query.eq('group_id', groupId);
      }
    }
    
    // Apply tags filter
    if (tags && tags.length > 0) {
      query = query.contains('tags', tags);
    }
    
    // Apply user filter
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    // Apply answered filter
    if (answered !== undefined) {
      if (answered) {
        // Questions with at least one answer
        query = query.gt('knowledge_answers.count', 0);
      } else {
        // Questions with no answers
        query = query.eq('knowledge_answers.count', 0);
      }
    }
    
    // Execute query
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data || [];
  }
  
  /**
   * Get question details with answers
   * @param {string} questionId - Question ID
   * @returns {Promise<Object>} Question with answers
   */
  async getQuestionDetails(questionId) {
    if (!this.initialized) {
      throw new Error('Knowledge Exchange Service not initialized');
    }
    
    // Get question details
    const { data: question, error: questionError } = await supabase
      .from('knowledge_questions')
      .select(`
        *,
        user:user_id(id, username, avatar_url),
        group:group_id(id, name)
      `)
      .eq('id', questionId)
      .single();
    
    if (questionError) throw questionError;
    
    // If question is in a group, check if user is a member
    if (question.group_id) {
      const { data: membership, error: membershipError } = await supabase
        .from('group_members')
        .select('role')
        .eq('group_id', question.group_id)
        .eq('user_id', this.userId)
        .maybeSingle();
      
      if (membershipError) throw membershipError;
      
      if (!membership) {
        throw new Error('You must be a member of the group to view this question');
      }
    }
    
    // Get answers
    const { data: answers, error: answersError } = await supabase
      .from('knowledge_answers')
      .select(`
        *,
        user:user_id(id, username, avatar_url)
      `)
      .eq('question_id', questionId)
      .order('is_accepted', { ascending: false })
      .order('created_at', { ascending: true });
    
    if (answersError) throw answersError;
    
    return {
      ...question,
      answers: answers || []
    };
  }
  
  /**
   * Accept an answer
   * @param {string} questionId - Question ID
   * @param {string} answerId - Answer ID
   * @returns {Promise<boolean>} Success status
   */
  async acceptAnswer(questionId, answerId) {
    if (!this.initialized) {
      throw new Error('Knowledge Exchange Service not initialized');
    }
    
    // Get question details
    const { data: question, error: questionError } = await supabase
      .from('knowledge_questions')
      .select('*')
      .eq('id', questionId)
      .single();
    
    if (questionError) throw questionError;
    
    // Check if user is the question author
    if (question.user_id !== this.userId) {
      throw new Error('Only the question author can accept answers');
    }
    
    // Reset all answers for this question
    const { error: resetError } = await supabase
      .from('knowledge_answers')
      .update({ is_accepted: false })
      .eq('question_id', questionId);
    
    if (resetError) throw resetError;
    
    // Accept the specified answer
    const { error: acceptError } = await supabase
      .from('knowledge_answers')
      .update({ is_accepted: true })
      .eq('id', answerId)
      .eq('question_id', questionId);
    
    if (acceptError) throw acceptError;
    
    // Get answer details
    const { data: answer, error: answerError } = await supabase
      .from('knowledge_answers')
      .select('user_id')
      .eq('id', answerId)
      .single();
    
    if (answerError) throw answerError;
    
    // Create activity for accepting answer
    await this._createActivity('accepted_answer', {
      question_id: questionId,
      question_title: question.title,
      answer_id: answerId,
      answerer_id: answer.user_id,
      group_id: question.group_id
    });
    
    return true;
  }
  
  /**
   * Search for questions
   * @param {string} query - Search query
   * @param {Object} [options] - Search options
   * @param {string} [options.groupId] - Filter by group ID (null for public questions)
   * @param {number} [options.limit=20] - Maximum number of results
   * @param {number} [options.offset=0] - Offset for pagination
   * @returns {Promise<Array<Object>>} Matching questions
   */
  async searchQuestions(query, options = {}) {
    if (!this.initialized) {
      throw new Error('Knowledge Exchange Service not initialized');
    }
    
    const {
      groupId,
      limit = 20,
      offset = 0
    } = options;
    
    // Build query
    let dbQuery = supabase
      .from('knowledge_questions')
      .select(`
        *,
        user:user_id(id, username, avatar_url),
        answer_count:knowledge_answers(count)
      `)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Apply group filter
    if (groupId !== undefined) {
      if (groupId === null) {
        dbQuery = dbQuery.is('group_id', null);
      } else {
        // Check if user is a member of the group
        const { data: membership, error: membershipError } = await supabase
          .from('group_members')
          .select('role')
          .eq('group_id', groupId)
          .eq('user_id', this.userId)
          .maybeSingle();
        
        if (membershipError) throw membershipError;
        
        if (!membership) {
          throw new Error('You must be a member of the group to search its questions');
        }
        
        dbQuery = dbQuery.eq('group_id', groupId);
      }
    }
    
    // Execute query
    const { data, error } = await dbQuery;
    
    if (error) throw error;
    
    return data || [];
  }
  
  /**
   * Update a question
   * @param {string} questionId - Question ID
   * @param {Object} questionData - Updated question data
   * @param {string} [questionData.title] - Question title
   * @param {string} [questionData.content] - Question content
   * @param {Array<string>} [questionData.tags] - Question tags
   * @returns {Promise<Object>} Updated question
   */
  async updateQuestion(questionId, questionData) {
    if (!this.initialized) {
      throw new Error('Knowledge Exchange Service not initialized');
    }
    
    // Get question details
    const { data: question, error: questionError } = await supabase
      .from('knowledge_questions')
      .select('*')
      .eq('id', questionId)
      .single();
    
    if (questionError) throw questionError;
    
    // Check if user is the question author
    if (question.user_id !== this.userId) {
      throw new Error('Only the question author can update the question');
    }
    
    // Prepare update data
    const updateData = {};
    
    if (questionData.title !== undefined) updateData.title = questionData.title;
    if (questionData.content !== undefined) updateData.content = questionData.content;
    if (questionData.tags !== undefined) updateData.tags = questionData.tags;
    
    updateData.updated_at = new Date().toISOString();
    
    // Update question
    const { data: updatedQuestion, error: updateError } = await supabase
      .from('knowledge_questions')
      .update(updateData)
      .eq('id', questionId)
      .select()
      .single();
    
    if (updateError) throw updateError;
    
    return updatedQuestion;
  }
  
  /**
   * Update an answer
   * @param {string} answerId - Answer ID
   * @param {Object} answerData - Updated answer data
   * @param {string} answerData.content - Answer content
   * @returns {Promise<Object>} Updated answer
   */
  async updateAnswer(answerId, answerData) {
    if (!this.initialized) {
      throw new Error('Knowledge Exchange Service not initialized');
    }
    
    // Get answer details
    const { data: answer, error: answerError } = await supabase
      .from('knowledge_answers')
      .select('*')
      .eq('id', answerId)
      .single();
    
    if (answerError) throw answerError;
    
    // Check if user is the answer author
    if (answer.user_id !== this.userId) {
      throw new Error('Only the answer author can update the answer');
    }
    
    // Update answer
    const { data: updatedAnswer, error: updateError } = await supabase
      .from('knowledge_answers')
      .update({
        content: answerData.content,
        updated_at: new Date().toISOString()
      })
      .eq('id', answerId)
      .select()
      .single();
    
    if (updateError) throw updateError;
    
    return updatedAnswer;
  }
  
  /**
   * Delete a question
   * @param {string} questionId - Question ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteQuestion(questionId) {
    if (!this.initialized) {
      throw new Error('Knowledge Exchange Service not initialized');
    }
    
    // Get question details
    const { data: question, error: questionError } = await supabase
      .from('knowledge_questions')
      .select('*')
      .eq('id', questionId)
      .single();
    
    if (questionError) throw questionError;
    
    // Check if user is the question author
    if (question.user_id !== this.userId) {
      // If question is in a group, check if user is an admin or moderator
      if (question.group_id) {
        const { data: membership, error: membershipError } = await supabase
          .from('group_members')
          .select('role')
          .eq('group_id', question.group_id)
          .eq('user_id', this.userId)
          .single();
        
        if (membershipError) throw membershipError;
        
        if (membership.role !== 'admin' && membership.role !== 'moderator') {
          throw new Error('You do not have permission to delete this question');
        }
      } else {
        throw new Error('Only the question author can delete the question');
      }
    }
    
    // Delete question
    const { error: deleteError } = await supabase
      .from('knowledge_questions')
      .delete()
      .eq('id', questionId);
    
    if (deleteError) throw deleteError;
    
    return true;
  }
  
  /**
   * Delete an answer
   * @param {string} answerId - Answer ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteAnswer(answerId) {
    if (!this.initialized) {
      throw new Error('Knowledge Exchange Service not initialized');
    }
    
    // Get answer details
    const { data: answer, error: answerError } = await supabase
      .from('knowledge_answers')
      .select(`
        *,
        question:question_id(group_id)
      `)
      .eq('id', answerId)
      .single();
    
    if (answerError) throw answerError;
    
    // Check if user is the answer author
    if (answer.user_id !== this.userId) {
      // If answer is in a group question, check if user is an admin or moderator
      if (answer.question.group_id) {
        const { data: membership, error: membershipError } = await supabase
          .from('group_members')
          .select('role')
          .eq('group_id', answer.question.group_id)
          .eq('user_id', this.userId)
          .single();
        
        if (membershipError) throw membershipError;
        
        if (membership.role !== 'admin' && membership.role !== 'moderator') {
          throw new Error('You do not have permission to delete this answer');
        }
      } else {
        throw new Error('Only the answer author can delete the answer');
      }
    }
    
    // Delete answer
    const { error: deleteError } = await supabase
      .from('knowledge_answers')
      .delete()
      .eq('id', answerId);
    
    if (deleteError) throw deleteError;
    
    return true;
  }
  
  /**
   * Create a user activity
   * @param {string} activityType - Activity type
   * @param {Object} content - Activity content
   * @param {boolean} [isPublic=true] - Whether the activity is public
   * @returns {Promise<Object>} Created activity
   * @private
   */
  async _createActivity(activityType, content, isPublic = true) {
    const { data, error } = await supabase
      .from('user_activities')
      .insert({
        user_id: this.userId,
        activity_type: activityType,
        content,
        is_public: isPublic,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating activity:', error);
      return null;
    }
    
    return data;
  }
}

/**
 * Hook for using the Knowledge Exchange Service
 * @returns {Object} Knowledge Exchange Service methods
 */
export function useKnowledgeExchange() {
  const service = KnowledgeExchangeService.getInstance();
  
  return {
    initialize: service.initialize.bind(service),
    askQuestion: service.askQuestion.bind(service),
    answerQuestion: service.answerQuestion.bind(service),
    getQuestions: service.getQuestions.bind(service),
    getQuestionDetails: service.getQuestionDetails.bind(service),
    acceptAnswer: service.acceptAnswer.bind(service),
    searchQuestions: service.searchQuestions.bind(service),
    updateQuestion: service.updateQuestion.bind(service),
    updateAnswer: service.updateAnswer.bind(service),
    deleteQuestion: service.deleteQuestion.bind(service),
    deleteAnswer: service.deleteAnswer.bind(service)
  };
}
