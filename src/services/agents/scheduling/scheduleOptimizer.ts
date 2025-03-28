
import { supabase } from '@/integrations/supabase/client';

/**
 * ScheduleOptimizer
 *
 * Optimizes study timing and session structure.
 */
export class ScheduleOptimizer {
  private static readonly DEFAULT_SESSION_DURATION = 25; // Pomodoro default duration

  /**
   * Optimize a study schedule based on user preferences and constraints
   */
  async optimizeSchedule(userId: string, options: {
    startDate?: string;
    endDate?: string;
    examDate?: string;
    dailyAvailableTime?: number;
    priorityTopics?: string[];
    difficulty?: 'easy' | 'medium' | 'hard';
  }): Promise<any> {
    console.log(`Optimizing schedule for user ${userId}`);
    
    try {
      // Parse dates
      const startDate = options.startDate ? new Date(options.startDate) : new Date();
      const endDate = options.endDate ? new Date(options.endDate) : undefined;
      const examDate = options.examDate ? new Date(options.examDate) : undefined;
      
      // Calculate schedule end date based on options
      let scheduleEndDate: Date;
      if (endDate) {
        scheduleEndDate = endDate;
      } else if (examDate) {
        scheduleEndDate = examDate;
      } else {
        // Default to 4 weeks
        scheduleEndDate = new Date(startDate);
        scheduleEndDate.setDate(startDate.getDate() + 28);
      }
      
      // Calculate days between start and end
      const dayDifference = Math.round((scheduleEndDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Calculate daily available time (in minutes)
      const dailyAvailableTime = options.dailyAvailableTime || 60; // Default 1 hour
      
      // Adjust session duration based on difficulty
      let sessionDuration = ScheduleOptimizer.DEFAULT_SESSION_DURATION;
      switch (options.difficulty) {
        case 'easy':
          sessionDuration = 20;
          break;
        case 'medium':
          sessionDuration = 25;
          break;
        case 'hard':
          sessionDuration = 30;
          break;
        default:
          sessionDuration = 25;
      }
      
      // Calculate daily sessions based on available time
      const dailySessions = Math.floor(dailyAvailableTime / sessionDuration);
      
      // Get topics or use defaults
      const topics = options.priorityTopics || ['accounting-basics', 'financial-statements', 'tax-accounting'];
      
      // Calculate topic distribution based on priority (give more sessions to priority topics)
      const topicDistribution = topics.map((topicId, index) => {
        return {
          topicId,
          // First topics get more sessions
          weight: 1 - (index / (topics.length * 2))
        };
      });
      
      // Normalize weights to sum to 1
      const totalWeight = topicDistribution.reduce((sum, topic) => sum + topic.weight, 0);
      topicDistribution.forEach(topic => {
        topic.weight = topic.weight / totalWeight;
      });
      
      // Generate optimal time slots
      const optimalTimes = [];
      const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      
      // Get preferred study times based on difficulty
      const timeSlots = this.getPreferredTimeSlots(options.difficulty);
      
      // Create recommended times for each day
      for (let day = 0; day < dayDifference; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + day);
        const dayOfWeek = daysOfWeek[currentDate.getDay()];
        
        // Select a subset of time slots for each day
        const dailySlots = timeSlots.slice(0, dailySessions);
        
        // For variety, rotate the slots each day
        timeSlots.push(timeSlots.shift()!);
        
        dailySlots.forEach(slot => {
          optimalTimes.push({
            day: dayOfWeek,
            date: new Date(currentDate).toISOString(),
            time: slot.time,
            duration: sessionDuration,
            // Add topic information based on distribution
            topicId: this.getWeightedRandomTopic(topicDistribution).topicId
          });
        });
      }
      
      // Build the schedule
      const schedule = {
        userId,
        startDate: startDate.toISOString(),
        endDate: scheduleEndDate.toISOString(),
        dailyAvailableTime,
        sessionDuration,
        dailySessions,
        topicDistribution,
        recommendedTimes: optimalTimes,
        totalStudyTime: optimalTimes.length * sessionDuration,
        details: {
          difficulty: options.difficulty || 'medium',
          priorityTopics: topics,
          examPreparation: !!examDate
        }
      };
      
      return {
        status: 'success',
        schedule
      };
    } catch (error) {
      console.error('Error optimizing schedule:', error);
      return {
        status: 'error',
        message: 'Failed to optimize schedule'
      };
    }
  }
  
  /**
   * Get preferred time slots based on difficulty level
   */
  private getPreferredTimeSlots(difficulty?: string): { time: string, quality: number }[] {
    switch (difficulty) {
      case 'easy':
        return [
          { time: '09:00', quality: 0.9 },
          { time: '14:00', quality: 0.8 },
          { time: '17:00', quality: 0.7 },
          { time: '19:00', quality: 0.6 }
        ];
      case 'hard':
        return [
          { time: '06:00', quality: 0.9 },
          { time: '10:00', quality: 0.85 },
          { time: '15:00', quality: 0.8 },
          { time: '19:00', quality: 0.7 },
          { time: '21:00', quality: 0.6 }
        ];
      case 'medium':
      default:
        return [
          { time: '08:00', quality: 0.9 },
          { time: '11:00', quality: 0.85 },
          { time: '15:00', quality: 0.8 },
          { time: '19:00', quality: 0.75 }
        ];
    }
  }
  
  /**
   * Get a random topic based on weight distribution
   */
  private getWeightedRandomTopic(topicDistribution: { topicId: string, weight: number }[]) {
    const totalWeight = topicDistribution.reduce((sum, topic) => sum + topic.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const topic of topicDistribution) {
      random -= topic.weight;
      if (random <= 0) {
        return topic;
      }
    }
    
    // Default to first topic if something goes wrong
    return topicDistribution[0];
  }
}
