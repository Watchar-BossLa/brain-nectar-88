/**
 * Database migrations for the Immersive Learning Service
 * This file contains the SQL queries to create the necessary tables
 * for the Immersive Learning Service to function.
 */

export const immersiveEnvironmentsTable = `
CREATE TABLE IF NOT EXISTS immersive_environments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('AR', 'VR', 'MR', '3D')),
  assets JSONB NOT NULL,
  interactions JSONB NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS immersive_environments_type_idx ON immersive_environments(type);
`;

export const immersiveSessionsTable = `
CREATE TABLE IF NOT EXISTS immersive_sessions (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  environment_id UUID NOT NULL REFERENCES immersive_environments(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  interactions JSONB DEFAULT '{}'::jsonb,
  progress JSONB DEFAULT '{}'::jsonb,
  analytics JSONB DEFAULT '{}'::jsonb,
  options JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS immersive_sessions_user_id_idx ON immersive_sessions(user_id);
CREATE INDEX IF NOT EXISTS immersive_sessions_environment_id_idx ON immersive_sessions(environment_id);
CREATE INDEX IF NOT EXISTS immersive_sessions_start_time_idx ON immersive_sessions(start_time);
`;

export const immersiveAssetsTable = `
CREATE TABLE IF NOT EXISTS immersive_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS immersive_assets_type_idx ON immersive_assets(type);
`;

export const immersiveInteractionsTable = `
CREATE TABLE IF NOT EXISTS immersive_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL REFERENCES immersive_sessions(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL,
  interaction_data JSONB NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS immersive_interactions_session_id_idx ON immersive_interactions(session_id);
CREATE INDEX IF NOT EXISTS immersive_interactions_timestamp_idx ON immersive_interactions(timestamp);
`;

/**
 * Run all migrations
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client
 * @returns {Promise<boolean>} Success status
 */
export async function runMigrations(supabase) {
  try {
    const migrations = [
      immersiveEnvironmentsTable,
      immersiveSessionsTable,
      immersiveAssetsTable,
      immersiveInteractionsTable
    ];
    
    for (const migration of migrations) {
      const { error } = await supabase.rpc('run_sql', { sql: migration });
      
      if (error) {
        console.error('Migration error:', error);
        return false;
      }
    }
    
    console.log('All immersive learning migrations completed successfully');
    return true;
  } catch (error) {
    console.error('Error running immersive learning migrations:', error);
    return false;
  }
}
