
import { useState } from 'react';
import { format, addDays } from 'date-fns';
import { SchedulingAgent } from '@/services/agents/scheduling';
import { useToast } from '@/components/ui/use-toast';

interface StudyPlanOptions {
  startDate?: string;
  endDate?: string;
  examDate?: string;
  dailyAvailableTime?: number;
  priorityTopics?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface StudySession {
  id: string;
  title: string;
  date: Date;
  duration: number;
  topic: string;
  completed: boolean;
}

export function useStudyPlanner() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [studyPlan, setStudyPlan] = useState<any>(null);
  const [generatedSessions, setGeneratedSessions] = useState<StudySession[]>([]);
  const schedulingAgent = new SchedulingAgent();

  const generateStudyPlan = async (options: StudyPlanOptions) => {
    setIsLoading(true);
    
    try {
      // In a real application, we'd use the user's ID from auth
      const userId = 'user-123';
      
      // Call the scheduling agent to generate an optimized schedule
      const response = await schedulingAgent.optimizeSchedule(userId, options);
      
      if (response.status === 'success') {
        setStudyPlan(response.schedule);
        
        // Generate study sessions from the schedule
        const sessions = generateSessionsFromSchedule(response.schedule, options);
        setGeneratedSessions(sessions);
        
        toast({
          title: 'Study Plan Generated',
          description: 'Your personalized study plan is ready',
        });
        
        return { success: true, sessions, plan: response.schedule };
      } else {
        toast({
          title: 'Error Generating Plan',
          description: 'There was a problem creating your study plan',
          variant: 'destructive',
        });
        
        return { success: false, error: 'Failed to generate study plan' };
      }
    } catch (error) {
      console.error('Error generating study plan:', error);
      
      toast({
        title: 'Error Generating Plan',
        description: 'There was a problem creating your study plan',
        variant: 'destructive',
      });
      
      return { success: false, error: 'Exception occurred' };
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateSessionsFromSchedule = (schedule: any, options: StudyPlanOptions) => {
    // This would typically use the actual schedule data from the agent
    // For now, we'll create mock sessions based on the options
    
    const sessions: StudySession[] = [];
    const startDate = options.startDate ? new Date(options.startDate) : new Date();
    const topicDistribution = schedule?.topicDistribution || [];
    
    // Create sessions for each recommended time slot
    (schedule?.recommendedTimes || []).forEach((timeSlot: any, index: number) => {
      // Determine which topic to use based on distribution
      const topicIndex = index % topicDistribution.length;
      const topicId = topicDistribution[topicIndex]?.topicId || 'topic-1';
      
      // Use priority topics if available, otherwise use the topic ID
      const topicName = options.priorityTopics && options.priorityTopics.length > 0
        ? options.priorityTopics[index % options.priorityTopics.length]
        : `Topic ${topicId}`;
      
      // Create a date for this session
      const sessionDate = new Date(startDate);
      if (timeSlot.day) {
        // Map day name to day offset from start date
        const dayMapping: Record<string, number> = {
          'Monday': 0, 'Tuesday': 1, 'Wednesday': 2, 
          'Thursday': 3, 'Friday': 4, 'Saturday': 5, 'Sunday': 6
        };
        
        const currentDay = startDate.getDay();
        const targetDay = dayMapping[timeSlot.day];
        const daysToAdd = (targetDay - currentDay + 7) % 7;
        
        sessionDate.setDate(startDate.getDate() + daysToAdd + (Math.floor(index / 7) * 7));
      } else {
        // If no day specified, just add the index as days
        sessionDate.setDate(startDate.getDate() + index);
      }
      
      // Parse the time if available
      if (timeSlot.time) {
        const [hours, minutes] = timeSlot.time.split(':').map(Number);
        sessionDate.setHours(hours, minutes);
      }
      
      // Create the session
      sessions.push({
        id: `generated-${index}`,
        title: `Study: ${topicName}`,
        date: sessionDate,
        duration: timeSlot.duration || 30,
        topic: topicId,
        completed: false
      });
    });
    
    return sessions;
  };
  
  const optimizeFlashcards = async (userId: string, options: any) => {
    setIsLoading(true);
    
    try {
      const response = await schedulingAgent.optimizeFlashcards(userId, options);
      
      if (response.status === 'success') {
        return { success: true, data: response.flashcardSchedule };
      } else {
        return { success: false, error: 'Failed to optimize flashcards' };
      }
    } catch (error) {
      console.error('Error optimizing flashcards:', error);
      return { success: false, error: 'Exception occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    studyPlan,
    generatedSessions,
    generateStudyPlan,
    optimizeFlashcards
  };
}
