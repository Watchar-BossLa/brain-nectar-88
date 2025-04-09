/**
 * Group Sessions Service
 * Service for managing study group sessions
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Group Sessions Service class
 */
export class GroupSessionsService {
  static instance;
  
  /**
   * Private constructor for singleton pattern
   */
  constructor() {
    this.initialized = false;
    this.activeSessions = new Map();
  }
  
  /**
   * Get the singleton instance
   * @returns {GroupSessionsService} The singleton instance
   */
  static getInstance() {
    if (!GroupSessionsService.instance) {
      GroupSessionsService.instance = new GroupSessionsService();
    }
    return GroupSessionsService.instance;
  }
  
  /**
   * Initialize the service
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async initialize(userId) {
    try {
      console.log('Initializing Group Sessions Service for user:', userId);
      this.userId = userId;
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Group Sessions Service:', error);
      return false;
    }
  }
  
  /**
   * Create a new study session
   * @param {string} groupId - Group ID
   * @param {Object} sessionData - Session data
   * @returns {Promise<Object>} Created session
   */
  async createSession(groupId, sessionData) {
    if (!this.initialized) {
      throw new Error('Group Sessions Service not initialized');
    }
    
    // Check if the user is a member of the group
    const { data: membership, error: membershipError } = await supabase
      .from('study_group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', this.userId)
      .maybeSingle();
    
    if (membershipError) throw membershipError;
    
    if (!membership) {
      throw new Error('You are not a member of this group');
    }
    
    // Create the session
    const { data: session, error } = await supabase
      .from('study_group_sessions')
      .insert({
        group_id: groupId,
        name: sessionData.name,
        description: sessionData.description,
        scheduled_start: sessionData.scheduledStart,
        scheduled_end: sessionData.scheduledEnd,
        status: 'scheduled',
        created_by: this.userId,
        session_data: sessionData.sessionData || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return session;
  }
  
  /**
   * Get sessions for a group
   * @param {string} groupId - Group ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Group sessions
   */
  async getGroupSessions(groupId, options = {}) {
    if (!this.initialized) {
      throw new Error('Group Sessions Service not initialized');
    }
    
    const { status, limit = 10, offset = 0, sortBy = 'scheduled_start', sortOrder = 'asc' } = options;
    
    // Build the query
    let query = supabase
      .from('study_group_sessions')
      .select(`
        *,
        creator:created_by(
          username,
          full_name,
          avatar_url
        ),
        attendance_count:study_group_session_attendance(count)
      `)
      .eq('group_id', groupId);
    
    // Filter by status if specified
    if (status) {
      query = query.eq('status', status);
    }
    
    // Apply sorting and pagination
    query = query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1);
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Check if the user is attending each session
    const sessionIds = data.map(session => session.id);
    
    if (sessionIds.length > 0) {
      const { data: attendances, error: attendanceError } = await supabase
        .from('study_group_session_attendance')
        .select('session_id')
        .eq('user_id', this.userId)
        .in('session_id', sessionIds);
      
      if (attendanceError) throw attendanceError;
      
      const attendingSessionIds = new Set(attendances.map(a => a.session_id));
      
      // Add isAttending flag to each session
      data.forEach(session => {
        session.isAttending = attendingSessionIds.has(session.id);
      });
    }
    
    return data;
  }
  
  /**
   * Get a session by ID
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object>} Session
   */
  async getSessionById(sessionId) {
    if (!this.initialized) {
      throw new Error('Group Sessions Service not initialized');
    }
    
    // Get the session
    const { data: session, error } = await supabase
      .from('study_group_sessions')
      .select(`
        *,
        creator:created_by(
          username,
          full_name,
          avatar_url
        ),
        study_groups!inner(
          id,
          name,
          description
        ),
        attendees:study_group_session_attendance(
          id,
          user_id,
          join_time,
          leave_time,
          duration,
          participation_score,
          profiles:user_id(
            username,
            full_name,
            avatar_url
          )
        )
      `)
      .eq('id', sessionId)
      .single();
    
    if (error) throw error;
    
    // Check if the user is attending
    const { data: attendance, error: attendanceError } = await supabase
      .from('study_group_session_attendance')
      .select('*')
      .eq('session_id', sessionId)
      .eq('user_id', this.userId)
      .maybeSingle();
    
    if (attendanceError) throw attendanceError;
    
    return {
      ...session,
      isAttending: !!attendance,
      userAttendance: attendance
    };
  }
  
  /**
   * Start a session
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object>} Updated session
   */
  async startSession(sessionId) {
    if (!this.initialized) {
      throw new Error('Group Sessions Service not initialized');
    }
    
    // Get the session
    const { data: session, error } = await supabase
      .from('study_group_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();
    
    if (error) throw error;
    
    // Check if the user is the creator or an admin
    if (session.created_by !== this.userId) {
      const { data: membership, error: membershipError } = await supabase
        .from('study_group_members')
        .select('role')
        .eq('group_id', session.group_id)
        .eq('user_id', this.userId)
        .single();
      
      if (membershipError) throw membershipError;
      
      if (membership.role !== 'admin') {
        throw new Error('Only the session creator or group admins can start the session');
      }
    }
    
    // Check if the session is already started
    if (session.status === 'in_progress') {
      throw new Error('Session is already in progress');
    }
    
    if (session.status === 'completed') {
      throw new Error('Session is already completed');
    }
    
    // Update the session status
    const { data: updatedSession, error: updateError } = await supabase
      .from('study_group_sessions')
      .update({
        status: 'in_progress',
        actual_start: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId)
      .select()
      .single();
    
    if (updateError) throw updateError;
    
    // Add the creator to the attendees
    await this.joinSession(sessionId);
    
    return updatedSession;
  }
  
  /**
   * End a session
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object>} Updated session
   */
  async endSession(sessionId) {
    if (!this.initialized) {
      throw new Error('Group Sessions Service not initialized');
    }
    
    // Get the session
    const { data: session, error } = await supabase
      .from('study_group_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();
    
    if (error) throw error;
    
    // Check if the user is the creator or an admin
    if (session.created_by !== this.userId) {
      const { data: membership, error: membershipError } = await supabase
        .from('study_group_members')
        .select('role')
        .eq('group_id', session.group_id)
        .eq('user_id', this.userId)
        .single();
      
      if (membershipError) throw membershipError;
      
      if (membership.role !== 'admin') {
        throw new Error('Only the session creator or group admins can end the session');
      }
    }
    
    // Check if the session is in progress
    if (session.status !== 'in_progress') {
      throw new Error('Session is not in progress');
    }
    
    // Update the session status
    const { data: updatedSession, error: updateError } = await supabase
      .from('study_group_sessions')
      .update({
        status: 'completed',
        actual_end: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId)
      .select()
      .single();
    
    if (updateError) throw updateError;
    
    // Update all attendees' leave time
    const { error: attendanceError } = await supabase
      .from('study_group_session_attendance')
      .update({
        leave_time: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('session_id', sessionId)
      .is('leave_time', null);
    
    if (attendanceError) throw attendanceError;
    
    // Calculate duration for all attendees
    const { data: attendances, error: getAttendancesError } = await supabase
      .from('study_group_session_attendance')
      .select('*')
      .eq('session_id', sessionId);
    
    if (getAttendancesError) throw getAttendancesError;
    
    // Update durations
    for (const attendance of attendances) {
      if (attendance.join_time && attendance.leave_time) {
        const joinTime = new Date(attendance.join_time).getTime();
        const leaveTime = new Date(attendance.leave_time).getTime();
        const duration = Math.round((leaveTime - joinTime) / 1000); // Duration in seconds
        
        await supabase
          .from('study_group_session_attendance')
          .update({
            duration,
            updated_at: new Date().toISOString()
          })
          .eq('id', attendance.id);
      }
    }
    
    return updatedSession;
  }
  
  /**
   * Join a session
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object>} Attendance record
   */
  async joinSession(sessionId) {
    if (!this.initialized) {
      throw new Error('Group Sessions Service not initialized');
    }
    
    // Get the session
    const { data: session, error } = await supabase
      .from('study_group_sessions')
      .select('group_id, status')
      .eq('id', sessionId)
      .single();
    
    if (error) throw error;
    
    // Check if the session is in progress or scheduled
    if (session.status !== 'in_progress' && session.status !== 'scheduled') {
      throw new Error('Session is not active');
    }
    
    // Check if the user is a member of the group
    const { data: membership, error: membershipError } = await supabase
      .from('study_group_members')
      .select('*')
      .eq('group_id', session.group_id)
      .eq('user_id', this.userId)
      .maybeSingle();
    
    if (membershipError) throw membershipError;
    
    if (!membership) {
      throw new Error('You are not a member of this group');
    }
    
    // Check if the user is already attending
    const { data: existingAttendance, error: attendanceError } = await supabase
      .from('study_group_session_attendance')
      .select('*')
      .eq('session_id', sessionId)
      .eq('user_id', this.userId)
      .maybeSingle();
    
    if (attendanceError) throw attendanceError;
    
    if (existingAttendance) {
      // If the user has left, update the join time
      if (existingAttendance.leave_time) {
        const { data: updatedAttendance, error: updateError } = await supabase
          .from('study_group_session_attendance')
          .update({
            join_time: new Date().toISOString(),
            leave_time: null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingAttendance.id)
          .select()
          .single();
        
        if (updateError) throw updateError;
        
        return updatedAttendance;
      }
      
      return existingAttendance;
    }
    
    // Create a new attendance record
    const { data: attendance, error: createError } = await supabase
      .from('study_group_session_attendance')
      .insert({
        session_id: sessionId,
        user_id: this.userId,
        join_time: new Date().toISOString(),
        attendance_data: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (createError) throw createError;
    
    return attendance;
  }
  
  /**
   * Leave a session
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object>} Updated attendance record
   */
  async leaveSession(sessionId) {
    if (!this.initialized) {
      throw new Error('Group Sessions Service not initialized');
    }
    
    // Check if the user is attending
    const { data: attendance, error } = await supabase
      .from('study_group_session_attendance')
      .select('*')
      .eq('session_id', sessionId)
      .eq('user_id', this.userId)
      .maybeSingle();
    
    if (error) throw error;
    
    if (!attendance) {
      throw new Error('You are not attending this session');
    }
    
    // Update the leave time
    const { data: updatedAttendance, error: updateError } = await supabase
      .from('study_group_session_attendance')
      .update({
        leave_time: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', attendance.id)
      .select()
      .single();
    
    if (updateError) throw updateError;
    
    return updatedAttendance;
  }
  
  /**
   * Get upcoming sessions for the user
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Upcoming sessions
   */
  async getUpcomingSessions(options = {}) {
    if (!this.initialized) {
      throw new Error('Group Sessions Service not initialized');
    }
    
    const { limit = 5, offset = 0 } = options;
    
    // Get groups where the user is a member
    const { data: memberships, error: membershipError } = await supabase
      .from('study_group_members')
      .select('group_id')
      .eq('user_id', this.userId);
    
    if (membershipError) throw membershipError;
    
    if (!memberships || memberships.length === 0) {
      return [];
    }
    
    const groupIds = memberships.map(m => m.group_id);
    
    // Get upcoming sessions
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('study_group_sessions')
      .select(`
        *,
        study_groups!inner(
          id,
          name
        ),
        creator:created_by(
          username,
          full_name,
          avatar_url
        )
      `)
      .in('group_id', groupIds)
      .or(`status.eq.scheduled,status.eq.in_progress`)
      .gte('scheduled_start', now)
      .order('scheduled_start', { ascending: true })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    return data;
  }
}

/**
 * Hook for using the Group Sessions Service
 * @returns {Object} Group Sessions Service methods
 */
export function useGroupSessions() {
  const service = GroupSessionsService.getInstance();
  
  return {
    initialize: service.initialize.bind(service),
    createSession: service.createSession.bind(service),
    getGroupSessions: service.getGroupSessions.bind(service),
    getSessionById: service.getSessionById.bind(service),
    startSession: service.startSession.bind(service),
    endSession: service.endSession.bind(service),
    joinSession: service.joinSession.bind(service),
    leaveSession: service.leaveSession.bind(service),
    getUpcomingSessions: service.getUpcomingSessions.bind(service)
  };
}
