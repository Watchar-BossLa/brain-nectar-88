/**
 * Database migrations for the Collaborative Learning Network
 * This file contains the SQL queries to create the necessary tables
 * for the Collaborative Learning Network to function.
 */

export const studyGroupsTable = `
CREATE TABLE IF NOT EXISTS study_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT FALSE,
  join_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS study_groups_creator_id_idx ON study_groups(creator_id);
CREATE INDEX IF NOT EXISTS study_groups_is_public_idx ON study_groups(is_public);
`;

export const groupMembersTable = `
CREATE TABLE IF NOT EXISTS group_members (
  group_id UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (group_id, user_id)
);

CREATE INDEX IF NOT EXISTS group_members_user_id_idx ON group_members(user_id);
`;

export const groupResourcesTable = `
CREATE TABLE IF NOT EXISTS group_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS group_resources_group_id_idx ON group_resources(group_id);
CREATE INDEX IF NOT EXISTS group_resources_creator_id_idx ON group_resources(creator_id);
CREATE INDEX IF NOT EXISTS group_resources_resource_type_id_idx ON group_resources(resource_type, resource_id);
`;

export const knowledgeQuestionsTable = `
CREATE TABLE IF NOT EXISTS knowledge_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS knowledge_questions_user_id_idx ON knowledge_questions(user_id);
CREATE INDEX IF NOT EXISTS knowledge_questions_group_id_idx ON knowledge_questions(group_id);
CREATE INDEX IF NOT EXISTS knowledge_questions_tags_idx ON knowledge_questions USING GIN(tags);
`;

export const knowledgeAnswersTable = `
CREATE TABLE IF NOT EXISTS knowledge_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES knowledge_questions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_accepted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS knowledge_answers_question_id_idx ON knowledge_answers(question_id);
CREATE INDEX IF NOT EXISTS knowledge_answers_user_id_idx ON knowledge_answers(user_id);
CREATE INDEX IF NOT EXISTS knowledge_answers_is_accepted_idx ON knowledge_answers(is_accepted);
`;

export const studySessionsTable = `
CREATE TABLE IF NOT EXISTS study_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  session_type TEXT NOT NULL,
  status TEXT NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  session_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS study_sessions_group_id_idx ON study_sessions(group_id);
CREATE INDEX IF NOT EXISTS study_sessions_creator_id_idx ON study_sessions(creator_id);
CREATE INDEX IF NOT EXISTS study_sessions_status_idx ON study_sessions(status);
CREATE INDEX IF NOT EXISTS study_sessions_scheduled_at_idx ON study_sessions(scheduled_at);
`;

export const sessionParticipantsTable = `
CREATE TABLE IF NOT EXISTS session_participants (
  session_id UUID NOT NULL REFERENCES study_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  left_at TIMESTAMP WITH TIME ZONE,
  PRIMARY KEY (session_id, user_id)
);

CREATE INDEX IF NOT EXISTS session_participants_user_id_idx ON session_participants(user_id);
`;

export const sessionMessagesTable = `
CREATE TABLE IF NOT EXISTS session_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES study_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS session_messages_session_id_idx ON session_messages(session_id);
CREATE INDEX IF NOT EXISTS session_messages_created_at_idx ON session_messages(created_at);
`;

export const userActivitiesTable = `
CREATE TABLE IF NOT EXISTS user_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  content JSONB NOT NULL,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS user_activities_user_id_idx ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS user_activities_activity_type_idx ON user_activities(activity_type);
CREATE INDEX IF NOT EXISTS user_activities_created_at_idx ON user_activities(created_at);
`;

export const userConnectionsTable = `
CREATE TABLE IF NOT EXISTS user_connections (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  connected_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  connection_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, connected_user_id)
);

CREATE INDEX IF NOT EXISTS user_connections_connected_user_id_idx ON user_connections(connected_user_id);
CREATE INDEX IF NOT EXISTS user_connections_connection_type_idx ON user_connections(connection_type);
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
      groupMembersTable,
      groupResourcesTable,
      knowledgeQuestionsTable,
      knowledgeAnswersTable,
      studySessionsTable,
      sessionParticipantsTable,
      sessionMessagesTable,
      userActivitiesTable,
      userConnectionsTable
    ];
    
    for (const migration of migrations) {
      const { error } = await supabase.rpc('run_sql', { sql: migration });
      
      if (error) {
        console.error('Migration error:', error);
        return false;
      }
    }
    
    console.log('All collaborative network migrations completed successfully');
    return true;
  } catch (error) {
    console.error('Error running collaborative network migrations:', error);
    return false;
  }
}
