
import { useState, useEffect } from 'react';

export interface FlashcardLearningStats {
  repetitionCount: number;
  easinessFactor: number;
  interval: number;
  lastReviewed?: string;
  nextReviewDate?: string;
}

export interface Flashcard {
  id: string;
  repetition_count: number;
  easiness_factor: number;
  last_reviewed_at?: string;
  next_review_date?: string;
}

/**
 * Calculate retention for a flashcard based on forgetting curve
 */
export const calculateRetention = (daysSinceReview: number, memoryStrength: number): number => {
  // Implementing Ebbinghaus forgetting curve formula
  // R = e^(-t/S) where:
  // R is retention (0-1)
  // t is time since review in days
  // S is memory strength
  
  const retention = Math.exp(-daysSinceReview / (memoryStrength || 1));
  
  // Clamp value between 0 and 1
  return Math.max(0, Math.min(1, retention));
};

/**
 * Hook for calculating and managing flashcard retention statistics
 */
export const useFlashcardRetention = () => {
  const [retentionStats, setRetentionStats] = useState<Record<string, number>>({});
  
  /**
   * Calculate retention for a specific flashcard
   */
  const calculateFlashcardRetention = (flashcard: Flashcard | FlashcardLearningStats): number => {
    if (!flashcard) return 1; // Default to 100% if no flashcard
    
    const now = new Date();
    let lastReviewDate: Date | null = null;
    
    // Handle different property names from different sources
    if ('last_reviewed_at' in flashcard && flashcard.last_reviewed_at) {
      lastReviewDate = new Date(flashcard.last_reviewed_at);
    } else if ('lastReviewed' in flashcard && flashcard.lastReviewed) {
      lastReviewDate = new Date(flashcard.lastReviewed);
    }
    
    // If never reviewed, return 0 retention
    if (!lastReviewDate) return 1;
    
    // Calculate days since last review
    const daysSinceReview = (now.getTime() - lastReviewDate.getTime()) / (1000 * 60 * 60 * 24);
    
    // Calculate memory strength based on repetition count and easiness factor
    const repetitionCount = 'repetition_count' in flashcard ? 
      flashcard.repetition_count : 
      ('repetitionCount' in flashcard ? flashcard.repetitionCount : 0);
    
    const easinessFactor = 'easiness_factor' in flashcard ? 
      flashcard.easiness_factor : 
      ('easinessFactor' in flashcard ? flashcard.easinessFactor : 2.5);
    
    // Memory strength increases with repetitions and easiness
    const memoryStrength = Math.max(1, repetitionCount * 0.4 * easinessFactor);
    
    return calculateRetention(daysSinceReview, memoryStrength);
  };
  
  /**
   * Update retention stats for a collection of flashcards
   */
  const updateRetentionStats = (flashcards: Flashcard[]) => {
    const stats: Record<string, number> = {};
    
    flashcards.forEach(card => {
      stats[card.id] = calculateFlashcardRetention(card);
    });
    
    setRetentionStats(stats);
    return stats;
  };
  
  return {
    retentionStats,
    calculateFlashcardRetention,
    updateRetentionStats
  };
};

export default useFlashcardRetention;
