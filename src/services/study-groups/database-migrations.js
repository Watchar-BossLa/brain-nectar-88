/**
 * Database migrations for the Collaborative Study Groups feature
 * This file contains the SQL queries to create the necessary tables
 * for the study groups system to function.
 */

import { supabase } from '@/integrations/supabase/client';

export const studyGroupsTable = `
CREATE TABLE IF NOT EXISTS study_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public BOOLEAN NOT NULL DEFAULT false,
  join_code TEXT,
  max_members INTEGER,
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS study_groups_created_by_idx ON study_groups(created_by);
CREATE INDEX IF NOT EXISTS study_groups_is_public_idx ON study_groups(is_public);
CREATE INDEX IF NOT EXISTS study_groups_join_code_idx ON study_groups(join_code);
`;

export const studyGroupMembersTable = `
CREATE TABLE IF NOT EXISTS study_group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

CREATE INDEX IF NOT EXISTS study_group_members_group_id_idx ON study_group_members(group_id);
CREATE INDEX IF NOT EXISTS study_group_members_user_id_idx ON study_group_members(user_id);
CREATE INDEX IF NOT EXISTS study_group_members_role_idx ON study_group_members(role);
`;

export const studyGroupSessionsTable = `
CREATE TABLE IF NOT EXISTS study_group_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  scheduled_start TIMESTAMP WITH TIME ZONE,
  scheduled_end TIMESTAMP WITH TIME ZONE,
  actual_start TIMESTAMP WITH TIME ZONE,
  actual_end TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'scheduled',
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS study_group_sessions_group_id_idx ON study_group_sessions(group_id);
CREATE INDEX IF NOT EXISTS study_group_sessions_created_by_idx ON study_group_sessions(created_by);
CREATE INDEX IF NOT EXISTS study_group_sessions_status_idx ON study_group_sessions(status);
CREATE INDEX IF NOT EXISTS study_group_sessions_scheduled_start_idx ON study_group_sessions(scheduled_start);
`;

export const studyGroupSessionAttendanceTable = `
CREATE TABLE IF NOT EXISTS study_group_session_attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES study_group_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  join_time TIMESTAMP WITH TIME ZONE,
  leave_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER,
  participation_score INTEGER,
  attendance_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, user_id)
);

CREATE INDEX IF NOT EXISTS study_group_session_attendance_session_id_idx ON study_group_session_attendance(session_id);
CREATE INDEX IF NOT EXISTS study_group_session_attendance_user_id_idx ON study_group_session_attendance(user_id);
`;

export const studyGroupResourcesTable = `
CREATE TABLE IF NOT EXISTS study_group_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL,
  resource_url TEXT,
  file_path TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  resource_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS study_group_resources_group_id_idx ON study_group_resources(group_id);
CREATE INDEX IF NOT EXISTS study_group_resources_created_by_idx ON study_group_resources(created_by);
CREATE INDEX IF NOT EXISTS study_group_resources_resource_type_idx ON study_group_resources(resource_type);
`;

export const studyGroupDiscussionsTable = `
CREATE TABLE IF NOT EXISTS study_group_discussions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  is_closed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS study_group_discussions_group_id_idx ON study_group_discussions(group_id);
CREATE INDEX IF NOT EXISTS study_group_discussions_created_by_idx ON study_group_discussions(created_by);
`;

export const studyGroupCommentsTable = `
CREATE TABLE IF NOT EXISTS study_group_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  discussion_id UUID NOT NULL REFERENCES study_group_discussions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES study_group_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS study_group_comments_discussion_id_idx ON study_group_comments(discussion_id);
CREATE INDEX IF NOT EXISTS study_group_comments_created_by_idx ON study_group_comments(created_by);
CREATE INDEX IF NOT EXISTS study_group_comments_parent_id_idx ON study_group_comments(parent_id);
`;

export const studyGroupTasksTable = `
CREATE TABLE IF NOT EXISTS study_group_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'pending',
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  task_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS study_group_tasks_group_id_idx ON study_group_tasks(group_id);
CREATE INDEX IF NOT EXISTS study_group_tasks_created_by_idx ON study_group_tasks(created_by);
CREATE INDEX IF NOT EXISTS study_group_tasks_assigned_to_idx ON study_group_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS study_group_tasks_status_idx ON study_group_tasks(status);
CREATE INDEX IF NOT EXISTS study_group_tasks_due_date_idx ON study_group_tasks(due_date);
`;

export const studyGroupInvitationsTable = `
CREATE TABLE IF NOT EXISTS study_group_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  invitation_code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, email)
);

CREATE INDEX IF NOT EXISTS study_group_invitations_group_id_idx ON study_group_invitations(group_id);
CREATE INDEX IF NOT EXISTS study_group_invitations_invited_by_idx ON study_group_invitations(invited_by);
CREATE INDEX IF NOT EXISTS study_group_invitations_status_idx ON study_group_invitations(status);
CREATE INDEX IF NOT EXISTS study_group_invitations_invitation_code_idx ON study_group_invitations(invitation_code);
`;

/**
 * Run all migrations
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client
 * @returns {Promise<boolean>} Success status
 */
export async function runMigrations(supabase) {
  try {
    const migrations = [
      studyGroupsTable,
      studyGroupMembersTable,
      studyGroupSessionsTable,
      studyGroupSessionAttendanceTable,
      studyGroupResourcesTable,
      studyGroupDiscussionsTable,
      studyGroupCommentsTable,
      studyGroupTasksTable,
      studyGroupInvitationsTable
    ];
    
    for (const migration of migrations) {
      const { error } = await supabase.rpc('run_sql', { sql: migration });
      
      if (error) {
        console.error('Migration error:', error);
        return false;
      }
    }
    
    console.log('All study groups migrations completed successfully');
    return true;
  } catch (error) {
    console.error('Error running study groups migrations:', error);
    return false;
  }
}
