/**
 * Database migrations for the Cognitive Optimization System
 * This file contains the SQL queries to create the necessary tables
 * for the Cognitive Optimization System to function.
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

export const cognitiveMonitoringSessionsTable = `
CREATE TABLE IF NOT EXISTS cognitive_monitoring_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration FLOAT,
  data_points JSONB DEFAULT '[]'::jsonb,
  options JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS cognitive_monitoring_sessions_user_id_idx ON cognitive_monitoring_sessions(user_id);
CREATE INDEX IF NOT EXISTS cognitive_monitoring_sessions_start_time_idx ON cognitive_monitoring_sessions(start_time);
`;

export const cognitiveRecommendationsTable = `
CREATE TABLE IF NOT EXISTS cognitive_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  state JSONB NOT NULL,
  recommendations JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS cognitive_recommendations_user_id_idx ON cognitive_recommendations(user_id);
CREATE INDEX IF NOT EXISTS cognitive_recommendations_timestamp_idx ON cognitive_recommendations(timestamp);
`;

export const cognitiveMetricsTable = `
CREATE TABLE IF NOT EXISTS cognitive_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  metrics JSONB NOT NULL,
  session_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS cognitive_metrics_user_id_idx ON cognitive_metrics(user_id);
CREATE INDEX IF NOT EXISTS cognitive_metrics_timestamp_idx ON cognitive_metrics(timestamp);
`;

export const studySessionsTable = `
CREATE TABLE IF NOT EXISTS study_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration FLOAT NOT NULL,
  activity_type TEXT NOT NULL,
  content JSONB NOT NULL,
  performance JSONB DEFAULT '{}'::jsonb,
  feedback JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS study_sessions_user_id_idx ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS study_sessions_start_time_idx ON study_sessions(start_time);
CREATE INDEX IF NOT EXISTS study_sessions_activity_type_idx ON study_sessions(activity_type);
`;

export const userPreferencesTable = `
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preferences JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS user_preferences_user_id_idx ON user_preferences(user_id);
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
      cognitiveMonitoringSessionsTable,
      cognitiveRecommendationsTable,
      cognitiveMetricsTable,
      studySessionsTable,
      userPreferencesTable
    ];
    
    for (const migration of migrations) {
      const { error } = await supabase.rpc('run_sql', { sql: migration });
      
      if (error) {
        console.error('Migration error:', error);
        return false;
      }
    }
    
    console.log('All cognitive optimization migrations completed successfully');
    return true;
  } catch (error) {
    console.error('Error running cognitive optimization migrations:', error);
    return false;
  }
}
