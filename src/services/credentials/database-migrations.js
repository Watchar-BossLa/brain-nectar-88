/**
 * Database migrations for the Blockchain Credential System
 * This file contains the SQL queries to create the necessary tables
 * for the Blockchain Credential System to function.
 */

export const credentialsTable = `
CREATE TABLE IF NOT EXISTS credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  issuer_id UUID NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  transaction_id TEXT,
  blockchain_data JSONB,
  revoked BOOLEAN DEFAULT FALSE,
  revoked_at TIMESTAMP WITH TIME ZONE,
  revoked_by UUID,
  revocation_reason TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS credentials_recipient_id_idx ON credentials(recipient_id);
CREATE INDEX IF NOT EXISTS credentials_issuer_id_idx ON credentials(issuer_id);
CREATE INDEX IF NOT EXISTS credentials_type_idx ON credentials(type);
CREATE INDEX IF NOT EXISTS credentials_transaction_id_idx ON credentials(transaction_id);
`;

export const credentialEventsTable = `
CREATE TABLE IF NOT EXISTS credential_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  credential_id UUID NOT NULL REFERENCES credentials(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS credential_events_credential_id_idx ON credential_events(credential_id);
CREATE INDEX IF NOT EXISTS credential_events_event_type_idx ON credential_events(event_type);
CREATE INDEX IF NOT EXISTS credential_events_timestamp_idx ON credential_events(timestamp);
`;

export const achievementsTable = `
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL,
  transaction_id TEXT,
  blockchain_data JSONB,
  criteria JSONB NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS achievements_recipient_id_idx ON achievements(recipient_id);
CREATE INDEX IF NOT EXISTS achievements_type_idx ON achievements(type);
CREATE INDEX IF NOT EXISTS achievements_transaction_id_idx ON achievements(transaction_id);
`;

export const achievementEventsTable = `
CREATE TABLE IF NOT EXISTS achievement_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS achievement_events_achievement_id_idx ON achievement_events(achievement_id);
CREATE INDEX IF NOT EXISTS achievement_events_event_type_idx ON achievement_events(event_type);
CREATE INDEX IF NOT EXISTS achievement_events_timestamp_idx ON achievement_events(timestamp);
`;

export const achievementTypesTable = `
CREATE TABLE IF NOT EXISTS achievement_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  criteria JSONB NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS achievement_types_type_idx ON achievement_types(type);
`;

export const credentialTemplatesTable = `
CREATE TABLE IF NOT EXISTS credential_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  template JSONB NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS credential_templates_type_idx ON credential_templates(type);
`;

/**
 * Run all migrations
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client
 * @returns {Promise<boolean>} Success status
 */
export async function runMigrations(supabase) {
  try {
    const migrations = [
      credentialsTable,
      credentialEventsTable,
      achievementsTable,
      achievementEventsTable,
      achievementTypesTable,
      credentialTemplatesTable
    ];
    
    for (const migration of migrations) {
      const { error } = await supabase.rpc('run_sql', { sql: migration });
      
      if (error) {
        console.error('Migration error:', error);
        return false;
      }
    }
    
    console.log('All blockchain credential migrations completed successfully');
    return true;
  } catch (error) {
    console.error('Error running blockchain credential migrations:', error);
    return false;
  }
}
