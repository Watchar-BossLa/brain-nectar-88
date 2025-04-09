/**
 * Handwriting Recognition Service
 * Service for recognizing and digitizing handwritten content
 */

import { supabase } from '@/integrations/supabase/client';
import { ai } from '@/services';
import { ImageAnalysisService } from './ImageAnalysisService';

/**
 * Handwriting Recognition Service class
 */
export class HandwritingRecognitionService {
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
   * @returns {HandwritingRecognitionService} The singleton instance
   */
  static getInstance() {
    if (!HandwritingRecognitionService.instance) {
      HandwritingRecognitionService.instance = new HandwritingRecognitionService();
    }
    return HandwritingRecognitionService.instance;
  }
  
  /**
   * Initialize the service
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async initialize(userId) {
    try {
      console.log('Initializing Handwriting Recognition Service for user:', userId);
      this.userId = userId;
      
      // Ensure image analysis service is initialized
      if (!this.imageAnalysis.initialized) {
        await this.imageAnalysis.initialize();
      }
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Handwriting Recognition Service:', error);
      return false;
    }
  }
  
  /**
   * Recognize handwriting in an image
   * @param {string} imageId - Image ID
   * @returns {Promise<Object>} Recognition results
   */
  async recognizeHandwriting(imageId) {
    if (!this.initialized) {
      throw new Error('Handwriting Recognition Service not initialized');
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
      // Perform handwriting recognition
      const results = await this._performHandwritingRecognition(image.file_url);
      
      // Save results
      const { data: resultData, error: resultError } = await supabase
        .from('visual_recognition_results')
        .insert({
          image_id: imageId,
          result_type: 'handwriting',
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
      console.error('Error recognizing handwriting:', error);
      
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
   * Perform handwriting recognition on an image
   * @param {string} imageUrl - Image URL
   * @returns {Promise<Object>} Recognition results
   * @private
   */
  async _performHandwritingRecognition(imageUrl) {
    // In a real implementation, this would use AI models for handwriting recognition
    // For now, we'll use a simulated implementation
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get text blocks from image analysis
    const analysisResults = await this.imageAnalysis.analyzeImage(imageUrl, ['text']);
    const textBlocks = analysisResults.text || [];
    
    // Process text blocks to identify handwritten content
    const handwrittenBlocks = textBlocks.map(block => ({
      ...block,
      isHandwritten: Math.random() > 0.3, // Simulate handwriting detection
      confidence: block.confidence * 0.9 // Slightly lower confidence for handwriting
    })).filter(block => block.isHandwritten);
    
    // Calculate overall confidence
    const overallConfidence = handwrittenBlocks.length > 0
      ? handwrittenBlocks.reduce((sum, block) => sum + block.confidence, 0) / handwrittenBlocks.length
      : 0;
    
    return {
      textBlocks: handwrittenBlocks,
      confidence: overallConfidence,
      wordCount: handwrittenBlocks.reduce((count, block) => count + block.content.split(/\\s+/).length, 0),
      characterCount: handwrittenBlocks.reduce((count, block) => count + block.content.length, 0),
      language: 'en', // Simulated language detection
      processingTime: 1.5 // Simulated processing time in seconds
    };
  }
  
  /**
   * Convert handwritten content to digital text
   * @param {string} imageId - Image ID
   * @returns {Promise<Object>} Conversion results
   */
  async convertToDigitalText(imageId) {
    if (!this.initialized) {
      throw new Error('Handwriting Recognition Service not initialized');
    }
    
    // Get handwriting recognition results
    const { data: results, error } = await supabase
      .from('visual_recognition_results')
      .select('*')
      .eq('image_id', imageId)
      .eq('result_type', 'handwriting')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      // If no results found, perform recognition first
      if (error.code === 'PGRST116') {
        return await this.recognizeHandwriting(imageId);
      }
      throw error;
    }
    
    // Get text blocks
    const { data: textBlocks, error: textError } = await supabase
      .from('visual_recognition_text')
      .select('*')
      .eq('image_id', imageId)
      .order('created_at', { ascending: true });
    
    if (textError) throw textError;
    
    // Format digital text
    const digitalText = textBlocks.map(block => block.text_content).join('\n\n');
    
    // Create a document with the digital text
    const { data: document, error: docError } = await supabase
      .from('documents')
      .insert({
        user_id: this.userId,
        title: `Handwriting Conversion - ${new Date().toLocaleDateString()}`,
        content: digitalText,
        source: 'handwriting_recognition',
        source_id: imageId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (docError) throw docError;
    
    return {
      document,
      digitalText,
      textBlocks: textBlocks || [],
      confidence: results.confidence
    };
  }
  
  /**
   * Improve handwriting recognition results with user corrections
   * @param {string} imageId - Image ID
   * @param {Array<Object>} corrections - User corrections
   * @returns {Promise<Object>} Updated results
   */
  async applyUserCorrections(imageId, corrections) {
    if (!this.initialized) {
      throw new Error('Handwriting Recognition Service not initialized');
    }
    
    // Apply each correction
    for (const correction of corrections) {
      const { textId, correctedText } = correction;
      
      // Update text block
      const { error } = await supabase
        .from('visual_recognition_text')
        .update({
          text_content: correctedText,
          updated_at: new Date().toISOString()
        })
        .eq('id', textId)
        .eq('image_id', imageId);
      
      if (error) throw error;
    }
    
    // Get updated text blocks
    const { data: textBlocks, error: textError } = await supabase
      .from('visual_recognition_text')
      .select('*')
      .eq('image_id', imageId)
      .order('created_at', { ascending: true });
    
    if (textError) throw textError;
    
    // Update result data
    const { data: result, error: resultError } = await supabase
      .from('visual_recognition_results')
      .select('*')
      .eq('image_id', imageId)
      .eq('result_type', 'handwriting')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (resultError) throw resultError;
    
    // Update result with corrections
    const updatedResultData = {
      ...result.result_data,
      textBlocks: textBlocks.map(block => ({
        text: block.text_content,
        confidence: block.confidence,
        boundingBox: block.bounding_box,
        isHandwritten: true
      })),
      userCorrected: true,
      correctionCount: (result.result_data.correctionCount || 0) + corrections.length
    };
    
    // Save updated result
    const { error: updateError } = await supabase
      .from('visual_recognition_results')
      .update({
        result_data: updatedResultData,
        updated_at: new Date().toISOString()
      })
      .eq('id', result.id);
    
    if (updateError) throw updateError;
    
    return {
      textBlocks: textBlocks || [],
      corrections: corrections.length,
      result: updatedResultData
    };
  }
}

/**
 * Hook for using the Handwriting Recognition Service
 * @returns {Object} Handwriting Recognition Service methods
 */
export function useHandwritingRecognition() {
  const service = HandwritingRecognitionService.getInstance();
  
  return {
    initialize: service.initialize.bind(service),
    recognizeHandwriting: service.recognizeHandwriting.bind(service),
    convertToDigitalText: service.convertToDigitalText.bind(service),
    applyUserCorrections: service.applyUserCorrections.bind(service)
  };
}
