/**
 * Database migrations for the Adaptive Spaced Repetition System
 * This file contains the SQL queries to create the necessary tables
 * for the Spaced Repetition System to function.
 */

export const studyItemsTable = `
CREATE TABLE IF NOT EXISTS study_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_front TEXT NOT NULL,
  content_back TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'text',
  source TEXT,
  source_id UUID,
  tags TEXT[] DEFAULT '{}',
  learning_data JSONB DEFAULT '{}'::jsonb,
  next_review_date TIMESTAMP WITH TIME ZONE,
  last_review_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS study_items_user_id_idx ON study_items(user_id);
CREATE INDEX IF NOT EXISTS study_items_next_review_date_idx ON study_items(next_review_date);
CREATE INDEX IF NOT EXISTS study_items_tags_idx ON study_items USING GIN(tags);
CREATE INDEX IF NOT EXISTS study_items_source_idx ON study_items(source, source_id);
`;

export const reviewSessionsTable = `
CREATE TABLE IF NOT EXISTS review_sessions (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_count INTEGER NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration FLOAT,
  metrics JSONB DEFAULT '{}'::jsonb,
  options JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS review_sessions_user_id_idx ON review_sessions(user_id);
CREATE INDEX IF NOT EXISTS review_sessions_start_time_idx ON review_sessions(start_time);
CREATE INDEX IF NOT EXISTS review_sessions_status_idx ON review_sessions(status);
`;

export const itemReviewsTable = `
CREATE TABLE IF NOT EXISTS item_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL REFERENCES review_sessions(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES study_items(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL,
  review_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS item_reviews_session_id_idx ON item_reviews(session_id);
CREATE INDEX IF NOT EXISTS item_reviews_item_id_idx ON item_reviews(item_id);
CREATE INDEX IF NOT EXISTS item_reviews_user_id_idx ON item_reviews(user_id);
CREATE INDEX IF NOT EXISTS item_reviews_review_time_idx ON item_reviews(review_time);
`;

export const learningParametersTable = `
CREATE TABLE IF NOT EXISTS learning_parameters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parameters JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS learning_parameters_user_id_idx ON learning_parameters(user_id);
`;

export const studyDecksTable = `
CREATE TABLE IF NOT EXISTS study_decks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  item_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS study_decks_user_id_idx ON study_decks(user_id);
`;

export const deckItemsTable = `
CREATE TABLE IF NOT EXISTS deck_items (
  deck_id UUID NOT NULL REFERENCES study_decks(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES study_items(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (deck_id, item_id)
);

CREATE INDEX IF NOT EXISTS deck_items_deck_id_idx ON deck_items(deck_id);
CREATE INDEX IF NOT EXISTS deck_items_item_id_idx ON deck_items(item_id);
`;

/**
 * Run all migrations
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client
 * @returns {Promise<boolean>} Success status
 */
export async function runMigrations(supabase) {
  try {
    const migrations = [
      studyItemsTable,
      reviewSessionsTable,
      itemReviewsTable,
      learningParametersTable,
      studyDecksTable,
      deckItemsTable
    ];
    
    for (const migration of migrations) {
      const { error } = await supabase.rpc('run_sql', { sql: migration });
      
      if (error) {
        console.error('Migration error:', error);
        return false;
      }
    }
    
    console.log('All spaced repetition migrations completed successfully');
    return true;
  } catch (error) {
    console.error('Error running spaced repetition migrations:', error);
    return false;
  }
}
