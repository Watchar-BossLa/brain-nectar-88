
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  getUserFlashcards, 
  getDueFlashcards, 
  getFlashcardStats,
  type FlashcardLearningStats 
} from '@/services/spacedRepetition';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  dueDate?: Date;
  lastReviewed?: Date;
  repetitionCount?: number;
  easinessFactor?: number;
  interval?: number;
  topicId?: string | null;
  // Add missing properties from Supabase Flashcard type
  user_id?: string;
  front_content?: string;
  back_content?: string;
  difficulty?: number;
  mastery_level?: number;
  next_review_date?: string;
  created_at?: string;
  updated_at?: string;
  last_retention?: number;
  last_reviewed_at?: string;
  topic_id?: string;
}

// Extension of the existing type to ensure compatibility
export interface ExtendedFlashcardStats {
  totalCards: number;
  dueCards: number;
  masteredCards: number;
  learningCards: number;
  newCards: number;
  reviewedToday: number;
  averageRetention: number;
  streakDays: number;
  averageDifficulty?: number;
  totalReviews?: number;
  averageEaseFactor?: number;
  retentionRate?: number;
  strugglingCardCount?: number;
  learningEfficiency?: number;
  recommendedDailyReviews?: number;
}

export function useFlashcardsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [isCreating, setIsCreating] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [dueFlashcards, setDueFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<ExtendedFlashcardStats>({
    totalCards: 0,
    dueCards: 0,
    masteredCards: 0,
    learningCards: 0,
    newCards: 0,
    reviewedToday: 0,
    averageRetention: 0,
    streakDays: 0,
    averageDifficulty: 0
  });

  // Load flashcards and stats
  const loadFlashcards = async () => {
    setIsLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user found');
        setIsLoading(false);
        return;
      }
      
      // In a real app, these would be API calls to get data from the backend
      const userFlashcardsResult = await getUserFlashcards(user.id);
      const dueCardsResult = await getDueFlashcards(user.id);
      const flashcardStats = await getFlashcardStats(user.id);
      
      if (userFlashcardsResult && userFlashcardsResult.data) {
        setFlashcards(userFlashcardsResult.data || []);
      }
      
      if (dueCardsResult && dueCardsResult.data) {
        setDueFlashcards(dueCardsResult.data || []);
      }
      
      if (flashcardStats) {
        const statsToSet: ExtendedFlashcardStats = {
          totalCards: flashcardStats.totalCards || 0,
          dueCards: flashcardStats.dueCards || 0,
          masteredCards: flashcardStats.masteredCards || 0,
          learningCards: flashcardStats.learningCards || 0,
          newCards: flashcardStats.newCards || 0,
          reviewedToday: flashcardStats.reviewsToday || 0,
          averageRetention: flashcardStats.averageRetention || 0,
          streakDays: flashcardStats.streakDays || 0,
          averageDifficulty: flashcardStats.averageDifficulty || 0,
          totalReviews: flashcardStats.totalReviews,
          averageEaseFactor: flashcardStats.averageEaseFactor,
          retentionRate: flashcardStats.retentionRate,
          strugglingCardCount: flashcardStats.strugglingCardCount,
          learningEfficiency: flashcardStats.learningEfficiency,
          recommendedDailyReviews: flashcardStats.recommendedDailyReviews
        };
        setStats(statsToSet);
      }
    } catch (error) {
      console.error('Error loading flashcards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFlashcards();
  }, []);

  // Create a new flashcard
  const handleCreateFlashcard = () => {
    setIsCreating(true);
    setActiveTab('create');
  };

  // Flashcard created handler
  const handleFlashcardCreated = () => {
    setIsCreating(false);
    setActiveTab('all');
    loadFlashcards();
  };

  // Start review handler
  const handleStartReview = () => {
    setActiveTab('review');
  };

  // Update stats handler
  const handleUpdateStats = () => {
    loadFlashcards();
  };

  return {
    activeTab,
    setActiveTab,
    isCreating,
    setIsCreating,
    flashcards,
    dueFlashcards,
    isLoading,
    stats,
    handleCreateFlashcard,
    handleFlashcardCreated,
    handleStartReview,
    handleUpdateStats
  };
}
