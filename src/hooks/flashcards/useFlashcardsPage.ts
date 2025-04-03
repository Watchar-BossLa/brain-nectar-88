
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth';
import { Flashcard, FlashcardLearningStats } from '@/types/flashcard';
import { supabase } from '@/integrations/supabase/client';
import { useFlashcardRetrieval } from './useFlashcardRetrieval';
import { useFlashcardStats } from './useFlashcardStats';
import { useFlashcardMutations } from './useFlashcardMutations';

export type { Flashcard, FlashcardLearningStats };

export interface UseFlashcardsReturn {
  flashcards: Flashcard[];
  dueFlashcards: Flashcard[];
  stats: FlashcardLearningStats & { averageDifficulty: number };
  loading: boolean;
  error: Error | null;
  createFlashcard: (flashcard: Partial<Flashcard>) => Promise<Flashcard | null>;
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => Promise<boolean>;
  deleteFlashcard: (id: string) => Promise<boolean>;
  refreshFlashcards: () => Promise<void>;
  isCreating: boolean;
  isDeleting: boolean;
  isUpdating: boolean;
}

export const useFlashcardsPage = (): UseFlashcardsReturn => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { flashcards, dueFlashcards, loading, error, fetchFlashcards } = useFlashcardRetrieval();
  const { stats, refreshStats } = useFlashcardStats();
  const { 
    createFlashcard, 
    updateFlashcard, 
    deleteFlashcard, 
    isCreating, 
    isDeleting,
    isUpdating
  } = useFlashcardMutations();

  const refreshFlashcards = async () => {
    await fetchFlashcards();
    await refreshStats();
  };

  return {
    flashcards,
    dueFlashcards,
    stats,
    loading,
    error,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    refreshFlashcards,
    isCreating,
    isDeleting,
    isUpdating
  };
};

// Additional utility functions to convert between naming conventions
export const formatFlashcardToCamelCase = (flashcardData: any): Partial<Flashcard> => {
  if (!flashcardData) return {};
  
  return {
    id: flashcardData.id,
    userId: flashcardData.user_id,
    topicId: flashcardData.topic_id,
    frontContent: flashcardData.front_content,
    backContent: flashcardData.back_content,
    difficulty: flashcardData.difficulty,
    nextReviewDate: flashcardData.next_review_date,
    repetitionCount: flashcardData.repetition_count,
    masteryLevel: flashcardData.mastery_level,
    createdAt: flashcardData.created_at,
    updatedAt: flashcardData.updated_at,
    easinessFactor: flashcardData.easiness_factor,
    lastRetention: flashcardData.last_retention,
    lastReviewedAt: flashcardData.last_reviewed_at
  };
};

export const formatFlashcardToSnakeCase = (flashcardData: Partial<Flashcard>): any => {
  if (!flashcardData) return {};
  
  return {
    id: flashcardData.id,
    user_id: flashcardData.userId,
    topic_id: flashcardData.topicId,
    front_content: flashcardData.frontContent,
    back_content: flashcardData.backContent,
    difficulty: flashcardData.difficulty,
    next_review_date: flashcardData.nextReviewDate,
    repetition_count: flashcardData.repetitionCount,
    mastery_level: flashcardData.masteryLevel,
    created_at: flashcardData.createdAt,
    updated_at: flashcardData.updatedAt,
    easiness_factor: flashcardData.easinessFactor,
    last_retention: flashcardData.lastRetention,
    last_reviewed_at: flashcardData.lastReviewedAt
  };
};
