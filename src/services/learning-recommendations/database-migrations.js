/**
 * Database migrations for the Learning Recommendations feature
 * This file contains the SQL queries to create the necessary tables
 * for the learning recommendations system to function.
 */

import { supabase } from '@/integrations/supabase/client';

export const learningProfilesTable = `
CREATE TABLE IF NOT EXISTS learning_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  learning_style JSONB,
  interests JSONB,
  strengths JSONB,
  weaknesses JSONB,
  goals JSONB,
  preferences JSONB,
  profile_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS learning_profiles_user_id_idx ON learning_profiles(user_id);
`;

export const learningActivitiesTable = `
CREATE TABLE IF NOT EXISTS learning_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  content_id UUID,
  content_type TEXT,
  duration INTEGER,
  engagement_level INTEGER,
  performance_score INTEGER,
  activity_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS learning_activities_user_id_idx ON learning_activities(user_id);
CREATE INDEX IF NOT EXISTS learning_activities_activity_type_idx ON learning_activities(activity_type);
CREATE INDEX IF NOT EXISTS learning_activities_content_id_idx ON learning_activities(content_id);
CREATE INDEX IF NOT EXISTS learning_activities_created_at_idx ON learning_activities(created_at);
`;

export const contentItemsTable = `
CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_id TEXT,
  topics JSONB,
  difficulty_level TEXT,
  estimated_duration INTEGER,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS content_items_content_type_idx ON content_items(content_type);
CREATE INDEX IF NOT EXISTS content_items_source_type_idx ON content_items(source_type);
CREATE INDEX IF NOT EXISTS content_items_source_id_idx ON content_items(source_id);
`;

export const contentAnalysisTable = `
CREATE TABLE IF NOT EXISTS content_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  topics JSONB,
  keywords JSONB,
  complexity_score INTEGER,
  readability_score INTEGER,
  engagement_score INTEGER,
  prerequisites JSONB,
  learning_outcomes JSONB,
  analysis_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(content_id)
);

CREATE INDEX IF NOT EXISTS content_analysis_content_id_idx ON content_analysis(content_id);
`;

export const recommendationsTable = `
CREATE TABLE IF NOT EXISTS recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL,
  relevance_score INTEGER,
  is_viewed BOOLEAN NOT NULL DEFAULT false,
  is_saved BOOLEAN NOT NULL DEFAULT false,
  is_dismissed BOOLEAN NOT NULL DEFAULT false,
  recommendation_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS recommendations_user_id_idx ON recommendations(user_id);
CREATE INDEX IF NOT EXISTS recommendations_content_id_idx ON recommendations(content_id);
CREATE INDEX IF NOT EXISTS recommendations_recommendation_type_idx ON recommendations(recommendation_type);
CREATE INDEX IF NOT EXISTS recommendations_is_viewed_idx ON recommendations(is_viewed);
CREATE INDEX IF NOT EXISTS recommendations_is_saved_idx ON recommendations(is_saved);
CREATE INDEX IF NOT EXISTS recommendations_is_dismissed_idx ON recommendations(is_dismissed);
CREATE INDEX IF NOT EXISTS recommendations_created_at_idx ON recommendations(created_at);
`;

export const userTopicsTable = `
CREATE TABLE IF NOT EXISTS user_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  interest_level INTEGER,
  proficiency_level INTEGER,
  topic_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, topic)
);

CREATE INDEX IF NOT EXISTS user_topics_user_id_idx ON user_topics(user_id);
CREATE INDEX IF NOT EXISTS user_topics_topic_idx ON user_topics(topic);
CREATE INDEX IF NOT EXISTS user_topics_interest_level_idx ON user_topics(interest_level);
CREATE INDEX IF NOT EXISTS user_topics_proficiency_level_idx ON user_topics(proficiency_level);
`;

export const learningGoalsTable = `
CREATE TABLE IF NOT EXISTS learning_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active',
  priority TEXT NOT NULL DEFAULT 'medium',
  progress INTEGER NOT NULL DEFAULT 0,
  goal_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS learning_goals_user_id_idx ON learning_goals(user_id);
CREATE INDEX IF NOT EXISTS learning_goals_status_idx ON learning_goals(status);
CREATE INDEX IF NOT EXISTS learning_goals_priority_idx ON learning_goals(priority);
CREATE INDEX IF NOT EXISTS learning_goals_target_date_idx ON learning_goals(target_date);
`;

/**
 * Run all migrations
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client
 * @returns {Promise<boolean>} Success status
 */
export async function runMigrations(supabase) {
  try {
    const migrations = [
      learningProfilesTable,
      learningActivitiesTable,
      contentItemsTable,
      contentAnalysisTable,
      recommendationsTable,
      userTopicsTable,
      learningGoalsTable
    ];
    
    for (const migration of migrations) {
      const { error } = await supabase.rpc('run_sql', { sql: migration });
      
      if (error) {
        console.error('Migration error:', error);
        return false;
      }
    }
    
    console.log('All learning recommendations migrations completed successfully');
    return true;
  } catch (error) {
    console.error('Error running learning recommendations migrations:', error);
    return false;
  }
}
