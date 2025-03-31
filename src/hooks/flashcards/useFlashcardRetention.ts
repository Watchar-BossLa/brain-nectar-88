
import { useState, useEffect } from 'react';
import { Flashcard, FlashcardLearningStats } from '@/hooks/flashcards/types';
import { supabase } from '@/integrations/supabase/client';

export interface RetentionResult {
  success: boolean;
  data: {
    overallRetention: number;
    cardRetention: Record<string, { 
      total: number; 
      remembered: number;
      rate: number;
    }>;
    retentionByDay: Record<string, { 
      total: number; 
      remembered: number;
    }>;
  };
  error?: string;
}

export const useFlashcardRetention = (
  userId: string | undefined, 
  refreshTrigger: number = 0
) => {
  const [retentionData, setRetentionData] = useState<RetentionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    
    const calculateRetention = async () => {
      try {
        setLoading(true);
        
        // Fetch all flashcard reviews for this user
        const { data: reviews, error: reviewsError } = await supabase
          .from('flashcard_reviews')
          .select('*')
          .eq('user_id', userId);
          
        if (reviewsError) {
          throw reviewsError;
        }
        
        if (!reviews || reviews.length === 0) {
          setRetentionData({
            success: true,
            data: {
              overallRetention: 0,
              cardRetention: {},
              retentionByDay: {}
            }
          });
          return;
        }
        
        // Get all flashcards
        const { data: flashcards, error: flashcardsError } = await supabase
          .from('flashcards')
          .select('*')
          .eq('user_id', userId);
          
        if (flashcardsError) {
          throw flashcardsError;
        }
        
        // Calculate retention metrics
        const cardRetention: Record<string, { 
          total: number; 
          remembered: number;
          rate: number;
        }> = {};
        
        const retentionByDay: Record<string, { 
          total: number; 
          remembered: number;
        }> = {};
        
        let totalReviews = 0;
        let totalRemembered = 0;
        
        reviews.forEach(review => {
          // By flashcard
          if (!cardRetention[review.flashcard_id]) {
            cardRetention[review.flashcard_id] = {
              total: 0,
              remembered: 0,
              rate: 0
            };
          }
          
          cardRetention[review.flashcard_id].total++;
          
          if (review.difficulty_rating >= 3) {
            cardRetention[review.flashcard_id].remembered++;
          }
          
          // By day
          const reviewDate = new Date(review.reviewed_at).toISOString().split('T')[0];
          
          if (!retentionByDay[reviewDate]) {
            retentionByDay[reviewDate] = {
              total: 0,
              remembered: 0
            };
          }
          
          retentionByDay[reviewDate].total++;
          
          if (review.difficulty_rating >= 3) {
            retentionByDay[reviewDate].remembered++;
          }
          
          // Overall
          totalReviews++;
          if (review.difficulty_rating >= 3) {
            totalRemembered++;
          }
        });
        
        // Calculate rates
        Object.keys(cardRetention).forEach(cardId => {
          const card = cardRetention[cardId];
          card.rate = card.total > 0 ? card.remembered / card.total : 0;
        });
        
        // Calculate overall retention
        const overallRetention = totalReviews > 0 ? totalRemembered / totalReviews : 0;
        
        // Sort retentionByDay by date
        const sortedRetentionByDay = Object.fromEntries(
          Object.entries(retentionByDay).sort(([dateA], [dateB]) => 
            new Date(dateA).getTime() - new Date(dateB).getTime()
          )
        );
        
        setRetentionData({
          success: true,
          data: {
            overallRetention,
            cardRetention,
            retentionByDay: sortedRetentionByDay
          }
        });
      } catch (error) {
        console.error('Error calculating flashcard retention:', error);
        setRetentionData({
          success: false,
          data: {
            overallRetention: 0,
            cardRetention: {},
            retentionByDay: {}
          },
          error: 'Failed to calculate retention data'
        });
      } finally {
        setLoading(false);
      }
    };
    
    calculateRetention();
  }, [userId, refreshTrigger]);
  
  return {
    retentionData,
    loading,
  };
};

// Used directly by components that don't need the hook's reactivity
export const calculateFlashcardRetention = async (userId: string): Promise<RetentionResult> => {
  try {
    const { data: reviews, error: reviewsError } = await supabase
      .from('flashcard_reviews')
      .select('*')
      .eq('user_id', userId);
      
    if (reviewsError) {
      throw reviewsError;
    }
    
    if (!reviews || reviews.length === 0) {
      return {
        success: true,
        data: {
          overallRetention: 0,
          cardRetention: {},
          retentionByDay: {}
        }
      };
    }
    
    // Standard retention calculation (same as in hook above)
    const cardRetention: Record<string, { 
      total: number; 
      remembered: number;
      rate: number;
    }> = {};
    
    const retentionByDay: Record<string, { 
      total: number; 
      remembered: number;
    }> = {};
    
    let totalReviews = 0;
    let totalRemembered = 0;
    
    reviews.forEach(review => {
      // By flashcard
      if (!cardRetention[review.flashcard_id]) {
        cardRetention[review.flashcard_id] = {
          total: 0,
          remembered: 0,
          rate: 0
        };
      }
      
      cardRetention[review.flashcard_id].total++;
      
      if (review.difficulty_rating >= 3) {
        cardRetention[review.flashcard_id].remembered++;
      }
      
      // By day
      const reviewDate = new Date(review.reviewed_at).toISOString().split('T')[0];
      
      if (!retentionByDay[reviewDate]) {
        retentionByDay[reviewDate] = {
          total: 0,
          remembered: 0
        };
      }
      
      retentionByDay[reviewDate].total++;
      
      if (review.difficulty_rating >= 3) {
        retentionByDay[reviewDate].remembered++;
      }
      
      // Overall
      totalReviews++;
      if (review.difficulty_rating >= 3) {
        totalRemembered++;
      }
    });
    
    // Calculate rates
    Object.keys(cardRetention).forEach(cardId => {
      const card = cardRetention[cardId];
      card.rate = card.total > 0 ? card.remembered / card.total : 0;
    });
    
    // Calculate overall retention
    const overallRetention = totalReviews > 0 ? totalRemembered / totalReviews : 0;
    
    return {
      success: true,
      data: {
        overallRetention,
        cardRetention,
        retentionByDay
      }
    };
  } catch (error) {
    console.error('Error calculating flashcard retention:', error);
    return {
      success: false,
      data: {
        overallRetention: 0,
        cardRetention: {},
        retentionByDay: {}
      },
      error: 'Failed to calculate retention data'
    };
  }
};
