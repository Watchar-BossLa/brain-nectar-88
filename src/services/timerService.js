import { supabase } from '@/integrations/supabase/client';

/**
 * @typedef {import('../types/components/timer').TimerSession} TimerSession
 */

/**
 * @typedef {Object} TimerSessionsDBRow
 * @property {string} id - Session ID
 * @property {string} user_id - User ID
 * @property {number} duration_minutes - Duration in minutes
 * @property {boolean} completed - Whether the session is completed
 * @property {string} start_time - Start time
 * @property {string} [end_time] - End time
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Update timestamp
 */

/**
 * Helper function to convert snake_case database objects to camelCase
 * @param {TimerSessionsDBRow} session - Database session
 * @returns {TimerSession} Transformed session
 */
const transformTimerSession = (session) => {
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

/**
 * Create a timer session
 * @param {number} durationMinutes - Duration in minutes
 * @returns {Promise<TimerSession>} Created session
 */
export const createTimerSession = async (durationMinutes) => {
  const { data, error } = await supabase
    .from('timer_sessions')
    .insert({
      duration_minutes: durationMinutes,
      completed: false,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return transformTimerSession(data);
};

/**
 * Complete a timer session
 * @param {string} sessionId - Session ID
 * @returns {Promise<TimerSession>} Updated session
 */
export const completeTimerSession = async (sessionId) => {
  const { data, error } = await supabase
    .from('timer_sessions')
    .update({
      completed: true,
      end_time: new Date().toISOString()
    })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return transformTimerSession(data);
};

/**
 * Get recent timer sessions
 * @param {number} [limit=10] - Limit
 * @returns {Promise<TimerSession[]>} Recent sessions
 */
export const getRecentTimerSessions = async (limit = 10) => {
  const { data, error } = await supabase
    .from('timer_sessions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data ? data.map(transformTimerSession) : [];
};

/**
 * Get timer session statistics
 * @returns {Promise<Object>} Timer statistics
 */
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
    .from('timer_sessions')
    .select('*')
    .eq('completed', true)
    .gte('end_time', startOfMonth.toISOString())
    .order('end_time', { ascending: false });

  if (error) throw new Error(error.message);
  
  const sessions = data ? data.map(transformTimerSession) : [];
  
  // Process the data to get stats
  const todaySessions = sessions.filter(session => 
    new Date(session.endTime) >= today
  );
  
  const weekSessions = sessions.filter(session => 
    new Date(session.endTime) >= startOfWeek
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
