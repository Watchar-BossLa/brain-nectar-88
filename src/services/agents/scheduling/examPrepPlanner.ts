
import { supabase } from '@/integrations/supabase/client';

/**
 * ExamPrepPlanner
 * 
 * Creates tailored exam preparation plans based on user's learning history and exam requirements.
 */
export class ExamPrepPlanner {
  /**
   * Create an exam preparation plan
   */
  async createPlan(userId: string, options: {
    examDate?: string;
    priorityTopics?: string[];
    difficulty?: 'easy' | 'medium' | 'hard';
    qualificationId?: string;
  }): Promise<any> {
    console.log(`Creating exam prep plan for user ${userId}`);
    
    try {
      // Get user's mastery levels by topic (would come from topic assessment results)
      // In a real implementation, we would fetch performance data from the database
      const userMasteryByTopic: Record<string, number> = {
        'accounting-basics': 0.8,
        'financial-statements': 0.6,
        'tax-accounting': 0.4,
        'managerial-accounting': 0.7,
        'auditing': 0.3,
        'accounting-standards': 0.5
      };
      
      // Determine priority topics based on masttery levels and user preferences
      const priorityTopics = options.priorityTopics || 
        Object.entries(userMasteryByTopic)
          .sort(([, a], [, b]) => a - b)
          .map(([topic]) => topic)
          .slice(0, 3);
      
      // Parse exam date or use default (30 days from now)
      const examDate = options.examDate 
        ? new Date(options.examDate)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      
      // Calculate days until exam
      const daysUntilExam = Math.round((examDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
      
      // Determine study intensity based on days until exam
      let studyIntensity: 'light' | 'moderate' | 'intensive';
      if (daysUntilExam > 60) {
        studyIntensity = 'light';
      } else if (daysUntilExam > 30) {
        studyIntensity = 'moderate';
      } else {
        studyIntensity = 'intensive';
      }
      
      // Adjust for user-selected difficulty
      if (options.difficulty === 'easy' && studyIntensity === 'intensive') {
        studyIntensity = 'moderate';
      } else if (options.difficulty === 'hard' && studyIntensity === 'light') {
        studyIntensity = 'moderate';
      }
      
      // Generate daily study minute recommendations
      let dailyMinutes: number;
      switch (studyIntensity) {
        case 'light':
          dailyMinutes = 45;
          break;
        case 'moderate':
          dailyMinutes = 90;
          break;
        case 'intensive':
          dailyMinutes = 150;
          break;
      }
      
      // Generate topic allocation percentages based on mastery levels
      const totalTopics = priorityTopics.length;
      const topicAllocation = priorityTopics.map(topic => {
        const masteryLevel = userMasteryByTopic[topic] || 0.5;
        // Lower mastery means higher allocation
        return {
          topic,
          allocation: Math.round(((1 - masteryLevel) / totalTopics) * 100)
        };
      });
      
      // Normalize allocations to ensure they sum to 100%
      const totalAllocation = topicAllocation.reduce((sum, { allocation }) => sum + allocation, 0);
      const normalizedAllocation = topicAllocation.map(item => ({
        ...item,
        allocation: Math.round((item.allocation / totalAllocation) * 100)
      }));
      
      // Generate mock assessments schedule
      const mockExams = [];
      if (daysUntilExam > 7) {
        mockExams.push({
          date: new Date(examDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'Full Mock Exam',
          duration: 180
        });
      }
      if (daysUntilExam > 14) {
        mockExams.push({
          date: new Date(examDate.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'Practice Questions',
          duration: 120
        });
      }
      if (daysUntilExam > 21) {
        mockExams.push({
          date: new Date(examDate.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'Topic Assessment',
          duration: 90
        });
      }
      
      // Create the exam prep plan
      const examPlan = {
        userId,
        examDate: examDate.toISOString(),
        daysUntilExam,
        studyIntensity,
        dailyMinutes,
        weeklyHours: Math.round((dailyMinutes * 7) / 60),
        priorityTopics,
        topicAllocation: normalizedAllocation,
        mockExams,
        recommendedResources: [
          { type: 'flashcards', count: 30 * priorityTopics.length },
          { type: 'practice-questions', count: 50 * priorityTopics.length },
          { type: 'review-sessions', count: daysUntilExam / 5 }
        ]
      };
      
      return {
        status: 'success',
        examPlan
      };
    } catch (error) {
      console.error('Error creating exam prep plan:', error);
      return {
        status: 'error',
        message: 'Failed to create exam preparation plan'
      };
    }
  }
}
