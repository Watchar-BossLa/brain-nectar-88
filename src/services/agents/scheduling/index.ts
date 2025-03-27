
import { AgentMessage, AgentTask } from '../types';
import { BaseAgent } from '../baseAgent';

/**
 * Scheduling Agent
 * 
 * Optimizes study timing and session structure.
 */
export class SchedulingAgent extends BaseAgent {
  constructor() {
    super('SCHEDULING');
  }
  
  async processTask(task: AgentTask): Promise<any> {
    console.log(`Scheduling Agent processing task: ${task.taskType}`);
    
    switch (task.taskType) {
      case 'SCHEDULE_OPTIMIZATION':
        return this.optimizeSchedule(task.userId, task.data);
      case 'FLASHCARD_OPTIMIZATION':
        return this.optimizeFlashcards(task.userId, task.data);
      case 'SPACED_REPETITION_SCHEDULE':
        return this.createSpacedRepetitionSchedule(task.userId, task.data);
      case 'EXAM_PREPARATION_PLAN':
        return this.createExamPrepPlan(task.userId, task.data);
      default:
        console.warn(`Scheduling Agent received unknown task type: ${task.taskType}`);
        return { status: 'error', message: 'Unknown task type' };
    }
  }
  
  receiveMessage(message: AgentMessage): void {
    console.log(`Scheduling Agent received message: ${message.type}`);
    // Handle messages from other agents
    if (message.type === 'LEARNING_PATH_UPDATE') {
      console.log('Learning path updated, scheduling agent notified');
    } else if (message.type === 'COGNITIVE_PROFILE_UPDATE') {
      console.log('Cognitive profile updated, scheduling agent notified');
    }
  }
  
  private async optimizeSchedule(userId: string, data: any): Promise<any> {
    console.log(`Optimizing schedule for user ${userId}`, data);
    
    // Extract parameters from data
    const startDate = data.startDate || new Date().toISOString();
    const endDate = data.endDate;
    const examDate = data.examDate;
    const dailyAvailableTime = data.dailyAvailableTime || 60; // minutes
    const priorityTopics = data.priorityTopics || [];
    const difficulty = data.difficulty || 'medium';
    
    // In a real implementation, we would use algorithms to determine optimal study times
    // based on the user's cognitive profile, historical data, and the specific topics
    
    // Generate recommended study times
    const recommendedTimes = this.generateRecommendedTimes(
      startDate, 
      endDate || examDate, 
      dailyAvailableTime, 
      difficulty
    );
    
    // Allocate topics based on priority
    const topicDistribution = this.allocateTopics(priorityTopics);
    
    return {
      status: 'success',
      schedule: {
        recommendedTimes,
        topicDistribution,
        startDate,
        endDate: endDate || examDate,
        dailyGoalMinutes: dailyAvailableTime,
        difficulty
      }
    };
  }
  
  private generateRecommendedTimes(
    startDateStr: string, 
    endDateStr: string | undefined, 
    dailyMinutes: number, 
    difficulty: string
  ): any[] {
    const startDate = new Date(startDateStr);
    const endDate = endDateStr ? new Date(endDateStr) : new Date(startDate);
    endDate.setDate(endDate.getDate() + 14); // Default to 2 weeks if no end date
    
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const recommendedTimes = [];
    
    // Determine how many sessions per day based on difficulty and daily minutes
    const sessionsPerDay = difficulty === 'easy' ? 1 : (difficulty === 'hard' ? 3 : 2);
    const minutesPerSession = Math.round(dailyMinutes / sessionsPerDay);
    
    // Generate study sessions
    // For this example, we'll create a 2-week schedule
    for (let i = 0; i < 14; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      // Skip weekends for easy difficulty
      const dayIndex = currentDate.getDay();
      const dayName = daysOfWeek[dayIndex === 0 ? 6 : dayIndex - 1]; // Adjust for Sunday
      
      if (difficulty === 'easy' && (dayIndex === 0 || dayIndex === 6)) {
        continue; // Skip weekends for easy difficulty
      }
      
      // Generate sessions for this day
      for (let session = 0; session < sessionsPerDay; session++) {
        let time;
        if (sessionsPerDay === 1) {
          time = '18:00'; // Evening for single session
        } else if (session === 0) {
          time = '09:00'; // Morning
        } else if (session === 1) {
          time = '15:00'; // Afternoon
        } else {
          time = '19:00'; // Evening
        }
        
        recommendedTimes.push({
          day: dayName,
          time: time,
          duration: minutesPerSession,
          week: Math.floor(i / 7) + 1
        });
      }
    }
    
    return recommendedTimes;
  }
  
  private allocateTopics(priorityTopics: string[]): any[] {
    if (priorityTopics.length === 0) {
      return [
        { topicId: 'topic-1', percentage: 50 },
        { topicId: 'topic-2', percentage: 50 }
      ];
    }
    
    // Allocate higher percentage to priority topics
    const result = [];
    const totalTopics = priorityTopics.length;
    const basePercentage = Math.floor(100 / (totalTopics + 1));
    let remainingPercentage = 100;
    
    for (let i = 0; i < totalTopics; i++) {
      const percentage = i === totalTopics - 1 
        ? remainingPercentage 
        : basePercentage + (i < 2 ? 10 : 0); // Give more weight to first two topics
      
      result.push({
        topicId: `priority-${i + 1}`,
        topic: priorityTopics[i],
        percentage
      });
      
      remainingPercentage -= percentage;
    }
    
    return result;
  }
  
  private async optimizeFlashcards(userId: string, data: any): Promise<any> {
    console.log(`Optimizing flashcards for user ${userId}`);
    
    // Get flashcard review history and calculate optimal intervals
    // In a real implementation, we would use spaced repetition algorithms
    
    return {
      status: 'success',
      flashcardSchedule: {
        reviewIntervals: [
          { cardId: 'card-1', nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() },
          { cardId: 'card-2', nextReview: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() }
        ],
        recommendedBatchSize: 15,
        dailyTimeAllocation: 20, // minutes
        optimalTimeOfDay: '19:00'
      }
    };
  }
  
  private async createSpacedRepetitionSchedule(userId: string, data: any): Promise<any> {
    console.log(`Creating spaced repetition schedule for user ${userId}`);
    
    // Generate a schedule optimized for spaced repetition learning
    return {
      status: 'success',
      schedule: {
        initialLearningPhase: {
          days: 3,
          sessionsPerDay: 2,
          minutesPerSession: 15
        },
        reviewPhase: {
          intervals: [1, 3, 7, 14, 30], // days
          minutesPerSession: 10
        },
        recommendedTimes: [
          { day: 'all', time: '07:30', duration: 15 },
          { day: 'all', time: '21:00', duration: 15 }
        ]
      }
    };
  }
  
  private async createExamPrepPlan(userId: string, data: any): Promise<any> {
    console.log(`Creating exam preparation plan for user ${userId}`);
    
    const examDate = data.examDate;
    const currentDate = new Date().toISOString();
    const topics = data.topics || [];
    
    return {
      status: 'success',
      examPlan: {
        phases: [
          {
            name: 'Learning Phase',
            duration: '60%',
            focus: 'Understanding core concepts',
            recommendedResources: ['Textbooks', 'Video lectures', 'Study notes']
          },
          {
            name: 'Practice Phase',
            duration: '30%',
            focus: 'Applying knowledge to problems',
            recommendedResources: ['Practice problems', 'Past exams', 'Group study']
          },
          {
            name: 'Review Phase',
            duration: '10%',
            focus: 'Final revision and memorization',
            recommendedResources: ['Flashcards', 'Summary notes', 'Mock exams']
          }
        ],
        dailySchedule: [
          { time: '09:00-10:30', activity: 'New content study' },
          { time: '11:00-12:00', activity: 'Practice problems' },
          { time: '15:00-16:00', activity: 'Review previous material' },
          { time: '19:00-20:00', activity: 'Flashcard review' }
        ],
        topicAllocation: topics.map((topic: string, index: number) => ({
          topic,
          daysNeeded: 3 + (index % 3),
          difficulty: index % 3 === 0 ? 'high' : index % 3 === 1 ? 'medium' : 'low'
        }))
      }
    };
  }
}
