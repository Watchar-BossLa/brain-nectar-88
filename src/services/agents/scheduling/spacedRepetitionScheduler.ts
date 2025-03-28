
import { supabase } from '@/integrations/supabase/client';

/**
 * SpacedRepetitionScheduler
 * 
 * Creates and manages spaced repetition schedules for effective learning.
 */
export class SpacedRepetitionScheduler {
  /**
   * Create a spaced repetition schedule
   */
  async createSchedule(userId: string, options: {
    flashcardIds?: string[];
    startDate?: string;
    endDate?: string;
    dailyAvailableTime?: number;
  }): Promise<any> {
    console.log(`Creating spaced repetition schedule for user ${userId}`);
    
    try {
      // Get user's flashcards (or use provided flashcard IDs)
      let flashcards;
      
      if (options.flashcardIds && options.flashcardIds.length > 0) {
        const { data, error } = await supabase
          .from('flashcards')
          .select('*')
          .eq('user_id', userId)
          .in('id', options.flashcardIds);
          
        if (error) throw error;
        flashcards = data || [];
      } else {
        const { data, error } = await supabase
          .from('flashcards')
          .select('*')
          .eq('user_id', userId);
          
        if (error) throw error;
        flashcards = data || [];
      }
      
      if (flashcards.length === 0) {
        return {
          status: 'error',
          message: 'No flashcards found for scheduling'
        };
      }
      
      // Parse start date or use today's date
      const startDate = options.startDate 
        ? new Date(options.startDate) 
        : new Date();
      
      // Parse end date or default to 30 days from start
      const endDate = options.endDate
        ? new Date(options.endDate)
        : new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      // Calculate number of days in the schedule
      const daysDiff = Math.round((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
      
      // Available time per day (in minutes)
      const dailyTime = options.dailyAvailableTime || 20;
      
      // Estimate time per flashcard review (in minutes)
      const timePerFlashcard = 0.5;
      
      // Maximum cards per day based on available time
      const maxCardsPerDay = Math.floor(dailyTime / timePerFlashcard);
      
      // Group flashcards by their next review date
      const groupedFlashcards: Record<string, any[]> = {};
      
      flashcards.forEach(card => {
        const nextReviewDate = card.next_review_date
          ? new Date(card.next_review_date).toISOString().split('T')[0]
          : startDate.toISOString().split('T')[0];
        
        if (!groupedFlashcards[nextReviewDate]) {
          groupedFlashcards[nextReviewDate] = [];
        }
        
        groupedFlashcards[nextReviewDate].push(card);
      });
      
      // Generate review schedule for each day
      const reviewSchedule = [];
      
      for (let i = 0; i < daysDiff; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        const dateString = currentDate.toISOString().split('T')[0];
        
        // Get cards due on this day
        const dueCards = groupedFlashcards[dateString] || [];
        
        // Calculate how many new cards to add
        const remainingCapacity = maxCardsPerDay - dueCards.length;
        let newCards: any[] = [];
        
        if (remainingCapacity > 0) {
          // Check if there's a backlog of overdue cards
          const overdueDates = Object.keys(groupedFlashcards)
            .filter(date => date < dateString)
            .sort();
            
          // Add overdue cards first
          let cardsAdded = 0;
          for (const overdueDate of overdueDates) {
            const overdueCards = groupedFlashcards[overdueDate] || [];
            const cardsToAdd = Math.min(remainingCapacity - cardsAdded, overdueCards.length);
            
            if (cardsToAdd > 0) {
              newCards = newCards.concat(overdueCards.slice(0, cardsToAdd));
              groupedFlashcards[overdueDate] = overdueCards.slice(cardsToAdd);
              cardsAdded += cardsToAdd;
              
              if (cardsAdded >= remainingCapacity) break;
            }
          }
        }
        
        // Create the daily schedule if there are cards to review
        if (dueCards.length > 0 || newCards.length > 0) {
          reviewSchedule.push({
            date: dateString,
            dueCards: dueCards.map(card => ({
              id: card.id,
              front: card.front_content,
              difficulty: card.difficulty,
              repetition_count: card.repetition_count
            })),
            overdueCards: newCards.map(card => ({
              id: card.id,
              front: card.front_content,
              difficulty: card.difficulty,
              repetition_count: card.repetition_count
            })),
            totalCards: dueCards.length + newCards.length,
            estimatedTime: (dueCards.length + newCards.length) * timePerFlashcard
          });
        }
      }
      
      // Statistics and summary information
      const totalReviews = reviewSchedule.reduce((sum, day) => sum + day.totalCards, 0);
      const averageCardsPerDay = totalReviews / Math.max(1, reviewSchedule.length);
      const totalCards = flashcards.length;
      const averageReviewsPerCard = totalCards > 0 ? totalReviews / totalCards : 0;
      
      return {
        status: 'success',
        schedule: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          dailyTime,
          totalCards,
          totalReviews,
          averageCardsPerDay,
          averageReviewsPerCard,
          reviewSchedule
        }
      };
    } catch (error) {
      console.error('Error creating spaced repetition schedule:', error);
      return {
        status: 'error',
        message: 'Failed to create spaced repetition schedule'
      };
    }
  }
  
  /**
   * Recommend optimal review times
   */
  async recommendReviewTimes(userId: string, options: {
    preferredTimeOfDay?: 'morning' | 'afternoon' | 'evening';
  }): Promise<{
    status: string;
    recommendations?: any;
    message?: string;
  }> {
    try {
      const preferredTime = options.preferredTimeOfDay || 'evening';
      
      // Map preference to time ranges
      const timeRanges = {
        morning: { start: '07:00', end: '09:00' },
        afternoon: { start: '13:00', end: '15:00' },
        evening: { start: '19:00', end: '21:00' }
      };
      
      // Get review history to analyze user's study patterns
      const { data: reviewHistory, error } = await supabase
        .from('flashcard_reviews')
        .select('*')
        .eq('user_id', userId)
        .order('reviewed_at', { ascending: false })
        .limit(100);
        
      if (error) throw error;
      
      // Analyze optimal review times based on history and cognitive science research
      let optimalTimes = [];
      
      // Default recommendations based on cognitive science if no history
      if (!reviewHistory || reviewHistory.length < 10) {
        optimalTimes = [
          { time: '07:30', quality: 0.8, reason: 'Morning is good for focused learning' },
          { time: '14:00', quality: 0.7, reason: 'Early afternoon works well for review' },
          { time: '20:00', quality: 0.9, reason: 'Evening reviews help with consolidation' }
        ];
      } else {
        // Implement custom analysis based on user's history
        // This would be more sophisticated in a real implementation
        // Example: Find times when user tends to rate cards with high retention
      }
      
      // Adjust based on preferred time
      const preferredTimeRange = timeRanges[preferredTime];
      const adjustedTimes = optimalTimes.map(time => ({
        ...time,
        quality: time.time >= preferredTimeRange.start && time.time <= preferredTimeRange.end
          ? Math.min(time.quality + 0.1, 1.0)
          : time.quality
      }));
      
      // Sort by quality
      adjustedTimes.sort((a, b) => b.quality - a.quality);
      
      return {
        status: 'success',
        recommendations: {
          optimalTimes: adjustedTimes,
          preferredTimeRange,
          suggestedDuration: 15, // minutes
          suggestedFrequency: 'twice daily',
          bestDays: ['Monday', 'Wednesday', 'Saturday']
        }
      };
    } catch (error) {
      console.error('Error recommending review times:', error);
      return {
        status: 'error',
        message: 'Failed to recommend review times'
      };
    }
  }
}
