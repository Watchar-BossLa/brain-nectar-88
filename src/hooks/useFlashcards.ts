import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { spacedRepetitionService } from '@/services/flashcards/spacedRepetitionService';
import { supabase } from '@/integrations/supabase/client';

export const useFlashcards = () => {
  const { user } = useAuth();
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [dueFlashcards, setDueFlashcards] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalCards: 0,
    masteredCards: 0,
    dueCards: 0,
    averageDifficulty: 0,
    reviewsToday: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFlashcards();
      fetchDueFlashcards();
      fetchStats();
    }
  }, [user]);

  const fetchFlashcards = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setFlashcards(data || []);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDueFlashcards = async () => {
    if (!user) return;
    
    try {
      const dueCards = await spacedRepetitionService.getDueFlashcards(user.id);
      setDueFlashcards(dueCards);
    } catch (error) {
      console.error('Error fetching due flashcards:', error);
    }
  };
  
  const fetchStats = async () => {
    if (!user) return;
    
    try {
      const flashcardStats = await spacedRepetitionService.getFlashcardStats(user.id);
      setStats(flashcardStats);
    } catch (error) {
      console.error('Error fetching flashcard stats:', error);
    }
  };
  
  const createFlashcard = async (flashcardData: { 
    front_content: string; 
    back_content: string;
    topic_id?: string;
  }) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .insert({
          ...flashcardData,
          user_id: user.id,
          difficulty: 0,
          repetition_count: 0,
          next_review_date: new Date().toISOString()
        })
        .select()
        .single();
        
      if (error) throw error;
      
      await fetchFlashcards();
      await fetchDueFlashcards();
      await fetchStats();
      
      return data;
    } catch (error) {
      console.error('Error creating flashcard:', error);
      return null;
    }
  };
  
  const deleteFlashcard = async (flashcardId: string) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', flashcardId)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      await fetchFlashcards();
      await fetchDueFlashcards();
      await fetchStats();
      
      return true;
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      return false;
    }
  };
  
  const updateFlashcard = async (flashcardId: string, updates: Partial<{
    front_content: string;
    back_content: string;
    topic_id: string;
  }>) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .update(updates)
        .eq('id', flashcardId)
        .eq('user_id', user.id)
        .select()
        .single();
        
      if (error) throw error;
      
      await fetchFlashcards();
      
      return data;
    } catch (error) {
      console.error('Error updating flashcard:', error);
      return null;
    }
  };
  
  const recordReview = async (flashcardId: string, difficulty: number) => {
    try {
      const success = await spacedRepetitionService.recordReview({
        flashcardId,
        difficulty,
        reviewedAt: new Date().toISOString()
      });
      
      if (success) {
        await fetchStats();
        await fetchDueFlashcards();
      }
      
      return success;
    } catch (error) {
      console.error('Error recording review:', error);
      return false;
    }
  };

  return {
    flashcards,
    dueFlashcards,
    stats,
    isLoading,
    fetchFlashcards,
    fetchDueFlashcards,
    fetchStats,
    createFlashcard,
    deleteFlashcard,
    updateFlashcard,
    recordReview
  };
};

export async function calculateFlashcardRetention(userId: string, options = {}) {
  try {
    const sampleData = {
      totalFlashcards: 120,
      reviewedLast7Days: 45,
      masteryLevels: {
        low: 30,
        medium: 55,
        high: 35
      },
      reviewAccuracy: 0.72,
      needsReview: 24,
      retentionRate: 0.83,
      projectedRetention: 0.91
    };
    
    return {
      success: true,
      data: sampleData
    };
  } catch (error) {
    console.error('Error calculating flashcard retention:', error);
    return {
      success: false,
      error: 'Failed to calculate retention metrics'
    };
  }
}
