
import { supabase } from '@/integrations/supabase/client';
import { TimerSession } from '@/types/components/timer';

// Define the database types for timer sessions
type TimerSessionsDBRow = {
  id: string;
  user_id: string;
  duration_minutes: number;
  completed: boolean;
  start_time: string;
  end_time?: string;
  created_at: string;
  updated_at: string;
};

// Helper function to convert snake_case database objects to camelCase
const transformTimerSession = (session: TimerSessionsDBRow): TimerSession => {
  return {
    id: session.id,
    userId: session.user_id,
    durationMinutes: session.duration_minutes,
    completed: session.completed,
    startTime: new Date(session.start_time),
    endTime: session.end_time ? new Date(session.end_time) : undefined,
    createdAt: new Date(session.created_at),
    updatedAt: new Date(session.updated_at)
  };
};

export const createTimerSession = async (durationMinutes: number): Promise<TimerSession> => {
  const { data, error } = await supabase
    .from('timer_sessions' as any)
    .insert({
      duration_minutes: durationMinutes,
      completed: false,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return transformTimerSession(data as TimerSessionsDBRow);
};

export const completeTimerSession = async (sessionId: string): Promise<TimerSession> => {
  const { data, error } = await supabase
    .from('timer_sessions' as any)
    .update({
      completed: true,
      end_time: new Date().toISOString()
    })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return transformTimerSession(data as TimerSessionsDBRow);
};

export const getRecentTimerSessions = async (limit = 10): Promise<TimerSession[]> => {
  const { data, error } = await supabase
    .from('timer_sessions' as any)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data ? (data as TimerSessionsDBRow[]).map(transformTimerSession) : [];
};

export const getTimerSessionStats = async () => {
  // Get today's date at midnight for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Get the start of the current week (Sunday)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  
  // Get the start of the current month
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  // Fetch all completed sessions from the current month
  const { data, error } = await supabase
    .from('timer_sessions' as any)
    .select('*')
    .eq('completed', true)
    .gte('end_time', startOfMonth.toISOString())
    .order('end_time', { ascending: false });

  if (error) throw new Error(error.message);
  
  const sessions = data ? (data as TimerSessionsDBRow[]).map(transformTimerSession) : [];
  
  // Process the data to get stats
  const todaySessions = sessions.filter(session => 
    new Date(session.endTime as Date) >= today
  );
  
  const weekSessions = sessions.filter(session => 
    new Date(session.endTime as Date) >= startOfWeek
  );

  const monthSessions = sessions;
  
  return {
    today: {
      sessions: todaySessions.length,
      totalMinutes: todaySessions.reduce((sum, session) => sum + session.durationMinutes, 0)
    },
    week: {
      sessions: weekSessions.length,
      totalMinutes: weekSessions.reduce((sum, session) => sum + session.durationMinutes, 0)
    },
    month: {
      sessions: monthSessions.length,
      totalMinutes: monthSessions.reduce((sum, session) => sum + session.durationMinutes, 0)
    },
    recentSessions: sessions.slice(0, 5)
  };
};
