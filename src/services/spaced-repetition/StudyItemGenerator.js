/**
 * Study Item Generator
 * Generates study items from various sources for use in the spaced repetition system.
 */

import { supabase } from '@/integrations/supabase/client';
import { useDocumentAnalysis } from '@/services/documents';

/**
 * Study Item Generator class
 */
export class StudyItemGenerator {
  static instance;
  
  /**
   * Private constructor for singleton pattern
   */
  constructor() {
    this.initialized = false;
    this.documentAnalysis = useDocumentAnalysis();
  }
  
  /**
   * Get the singleton instance
   * @returns {StudyItemGenerator} The singleton instance
   */
  static getInstance() {
    if (!StudyItemGenerator.instance) {
      StudyItemGenerator.instance = new StudyItemGenerator();
    }
    return StudyItemGenerator.instance;
  }
  
  /**
   * Initialize the service
   * @returns {Promise<boolean>} Success status
   */
  async initialize() {
    try {
      console.log('Initializing Study Item Generator');
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Study Item Generator:', error);
      return false;
    }
  }
  
  /**
   * Create a study item
   * @param {Object} itemData - Study item data
   * @param {string} itemData.userId - User ID
   * @param {string} itemData.contentFront - Front content
   * @param {string} itemData.contentBack - Back content
   * @param {string} [itemData.contentType='text'] - Content type
   * @param {string} [itemData.source] - Source type
   * @param {string} [itemData.sourceId] - Source ID
   * @param {Array<string>} [itemData.tags] - Tags
   * @returns {Promise<Object>} Created study item
   */
  async createStudyItem(itemData) {
    if (!this.initialized) {
      await this.initialize();
    }
    
    const {
      userId,
      contentFront,
      contentBack,
      contentType = 'text',
      source,
      sourceId,
      tags = []
    } = itemData;
    
    // Validate required fields
    if (!userId || !contentFront || !contentBack) {
      throw new Error('Missing required fields for study item');
    }
    
    // Set initial review date to now (due immediately)
    const nextReviewDate = new Date().toISOString();
    
    // Create study item in database
    const { data, error } = await supabase
      .from('study_items')
      .insert({
        user_id: userId,
        content_front: contentFront,
        content_back: contentBack,
        content_type: contentType,
        source,
        source_id: sourceId,
        tags,
        next_review_date: nextReviewDate,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  }
  
  /**
   * Create multiple study items
   * @param {Array<Object>} items - Array of study item data
   * @param {string} userId - User ID
   * @returns {Promise<Array<Object>>} Created study items
   */
  async createStudyItems(items, userId) {
    if (!this.initialized) {
      await this.initialize();
    }
    
    if (!items || items.length === 0) {
      return [];
    }
    
    // Prepare items for insertion
    const itemsToInsert = items.map(item => ({
      user_id: userId,
      content_front: item.contentFront,
      content_back: item.contentBack,
      content_type: item.contentType || 'text',
      source: item.source,
      source_id: item.sourceId,
      tags: item.tags || [],
      next_review_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    
    // Insert items in database
    const { data, error } = await supabase
      .from('study_items')
      .insert(itemsToInsert)
      .select();
    
    if (error) throw error;
    
    return data || [];
  }
  
  /**
   * Generate study items from a document
   * @param {string} documentId - Document ID
   * @param {string} userId - User ID
   * @param {Object} [options] - Generation options
   * @returns {Promise<Array<Object>>} Generated study items
   */
  async generateFromDocument(documentId, userId, options = {}) {
    if (!this.initialized) {
      await this.initialize();
    }
    
    // Get document results
    const { data: document, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    
    // Check if document processing is complete
    if (document.status !== 'completed') {
      throw new Error('Document processing is not complete');
    }
    
    const items = [];
    
    // Generate items from document structure
    if (document.structure && options.fromStructure !== false) {
      const structureItems = await this.generateFromDocumentStructure(document, userId);
      items.push(...structureItems);
    }
    
    // Generate items from key concepts
    if (document.analysis?.keyConcepts && options.fromConcepts !== false) {
      const conceptItems = await this.generateFromKeyConcepts(document, userId);
      items.push(...conceptItems);
    }
    
    // Generate items from formulas
    if (document.formulas && document.formulas.length > 0 && options.fromFormulas !== false) {
      const formulaItems = await this.generateFromFormulas(document, userId);
      items.push(...formulaItems);
    }
    
    // Create items in database
    const createdItems = await this.createStudyItems(items, userId);
    
    return createdItems;
  }
  
  /**
   * Generate study items from document structure
   * @param {Object} document - Document data
   * @param {string} userId - User ID
   * @returns {Promise<Array<Object>>} Generated study items
   * @private
   */
  async generateFromDocumentStructure(document, userId) {
    const items = [];
    
    // Process sections
    if (document.structure?.sections) {
      for (const section of document.structure.sections) {
        // Create item for section title and content
        items.push({
          contentFront: `What is the main content of "${section.title}"?`,
          contentBack: section.content,
          contentType: 'text',
          source: 'document',
          sourceId: document.id,
          tags: ['document', 'section', document.file_name]
        });
        
        // Process subsections if they exist
        if (section.subsections && section.subsections.length > 0) {
          for (const subsection of section.subsections) {
            items.push({
              contentFront: `What is covered in "${subsection.title}"?`,
              contentBack: subsection.content,
              contentType: 'text',
              source: 'document',
              sourceId: document.id,
              tags: ['document', 'subsection', document.file_name]
            });
          }
        }
      }
    }
    
    return items;
  }
  
  /**
   * Generate study items from key concepts
   * @param {Object} document - Document data
   * @param {string} userId - User ID
   * @returns {Promise<Array<Object>>} Generated study items
   * @private
   */
  async generateFromKeyConcepts(document, userId) {
    const items = [];
    
    if (document.analysis?.keyConcepts) {
      for (const concept of document.analysis.keyConcepts) {
        // Create item for concept definition
        items.push({
          contentFront: `Define or explain: ${concept.name}`,
          contentBack: `Key concept from ${document.file_name}. Related to: ${concept.relatedConcepts.join(', ')}`,
          contentType: 'text',
          source: 'document',
          sourceId: document.id,
          tags: ['document', 'concept', document.file_name]
        });
        
        // Create items for relationships between concepts
        if (concept.relatedConcepts && concept.relatedConcepts.length > 0) {
          items.push({
            contentFront: `What concepts are related to ${concept.name}?`,
            contentBack: concept.relatedConcepts.join(', '),
            contentType: 'text',
            source: 'document',
            sourceId: document.id,
            tags: ['document', 'concept-relationship', document.file_name]
          });
        }
      }
    }
    
    return items;
  }
  
  /**
   * Generate study items from formulas
   * @param {Object} document - Document data
   * @param {string} userId - User ID
   * @returns {Promise<Array<Object>>} Generated study items
   * @private
   */
  async generateFromFormulas(document, userId) {
    const items = [];
    
    if (document.formulas && document.formulas.length > 0) {
      for (const formula of document.formulas) {
        // Create item for formula recognition
        items.push({
          contentFront: `What is this formula? ${formula.latex}`,
          contentBack: formula.description,
          contentType: 'formula',
          source: 'document',
          sourceId: document.id,
          tags: ['document', 'formula', document.file_name]
        });
        
        // Create item for formula recall
        items.push({
          contentFront: `Write the formula for: ${formula.description}`,
          contentBack: formula.latex,
          contentType: 'formula',
          source: 'document',
          sourceId: document.id,
          tags: ['document', 'formula', document.file_name]
        });
      }
    }
    
    return items;
  }
  
  /**
   * Generate study items from flashcards
   * @param {string} deckId - Flashcard deck ID
   * @param {string} userId - User ID
   * @returns {Promise<Array<Object>>} Generated study items
   */
  async generateFromFlashcards(deckId, userId) {
    // Get flashcards from deck
    const { data: flashcards, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('deck_id', deckId)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    if (!flashcards || flashcards.length === 0) {
      return [];
    }
    
    // Convert flashcards to study items
    const items = flashcards.map(card => ({
      contentFront: card.front,
      contentBack: card.back,
      contentType: 'text',
      source: 'flashcard',
      sourceId: card.id,
      tags: ['flashcard', card.deck_id]
    }));
    
    // Create items in database
    const createdItems = await this.createStudyItems(items, userId);
    
    return createdItems;
  }
  
  /**
   * Generate study items from quiz questions
   * @param {string} quizId - Quiz ID
   * @param {string} userId - User ID
   * @returns {Promise<Array<Object>>} Generated study items
   */
  async generateFromQuiz(quizId, userId) {
    // Get quiz questions
    const { data: questions, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quizId);
    
    if (error) throw error;
    
    if (!questions || questions.length === 0) {
      return [];
    }
    
    // Convert questions to study items
    const items = questions.map(question => {
      let back = '';
      
      // Format back content based on question type
      if (question.type === 'multiple_choice') {
        const correctOption = question.options.find(opt => opt.isCorrect);
        back = correctOption ? correctOption.text : '';
      } else {
        back = question.answer || '';
      }
      
      return {
        contentFront: question.text,
        contentBack: back,
        contentType: 'text',
        source: 'quiz',
        sourceId: question.id,
        tags: ['quiz', quizId]
      };
    });
    
    // Create items in database
    const createdItems = await this.createStudyItems(items, userId);
    
    return createdItems;
  }
  
  /**
   * Create a study deck
   * @param {Object} deckData - Deck data
   * @param {string} deckData.userId - User ID
   * @param {string} deckData.name - Deck name
   * @param {string} [deckData.description] - Deck description
   * @param {Array<string>} [deckData.tags] - Deck tags
   * @returns {Promise<Object>} Created deck
   */
  async createDeck(deckData) {
    if (!this.initialized) {
      await this.initialize();
    }
    
    const { userId, name, description = '', tags = [] } = deckData;
    
    // Validate required fields
    if (!userId || !name) {
      throw new Error('Missing required fields for deck');
    }
    
    // Create deck in database
    const { data, error } = await supabase
      .from('study_decks')
      .insert({
        user_id: userId,
        name,
        description,
        tags,
        item_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  }
  
  /**
   * Add items to a deck
   * @param {string} deckId - Deck ID
   * @param {Array<string>} itemIds - Item IDs
   * @returns {Promise<boolean>} Success status
   */
  async addItemsToDeck(deckId, itemIds) {
    if (!this.initialized) {
      await this.initialize();
    }
    
    if (!itemIds || itemIds.length === 0) {
      return true;
    }
    
    // Prepare deck items for insertion
    const deckItems = itemIds.map(itemId => ({
      deck_id: deckId,
      item_id: itemId,
      created_at: new Date().toISOString()
    }));
    
    // Insert deck items
    const { error } = await supabase
      .from('deck_items')
      .insert(deckItems);
    
    if (error) throw error;
    
    // Update deck item count
    const { error: updateError } = await supabase.rpc('update_deck_item_count', {
      p_deck_id: deckId
    });
    
    if (updateError) {
      console.error('Error updating deck item count:', updateError);
    }
    
    return true;
  }
  
  /**
   * Get deck items
   * @param {string} deckId - Deck ID
   * @returns {Promise<Array<Object>>} Deck items
   */
  async getDeckItems(deckId) {
    // Get item IDs from deck
    const { data: deckItems, error } = await supabase
      .from('deck_items')
      .select('item_id')
      .eq('deck_id', deckId);
    
    if (error) throw error;
    
    if (!deckItems || deckItems.length === 0) {
      return [];
    }
    
    // Get items
    const itemIds = deckItems.map(item => item.item_id);
    
    const { data: items, error: itemsError } = await supabase
      .from('study_items')
      .select('*')
      .in('id', itemIds);
    
    if (itemsError) throw itemsError;
    
    return items || [];
  }
  
  /**
   * Remove items from a deck
   * @param {string} deckId - Deck ID
   * @param {Array<string>} itemIds - Item IDs
   * @returns {Promise<boolean>} Success status
   */
  async removeItemsFromDeck(deckId, itemIds) {
    if (!this.initialized) {
      await this.initialize();
    }
    
    if (!itemIds || itemIds.length === 0) {
      return true;
    }
    
    // Delete deck items
    const { error } = await supabase
      .from('deck_items')
      .delete()
      .eq('deck_id', deckId)
      .in('item_id', itemIds);
    
    if (error) throw error;
    
    // Update deck item count
    const { error: updateError } = await supabase.rpc('update_deck_item_count', {
      p_deck_id: deckId
    });
    
    if (updateError) {
      console.error('Error updating deck item count:', updateError);
    }
    
    return true;
  }
  
  /**
   * Get user decks
   * @param {string} userId - User ID
   * @returns {Promise<Array<Object>>} User decks
   */
  async getUserDecks(userId) {
    const { data, error } = await supabase
      .from('study_decks')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  }
}

/**
 * Hook for using the Study Item Generator
 * @returns {Object} Study Item Generator methods
 */
export function useStudyItemGenerator() {
  const generator = StudyItemGenerator.getInstance();
  
  return {
    initialize: generator.initialize.bind(generator),
    createStudyItem: generator.createStudyItem.bind(generator),
    createStudyItems: generator.createStudyItems.bind(generator),
    generateFromDocument: generator.generateFromDocument.bind(generator),
    generateFromFlashcards: generator.generateFromFlashcards.bind(generator),
    generateFromQuiz: generator.generateFromQuiz.bind(generator),
    createDeck: generator.createDeck.bind(generator),
    addItemsToDeck: generator.addItemsToDeck.bind(generator),
    getDeckItems: generator.getDeckItems.bind(generator),
    removeItemsFromDeck: generator.removeItemsFromDeck.bind(generator),
    getUserDecks: generator.getUserDecks.bind(generator)
  };
}
