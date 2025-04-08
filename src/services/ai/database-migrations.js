/**
 * Database migrations for the Adaptive Learning Engine
 * This file contains the SQL queries to create the necessary tables
 * for the Adaptive Learning Engine to function.
 */

export const cognitiveProfilesTable = `
CREATE TABLE IF NOT EXISTS cognitive_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS cognitive_profiles_user_id_idx ON cognitive_profiles(user_id);
`;

export const learningActivitiesTable = `
CREATE TABLE IF NOT EXISTS learning_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id TEXT NOT NULL,
  completion_data JSONB NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS learning_activities_user_id_idx ON learning_activities(user_id);
CREATE INDEX IF NOT EXISTS learning_activities_completed_at_idx ON learning_activities(completed_at);
`;

export const learningPathwaysTable = `
CREATE TABLE IF NOT EXISTS learning_pathways (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pathway JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE,
  UNIQUE(user_id, active) WHERE active = TRUE
);

CREATE INDEX IF NOT EXISTS learning_pathways_user_id_idx ON learning_pathways(user_id);
CREATE INDEX IF NOT EXISTS learning_pathways_active_idx ON learning_pathways(active);
`;

export const contentLibraryTable = `
CREATE TABLE IF NOT EXISTS content_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type TEXT NOT NULL,
  metadata JSONB NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS content_library_content_type_idx ON content_library(content_type);
`;

export const conceptNetworkTable = `
CREATE TABLE IF NOT EXISTS concept_network (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  concept_id TEXT NOT NULL,
  related_concepts JSONB NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(concept_id)
);

CREATE INDEX IF NOT EXISTS concept_network_concept_id_idx ON concept_network(concept_id);
`;

export const learningAnalyticsTable = `
CREATE TABLE IF NOT EXISTS learning_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  analytics_data JSONB NOT NULL,
  session_start TIMESTAMP WITH TIME ZONE NOT NULL,
  session_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS learning_analytics_user_id_idx ON learning_analytics(user_id);
CREATE INDEX IF NOT EXISTS learning_analytics_session_start_idx ON learning_analytics(session_start);
`;

/**
 * Run all migrations
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client
 * @returns {Promise<boolean>} Success status
 */
export async function runMigrations(supabase) {
  try {
    const migrations = [
      cognitiveProfilesTable,
      learningActivitiesTable,
      learningPathwaysTable,
      contentLibraryTable,
      conceptNetworkTable,
      learningAnalyticsTable
    ];
    
    for (const migration of migrations) {
      const { error } = await supabase.rpc('run_sql', { sql: migration });
      
      if (error) {
        console.error('Migration error:', error);
        return false;
      }
    }
    
    console.log('All migrations completed successfully');
    return true;
  } catch (error) {
    console.error('Error running migrations:', error);
    return false;
  }
}
