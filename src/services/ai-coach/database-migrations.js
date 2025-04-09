/**
 * Database migrations for the AI Study Coach
 * This file contains the SQL queries to create the necessary tables
 * for the AI Study Coach to function.
 */

export const aiCoachProfilesTable = `
CREATE TABLE IF NOT EXISTS ai_coach_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coach_name TEXT NOT NULL DEFAULT 'Study Coach',
  coach_personality TEXT NOT NULL DEFAULT 'supportive',
  coaching_style TEXT NOT NULL DEFAULT 'balanced',
  active_goals JSONB NOT NULL DEFAULT '[]',
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ai_coach_profiles_user_id_idx ON ai_coach_profiles(user_id);
`;

export const aiCoachSessionsTable = `
CREATE TABLE IF NOT EXISTS ai_coach_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES ai_coach_profiles(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  session_data JSONB NOT NULL DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ai_coach_sessions_user_id_idx ON ai_coach_sessions(user_id);
CREATE INDEX IF NOT EXISTS ai_coach_sessions_profile_id_idx ON ai_coach_sessions(profile_id);
`;

export const aiCoachMessagesTable = `
CREATE TABLE IF NOT EXISTS ai_coach_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES ai_coach_sessions(id) ON DELETE CASCADE,
  sender TEXT NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text',
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ai_coach_messages_session_id_idx ON ai_coach_messages(session_id);
`;

export const aiCoachInsightsTable = `
CREATE TABLE IF NOT EXISTS ai_coach_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL,
  insight_data JSONB NOT NULL,
  confidence FLOAT NOT NULL DEFAULT 0.0,
  is_applied BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ai_coach_insights_user_id_idx ON ai_coach_insights(user_id);
CREATE INDEX IF NOT EXISTS ai_coach_insights_type_idx ON ai_coach_insights(insight_type);
`;

export const aiCoachLearningStylesTable = `
CREATE TABLE IF NOT EXISTS ai_coach_learning_styles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  visual_score FLOAT NOT NULL DEFAULT 0.0,
  auditory_score FLOAT NOT NULL DEFAULT 0.0,
  reading_score FLOAT NOT NULL DEFAULT 0.0,
  kinesthetic_score FLOAT NOT NULL DEFAULT 0.0,
  social_score FLOAT NOT NULL DEFAULT 0.0,
  solitary_score FLOAT NOT NULL DEFAULT 0.0,
  logical_score FLOAT NOT NULL DEFAULT 0.0,
  assessment_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS ai_coach_learning_styles_user_id_idx ON ai_coach_learning_styles(user_id);
`;

export const aiCoachGoalsTable = `
CREATE TABLE IF NOT EXISTS ai_coach_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  goal_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  target_date TIMESTAMP WITH TIME ZONE,
  progress FLOAT NOT NULL DEFAULT 0.0,
  metrics JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ai_coach_goals_user_id_idx ON ai_coach_goals(user_id);
`;

export const aiCoachStudySessionsTable = `
CREATE TABLE IF NOT EXISTS ai_coach_study_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_id UUID REFERENCES ai_coach_goals(id) ON DELETE SET NULL,
  session_type TEXT NOT NULL,
  duration INTEGER NOT NULL DEFAULT 0,
  effectiveness_score FLOAT,
  focus_score FLOAT,
  session_data JSONB NOT NULL DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ai_coach_study_sessions_user_id_idx ON ai_coach_study_sessions(user_id);
CREATE INDEX IF NOT EXISTS ai_coach_study_sessions_goal_id_idx ON ai_coach_study_sessions(goal_id);
`;

export const aiCoachRecommendationsTable = `
CREATE TABLE IF NOT EXISTS ai_coach_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority INTEGER NOT NULL DEFAULT 1,
  is_applied BOOLEAN NOT NULL DEFAULT false,
  recommendation_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ai_coach_recommendations_user_id_idx ON ai_coach_recommendations(user_id);
`;

/**
 * Run all migrations
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client
 * @returns {Promise<boolean>} Success status
 */
export async function runMigrations(supabase) {
  try {
    const migrations = [
      aiCoachProfilesTable,
      aiCoachSessionsTable,
      aiCoachMessagesTable,
      aiCoachInsightsTable,
      aiCoachLearningStylesTable,
      aiCoachGoalsTable,
      aiCoachStudySessionsTable,
      aiCoachRecommendationsTable
    ];
    
    for (const migration of migrations) {
      const { error } = await supabase.rpc('run_sql', { sql: migration });
      
      if (error) {
        console.error('Migration error:', error);
        return false;
      }
    }
    
    console.log('All AI coach migrations completed successfully');
    return true;
  } catch (error) {
    console.error('Error running AI coach migrations:', error);
    return false;
  }
}
