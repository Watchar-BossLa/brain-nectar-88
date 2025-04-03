
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { spacedRepetitionService } from '@/services/flashcards/spacedRepetitionService';
import { supabase } from '@/integrations/supabase/client';

export interface Flashcard {
  id: string;
  userId?: string;
  topicId?: string | null;
  front?: string;
  back?: string;
  frontContent?: string;
  backContent?: string;
  difficulty?: number;
  nextReviewDate?: string;
  repetitionCount?: number;
  masteryLevel?: number;
  createdAt?: string;
  updatedAt?: string;
  easinessFactor?: number;
  lastRetention?: number;
  lastReviewedAt?: string | null;
}

export interface FlashcardLearningStats {
  totalCards: number;
  masteredCards: number;
  dueCards: number;
  averageDifficulty: number;
  reviewsToday: number;
  // Extended stats
  learningCards?: number;
  newCards?: number;
  reviewedToday?: number;
  averageRetention?: number;
  streakDays?: number;
  totalReviews?: number;
  averageEaseFactor?: number;
  retentionRate?: number;
  strugglingCardCount?: number;
  learningEfficiency?: number;
  recommendedDailyReviews?: number;
}

export interface UseFlashcardsReturn {
  flashcards: Flashcard[];
  dueFlashcards: Flashcard[];
  stats: FlashcardLearningStats;
  loading: boolean;
  error: Error | null;
  refreshFlashcards: () => Promise<void>;
  createFlashcard: (flashcard: Partial<Flashcard>) => Promise<void>;
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => Promise<void>;
  deleteFlashcard: (id: string) => Promise<void>;
  // Additional properties for the Flashcards page
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  isCreating?: boolean;
  setIsCreating?: (creating: boolean) => void;
  isLoading?: boolean;
  handleCreateFlashcard?: () => void;
  handleFlashcardCreated?: () => void;
  handleStartReview?: () => void;
  handleUpdateStats?: () => void;
}

export const useFlashcardsPage = (): UseFlashcardsReturn => {
  const { toast } = useToast();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [dueFlashcards, setDueFlashcards] = useState<Flashcard[]>([]);
  const [stats, setStats] = useState<FlashcardLearningStats>({
    totalCards: 0,
    masteredCards: 0,
    dueCards: 0,
    averageDifficulty: 0,
    reviewsToday: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshFlashcards = async () => {
    try {
      setLoading(true);
      
      // Fetch all flashcards
      const { data: allFlashcards, error: allError } = await supabase
        .from('flashcards')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (allError) throw allError;
      
      // Fetch due flashcards (next_review_date <= current time)
      const { data: dueCards, error: dueError } = await supabase
        .from('flashcards')
        .select('*')
        .lte('next_review_date', new Date().toISOString())
        .order('next_review_date', { ascending: true });
      
      if (dueError) throw dueError;
      
      // Convert to camelCase
      const camelCaseFlashcards = (allFlashcards || []).map(formatFlashcardToCamelCase);
      const camelCaseDueCards = (dueCards || []).map(formatFlashcardToCamelCase);
      
      setFlashcards(camelCaseFlashcards);
      setDueFlashcards(camelCaseDueCards);
      
      // Calculate stats
      const masteredCount = camelCaseFlashcards.filter(card => card.masteryLevel && card.masteryLevel >= 0.9).length;
      const avgDifficulty = camelCaseFlashcards.reduce((sum, card) => sum + (card.difficulty || 0), 0) / 
                          (camelCaseFlashcards.length || 1);
      
      // Count reviews done today
      const today = new Date().toISOString().split('T')[0];
      const reviewsToday = camelCaseFlashcards.filter(card => 
        card.lastReviewedAt && card.lastReviewedAt.startsWith(today)
      ).length;
      
      const newStats: FlashcardLearningStats = {
        totalCards: camelCaseFlashcards.length,
        masteredCards: masteredCount,
        dueCards: camelCaseDueCards.length,
        averageDifficulty: Number(avgDifficulty.toFixed(2)),
        reviewsToday,
        // Set extended stats with default values
        learningCards: camelCaseFlashcards.filter(card => 
          card.masteryLevel && card.masteryLevel > 0 && card.masteryLevel < 0.9
        ).length,
        newCards: camelCaseFlashcards.filter(card => 
          !card.masteryLevel || card.masteryLevel === 0
        ).length,
        reviewedToday: reviewsToday,
        averageRetention: 0.85, // Default placeholder
        streakDays: 1, // Default placeholder
        totalReviews: camelCaseFlashcards.reduce((sum, card) => sum + (card.repetitionCount || 0), 0),
        averageEaseFactor: camelCaseFlashcards.reduce((sum, card) => sum + (card.easinessFactor || 2.5), 0) / 
                          (camelCaseFlashcards.length || 1),
        retentionRate: 0.85, // Default placeholder
        strugglingCardCount: camelCaseFlashcards.filter(card => 
          card.difficulty && card.difficulty >= 3
        ).length,
        learningEfficiency: 0.75, // Default placeholder
        recommendedDailyReviews: Math.min(20, Math.ceil(camelCaseDueCards.length * 1.2)) // Simple formula
      };
      
      setStats(newStats);
    } catch (err) {
      console.error('Error fetching flashcards:', err);
      setError(err as Error);
      toast({
        title: 'Error fetching flashcards',
        description: (err as Error).message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format snake_case database fields to camelCase
  const formatFlashcardToCamelCase = (flashcard: any): Flashcard => {
    return {
      id: flashcard.id,
      userId: flashcard.user_id,
      topicId: flashcard.topic_id,
      frontContent: flashcard.front_content,
      backContent: flashcard.back_content,
      difficulty: flashcard.difficulty,
      nextReviewDate: flashcard.next_review_date,
      repetitionCount: flashcard.repetition_count,
      masteryLevel: flashcard.mastery_level,
      createdAt: flashcard.created_at,
      updatedAt: flashcard.updated_at,
      easinessFactor: flashcard.easiness_factor,
      lastRetention: flashcard.last_retention,
      lastReviewedAt: flashcard.last_reviewed_at
    };
  };

  const createFlashcard = async (flashcard: Partial<Flashcard>) => {
    try {
      setLoading(true);
      
      // Ensure required fields
      if (!flashcard.front && !flashcard.frontContent) {
        throw new Error('Front content is required');
      }
      
      if (!flashcard.back && !flashcard.backContent) {
        throw new Error('Back content is required');
      }
      
      // Get user ID from current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        throw new Error('User not authenticated');
      }
      
      // Prepare data for insert - converting camelCase to snake_case for database
      const newFlashcard = {
        user_id: session.user.id,
        front_content: flashcard.front || flashcard.frontContent,
        back_content: flashcard.back || flashcard.backContent,
        topic_id: flashcard.topicId || null,
        difficulty: flashcard.difficulty || 1,
        mastery_level: 0,
        next_review_date: new Date().toISOString(),
        easiness_factor: 2.5,
        repetition_count: 0
      };
      
      const { data, error: insertError } = await supabase
        .from('flashcards')
        .insert(newFlashcard)
        .select();
      
      if (insertError) throw insertError;
      
      toast({
        title: 'Flashcard created',
        description: 'Your new flashcard has been added',
      });
      
      // Refresh flashcards to update the list
      await refreshFlashcards();
    } catch (err) {
      console.error('Error creating flashcard:', err);
      setError(err as Error);
      toast({
        title: 'Error creating flashcard',
        description: (err as Error).message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFlashcard = async (id: string, updates: Partial<Flashcard>) => {
    try {
      setLoading(true);
      
      // Prepare data for update - converting camelCase to snake_case for database
      const updateData: any = {};
      if (updates.front || updates.frontContent) {
        updateData.front_content = updates.front || updates.frontContent;
      }
      if (updates.back || updates.backContent) {
        updateData.back_content = updates.back || updates.backContent;
      }
      if (updates.difficulty !== undefined) {
        updateData.difficulty = updates.difficulty;
      }
      if (updates.topicId !== undefined) {
        updateData.topic_id = updates.topicId;
      }
      if (updates.nextReviewDate) {
        updateData.next_review_date = updates.nextReviewDate;
      }
      
      const { error: updateError } = await supabase
        .from('flashcards')
        .update(updateData)
        .eq('id', id);
      
      if (updateError) throw updateError;
      
      toast({
        title: 'Flashcard updated',
        description: 'Your flashcard has been updated',
      });
      
      // Refresh flashcards to update the list
      await refreshFlashcards();
    } catch (err) {
      console.error('Error updating flashcard:', err);
      setError(err as Error);
      toast({
        title: 'Error updating flashcard',
        description: (err as Error).message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteFlashcard = async (id: string) => {
    try {
      setLoading(true);
      
      const { error: deleteError } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', id);
      
      if (deleteError) throw deleteError;
      
      toast({
        title: 'Flashcard deleted',
        description: 'Your flashcard has been removed',
      });
      
      // Refresh flashcards to update the list
      await refreshFlashcards();
    } catch (err) {
      console.error('Error deleting flashcard:', err);
      setError(err as Error);
      toast({
        title: 'Error deleting flashcard',
        description: (err as Error).message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshFlashcards();
  }, []);

  return {
    flashcards,
    dueFlashcards,
    stats,
    loading,
    error,
    refreshFlashcards,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard
  };
};
