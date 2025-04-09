/**
 * Content Analysis Service
 * Service for analyzing learning content
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Content Analysis Service class
 */
export class ContentAnalysisService {
  static instance;
  
  /**
   * Private constructor for singleton pattern
   */
  constructor() {
    this.initialized = false;
  }
  
  /**
   * Get the singleton instance
   * @returns {ContentAnalysisService} The singleton instance
   */
  static getInstance() {
    if (!ContentAnalysisService.instance) {
      ContentAnalysisService.instance = new ContentAnalysisService();
    }
    return ContentAnalysisService.instance;
  }
  
  /**
   * Initialize the service
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async initialize(userId) {
    try {
      console.log('Initializing Content Analysis Service for user:', userId);
      this.userId = userId;
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Content Analysis Service:', error);
      return false;
    }
  }
  
  /**
   * Add a content item
   * @param {Object} contentData - Content data
   * @returns {Promise<Object>} Created content item
   */
  async addContentItem(contentData) {
    if (!this.initialized) {
      throw new Error('Content Analysis Service not initialized');
    }
    
    const { 
      title, 
      description, 
      contentType, 
      sourceType, 
      sourceId, 
      topics, 
      difficultyLevel, 
      estimatedDuration, 
      metadata 
    } = contentData;
    
    // Create content item
    const { data: contentItem, error } = await supabase
      .from('content_items')
      .insert({
        title,
        description,
        content_type: contentType,
        source_type: sourceType,
        source_id: sourceId,
        topics,
        difficulty_level: difficultyLevel,
        estimated_duration: estimatedDuration,
        metadata: metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return contentItem;
  }
  
  /**
   * Get content item by ID
   * @param {string} contentId - Content ID
   * @returns {Promise<Object>} Content item with analysis
   */
  async getContentItem(contentId) {
    if (!this.initialized) {
      throw new Error('Content Analysis Service not initialized');
    }
    
    // Get content item
    const { data: contentItem, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('id', contentId)
      .single();
    
    if (error) throw error;
    
    // Get content analysis
    const { data: analysis, error: analysisError } = await supabase
      .from('content_analysis')
      .select('*')
      .eq('content_id', contentId)
      .maybeSingle();
    
    if (analysisError) throw analysisError;
    
    return {
      ...contentItem,
      analysis
    };
  }
  
  /**
   * Search content items
   * @param {Object} searchParams - Search parameters
   * @returns {Promise<Array>} Content items
   */
  async searchContent(searchParams = {}) {
    if (!this.initialized) {
      throw new Error('Content Analysis Service not initialized');
    }
    
    const { 
      query, 
      contentType, 
      sourceType, 
      topics, 
      difficultyLevel, 
      limit = 20, 
      offset = 0 
    } = searchParams;
    
    // Build query
    let dbQuery = supabase
      .from('content_items')
      .select(`
        *,
        content_analysis(*)
      `);
    
    // Apply filters
    if (query) {
      dbQuery = dbQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
    }
    
    if (contentType) {
      dbQuery = dbQuery.eq('content_type', contentType);
    }
    
    if (sourceType) {
      dbQuery = dbQuery.eq('source_type', sourceType);
    }
    
    if (difficultyLevel) {
      dbQuery = dbQuery.eq('difficulty_level', difficultyLevel);
    }
    
    if (topics && topics.length > 0) {
      // This is a simplified approach - in a real implementation, 
      // you would need a more sophisticated query for JSONB arrays
      const topicConditions = topics.map(topic => `topics::text ILIKE '%${topic}%'`).join(' OR ');
      dbQuery = dbQuery.or(topicConditions);
    }
    
    // Apply pagination
    dbQuery = dbQuery
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });
    
    const { data, error } = await dbQuery;
    
    if (error) throw error;
    
    return data;
  }
  
  /**
   * Analyze content
   * @param {string} contentId - Content ID
   * @param {Object} analysisData - Analysis data
   * @returns {Promise<Object>} Content analysis
   */
  async analyzeContent(contentId, analysisData) {
    if (!this.initialized) {
      throw new Error('Content Analysis Service not initialized');
    }
    
    const { 
      topics, 
      keywords, 
      complexityScore, 
      readabilityScore, 
      engagementScore, 
      prerequisites, 
      learningOutcomes, 
      analysisData: customAnalysisData 
    } = analysisData;
    
    // Check if analysis already exists
    const { data: existingAnalysis, error: checkError } = await supabase
      .from('content_analysis')
      .select('id')
      .eq('content_id', contentId)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    if (existingAnalysis) {
      // Update existing analysis
      const { data: updatedAnalysis, error } = await supabase
        .from('content_analysis')
        .update({
          topics,
          keywords,
          complexity_score: complexityScore,
          readability_score: readabilityScore,
          engagement_score: engagementScore,
          prerequisites,
          learning_outcomes: learningOutcomes,
          analysis_data: customAnalysisData || {},
          updated_at: new Date().toISOString()
        })
        .eq('id', existingAnalysis.id)
        .select()
        .single();
      
      if (error) throw error;
      
      return updatedAnalysis;
    } else {
      // Create new analysis
      const { data: newAnalysis, error } = await supabase
        .from('content_analysis')
        .insert({
          content_id: contentId,
          topics,
          keywords,
          complexity_score: complexityScore,
          readability_score: readabilityScore,
          engagement_score: engagementScore,
          prerequisites,
          learning_outcomes: learningOutcomes,
          analysis_data: customAnalysisData || {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return newAnalysis;
    }
  }
  
  /**
   * Get content by topic
   * @param {string} topic - Topic name
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Content items
   */
  async getContentByTopic(topic, options = {}) {
    if (!this.initialized) {
      throw new Error('Content Analysis Service not initialized');
    }
    
    const { limit = 10, offset = 0, contentType } = options;
    
    // Build query
    let query = supabase
      .from('content_items')
      .select(`
        *,
        content_analysis(*)
      `)
      .filter('topics', 'cs', `{"${topic}"}`);
    
    if (contentType) {
      query = query.eq('content_type', contentType);
    }
    
    query = query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data;
  }
  
  /**
   * Get related content
   * @param {string} contentId - Content ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Related content items
   */
  async getRelatedContent(contentId, options = {}) {
    if (!this.initialized) {
      throw new Error('Content Analysis Service not initialized');
    }
    
    const { limit = 5 } = options;
    
    // Get the content item
    const { data: contentItem, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('id', contentId)
      .single();
    
    if (error) throw error;
    
    // Get content analysis
    const { data: analysis, error: analysisError } = await supabase
      .from('content_analysis')
      .select('topics, keywords')
      .eq('content_id', contentId)
      .maybeSingle();
    
    if (analysisError) throw analysisError;
    
    // Get topics from content and analysis
    const topics = [
      ...(contentItem.topics || []),
      ...(analysis?.topics || [])
    ];
    
    if (topics.length === 0) {
      return [];
    }
    
    // Find related content based on topics
    const { data: relatedContent, error: relatedError } = await supabase
      .from('content_items')
      .select(`
        *,
        content_analysis(*)
      `)
      .neq('id', contentId)
      .filter('topics', 'cs', `{${topics.map(t => `"${t}"`).join(',')}}`)
      .limit(limit);
    
    if (relatedError) throw relatedError;
    
    return relatedContent;
  }
  
  /**
   * Get popular content
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Popular content items
   */
  async getPopularContent(options = {}) {
    if (!this.initialized) {
      throw new Error('Content Analysis Service not initialized');
    }
    
    const { limit = 10, contentType, timeFrame = 'week' } = options;
    
    // Calculate date range based on time frame
    const now = new Date();
    let startDate;
    
    switch (timeFrame) {
      case 'day':
        startDate = new Date(now.setDate(now.getDate() - 1));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 7));
    }
    
    // Get content with the most activities
    const { data, error } = await supabase
      .rpc('get_popular_content', {
        start_date: startDate.toISOString(),
        content_type_filter: contentType || null,
        result_limit: limit
      });
    
    if (error) throw error;
    
    // If RPC is not available, this is a fallback
    if (!data || data.length === 0) {
      // Simplified fallback query
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('content_items')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (fallbackError) throw fallbackError;
      
      return fallbackData;
    }
    
    return data;
  }
  
  /**
   * Analyze text content
   * @param {string} text - Text to analyze
   * @returns {Object} Text analysis
   */
  analyzeTextContent(text) {
    // This is a simplified implementation
    // In a real application, this would use NLP or AI services
    
    // Extract keywords (simple implementation)
    const words = text.toLowerCase().split(/\W+/).filter(word => word.length > 3);
    const wordFrequency = {};
    
    words.forEach(word => {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });
    
    const keywords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
    
    // Calculate readability (simplified Flesch-Kincaid)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const totalWords = words.length;
    const totalSentences = sentences.length;
    const totalSyllables = words.reduce((count, word) => {
      return count + this._countSyllables(word);
    }, 0);
    
    const wordsPerSentence = totalWords / totalSentences;
    const syllablesPerWord = totalSyllables / totalWords;
    
    // Simplified Flesch-Kincaid Grade Level
    const readabilityScore = Math.min(100, Math.max(0, 
      Math.round(0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59)
    ));
    
    // Complexity score (simplified)
    const complexityScore = Math.min(100, Math.max(0, 
      Math.round(readabilityScore * 0.7 + (totalWords / 100) * 0.3)
    ));
    
    return {
      keywords,
      readabilityScore,
      complexityScore,
      textStats: {
        wordCount: totalWords,
        sentenceCount: totalSentences,
        averageWordsPerSentence: wordsPerSentence.toFixed(1),
        averageSyllablesPerWord: syllablesPerWord.toFixed(1)
      }
    };
  }
  
  /**
   * Count syllables in a word (simplified)
   * @param {string} word - Word to count syllables for
   * @returns {number} Syllable count
   * @private
   */
  _countSyllables(word) {
    word = word.toLowerCase();
    
    // Special cases
    if (word.length <= 3) return 1;
    
    // Remove es, ed at the end
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    
    // Count vowel groups
    const syllableCount = word.match(/[aeiouy]{1,2}/g);
    
    return syllableCount ? syllableCount.length : 1;
  }
}

/**
 * Hook for using the Content Analysis Service
 * @returns {Object} Content Analysis Service methods
 */
export function useContentAnalysis() {
  const service = ContentAnalysisService.getInstance();
  
  return {
    initialize: service.initialize.bind(service),
    addContentItem: service.addContentItem.bind(service),
    getContentItem: service.getContentItem.bind(service),
    searchContent: service.searchContent.bind(service),
    analyzeContent: service.analyzeContent.bind(service),
    getContentByTopic: service.getContentByTopic.bind(service),
    getRelatedContent: service.getRelatedContent.bind(service),
    getPopularContent: service.getPopularContent.bind(service),
    analyzeTextContent: service.analyzeTextContent.bind(service)
  };
}
