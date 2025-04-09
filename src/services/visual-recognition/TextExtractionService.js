/**
 * Text Extraction Service
 * Service for extracting and processing text from images
 */

import { supabase } from '@/integrations/supabase/client';
import { ai } from '@/services';
import { ImageAnalysisService } from './ImageAnalysisService';

/**
 * Text Extraction Service class
 */
export class TextExtractionService {
  static instance;
  
  /**
   * Private constructor for singleton pattern
   */
  constructor() {
    this.initialized = false;
    this.imageAnalysis = ImageAnalysisService.getInstance();
  }
  
  /**
   * Get the singleton instance
   * @returns {TextExtractionService} The singleton instance
   */
  static getInstance() {
    if (!TextExtractionService.instance) {
      TextExtractionService.instance = new TextExtractionService();
    }
    return TextExtractionService.instance;
  }
  
  /**
   * Initialize the service
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async initialize(userId) {
    try {
      console.log('Initializing Text Extraction Service for user:', userId);
      this.userId = userId;
      
      // Ensure image analysis service is initialized
      if (!this.imageAnalysis.initialized) {
        await this.imageAnalysis.initialize();
      }
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Text Extraction Service:', error);
      return false;
    }
  }
  
  /**
   * Extract text from an image
   * @param {string} imageId - Image ID
   * @returns {Promise<Object>} Extraction results
   */
  async extractText(imageId) {
    if (!this.initialized) {
      throw new Error('Text Extraction Service not initialized');
    }
    
    // Get image details
    const { data: image, error: imageError } = await supabase
      .from('visual_recognition_images')
      .select('*')
      .eq('id', imageId)
      .eq('user_id', this.userId)
      .single();
    
    if (imageError) throw imageError;
    
    // Update status to processing
    await supabase
      .from('visual_recognition_images')
      .update({
        recognition_status: 'processing',
        updated_at: new Date().toISOString()
      })
      .eq('id', imageId);
    
    try {
      // Perform text extraction
      const results = await this._performTextExtraction(image.file_url);
      
      // Save results
      const { data: resultData, error: resultError } = await supabase
        .from('visual_recognition_results')
        .insert({
          image_id: imageId,
          result_type: 'text',
          result_data: results,
          confidence: results.confidence,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (resultError) throw resultError;
      
      // Save text blocks
      for (const block of results.textBlocks) {
        await supabase
          .from('visual_recognition_text')
          .insert({
            image_id: imageId,
            text_content: block.text,
            confidence: block.confidence,
            bounding_box: block.boundingBox,
            created_at: new Date().toISOString()
          });
      }
      
      // Update status to completed
      await supabase
        .from('visual_recognition_images')
        .update({
          recognition_status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', imageId);
      
      return {
        ...results,
        id: resultData.id
      };
    } catch (error) {
      console.error('Error extracting text:', error);
      
      // Update status to failed
      await supabase
        .from('visual_recognition_images')
        .update({
          recognition_status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', imageId);
      
      throw error;
    }
  }
  
  /**
   * Perform text extraction on an image
   * @param {string} imageUrl - Image URL
   * @returns {Promise<Object>} Extraction results
   * @private
   */
  async _performTextExtraction(imageUrl) {
    // In a real implementation, this would use OCR models
    // For now, we'll use a simulated implementation
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Sample text blocks for demonstration
    const sampleTextBlocks = [
      {
        text: 'The quick brown fox jumps over the lazy dog.',
        confidence: 0.95,
        boundingBox: { x: 100, y: 100, width: 400, height: 30 },
        language: 'en'
      },
      {
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        confidence: 0.92,
        boundingBox: { x: 100, y: 150, width: 400, height: 30 },
        language: 'en'
      },
      {
        text: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        confidence: 0.90,
        boundingBox: { x: 100, y: 200, width: 400, height: 30 },
        language: 'en'
      }
    ];
    
    // Calculate overall confidence
    const overallConfidence = sampleTextBlocks.reduce((sum, block) => sum + block.confidence, 0) / sampleTextBlocks.length;
    
    return {
      textBlocks: sampleTextBlocks,
      confidence: overallConfidence,
      wordCount: sampleTextBlocks.reduce((count, block) => count + block.text.split(/\\s+/).length, 0),
      characterCount: sampleTextBlocks.reduce((count, block) => count + block.text.length, 0),
      language: 'en', // Simulated language detection
      processingTime: 1.5 // Simulated processing time in seconds
    };
  }
  
  /**
   * Convert extracted text to a document
   * @param {string} imageId - Image ID
   * @returns {Promise<Object>} Conversion results
   */
  async convertToDocument(imageId) {
    if (!this.initialized) {
      throw new Error('Text Extraction Service not initialized');
    }
    
    // Get text blocks
    const { data: textBlocks, error: textError } = await supabase
      .from('visual_recognition_text')
      .select('*')
      .eq('image_id', imageId)
      .order('created_at', { ascending: true });
    
    if (textError) throw textError;
    
    if (!textBlocks || textBlocks.length === 0) {
      // If no text blocks found, perform extraction first
      await this.extractText(imageId);
      
      // Get text blocks again
      const { data: newTextBlocks, error: newError } = await supabase
        .from('visual_recognition_text')
        .select('*')
        .eq('image_id', imageId)
        .order('created_at', { ascending: true });
      
      if (newError) throw newError;
      
      if (!newTextBlocks || newTextBlocks.length === 0) {
        throw new Error('No text found in the image');
      }
      
      textBlocks = newTextBlocks;
    }
    
    // Get image details for title
    const { data: image, error: imageError } = await supabase
      .from('visual_recognition_images')
      .select('file_name')
      .eq('id', imageId)
      .single();
    
    if (imageError) throw imageError;
    
    // Format document content
    const documentContent = textBlocks.map(block => block.text_content).join('\n\n');
    
    // Create document
    const { data: document, error: docError } = await supabase
      .from('documents')
      .insert({
        user_id: this.userId,
        title: `Text from ${image.file_name}`,
        content: documentContent,
        source: 'text_extraction',
        source_id: imageId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (docError) throw docError;
    
    return {
      document,
      textContent: documentContent,
      textBlocks: textBlocks || [],
      wordCount: documentContent.split(/\\s+/).length,
      characterCount: documentContent.length
    };
  }
  
  /**
   * Generate flashcards from extracted text
   * @param {string} imageId - Image ID
   * @returns {Promise<Object>} Generated flashcards
   */
  async generateFlashcards(imageId) {
    if (!this.initialized) {
      throw new Error('Text Extraction Service not initialized');
    }
    
    // Get text blocks
    const { data: textBlocks, error: textError } = await supabase
      .from('visual_recognition_text')
      .select('*')
      .eq('image_id', imageId)
      .order('created_at', { ascending: true });
    
    if (textError) throw textError;
    
    if (!textBlocks || textBlocks.length === 0) {
      // If no text blocks found, perform extraction first
      await this.extractText(imageId);
      
      // Get text blocks again
      const { data: newTextBlocks, error: newError } = await supabase
        .from('visual_recognition_text')
        .select('*')
        .eq('image_id', imageId)
        .order('created_at', { ascending: true });
      
      if (newError) throw newError;
      
      if (!newTextBlocks || newTextBlocks.length === 0) {
        throw new Error('No text found in the image');
      }
      
      textBlocks = newTextBlocks;
    }
    
    // Combine text blocks
    const fullText = textBlocks.map(block => block.text_content).join('\n\n');
    
    // In a real implementation, this would use AI to generate flashcards
    // For now, we'll use a simulated implementation
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate flashcards
    const flashcards = [];
    
    // Simple heuristic: Split by sentences and create Q&A pairs
    const sentences = fullText.match(/[^.!?]+[.!?]+/g) || [];
    
    for (let i = 0; i < sentences.length; i += 2) {
      if (i + 1 < sentences.length) {
        const front = `${sentences[i].trim()}`;
        const back = `${sentences[i + 1].trim()}`;
        
        // Create flashcard
        const { data: flashcard, error: flashcardError } = await supabase
          .from('flashcards')
          .insert({
            user_id: this.userId,
            front,
            back,
            tags: ['text_extraction', 'visual_recognition'],
            source: 'text_extraction',
            source_id: imageId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (flashcardError) {
          console.error('Error creating flashcard:', flashcardError);
          continue;
        }
        
        flashcards.push({
          id: flashcard.id,
          front,
          back
        });
      }
    }
    
    return {
      flashcards,
      count: flashcards.length,
      sourceText: fullText
    };
  }
  
  /**
   * Summarize extracted text
   * @param {string} imageId - Image ID
   * @returns {Promise<Object>} Summary results
   */
  async summarizeText(imageId) {
    if (!this.initialized) {
      throw new Error('Text Extraction Service not initialized');
    }
    
    // Get text blocks
    const { data: textBlocks, error: textError } = await supabase
      .from('visual_recognition_text')
      .select('*')
      .eq('image_id', imageId)
      .order('created_at', { ascending: true });
    
    if (textError) throw textError;
    
    if (!textBlocks || textBlocks.length === 0) {
      // If no text blocks found, perform extraction first
      await this.extractText(imageId);
      
      // Get text blocks again
      const { data: newTextBlocks, error: newError } = await supabase
        .from('visual_recognition_text')
        .select('*')
        .eq('image_id', imageId)
        .order('created_at', { ascending: true });
      
      if (newError) throw newError;
      
      if (!newTextBlocks || newTextBlocks.length === 0) {
        throw new Error('No text found in the image');
      }
      
      textBlocks = newTextBlocks;
    }
    
    // Combine text blocks
    const fullText = textBlocks.map(block => block.text_content).join('\n\n');
    
    // In a real implementation, this would use AI to generate a summary
    // For now, we'll use a simulated implementation
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate summary (just take first 100 characters for simulation)
    const summary = fullText.length > 100 
      ? fullText.substring(0, 100) + '...' 
      : fullText;
    
    // Generate key points (just split by sentences for simulation)
    const keyPoints = fullText
      .match(/[^.!?]+[.!?]+/g)
      ?.slice(0, 3)
      .map(sentence => sentence.trim()) || [];
    
    return {
      summary,
      keyPoints,
      wordCount: fullText.split(/\\s+/).length,
      sourceText: fullText
    };
  }
}

/**
 * Hook for using the Text Extraction Service
 * @returns {Object} Text Extraction Service methods
 */
export function useTextExtraction() {
  const service = TextExtractionService.getInstance();
  
  return {
    initialize: service.initialize.bind(service),
    extractText: service.extractText.bind(service),
    convertToDocument: service.convertToDocument.bind(service),
    generateFlashcards: service.generateFlashcards.bind(service),
    summarizeText: service.summarizeText.bind(service)
  };
}
