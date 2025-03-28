
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useStudyPlanner } from '@/hooks/useStudyPlanner';
import { StudySession, StudyPlanOptions, StudyStatistics } from '../types';

export const useStudyPlannerState = () => {
  const { toast } = useToast();
  const { isLoading, generateStudyPlan } = useStudyPlanner();
  const [studyPlan, setStudyPlan] = useState<StudyPlanOptions | null>(null);
  const [planCreated, setPlanCreated] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("schedule");
  
  // Use the existing hook for sessions management
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [showCompleted, setShowCompleted] = useState(true);
  const [statistics, setStatistics] = useState<StudyStatistics>({
    totalSessionsCount: 0,
    completedSessionsCount: 0,
    completionPercentage: 0,
    totalMinutes: 0,
    completedMinutes: 0,
    upcomingSessions: []
  });

  // Calculate statistics whenever sessions change
  useEffect(() => {
    if (sessions.length === 0) return;
    
    const totalSessionsCount = sessions.length;
    const completedSessionsCount = sessions.filter(s => s.completed).length;
    const completionPercentage = totalSessionsCount > 0 
      ? Math.round((completedSessionsCount / totalSessionsCount) * 100) 
      : 0;
    const totalMinutes = sessions.reduce((total, session) => total + session.duration, 0);
    const completedMinutes = sessions
      .filter(s => s.completed)
      .reduce((total, session) => total + session.duration, 0);
      
    // Get upcoming sessions
    const now = new Date();
    const upcomingSessions = [...sessions]
      .filter(session => session.date >= now && !session.completed)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5); // Only get the next 5 sessions
    
    setStatistics({
      totalSessionsCount,
      completedSessionsCount,
      completionPercentage,
      totalMinutes,
      completedMinutes,
      upcomingSessions
    });
  }, [sessions]);

  const createStudyPlan = async (planOptions: StudyPlanOptions) => {
    if (!planOptions.startDate) {
      toast({
        title: "Missing Information",
        description: "Please set a start date for your study plan",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const result = await generateStudyPlan({
        startDate: planOptions.startDate.toISOString(),
        examDate: planOptions.examDate?.toISOString(),
        dailyAvailableTime: planOptions.dailyStudyMinutes || Math.round((planOptions.studyHoursPerWeek * 60) / 7),
        priorityTopics: planOptions.priorityTopics,
        difficulty: planOptions.difficulty
      });

      if (result.success) {
        setStudyPlan(planOptions);
        setSessions(result.sessions || []);
        setPlanCreated(true);
        setActiveTab("schedule");
        
        toast({
          title: "Study Plan Created",
          description: "Your personalized study plan is ready",
        });
        
        return result;
      } else {
        toast({
          title: "Error Creating Plan",
          description: result.error || "Failed to create study plan",
          variant: "destructive"
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Error creating study plan:", error);
      toast({
        title: "Error Creating Plan",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  // Session management functions
  const addSession = (sessionData: {
    title: string;
    date: Date;
    duration: number;
    topic: string;
  }) => {
    const newSession: StudySession = {
      id: Date.now().toString(),
      title: sessionData.title,
      date: sessionData.date,
      duration: sessionData.duration,
      topic: sessionData.topic,
      completed: false
    };
    
    setSessions(prevSessions => [...prevSessions, newSession]);
    
    toast({
      title: "Study Session Added",
      description: `${sessionData.title} has been added to your schedule`,
    });
  };

  const toggleCompleted = (id: string) => {
    setSessions(prevSessions =>
      prevSessions.map(session => 
        session.id === id 
          ? { ...session, completed: !session.completed } 
          : session
      )
    );
    
    // Get the session that was toggled
    const toggledSession = sessions.find(session => session.id === id);
    if (toggledSession) {
      toast({
        title: toggledSession.completed ? "Session Marked Incomplete" : "Session Completed",
        description: `${toggledSession.title} has been marked as ${toggledSession.completed ? 'incomplete' : 'complete'}`,
      });
    }
  };
  
  const deleteSession = (id: string) => {
    const sessionToDelete = sessions.find(session => session.id === id);
    setSessions(prevSessions => prevSessions.filter(session => session.id !== id));
    
    if (sessionToDelete) {
      toast({
        title: "Session Deleted",
        description: `${sessionToDelete.title} has been removed from your schedule`,
      });
    }
  };

  // Filter sessions based on the showCompleted state and sort by date
  const getFilteredSessions = () => {
    const filtered = showCompleted 
      ? sessions 
      : sessions.filter(session => !session.completed);
      
    return [...filtered].sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  return {
    activeTab,
    setActiveTab,
    studyPlan,
    planCreated,
    setPlanCreated,
    isLoading,
    createStudyPlan,
    sessions,
    filteredSessions: getFilteredSessions(),
    showCompleted,
    setShowCompleted,
    statistics,
    addSession,
    toggleCompleted,
    deleteSession,
  };
};
