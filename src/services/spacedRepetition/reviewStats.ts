
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/supabaseAuth';

/**
 * Calculate retention percentage for a flashcard
 */
export function calculateRetentionPercentage(flashcard: any) {
  if (!flashcard) return 0;
  
  const easinessFactor = flashcard.easiness_factor || 2.5;
  const repetitionCount = flashcard.repetition_count || 0;
  
  if (repetitionCount === 0) return 0;
  
  // A simple formula to estimate retention based on repetition count and easiness
  // This is just a heuristic, not based on actual memory models
  const baseRetention = Math.min(90, repetitionCount * 15);  
  const easinessBonus = Math.max(0, (easinessFactor - 2.5) * 10);
  
  return Math.min(100, baseRetention + easinessBonus);
}

/**
 * Get flashcard retention stats for user
 */
export async function getFlashcardRetentionStats(userId?: string) {
  try {
    // Get current user session if userId is not provided
    if (!userId) {
      const { data: sessionData } = await getSession();
      
      if (!sessionData?.session?.user?.id) {
        throw new Error('User not authenticated');
      }
      
      userId = sessionData.session.user.id;
    }
    
    // Get all flashcard stats
    const { data: statsData, error: statsError } = await supabase
      .from('flashcard_learning_stats')
      .select('*')
      .eq('user_id', userId);
    
    if (statsError) {
      throw statsError;
    }
    
    // Get all flashcards
    const { data: flashcardsData, error: flashcardsError } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId);
    
    if (flashcardsError) {
      throw flashcardsError;
    }
    
    // Calculate retention metrics
    const totalCards = statsData.length;
    let totalRetention = 0;
    
    statsData.forEach(stats => {
      totalRetention += calculateRetentionPercentage(stats);
    });
    
    const averageRetention = totalCards > 0 ? totalRetention / totalCards : 0;
    
    // Group cards by topic for topic-based retention
    const topicRetention: Record<string, { count: number, total: number }> = {};
    
    flashcardsData.forEach(flashcard => {
      const stats = statsData.find(s => s.flashcard_id === flashcard.id);
      if (!stats) return;
      
      const topic = flashcard.topic || 'Uncategorized';
      
      if (!topicRetention[topic]) {
        topicRetention[topic] = { count: 0, total: 0 };
      }
      
      topicRetention[topic].count++;
      topicRetention[topic].total += calculateRetentionPercentage(stats);
    });
    
    // Calculate average retention by topic
    const retentionByTopic = Object.entries(topicRetention).map(([topic, data]) => ({
      topic,
      retention: data.count > 0 ? data.total / data.count : 0
    }));
    
    return {
      totalCards,
      averageRetention,
      retentionByTopic
    };
  } catch (error) {
    console.error('Error getting flashcard retention stats:', error);
    throw error;
  }
}
