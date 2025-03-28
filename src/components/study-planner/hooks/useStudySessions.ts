
import { useState, useEffect } from 'react';
import { addDays, format, isToday, isAfter } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";
import { StudySession, StudyTopic, StudyStatistics } from '../types';

export const useStudySessions = () => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<StudySession[]>([
    {
      id: "1",
      title: "Accounting Fundamentals",
      date: new Date(),
      duration: 30,
      topic: "accounting-basics",
      completed: false
    },
    {
      id: "2",
      title: "Financial Statement Review",
      date: addDays(new Date(), 1),
      duration: 45,
      topic: "financial-statements",
      completed: false
    },
    {
      id: "3",
      title: "Balance Sheet Analysis",
      date: addDays(new Date(), 2),
      duration: 60,
      topic: "financial-statements",
      completed: false
    },
    {
      id: "4",
      title: "GAAP Principles Overview",
      date: addDays(new Date(), 3),
      duration: 90,
      topic: "accounting-standards",
      completed: false
    }
  ]);
  const [showCompleted, setShowCompleted] = useState(true);
  const [statistics, setStatistics] = useState<StudyStatistics>({
    totalSessionsCount: 0,
    completedSessionsCount: 0,
    completionPercentage: 0,
    totalMinutes: 0,
    completedMinutes: 0,
    upcomingSessions: []
  });

  // Define the available study topics
  const topics: StudyTopic[] = [
    { value: "accounting-basics", label: "Accounting Basics" },
    { value: "financial-statements", label: "Financial Statements" },
    { value: "tax-accounting", label: "Tax Accounting" },
    { value: "managerial-accounting", label: "Managerial Accounting" },
    { value: "auditing", label: "Auditing" },
    { value: "accounting-standards", label: "Accounting Standards" },
    { value: "generated-plan", label: "From Study Plan" }
  ];

  // Calculate statistics whenever sessions or showCompleted changes
  useEffect(() => {
    const totalSessionsCount = sessions.length;
    const completedSessionsCount = sessions.filter(s => s.completed).length;
    const completionPercentage = totalSessionsCount > 0 
      ? Math.round((completedSessionsCount / totalSessionsCount) * 100) 
      : 0;
    const totalMinutes = sessions.reduce((total, session) => total + session.duration, 0);
    const completedMinutes = sessions
      .filter(s => s.completed)
      .reduce((total, session) => total + session.duration, 0);
      
    // Get upcoming sessions (today and future)
    const upcomingSessions = [...sessions]
      .filter(session => isToday(session.date) || isAfter(session.date, new Date()))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    
    setStatistics({
      totalSessionsCount,
      completedSessionsCount,
      completionPercentage,
      totalMinutes,
      completedMinutes,
      upcomingSessions
    });
  }, [sessions, showCompleted]);

  // Add a new study session
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
    
    setSessions([...sessions, newSession]);
    
    toast({
      title: "Study Session Added",
      description: `${sessionData.title} has been added to your schedule`,
    });
  };

  // Toggle the completed status of a session
  const toggleCompleted = (id: string) => {
    setSessions(
      sessions.map(session => 
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
  
  // Delete a session
  const deleteSession = (id: string) => {
    const sessionToDelete = sessions.find(session => session.id === id);
    setSessions(sessions.filter(session => session.id !== id));
    
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
    sessions,
    filteredSessions: getFilteredSessions(),
    showCompleted,
    setShowCompleted,
    statistics,
    topics,
    addSession,
    toggleCompleted,
    deleteSession
  };
};
