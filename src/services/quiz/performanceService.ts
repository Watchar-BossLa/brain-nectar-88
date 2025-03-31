
import { supabase } from '@/lib/supabase';

/**
 * Get performance metrics by difficulty level
 * @param userId The ID of the user
 * @returns Performance metrics grouped by difficulty
 */
export const getPerformanceByDifficulty = async (userId: string) => {
  try {
    // Get all quiz sessions for this user
    const { data: sessions, error } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    if (!sessions || sessions.length === 0) {
      return {
        easy: { correct: 0, total: 0, accuracy: 0 },
        medium: { correct: 0, total: 0, accuracy: 0 },
        hard: { correct: 0, total: 0, accuracy: 0 }
      };
    }
    
    // Group sessions by difficulty
    const byDifficulty = {
      1: { correct: 0, total: 0 }, // Easy
      2: { correct: 0, total: 0 }, // Medium
      3: { correct: 0, total: 0 }  // Hard
    };
    
    sessions.forEach(session => {
      const difficulty = session.initial_difficulty || 1;
      if (byDifficulty[difficulty]) {
        byDifficulty[difficulty].correct += session.correct_answers || 0;
        byDifficulty[difficulty].total += session.total_questions || 0;
      }
    });
    
    // Calculate accuracy
    return {
      easy: {
        ...byDifficulty[1],
        accuracy: byDifficulty[1].total > 0 
          ? (byDifficulty[1].correct / byDifficulty[1].total) * 100 
          : 0
      },
      medium: {
        ...byDifficulty[2],
        accuracy: byDifficulty[2].total > 0 
          ? (byDifficulty[2].correct / byDifficulty[2].total) * 100 
          : 0
      },
      hard: {
        ...byDifficulty[3],
        accuracy: byDifficulty[3].total > 0 
          ? (byDifficulty[3].correct / byDifficulty[3].total) * 100 
          : 0
      }
    };
  } catch (error) {
    console.error('Error getting performance by difficulty:', error);
    return {
      easy: { correct: 0, total: 0, accuracy: 0 },
      medium: { correct: 0, total: 0, accuracy: 0 },
      hard: { correct: 0, total: 0, accuracy: 0 }
    };
  }
};
