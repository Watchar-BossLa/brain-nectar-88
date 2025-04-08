/**
 * Database migrations for the Augmented Reality Study Environment
 * This file contains the SQL queries to create the necessary tables
 * for the AR Study Environment to function.
 */

export const arStudySpacesTable = `
CREATE TABLE IF NOT EXISTS ar_study_spaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  environment_type TEXT NOT NULL,
  settings JSONB NOT NULL DEFAULT '{}',
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ar_study_spaces_user_id_idx ON ar_study_spaces(user_id);
`;

export const arStudyObjectsTable = `
CREATE TABLE IF NOT EXISTS ar_study_objects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  space_id UUID NOT NULL REFERENCES ar_study_spaces(id) ON DELETE CASCADE,
  object_type TEXT NOT NULL,
  content_type TEXT NOT NULL,
  content_id UUID,
  position JSONB NOT NULL,
  rotation JSONB NOT NULL,
  scale JSONB NOT NULL,
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ar_study_objects_space_id_idx ON ar_study_objects(space_id);
CREATE INDEX IF NOT EXISTS ar_study_objects_content_id_idx ON ar_study_objects(content_id);
`;

export const arCollaborativeSessionsTable = `
CREATE TABLE IF NOT EXISTS ar_collaborative_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  space_id UUID NOT NULL REFERENCES ar_study_spaces(id) ON DELETE CASCADE,
  host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  max_participants INTEGER NOT NULL DEFAULT 10,
  settings JSONB NOT NULL DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ar_collaborative_sessions_space_id_idx ON ar_collaborative_sessions(space_id);
CREATE INDEX IF NOT EXISTS ar_collaborative_sessions_host_id_idx ON ar_collaborative_sessions(host_id);
CREATE INDEX IF NOT EXISTS ar_collaborative_sessions_session_code_idx ON ar_collaborative_sessions(session_code);
`;

export const arSessionParticipantsTable = `
CREATE TABLE IF NOT EXISTS ar_session_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES ar_collaborative_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'participant',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  left_at TIMESTAMP WITH TIME ZONE,
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ar_session_participants_session_id_idx ON ar_session_participants(session_id);
CREATE INDEX IF NOT EXISTS ar_session_participants_user_id_idx ON ar_session_participants(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS ar_session_participants_session_user_idx ON ar_session_participants(session_id, user_id) WHERE left_at IS NULL;
`;

export const arInteractionLogsTable = `
CREATE TABLE IF NOT EXISTS ar_interaction_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES ar_collaborative_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  space_id UUID NOT NULL REFERENCES ar_study_spaces(id) ON DELETE CASCADE,
  object_id UUID REFERENCES ar_study_objects(id) ON DELETE SET NULL,
  interaction_type TEXT NOT NULL,
  interaction_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ar_interaction_logs_session_id_idx ON ar_interaction_logs(session_id);
CREATE INDEX IF NOT EXISTS ar_interaction_logs_user_id_idx ON ar_interaction_logs(user_id);
CREATE INDEX IF NOT EXISTS ar_interaction_logs_space_id_idx ON ar_interaction_logs(space_id);
CREATE INDEX IF NOT EXISTS ar_interaction_logs_object_id_idx ON ar_interaction_logs(object_id);
`;

export const arTemplatesTable = `
CREATE TABLE IF NOT EXISTS ar_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  environment_type TEXT NOT NULL,
  preview_image_url TEXT,
  template_data JSONB NOT NULL,
  is_system BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ar_templates_created_by_idx ON ar_templates(created_by);
`;

/**
 * Run all migrations
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client
 * @returns {Promise<boolean>} Success status
 */
export async function runMigrations(supabase) {
  try {
    const migrations = [
      arStudySpacesTable,
      arStudyObjectsTable,
      arCollaborativeSessionsTable,
      arSessionParticipantsTable,
      arInteractionLogsTable,
      arTemplatesTable
    ];
    
    for (const migration of migrations) {
      const { error } = await supabase.rpc('run_sql', { sql: migration });
      
      if (error) {
        console.error('Migration error:', error);
        return false;
      }
    }
    
    console.log('All augmented reality migrations completed successfully');
    return true;
  } catch (error) {
    console.error('Error running augmented reality migrations:', error);
    return false;
  }
}
