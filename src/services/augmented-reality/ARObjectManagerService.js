/**
 * AR Object Manager Service
 * Service for managing AR objects and their content
 */

import { supabase } from '@/integrations/supabase/client';
import { ARStudyEnvironmentService } from './ARStudyEnvironmentService';

/**
 * AR Object Manager Service class
 */
export class ARObjectManagerService {
  static instance;
  
  /**
   * Private constructor for singleton pattern
   */
  constructor() {
    this.initialized = false;
    this.arStudyEnvironment = ARStudyEnvironmentService.getInstance();
  }
  
  /**
   * Get the singleton instance
   * @returns {ARObjectManagerService} The singleton instance
   */
  static getInstance() {
    if (!ARObjectManagerService.instance) {
      ARObjectManagerService.instance = new ARObjectManagerService();
    }
    return ARObjectManagerService.instance;
  }
  
  /**
   * Initialize the service
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async initialize(userId) {
    try {
      console.log('Initializing AR Object Manager Service for user:', userId);
      this.userId = userId;
      
      // Ensure AR Study Environment Service is initialized
      if (!this.arStudyEnvironment.initialized) {
        await this.arStudyEnvironment.initialize(userId);
      }
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize AR Object Manager Service:', error);
      return false;
    }
  }
  
  /**
   * Create a text note object
   * @param {string} spaceId - Study space ID
   * @param {Object} noteData - Note data
   * @param {string} noteData.title - Note title
   * @param {string} noteData.content - Note content
   * @param {Object} noteData.position - 3D position
   * @param {Object} noteData.rotation - 3D rotation
   * @param {Object} noteData.scale - 3D scale
   * @param {Object} [noteData.settings={}] - Note settings
   * @returns {Promise<Object>} Created object
   */
  async createTextNoteObject(spaceId, noteData) {
    if (!this.initialized) {
      throw new Error('AR Object Manager Service not initialized');
    }
    
    const {
      title,
      content,
      position,
      rotation,
      scale,
      settings = {}
    } = noteData;
    
    // Create note content in database
    const { data: note, error: noteError } = await supabase
      .from('documents')
      .insert({
        user_id: this.userId,
        title,
        content,
        file_name: `${title}.md`,
        file_type: 'text/markdown',
        source: 'ar_note',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (noteError) throw noteError;
    
    // Create AR object
    const object = await this.arStudyEnvironment.addStudyObject(spaceId, {
      objectType: 'note',
      contentType: 'document',
      contentId: note.id,
      position,
      rotation,
      scale,
      settings: {
        ...settings,
        title,
        preview: content.substring(0, 100) + (content.length > 100 ? '...' : '')
      }
    });
    
    return {
      ...object,
      content: note
    };
  }
  
  /**
   * Create a flashcard object
   * @param {string} spaceId - Study space ID
   * @param {Object} flashcardData - Flashcard data
   * @param {string} flashcardData.deckId - Flashcard deck ID
   * @param {Object} flashcardData.position - 3D position
   * @param {Object} flashcardData.rotation - 3D rotation
   * @param {Object} flashcardData.scale - 3D scale
   * @param {Object} [flashcardData.settings={}] - Flashcard settings
   * @returns {Promise<Object>} Created object
   */
  async createFlashcardObject(spaceId, flashcardData) {
    if (!this.initialized) {
      throw new Error('AR Object Manager Service not initialized');
    }
    
    const {
      deckId,
      position,
      rotation,
      scale,
      settings = {}
    } = flashcardData;
    
    // Get deck details
    const { data: deck, error: deckError } = await supabase
      .from('study_decks')
      .select('*')
      .eq('id', deckId)
      .single();
    
    if (deckError) throw deckError;
    
    // Check if user has access to the deck
    if (deck.user_id !== this.userId && !deck.is_public) {
      throw new Error('You do not have access to this flashcard deck');
    }
    
    // Get flashcard count
    const { count, error: countError } = await supabase
      .from('flashcards')
      .select('*', { count: 'exact', head: true })
      .eq('deck_id', deckId);
    
    if (countError) throw countError;
    
    // Create AR object
    const object = await this.arStudyEnvironment.addStudyObject(spaceId, {
      objectType: 'flashcards',
      contentType: 'flashcard_deck',
      contentId: deckId,
      position,
      rotation,
      scale,
      settings: {
        ...settings,
        deckName: deck.name,
        cardCount: count
      }
    });
    
    return {
      ...object,
      content: deck
    };
  }
  
  /**
   * Create a 3D model object
   * @param {string} spaceId - Study space ID
   * @param {Object} modelData - Model data
   * @param {string} modelData.modelUrl - Model URL
   * @param {string} modelData.modelType - Model type
   * @param {string} modelData.name - Model name
   * @param {Object} modelData.position - 3D position
   * @param {Object} modelData.rotation - 3D rotation
   * @param {Object} modelData.scale - 3D scale
   * @param {Object} [modelData.settings={}] - Model settings
   * @returns {Promise<Object>} Created object
   */
  async create3DModelObject(spaceId, modelData) {
    if (!this.initialized) {
      throw new Error('AR Object Manager Service not initialized');
    }
    
    const {
      modelUrl,
      modelType,
      name,
      position,
      rotation,
      scale,
      settings = {}
    } = modelData;
    
    // Create AR object
    const object = await this.arStudyEnvironment.addStudyObject(spaceId, {
      objectType: '3d_model',
      contentType: modelType,
      contentId: null,
      position,
      rotation,
      scale,
      settings: {
        ...settings,
        name,
        modelUrl
      }
    });
    
    return object;
  }
  
  /**
   * Create a knowledge map object
   * @param {string} spaceId - Study space ID
   * @param {Object} mapData - Map data
   * @param {string} mapData.mapId - Knowledge map ID
   * @param {Object} mapData.position - 3D position
   * @param {Object} mapData.rotation - 3D rotation
   * @param {Object} mapData.scale - 3D scale
   * @param {Object} [mapData.settings={}] - Map settings
   * @returns {Promise<Object>} Created object
   */
  async createKnowledgeMapObject(spaceId, mapData) {
    if (!this.initialized) {
      throw new Error('AR Object Manager Service not initialized');
    }
    
    const {
      mapId,
      position,
      rotation,
      scale,
      settings = {}
    } = mapData;
    
    // Get map details
    const { data: map, error: mapError } = await supabase
      .from('knowledge_maps')
      .select('*')
      .eq('id', mapId)
      .single();
    
    if (mapError) throw mapError;
    
    // Check if user has access to the map
    if (map.user_id !== this.userId && !map.is_public) {
      throw new Error('You do not have access to this knowledge map');
    }
    
    // Create AR object
    const object = await this.arStudyEnvironment.addStudyObject(spaceId, {
      objectType: 'knowledge_map',
      contentType: 'knowledge_map',
      contentId: mapId,
      position,
      rotation,
      scale,
      settings: {
        ...settings,
        mapName: map.name
      }
    });
    
    return {
      ...object,
      content: map
    };
  }
  
  /**
   * Create a document object
   * @param {string} spaceId - Study space ID
   * @param {Object} documentData - Document data
   * @param {string} documentData.documentId - Document ID
   * @param {Object} documentData.position - 3D position
   * @param {Object} documentData.rotation - 3D rotation
   * @param {Object} documentData.scale - 3D scale
   * @param {Object} [documentData.settings={}] - Document settings
   * @returns {Promise<Object>} Created object
   */
  async createDocumentObject(spaceId, documentData) {
    if (!this.initialized) {
      throw new Error('AR Object Manager Service not initialized');
    }
    
    const {
      documentId,
      position,
      rotation,
      scale,
      settings = {}
    } = documentData;
    
    // Get document details
    const { data: document, error: documentError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();
    
    if (documentError) throw documentError;
    
    // Check if user has access to the document
    if (document.user_id !== this.userId) {
      throw new Error('You do not have access to this document');
    }
    
    // Create AR object
    const object = await this.arStudyEnvironment.addStudyObject(spaceId, {
      objectType: 'document',
      contentType: 'document',
      contentId: documentId,
      position,
      rotation,
      scale,
      settings: {
        ...settings,
        title: document.title || document.file_name,
        fileType: document.file_type
      }
    });
    
    return {
      ...object,
      content: document
    };
  }
  
  /**
   * Create a whiteboard object
   * @param {string} spaceId - Study space ID
   * @param {Object} whiteboardData - Whiteboard data
   * @param {string} whiteboardData.name - Whiteboard name
   * @param {Object} whiteboardData.position - 3D position
   * @param {Object} whiteboardData.rotation - 3D rotation
   * @param {Object} whiteboardData.scale - 3D scale
   * @param {Object} [whiteboardData.settings={}] - Whiteboard settings
   * @returns {Promise<Object>} Created object
   */
  async createWhiteboardObject(spaceId, whiteboardData) {
    if (!this.initialized) {
      throw new Error('AR Object Manager Service not initialized');
    }
    
    const {
      name,
      position,
      rotation,
      scale,
      settings = {}
    } = whiteboardData;
    
    // Create whiteboard content in database
    const { data: whiteboard, error: whiteboardError } = await supabase
      .from('documents')
      .insert({
        user_id: this.userId,
        title: name,
        content: '',
        file_name: `${name}.json`,
        file_type: 'application/json',
        source: 'ar_whiteboard',
        metadata: {
          strokes: [],
          background: settings.background || 'white'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (whiteboardError) throw whiteboardError;
    
    // Create AR object
    const object = await this.arStudyEnvironment.addStudyObject(spaceId, {
      objectType: 'whiteboard',
      contentType: 'document',
      contentId: whiteboard.id,
      position,
      rotation,
      scale,
      settings: {
        ...settings,
        name
      }
    });
    
    return {
      ...object,
      content: whiteboard
    };
  }
  
  /**
   * Create a quiz object
   * @param {string} spaceId - Study space ID
   * @param {Object} quizData - Quiz data
   * @param {string} quizData.quizId - Quiz ID
   * @param {Object} quizData.position - 3D position
   * @param {Object} quizData.rotation - 3D rotation
   * @param {Object} quizData.scale - 3D scale
   * @param {Object} [quizData.settings={}] - Quiz settings
   * @returns {Promise<Object>} Created object
   */
  async createQuizObject(spaceId, quizData) {
    if (!this.initialized) {
      throw new Error('AR Object Manager Service not initialized');
    }
    
    const {
      quizId,
      position,
      rotation,
      scale,
      settings = {}
    } = quizData;
    
    // Get quiz details
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', quizId)
      .single();
    
    if (quizError) throw quizError;
    
    // Check if user has access to the quiz
    if (quiz.user_id !== this.userId) {
      throw new Error('You do not have access to this quiz');
    }
    
    // Get question count
    const { count, error: countError } = await supabase
      .from('quiz_questions')
      .select('*', { count: 'exact', head: true })
      .eq('quiz_id', quizId);
    
    if (countError) throw countError;
    
    // Create AR object
    const object = await this.arStudyEnvironment.addStudyObject(spaceId, {
      objectType: 'quiz',
      contentType: 'quiz',
      contentId: quizId,
      position,
      rotation,
      scale,
      settings: {
        ...settings,
        quizName: quiz.title,
        questionCount: count
      }
    });
    
    return {
      ...object,
      content: quiz
    };
  }
  
  /**
   * Create an image object
   * @param {string} spaceId - Study space ID
   * @param {Object} imageData - Image data
   * @param {string} imageData.imageUrl - Image URL
   * @param {string} imageData.name - Image name
   * @param {Object} imageData.position - 3D position
   * @param {Object} imageData.rotation - 3D rotation
   * @param {Object} imageData.scale - 3D scale
   * @param {Object} [imageData.settings={}] - Image settings
   * @returns {Promise<Object>} Created object
   */
  async createImageObject(spaceId, imageData) {
    if (!this.initialized) {
      throw new Error('AR Object Manager Service not initialized');
    }
    
    const {
      imageUrl,
      name,
      position,
      rotation,
      scale,
      settings = {}
    } = imageData;
    
    // Create AR object
    const object = await this.arStudyEnvironment.addStudyObject(spaceId, {
      objectType: 'image',
      contentType: 'image',
      contentId: null,
      position,
      rotation,
      scale,
      settings: {
        ...settings,
        name,
        imageUrl
      }
    });
    
    return object;
  }
  
  /**
   * Create a video object
   * @param {string} spaceId - Study space ID
   * @param {Object} videoData - Video data
   * @param {string} videoData.videoUrl - Video URL
   * @param {string} videoData.name - Video name
   * @param {Object} videoData.position - 3D position
   * @param {Object} videoData.rotation - 3D rotation
   * @param {Object} videoData.scale - 3D scale
   * @param {Object} [videoData.settings={}] - Video settings
   * @returns {Promise<Object>} Created object
   */
  async createVideoObject(spaceId, videoData) {
    if (!this.initialized) {
      throw new Error('AR Object Manager Service not initialized');
    }
    
    const {
      videoUrl,
      name,
      position,
      rotation,
      scale,
      settings = {}
    } = videoData;
    
    // Create AR object
    const object = await this.arStudyEnvironment.addStudyObject(spaceId, {
      objectType: 'video',
      contentType: 'video',
      contentId: null,
      position,
      rotation,
      scale,
      settings: {
        ...settings,
        name,
        videoUrl
      }
    });
    
    return object;
  }
  
  /**
   * Get object content
   * @param {Object} object - AR object
   * @returns {Promise<Object>} Object content
   */
  async getObjectContent(object) {
    if (!this.initialized) {
      throw new Error('AR Object Manager Service not initialized');
    }
    
    if (!object.content_id) {
      return null;
    }
    
    let content = null;
    
    switch (object.content_type) {
      case 'document':
        const { data: document, error: documentError } = await supabase
          .from('documents')
          .select('*')
          .eq('id', object.content_id)
          .single();
        
        if (documentError) throw documentError;
        content = document;
        break;
        
      case 'flashcard_deck':
        const { data: deck, error: deckError } = await supabase
          .from('study_decks')
          .select('*')
          .eq('id', object.content_id)
          .single();
        
        if (deckError) throw deckError;
        
        // Get flashcards
        const { data: flashcards, error: flashcardsError } = await supabase
          .from('flashcards')
          .select('*')
          .eq('deck_id', object.content_id)
          .order('created_at', { ascending: true });
        
        if (flashcardsError) throw flashcardsError;
        
        content = {
          ...deck,
          flashcards: flashcards || []
        };
        break;
        
      case 'knowledge_map':
        const { data: map, error: mapError } = await supabase
          .from('knowledge_maps')
          .select('*')
          .eq('id', object.content_id)
          .single();
        
        if (mapError) throw mapError;
        
        // Get nodes
        const { data: nodes, error: nodesError } = await supabase
          .from('knowledge_nodes')
          .select('*')
          .eq('map_id', object.content_id);
        
        if (nodesError) throw nodesError;
        
        // Get edges
        const { data: edges, error: edgesError } = await supabase
          .from('knowledge_edges')
          .select('*')
          .eq('map_id', object.content_id);
        
        if (edgesError) throw edgesError;
        
        content = {
          ...map,
          nodes: nodes || [],
          edges: edges || []
        };
        break;
        
      case 'quiz':
        const { data: quiz, error: quizError } = await supabase
          .from('quizzes')
          .select('*')
          .eq('id', object.content_id)
          .single();
        
        if (quizError) throw quizError;
        
        // Get questions
        const { data: questions, error: questionsError } = await supabase
          .from('quiz_questions')
          .select('*')
          .eq('quiz_id', object.content_id)
          .order('order_index', { ascending: true });
        
        if (questionsError) throw questionsError;
        
        content = {
          ...quiz,
          questions: questions || []
        };
        break;
        
      default:
        break;
    }
    
    return content;
  }
  
  /**
   * Update whiteboard content
   * @param {string} whiteboardId - Whiteboard document ID
   * @param {Object} strokeData - Stroke data
   * @returns {Promise<Object>} Updated whiteboard
   */
  async updateWhiteboardContent(whiteboardId, strokeData) {
    if (!this.initialized) {
      throw new Error('AR Object Manager Service not initialized');
    }
    
    // Get current whiteboard data
    const { data: whiteboard, error: whiteboardError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', whiteboardId)
      .single();
    
    if (whiteboardError) throw whiteboardError;
    
    // Check if user has access to the whiteboard
    if (whiteboard.user_id !== this.userId) {
      throw new Error('You do not have access to this whiteboard');
    }
    
    // Update whiteboard metadata
    const metadata = whiteboard.metadata || { strokes: [] };
    metadata.strokes.push(strokeData);
    
    // Update in database
    const { data: updatedWhiteboard, error: updateError } = await supabase
      .from('documents')
      .update({
        metadata,
        updated_at: new Date().toISOString()
      })
      .eq('id', whiteboardId)
      .select()
      .single();
    
    if (updateError) throw updateError;
    
    return updatedWhiteboard;
  }
  
  /**
   * Clear whiteboard content
   * @param {string} whiteboardId - Whiteboard document ID
   * @returns {Promise<Object>} Updated whiteboard
   */
  async clearWhiteboardContent(whiteboardId) {
    if (!this.initialized) {
      throw new Error('AR Object Manager Service not initialized');
    }
    
    // Get current whiteboard data
    const { data: whiteboard, error: whiteboardError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', whiteboardId)
      .single();
    
    if (whiteboardError) throw whiteboardError;
    
    // Check if user has access to the whiteboard
    if (whiteboard.user_id !== this.userId) {
      throw new Error('You do not have access to this whiteboard');
    }
    
    // Update whiteboard metadata
    const metadata = whiteboard.metadata || {};
    metadata.strokes = [];
    
    // Update in database
    const { data: updatedWhiteboard, error: updateError } = await supabase
      .from('documents')
      .update({
        metadata,
        updated_at: new Date().toISOString()
      })
      .eq('id', whiteboardId)
      .select()
      .single();
    
    if (updateError) throw updateError;
    
    return updatedWhiteboard;
  }
}

/**
 * Hook for using the AR Object Manager Service
 * @returns {Object} AR Object Manager Service methods
 */
export function useARObjectManager() {
  const service = ARObjectManagerService.getInstance();
  
  return {
    initialize: service.initialize.bind(service),
    createTextNoteObject: service.createTextNoteObject.bind(service),
    createFlashcardObject: service.createFlashcardObject.bind(service),
    create3DModelObject: service.create3DModelObject.bind(service),
    createKnowledgeMapObject: service.createKnowledgeMapObject.bind(service),
    createDocumentObject: service.createDocumentObject.bind(service),
    createWhiteboardObject: service.createWhiteboardObject.bind(service),
    createQuizObject: service.createQuizObject.bind(service),
    createImageObject: service.createImageObject.bind(service),
    createVideoObject: service.createVideoObject.bind(service),
    getObjectContent: service.getObjectContent.bind(service),
    updateWhiteboardContent: service.updateWhiteboardContent.bind(service),
    clearWhiteboardContent: service.clearWhiteboardContent.bind(service)
  };
}
