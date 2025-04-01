import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

export interface Flashcard {
  id: string;
  user_id?: string;
  topicId?: string | null;
  topic_id?: string | null;
  front?: string;
  back?: string;
  front_content?: string;
  back_content?: string;
  difficulty?: number;
  next_review_date?: string;
  repetition_count?: number;
  mastery_level?: number;
  created_at?: string;
  updated_at?: string;
  easiness_factor?: number;
  last_retention?: number;
  last_reviewed_at?: string | null;
}

export interface FlashcardLearningStats {
  totalCards: number;
  masteredCards: number;
  dueCards: number;
  averageDifficulty: number;
  reviewsToday: number;
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
      
      const { data: allFlashcards, error: allError } = await supabase
        .from('flashcards')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (allError) throw allError;
      
      const { data: dueCards, error: dueError } = await supabase
        .from('flashcards')
        .select('*')
        .lte('next_review_date', new Date().toISOString())
        .order('next_review_date', { ascending: true });
      
      if (dueError) throw dueError;
      
      setFlashcards(allFlashcards || []);
      setDueFlashcards(dueCards || []);
      
      const masteredCount = (allFlashcards || []).filter(card => card.mastery_level && card.mastery_level >= 0.9).length;
      const avgDifficulty = (allFlashcards || []).reduce((sum, card) => sum + (card.difficulty || 0), 0) / 
                          ((allFlashcards || []).length || 1);
      
      const today = new Date().toISOString().split('T')[0];
      const reviewsToday = (allFlashcards || []).filter(card => 
        card.last_reviewed_at && card.last_reviewed_at.startsWith(today)
      ).length;
      
      const newStats: FlashcardLearningStats = {
        totalCards: (allFlashcards || []).length,
        masteredCards: masteredCount,
        dueCards: (dueCards || []).length,
        averageDifficulty: Number(avgDifficulty.toFixed(2)),
        reviewsToday,
        learningCards: (allFlashcards || []).filter(card => 
          card.mastery_level && card.mastery_level > 0 && card.mastery_level < 0.9
        ).length,
        newCards: (allFlashcards || []).filter(card => 
          !card.mastery_level || card.mastery_level === 0
        ).length,
        reviewedToday: reviewsToday,
        averageRetention: 0.85,
        streakDays: 1,
        totalReviews: (allFlashcards || []).reduce((sum, card) => sum + (card.repetition_count || 0), 0),
        averageEaseFactor: (allFlashcards || []).reduce((sum, card) => sum + (card.easiness_factor || 2.5), 0) / 
                          ((allFlashcards || []).length || 1),
        retentionRate: 0.85,
        strugglingCardCount: (allFlashcards || []).filter(card => 
          card.difficulty && card.difficulty >= 3
        ).length,
        learningEfficiency: 0.75,
        recommendedDailyReviews: Math.min(20, Math.ceil((dueCards || []).length * 1.2))
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

  const createFlashcard = async (flashcard: Partial<Flashcard>) => {
    try {
      setLoading(true);
      
      if (!flashcard.front && !flashcard.front_content) {
        throw new Error('Front content is required');
      }
      
      if (!flashcard.back && !flashcard.back_content) {
        throw new Error('Back content is required');
      }
      
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      
      const newFlashcard = {
        user_id: user.id,
        front_content: flashcard.front || flashcard.front_content,
        back_content: flashcard.back || flashcard.back_content,
        topic_id: flashcard.topicId || flashcard.topic_id || null,
        difficulty: flashcard.difficulty || 1,
        mastery_level: 0,
        next_review_date: new Date().toISOString(),
        easiness_factor: 2.5,
        repetition_count: 0
      };
      
      const { data: insertData, error: insertError } = await supabase
        .from('flashcards')
        .insert(newFlashcard)
        .select();
      
      if (insertError) throw insertError;
      
      toast({
        title: 'Flashcard created',
        description: 'Your new flashcard has been added',
      });
      
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
      
      const updateData: any = {};
      if (updates.front || updates.front_content) {
        updateData.front_content = updates.front || updates.front_content;
      }
      if (updates.back || updates.back_content) {
        updateData.back_content = updates.back || updates.back_content;
      }
      if (updates.difficulty !== undefined) {
        updateData.difficulty = updates.difficulty;
      }
      if (updates.topicId || updates.topic_id) {
        updateData.topic_id = updates.topicId || updates.topic_id;
      }
      if (updates.next_review_date) {
        updateData.next_review_date = updates.next_review_date;
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
