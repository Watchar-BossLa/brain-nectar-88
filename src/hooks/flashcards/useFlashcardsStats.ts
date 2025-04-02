
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export function useFlashcardsStats() {
  const [stats, setStats] = useState({
    totalCards: 0,
    masteredCards: 0,
    dueCards: 0,
    averageDifficulty: 0,
    reviewsToday: 0
  });
  const [loading, setLoading] = useState<boolean>(false);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch user session
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData?.session?.user?.id) {
        throw new Error('No authenticated user');
      }
      
      const userId = sessionData.session.user.id;
      
      // Get total cards count
      const { count: totalCards, error: totalError } = await supabase
        .from('flashcards')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      
      // Get mastered cards count
      const { count: masteredCards, error: masteredError } = await supabase
        .from('flashcard_learning_stats')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('easiness_factor', 2.5)
        .gte('repetition_count', 3);
      
      // Get due cards count
      const now = new Date().toISOString();
      const { count: dueCards, error: dueError } = await supabase
        .from('flashcard_learning_stats')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .lte('next_review_date', now);
      
      // Calculate reviews done today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: reviewsToday, error: reviewsError } = await supabase
        .from('flashcard_reviews')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('reviewed_at', today.toISOString());
      
      setStats({
        totalCards: totalCards || 0,
        masteredCards: masteredCards || 0,
        dueCards: dueCards || 0,
        averageDifficulty: 0, // This would require additional calculation
        reviewsToday: reviewsToday || 0
      });
    } catch (error) {
      console.error('Error fetching flashcard stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { stats, fetchStats, loading };
}
